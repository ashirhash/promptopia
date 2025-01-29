import mongoose from "mongoose";
import User from "@models/user";
import Prompt from "@models/prompt";
import Likes from "@models/like";
import Comment from "@models/comment";

let isConnected = false;
const mongoDbUri: string | undefined = process.env.MONGODB_URI


const registerModels = () => {
  // Importing models ensures they are registered with Mongoose,
  // so referncing other modals does not throw a not registering error
  User;
  Prompt;
  Likes;
  Comment;
};


export const ConnectToDB = async () => {
    mongoose.set('strictQuery', true)
    registerModels();

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
            dbName: "promptopia"
        })

        isConnected = true
        console.log('MongoDB connection successful');
    }
    catch (error: any) {
        console.log("MongoDB connection failed: ", error.message);
        throw new Error("Database connection failed");

    }
}

