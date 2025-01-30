import { Schema, model, models } from "mongoose";
import Share from "./share";

const PromptSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
  title: {
    type: String,
    required: [true, "Title is required."],
  },
  prompt: {
    type: String,
    required: [true, "Prompt is required."],
  },
  tag: {
    type: String,
    required: [true, "Tag is required."],
  },
  likes: {
    type: Number,
    default: 0,
    required: [true, "Likes are required."],
  },
  shares: {
    type: Number,
    default: 0,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  imageUrls: { type: [String], default: [] },
});

// Middleware to auto-delete associated shares and saved posts
PromptSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Share.deleteMany({ postId: doc._id });
    // await Save.deleteMany({ postId: doc._id });
  }
});

const Prompt = models.Prompt || model("Prompt", PromptSchema);

export default Prompt;
