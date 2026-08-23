import mongoose from 'mongoose';
import { Config } from '../config';
// import userDetailSeed from '../seeders/userDetail.seeder';

export const connectDB = async () => {
  try {
    await mongoose.connect(Config.MONGO_DB_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};
