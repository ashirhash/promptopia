import mongoose from "mongoose";

let isConnected = false;
const mongoDbUri: string | undefined = process.env.MONGODB_URI

export const ConnectToDB = async () => {
    mongoose.set('strictQuery', true)

    if (isConnected) {
        console.log('MongoDB is already connected');
        return
    }

    if (!mongoDbUri) {
        console.log('MongoDB URI is not defined');
        return;
    }

    try {
        await mongoose.connect(mongoDbUri, {
            dbName: "share_prompt"
        })

        isConnected = true
        console.log('MongoDB connection successful');
    }
    catch (error: any) {
        console.log("MongoDB connection failed: ", error.message);
        throw new Error("Database connection failed");

    }
}

