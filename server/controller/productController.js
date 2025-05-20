import productModel from '../model/productModel.js';
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import orderModel from "../model/orderModel.js";
import categoryModel from "../model/categoryModel.js"

import dotenv from "dotenv";
dotenv.config({path: "./config.env" });
dotenv.config();

//PAYMENT GATEWAY
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


// PRODUCT CONTROLLER ---->
export const createProductController= async (req,res) => {
    try{
        const {name, description, price, category, quantity, shipping } =req.fields;
        const {photo}= req.files;

        switch (true) {
            case !name:
                return res.status(500).send({ error: "name is reqquired" });
            case !description:
                return res.status(500).send({ error: "description is reqquired" });
            case !price:
                return res.status(500).send({ error: "price is reqquired" });
            case !category:
                return res.status(500).send({ error: "category is reqquired" });
            case !quantity:
                return res.status(500).send({ error: "quantity is reqquired" });
            case !shipping:
                return res.status(500).send({ error: "shipping is reqquired" });
            case photo && photo.size > 10485760:
                return res.status(500).send({ error: "photo is reqquired and should be less then 1mb" });
        }

        const product = new productModel({...req.fields, slug:slugify(name)});
        if (photo){
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;

        }
        await product.save();
        res.status(201).send({
            success:true,
            message:"product created successfully",
            product,
        });
    }catch(error){
        console.log(error);
        res.status(500).send({success:false, error, message:"error in creating product"});
    }
}


// GET PRODUCT CONTROLLER
export const getProductController = async( req, res )  => {
    try{
        const products = await productModel
        .find({})
        .populate("category")
        .select("-photo")
        .limit(12)
        .sort({ createdAt: -1});
    res.status(200).send({
        success:true,
        countTotal: products.length,
        message:"Allproducts",
        products,
    });
    } catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in getting products",
            error:error.message,
        });
    }
};

//  GET SINGLE PRODUCT CONTROLLER
export const getSingleProductController = async (req, res) => {
    try {
      const product = await productModel
        .findOne({ slug: req.params.slug })
        .select("-photo")
        .populate("category");
  
      res.status(200).send({
        success: true,
        message: "single product fetched",
        product, 
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "error while getting single product",
        error,
      });
    }
  };
  


// CONTROLLER: GET PRODUCT PHOTO
export const productPhotoController = async (req, res) => {
    try {
      const product = await productModel.findById(req.params.pid).select("photo");
      if (product.photo && product.photo.data) {
        res.set("Content-Type", product.photo.contentType);
        return res.status(200).send(product.photo.data);
      } else {
        return res.status(404).send("Photo not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Error loading product photo" });
    }
  };
  

// DELETE PRODUCT CONTROLLER
export const deleteProductController =  async ( req, res) =>{
    try{
        await productModel.findByIdAndDelete(req.param.pid).select("photo");
        res.status(200).send({
            success:true,
            message:"product deleted succefully"
        });
    } catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error while deleting product"
        });
    }
};


// UPDATE PRODUCT CONTROLLER
export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !name:
                return res.status(500).send({ error: "name is reqquired" });
            case !description:
                return res.status(500).send({ error: "description is reqquired" });
            case !price:
                return res.status(500).send({ error: "price is reqquired" });
            case !category:
                return res.status(500).send({ error: "category is reqquired" });
            case !quantity:
                return res.status(500).send({ error: "quantity is reqquired" });
            case !shipping:
                return res.status(500).send({ error: "shipping is reqquired" });
            case photo && photo.size > 10485760:
                return res.status(500).send({ error: "photo is reqquired and should be less then 1mb" });
        }

        const products = await productModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        await products.save();
        res.status(201).send({
            success: true,
            message: "product created successfully",
            product: products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error, message: "error in creating product" });
    }
};

// PRODUCT FILTERS CONTROLLER
export const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};

        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            count: products.length,
            message: "Products filtered by category and price",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while filtering products",
            error,
        });
    }
}

//  PRODUCT COUNT CONTROLLER
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            message: "Total products count",
            total,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting product count",
            error,
        });
    }
}

//  PRODUCT LIST CONTROLLER
export const productListController = async (req, res) => {
    try {
        const perPage = 20;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: "Products list",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting products list",
            error,
        });
    }

}

//  PRODUCT SEARCH CONTROLLER
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;

    const products = await productModel
      .find()
      .populate("category")
      .select("-photo");

    const results = products.filter((product) => {
      const keywordLower = keyword.toLowerCase();
      return (
        product.name.toLowerCase().includes(keywordLower) ||
        product.description.toLowerCase().includes(keywordLower) ||
        product.category?.name?.toLowerCase().includes(keywordLower)
      );
    });

    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Error while searching products",
    });
  }
};

  
  


// BRAINTREE TOKEN CONTROLLER
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send({ error: "Error generating client token" });
            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while generating client token",
            error,
        });
    }
}


// BRAINTREE PAYMENT CONTROLLER
export const braintreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;

    // Calculate total amount
    let total = 0;
    cart.forEach(item => {
      total += item.price * (item.count || item.quantity || 1);
    });

    // Process payment with Braintree
    gateway.transaction.sale(
      {
        amount: total.toFixed(2), // format as string with 2 decimals
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async (err, result) => {
        if (err) {
          console.error("Transaction error:", err);
          return res.status(500).json({
            success: false,
            message: "Transaction failed",
            error: err,
          });
        }

        if (result?.success) {
          // ✅ Use quantity instead of count
          const formattedProducts = cart.map(item => ({
            product: item._id || item.product,
            quantity: item.count || item.quantity || 1,
          }));

          // Save the order
          const order = new orderModel({
            products: formattedProducts,
            payment: result,
            buyer: req.user._id,
          });

          await order.save();

          res.status(200).json({
            success: true,
            message: "Payment successful and order created",
            transaction: result,
          });
        } else {
          res.status(500).json({
            success: false,
            message: "Transaction was not successful",
            error: result,
          });
        }
      }
    );
  } catch (error) {
    console.error("Payment controller error:", error);
    res.status(500).json({
      success: false,
      message: "Error while processing payment",
      error,
    });
  }
};


// GET PRODUCTS BY CATEGORY SLUG CONTROLLER
export const getProductsByCategoryController = async (req, res) => {
    try {
      const category = await categoryModel.findOne({ slug: req.params.slug });
      if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
  
      const products = await productModel.find({ category: category._id }).populate("category");
      res.status(200).json({ success: true, products });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Error fetching products by category", error });
    }
  };