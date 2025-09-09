import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }
  try {
    const connectState = await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`);
  }
};

export default connectDB;
