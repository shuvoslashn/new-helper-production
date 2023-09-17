import slugify from 'slugify';
import categoryModel from '../models/categoryModel.js';

// create category controller
export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(401).json({
                message: `Name is required`,
            });
        }
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(200).json({
                success: false,
                message: `Category Already Exisits`,
            });
        }
        const category = await new categoryModel({
            name,
            slug: slugify(name),
        }).save();
        res.status(201).send({
            success: true,
            message: `New Category Created!`,
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Error in category`,
            error,
        });
    }
};

// update category controller
export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await categoryModel.findByIdAndUpdate(
            id,
            {
                name,
                slug: slugify(name),
            },
            { new: true }
        );
        res.json({
            success: true,
            message: `Category Updated Successfully!`,
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Error while updating category`,
            error,
        });
    }
};

//* get all category controller
export const categoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        res.json({
            success: true,
            message: `All Category List`,
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Error while getting all category`,
            error,
        });
    }
};

//* get single category
export const singleCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        res.json({
            success: true,
            message: `Get Single Category Success`,
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Error while getting single category`,
            error,
        });
    }
};

//* Delete Category Controller
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.json({
            success: true,
            message: `Delete Category Successfully`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Error while deleting category`,
            error,
        });
    }
};
