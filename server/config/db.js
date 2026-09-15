import mongoose from 'mongoose';
import User from '../models/User.js';

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bharat_news';
    const conn = await mongoose.connect(connStr);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed default Super Admin if not present
    const adminEmail = 'admin@ideaciti.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: 'Admin@123',
        role: 'Super Admin',
        status: 'Active',
      });
      console.log(`[DB] Default Super Admin created: ${adminEmail}`);
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
