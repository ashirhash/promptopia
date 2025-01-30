import { Schema, model, models } from "mongoose";

const SaveSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Prompt", required: true },
  },
  { timestamps: true }
);

const Save = models.Save || model("Save", SaveSchema);

export default Save;
