import userModel from '../model/userschema.js';
import productModel from '../model/productModel.js';
import JWT from "jsonwebtoken";
import fs from "fs";
import slugify from "slugify";
import { hashPassword, comparedPassword } from "../helper/authHelper.js";
import orderModel from '../model/orderModel.js';
import Product from "../model/orderModel.js";


// Google OAuth integration
import { OAuth2Client } from "google-auth-library";  // Imported Google OAuth2 client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Added your Google Client ID

// GOOGLE LOGIN CONTROLLER ---->
export const googleLoginController = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ success: false, message: "ID Token is required" });
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        let user = await userModel.findOne({ email });

        // If user doesn't exist, create one
        if (!user) {
            user = await userModel.create({
                name,
                email,
                password: "", // or a dummy password if your model requires it
                profilePic: picture,
            });
        }

        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            success: true,
            message: "Google login success",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Google login failed" });
    }
};

// REGISTER CONTROLLER ---> 
export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;
        const profilePic = req.file ? `/uploads/${req.file.filename}` : ""; // Store relative path

        if (!name || !email || !password || !phone || !address || !answer) {
            return res.status(422).json({ error: "Please fill all fields" });
        }

        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(422).json({ error: "Email already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const user = new userModel({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            answer,
            profilePic // Save profile picture path
        });

        if(data?.error){
            toast.error(data?.error);
        } else{
            setAuth({ ...auth, user: data?.updatedUser});
            let ls = localStorage.getItem("auth");
            ls =JSON.parse(ls);
            ls.user = data.updated;
            localStorage.setItem("auth", JSON.stringyfy(ls));
            toast.success("profile updated succefully")
        }

    } catch (err) {
        console.error(err);
       toast.error("something went wrong")
    }
};


// LOGIN CONTROLLER --->  
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password",
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered",
            });
        }

        const match = await comparedPassword(password, user.password);
        if (!match) {
            return res.status(401).send({
                success: false,
                message: "Invalid password",
            });
        }


        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(200).send({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                address: user.address,
                answer: user.answer,
                phone: user.phone,
                profilePic: user.profilePic || null, 
                role: user.role
            },
            token,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
        });
    }
};


// TEST CONTROLLER ---> 
export const testController = (req, res) => {
    try {
        res.send("Protected Route");
    } catch (error) {
        console.log(error);
        res.send({ error });
    }
};

// FORGOT PASSWORD CONTROLLER ---->
export const forgotPasswordController = async (req,res) => {
try{
    const {email, answer, newPassword} = req.body;
    if (!email){
        res.status(400).send({message: "email is required"});
    }
    if (!newPassword){
        res.status(400).send({message: "password is required"});
    }
    if (!answer){
        res.status(400).send({message: "answer is required"});
    }
    //check
    const user = await userModel.findOne({email, answer});

    //validation
    if(!user){
         return res.status(400).send({
            success:false,
            message:"wrong email or answer"
         });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id,{password:hashed});
    res.status(200).send({
        success:true,
        message:"password reset succefully"
    });
    
} catch(err){
    console.log(err);
    res.status(500).send({
        success:false,
        message:"something went wrong"
    });
}
}

// UPDATE PROFILE CONTROLLER ---->
export const updateProfileController = async ( req, res ) =>{
    try{
        const { name, email, password, phone, address } = req.body;
        const user = await userModel.findByIdAndUpdate(req.user._id);

      if (password && password.length < 6) {
        return res.status(400).send({ message: "Password must be at least 6 characters long" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;   
    const updateUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            name: name || user.name,
            email: email || user.email,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
        },
        { new: true }
    );
    res.status(200).send({
        success: true,
        message: "Profile updated successfully",
        user: updateUser,
    });
} catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: "Error updating profile",
    });
} ;  
};

// ORDER CONTROLLER 
 
export const getOrderController = async (req, res) =>{
try{
    const orders =await orderModel.find({ buyer: req.user._id})
   .populate("products.product", "-photo") 
    .populate ( "buyer", "name");
    res.json(orders);
} 
catch(error){
    console.log(error);
    res.status(500).send({
        success:false,
        message:"error while getting orders",
        error,
    });
}
};




//get all order
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products.product", "-photo")   // <-- Add this line
            .populate("buyer", "name")
            .sort({ createdAt: -1 });                  // Note: use number -1, not string "-1"
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Getting Orders",
            error,
        });
    }
}




//Order Status

export const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const order = await orderModel.findOneAndUpdate(
        { _id: orderId },
        { status },
        { new: true }
      );
      res.json(order);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while updating order status",
        error,
      });
    }
  };
  