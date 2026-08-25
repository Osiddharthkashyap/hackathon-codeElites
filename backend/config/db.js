import mongoose from "mongoose";

export const isValidMongoUri = (mongoUri) => {
    return /^mongodb(\+srv)?:\/\//.test(mongoUri || "");
};

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri || !isValidMongoUri(mongoUri)) {
        throw new Error("MONGODB_URI must be a valid MongoDB connection string.");
    }

    await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10_000,
        connectTimeoutMS: 10_000,
    });
    console.log("MongoDB connected.");
    return true;
};

export default connectDB;
