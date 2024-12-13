import { Schema, model, models } from "mongoose";

const PromptSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
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
  }
});

const Prompt = models.Prompt || model("Prompt", PromptSchema);

export default Prompt;
