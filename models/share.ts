import { Schema, model, models } from "mongoose";

const ShareSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Prompt",
      required: true,
    },
  },
  { timestamps: true }
);

const Share = models.Share || model("Share", ShareSchema);

export default Share;
