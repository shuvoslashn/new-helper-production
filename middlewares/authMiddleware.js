import userModel from '../models/userModel.js';
import JWT from 'jsonwebtoken';

//* Protected Routes token base
export const requireSignIn = async (req, res, next) => {
    try {
        const decode = await JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message: `Unauthorized token access`,
            error,
        });
    }
};

//* Admin Access
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: `Unauthorized Access`,
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: `Error in admin middleware`,
            error,
        });
    }
};
