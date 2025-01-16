import { Schema, model, models } from "mongoose";

const CommentsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // The user who made the comment
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true }, // The post the comment is related to
  parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null }, // Reference to parent comment (null for top-level comments)
  content: { type: String, required: true }, // The comment text
  createdAt: { type: Date, default: Date.now }, // Timestamp of comment creation
  // updatedAt: { type: Date, default: Date.now }, // Timestamp of last edit
});

// Ensure models are not re-compiled if already defined
const Comment = models.Comment || model("Comment", CommentsSchema);

export default Comment;
