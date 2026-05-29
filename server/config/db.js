import mongoose from 'mongoose';

// By the time this module is loaded, dotenv has already been configured
// by config/env.js which is imported first in server.js
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrotrack';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Database connected successfully');
    } catch (error) {
        console.error('❌ Error connecting to the database:', error.message);
        process.exit(1);
    }
};

// Call connection on import
connectDB();

export default mongoose;
