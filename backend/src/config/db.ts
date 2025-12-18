import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is missing in your .env file");
    }

    const conn = await mongoose.connect(uri);

    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.log("✅ Database Connected");
    }
  } catch (error) {
    console.error(`❌ Database Error: ${(error as Error).message}`);

    process.exit(1);
  }
};

export default connectDB;
