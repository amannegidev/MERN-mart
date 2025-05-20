import express from 'express';

import { 
    registerController,
    loginController,
    testController,
    forgotPasswordController,
    updateProfileController,
    getOrderController,
    getAllOrdersController,
    orderStatusController,
    googleLoginController

} from '../controller/authController.js';

import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// AUTH ROUTES ---> //

// Ensure "uploads" folder exists
const uploadFolder = "uploads/";
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// Register route
router.post("/register", upload.single("profilePic"), registerController);


// Login Route (Public)
router.post('/login', loginController);

router.post("/google-login", googleLoginController); 

// Test Route (Protected - Only Admin Access)
router.get('/test', requireSignIn, isAdmin, testController);

// forgot password route
router.post('/forgotpass', forgotPasswordController);

router.put('/profile', requireSignIn, updateProfileController);

// get orders route
router.get('/orders', requireSignIn, getOrderController);

router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);

router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController);

//protected User route auth
router.get('/user-auth',requireSignIn,(req,res) =>{
    res.status(200).send({ok:true});
});


//pretected adimn route auth
router.get('/admin-auth',requireSignIn, isAdmin,(req,res) =>{
    res.status(200).send({ok:true});
});


export default router;

