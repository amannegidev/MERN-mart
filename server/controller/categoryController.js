import categoryModel from "../model/categoryModel.js";
import slugify from "slugify";


// categories post api
export const CreateCategoryController = async (req,res) =>{
    try{
        const {name} = req.body;
        if(!name){
            return res.status(401).send({message:"Name is require"});
        }  
        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory){
            return res.status(200).send({
                success:false,
                message:"Category alredy exists"
            });
        }

        const category = await new categoryModel({
            name,
            slug:slugify(name),
        }).save();
        res.status(201).send({
            success:true,
            message:"New category created",
            category,
        });
      }
      catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Category",
        });
      }

};

export const CategoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "All categeory list",
            category
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: true,
            error,
            message: "error while getting all category"
        });
    }
}

// delete category-controller
export const DeleteCategeoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "category delete"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error while delting category",
            error
        });
    }
}

// update category
export const updateCategoryController = async (req, res) => {
    try {
      const { name } = req.body;
      const { id } = req.params; // ✅ Get ID from route param
  
      const category = await categoryModel.findByIdAndUpdate(
        id,
        { name, slug: slugify(name) },
        { new: true }
      );
  
      res.status(200).send({
        success: true,
        message: "Category Updated Successfully",
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while Updating category",
      });
    }
  };
  

  import productModel from "../model/productModel.js"; // Make sure you import your product model


