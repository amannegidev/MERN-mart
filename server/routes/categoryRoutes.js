import express from "express";
import { isAdmin,requireSignIn } from "../middleware/authMiddleware.js";
import { CreateCategoryController, CategoryController, DeleteCategeoryController, updateCategoryController, } from "../controller/categoryController.js"

const router = express.Router();

//create cagegory
router.post('/create-Category', requireSignIn, isAdmin, CreateCategoryController);
router.get('/get-Category', CategoryController);
router.delete('/delete-category/:id', requireSignIn, isAdmin, DeleteCategeoryController);
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);

 

export default router;