import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectToDataBase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectToDataBase;
