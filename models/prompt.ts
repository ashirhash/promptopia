import { Schema, model, models } from "mongoose";

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
  commentCount: {
    type: Number,
    default: 0,
    required: [true, "Comments are required."],
  },
  imageUrls: { type: [String], default: [] },
});

const Prompt = models.Prompt || model("Prompt", PromptSchema);

export default Prompt;
