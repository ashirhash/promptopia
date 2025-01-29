import { Schema, model, models } from "mongoose";

const CommentsSchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    content: { type: String, maxlength: 500, required: true },
  },
  { timestamps: true }
);

// Ensure models are not re-compiled if already defined
const Comment = models.Comment || model("Comment", CommentsSchema);

export default Comment;
