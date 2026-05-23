import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing.");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, { autoIndex: false });
    console.log("✓ MongoDB connected");
    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}
