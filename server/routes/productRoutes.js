import express from "express";
import { createProductController, deleteProductController, getProductController, getSingleProductController, productPhotoController, updateProductController, productFiltersController,productCountController, productListController, braintreeTokenController, braintreePaymentController, getProductsByCategoryController, searchProductController } from "../controller/productController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();



// PRODUCT ROUTE
router.post('/create-products', requireSignIn, isAdmin, formidable(), createProductController);

// PRODUCTS ROUTE
router.get("/get-product", getProductController);


// SINGLE PRODUCTS ROUTE
router.get("/get-product/:slug", getSingleProductController);

// PRODUCT PHOTO ROUTE
router.get('/product-photo/:pid', productPhotoController);

// DELETE PRODUCT ROUTE
router.delete('/delete-product/:pid', deleteProductController);

// UPDATE PRODUCT ROUTE
router.put("/update-product/:pid", requireSignIn, isAdmin, formidable(), updateProductController);

// FILTERS PRODUCT ROUTE
router.post("/product-filters", productFiltersController);

// PRODUCT COUNT ROUTE
router.get("/product-count", productCountController);

// PRODUCT LIST ROUTE
router.get("/product-list/:page", productListController);

// BRAINTREE TOKEN ROUTE
router.get("/braintree/token", braintreeTokenController);

// BRAINTREE PAYMENT ROUTE
router.post("/braintree/payment", requireSignIn, braintreePaymentController);

router.get('/category/:slug', getProductsByCategoryController);

router.get("/search/:keyword", searchProductController);


export default router;

