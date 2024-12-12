import { ConnectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import Likes from "@models/likes";

export const GET = async (req: any) => {
  try {
    const userId = req.headers.get("userId");
    await ConnectToDB();

    const prompts = await Prompt.find({}).populate("creator");

    let likedPostIds = [];
    if (userId) {
      const userLikes = await Likes.find({ userId }).select("postId"); // Assuming Like model stores postId and userId
      likedPostIds = userLikes.map((like: any) => like.postId.toString()); // Extract liked postIds
    }

    const promptsWithLikes = prompts.map(post => ({
      ...post.toObject(), // Convert Mongo document to plain object
      liked: likedPostIds.includes(post._id.toString()), // Check if the user has liked the post
    }));

    return new Response(JSON.stringify(promptsWithLikes), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to fetch all prompts", {
      status: 500,
    });
  }
};
