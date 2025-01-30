import { ConnectToDB } from "/lib/database";
import Prompt from "models/prompt";
import Likes from "models/like";

export const PATCH = async (req: any, { params }: any) => {
  try {
    await ConnectToDB();

    const { userId } = await req.json();
    const postId = params.id;

    const existingLike = await Likes.findOne({ postId, userId });

    // If the like exists, delete it (dislike)
    if (existingLike) {
      await Likes.findByIdAndDelete(existingLike._id);
      const totalLikes = await Likes.countDocuments({ postId });
      await Prompt.findByIdAndUpdate(postId, { likes: totalLikes });
      return new Response("Prompt disliked successfully", {
        status: 200,
      });
    }

    // If the like doesn't exist, add a new like (like)
    const newLikedPost = new Likes({ userId, postId });
    await newLikedPost.save();

    const totalLikes = await Likes.countDocuments({ postId });
    await Prompt.findByIdAndUpdate(postId, { likes: totalLikes });

    return new Response("Prompt liked successfully", {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to like prompt", {
      status: 500,
    });
  }
};
