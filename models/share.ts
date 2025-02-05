import { Schema, model, models } from "mongoose";
import Prompt from "./prompt";

const ShareSchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sharedPost: {
      type: Schema.Types.ObjectId,
      ref: "Prompt",
      required: true,
    },
  },
  { timestamps: true }
);

// Updates shares count in the doc of the post which is being shared
ShareSchema.post("save", async function (doc) {
  try {
    const result = await Prompt.updateOne(
      { _id: doc.sharedPost },
      { $inc: { shares: 1 } } // Atomic increment
    );
    if (result.modifiedCount === 0) {
      console.log("No changes made to the shares field.");
    }
  } catch (err) {
    console.error("Error updating shares:", err);
  }
});

// Decrements the shares count when a share is deleted
ShareSchema.post("findOneAndDelete", async function (doc) {
  try {
    if (doc) {
      await Prompt.updateOne(
        { _id: doc.sharedPost },
        { $inc: { shares: -1 } } // Atomic decrement
      );
    }
  } catch (err) {
    console.error("Error updating shares:", err);
  }
});

const Share = models.Share || model("Share", ShareSchema);

export default Share;
