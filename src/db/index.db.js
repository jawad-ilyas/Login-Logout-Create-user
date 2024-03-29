import mongoose from "mongoose";

// Define a function to establish connection to MongoDB
const connectDb = async () => {
    try {
        // Get MongoDB URI from environment variables
        const uri = process.env.MONGODB_URI;

        // Check if URI is provided
        if (!uri) {
            throw new Error("MongoDB URI is not provided");
        }

        // Connect to MongoDB using Mongoose
        const connection = await mongoose.connect(uri);

        // Log success message if connection is established
        console.log("Database connected successfully");
    } catch (error) {
        // Log error if connection fails
        console.log("Error connecting to the database:", error);
    }
};

// Export the connectDb function for external use
export default connectDb;
