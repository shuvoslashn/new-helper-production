import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        services: [
            {
                type: mongoose.ObjectId,
                ref: 'Services',
            },
        ],
        payment: {},
        buyer: {
            type: mongoose.ObjectId,
            ref: 'users',
        },
        status: {
            type: String,
            default: 'Not Process',
            enum: [
                'Not Process',
                'Processing',
                'Serviceman Working',
                'Service Done',
                'Cancel',
            ],
        },
    },
    { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
