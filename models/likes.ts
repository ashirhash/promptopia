import { Schema, model, models } from "mongoose";

const LikesSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  postId: { type: Schema.Types.ObjectId, ref: "Prompt" },
  createdAt: { type: Date, default: Date.now },
});

const Likes = models.Likes || model("Likes", LikesSchema);

export default Likes;
