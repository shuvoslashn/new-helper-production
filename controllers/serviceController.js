import fs from 'fs';
import slugify from 'slugify';
import serviceModel from '../models/serviceModel.js';
import categoryModel from '../models/categoryModel.js';
import orderModel from '../models/orderModel.js';

//* Create Service Controller
export const createServiceController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } =
            req.fields;
        const { photo } = req.files;

        // validation
        switch (true) {
            case !name:
                return res.status(500).json({ message: `Name is required!` });
            case !description:
                return res
                    .status(500)
                    .json({ message: `description is required!` });
            case !price:
                return res.status(500).json({ message: `price is required!` });
            case !category:
                return res
                    .status(500)
                    .json({ message: `category is required!` });
            // case !quantity:
            //     return res
            //         .status(500)
            //         .json({ message: `quantity is required!` });
            case !photo && photo.size > 1048576:
                return res
                    .status(500)
                    .json({ message: `photo is required & less then 1 MB` });
        }

        const services = new serviceModel({
            ...req.fields,
            slug: slugify(name),
        });

        if (photo) {
            services.photo.data = fs.readFileSync(photo.path);
            services.photo.contentType = photo.type;
        }
        await services.save();
        res.status(201).json({
            success: true,
            message: 'Service Create Successfully',
            services,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Error in creating service`,
            error,
        });
    }
};

//* Get all Services Controller
export const getServiceController = async (req, res) => {
    try {
        const services = await serviceModel
            .find({})
            .populate('category')
            .select('-photo')
            .limit(12)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: services.length,
            message: 'All Services',
            services,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Error in getting all services`,
            error,
        });
    }
};

//* Get Single Services Controller
export const getSingleServiceController = async (req, res) => {
    try {
        const service = await serviceModel
            .findOne({ slug: req.params.slug })
            .select('-photo')
            .populate('category');
        res.status(200).json({
            success: true,
            message: 'Single Service Fetched',
            service,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Error in getting all services`,
            error,
        });
    }
};

//* Get Service Photo Controller
export const servicePhotoController = async (req, res) => {
    try {
        const service = await serviceModel
            .findById(req.params.pid)
            .select('photo');
        if (service.photo.data) {
            res.set('Content-type', service.photo.contentType);
            return res.send(service.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Error in getting photo`,
            error,
        });
    }
};

//* update Service Controller
export const updateServiceController = async (req, res) => {
    try {
        const { name, description, price, category } = req.fields;
        const { photo } = req.files;

        // validation
        switch (true) {
            case !name:
                return res.status(500).json({ message: `Name is required!` });
            case !description:
                return res
                    .status(500)
                    .json({ message: `description is required!` });
            case !price:
                return res.status(500).json({ message: `price is required!` });
            case !category:
                return res
                    .status(500)
                    .json({ message: `category is required!` });
            // case !quantity:
            //     return res
            //         .status(500)
            //         .json({ message: `quantity is required!` });
            // case !photo && photo.size > 1048576:
            // case !photo:
            //     return res
            //         .status(500)
            //         .json({ message: `photo is required & less then 1 MB` });
        }

        const services = await serviceModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );

        if (photo) {
            services.photo.data = fs.readFileSync(photo.path);
            services.photo.contentType = photo.type;
        }
        await services.save();
        res.status(201).json({
            success: true,
            message: 'Service Updated Successfully',
            services,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Error in updating service`,
            error,
        });
    }
};

//* Delete Service Controller
export const deleteServiceController = async (req, res) => {
    try {
        await serviceModel.findByIdAndDelete(req.params.pid).select('-photo');
        res.status(200).json({
            success: true,
            message: 'Service Deleted Successfully!',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Error in delete service`,
            error,
        });
    }
};

//* Filter Service Controller
export const serviceFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const services = await serviceModel.find(args);
        res.status(200).send({
            success: true,
            services,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error WHile Filtering Services',
            error,
        });
    }
};

//* service count
export const serviceCountController = async (req, res) => {
    try {
        const total = await serviceModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: 'Error in service count',
            error,
            success: false,
        });
    }
};

//* service list base on page
export const serviceListController = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const services = await serviceModel
            .find({})
            .select('-photo')
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            services,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'error in per page ctrl',
            error,
        });
    }
};

//* Search service controller
export const searchServiceController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const result = await serviceModel
            .find({
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } },
                ],
            })
            .select('-photo');
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error in search service api',
            error,
        });
    }
};

// similar service controller
export const relatedServiceController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const services = await serviceModel
            .find({
                category: cid,
                _id: { $ne: pid },
            })
            .select('-photo')
            .limit(3)
            .populate('category');

        res.json({
            success: true,
            services,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error in similar service api',
            error,
        });
    }
};

//* Service category controller
export const serviceCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const services = await serviceModel
            .find({ category })
            .populate('category');

        res.json({
            success: true,
            category,
            services,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error in service category api',
            error,
        });
    }
};

//* place order controller
export const orderController = async (req, res) => {
    try {
        const { cart } = req.body;
        let totalPrice = 0;
        cart?.map((i) => {
            totalPrice = totalPrice + Number(i.price);
        });
        console.log(totalPrice);
        // Create the order
        const order = new orderModel({
            services: cart,
            payment: {
                amount: totalPrice,
                method: 'Cash on delivery',
            },
            buyer: req.user._id,
        }).save();

        res.status(201).json({
            success: true,
            ok: true,
            message: 'Order created successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error in creating order',
            error,
        });
    }
};
