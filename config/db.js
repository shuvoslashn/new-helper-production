import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        const conn = await mongoose.connect(uri, { useNewUrlParser: true });
        console.log(
            ` Connected to mongodb ${conn.connection.host} `.bgGreen.black
        );
    } catch (error) {
        console.log(`Error in MongoDB ${error}`.bgRed.white);
    }
};

export default connectDB;
