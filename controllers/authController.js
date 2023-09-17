import JWT from 'jsonwebtoken';
import userModel from './../models/userModel.js';
import { comparePassword, hashPassword } from './../helpers/authHelper.js';
import orderModel from '../models/orderModel.js';

//* Register Controller
export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;

        //validations
        if (!name) {
            return res.json({ message: `Name is required` });
        }
        if (!email) {
            return res.json({ message: `email is required` });
        }
        if (!password) {
            return res.json({ message: `password is required` });
        }
        if (!phone) {
            return res.json({ message: `phone is required` });
        }
        if (!address) {
            return res.json({ message: `address is required` });
        }
        if (!answer) {
            return res.json({ message: `answer is required` });
        }
        if (password.length < 6) {
            return res.json({
                message: `password must be 6 character long`,
            });
        }

        // check user
        const existingUser = await userModel.findOne({ email });

        // existing user
        if (existingUser) {
            return res.status(200).json({
                success: false,
                message: `Already Registered! Please Login`,
            });
        }

        // register user
        const hashedPassword = await hashPassword(password);

        // save user
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            answer,
            password: hashedPassword,
        }).save();

        res.status(201).json({
            success: true,
            message: `User registration successful`,
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Error in registration`,
            error,
        });
    }
};

//* login Controller
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: `Invalid email or password`,
            });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: `Email is not registered`,
            });
        }
        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.status(401).json({
                success: false,
                message: `Invalid Password`,
            });
        }

        // token generate
        const token = await JWT.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: `Login successful`,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Error in login`,
            error,
        });
    }
};

//* Forgot Password Controller
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ message: `Email is required` });
        }
        if (!answer) {
            res.status(400).send({ message: `Answer is required` });
        }
        if (!newPassword) {
            res.status(400).send({ message: `New Password is required` });
        }
        if (newPassword.length < 6) {
            return res.json({
                message: `password must be 6 character long`,
            });
        }

        // check
        const user = await userModel.findOne({ email, answer });

        // validation
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `Wrong Email or Answer`,
            });
        }

        // hashed Password
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).json({
            success: true,
            message: `Password Reset Successfully`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error,
        });
    }
};

//! test controller
export const testController = (req, res) => {
    res.send('protected route');
};

//* update profile controller
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        const user = await userModel.findById(req.user._id);
        //password
        if (password && password.length < 6) {
            return res.json({
                error: `password must be 6 character long`,
            });
        }
        const hashedPassword = password
            ? await hashPassword(password)
            : undefined;

        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                address: address || user.address,
                phone: phone || user.phone,
                password: hashedPassword || user.password,
            },
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error in update profile',
            error,
        });
    }
};

//* get order controller
export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate('services', '-photo')
            .populate('buyer', 'name');

        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error in getting order',
            error,
        });
    }
};

//* get all order controller
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate('services', '-photo')
            .populate('buyer', 'name')
            .sort({ createdAt: '-1' });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error in getting order',
            error,
        });
    }
};

//* get all order controller
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error in getting order',
            error,
        });
    }
};
