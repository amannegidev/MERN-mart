import JWT from "jsonwebtoken";
import userModel from "../model/userschema.js";

// Middleware to verify user authentication using JWT
export const requireSignIn = async (req, res, next) => {
    try {
        // Verify token from request headers
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        req.user = decode; // Attach decoded user data to request
        next(); // Proceed to next middleware or route
    } catch (error) {
        console.log(error);
    }
};

// Middleware to check if the user has admin privileges
export const isAdmin = async (req, res, next) => {
    try {
        // Fetch user details from database
        const user = await userModel.findById(req.user._id);
        
        // Check if user is an admin (role === 1)
        if (user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized Access",
            });
        } 
        next(); // Proceed if user is an admin
         
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error in admin middleware",
        });
    }
};


