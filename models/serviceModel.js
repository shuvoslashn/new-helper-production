import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            lowercase: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        // quantity: {
        //     type: Number,
        //     required: true,
        // },
        photo: {
            data: Buffer,
            contentType: String,
        },
        // shipping: {
        //     type: Boolean,
        // },
    },
    { timestamps: true }
);

export default mongoose.model('Services', serviceSchema);
