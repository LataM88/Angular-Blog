
import mongoose from 'mongoose';

export const connectDatabase = async () => {
    const MONGO_URI = process.env.MONGO_URI || '';
    if (!MONGO_URI) {
        console.error('MONGO_URI is not defined in environment variables');
        return;
    }
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};
