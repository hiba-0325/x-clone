import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to x-clone database");
  } catch (error) {
    console.log( error);
  }
};

export default connectDB;
