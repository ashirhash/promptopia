import { ConnectToDB } from "utils/database";
import Prompt from "models/prompt";
import Likes from "models/like";

export const dynamic = 'force-dynamic';

export const GET = async (req: Request) => {
  try {
    let userId: string | null;
    userId = req.headers.get("userid");
    await ConnectToDB();

    // Fetch all prompts
    const prompts = await Prompt.find({}).populate("creator");
    let likedPostIds: string[] = [];

    // If user is logged in, fetch their liked posts
    if (userId && userId !== "null" && userId !== "undefined") {
      const userLikes = await Likes.find({ userId: userId }).select("postId");
      likedPostIds = userLikes.map((like) => like.postId.toString());
    }

    // Attach like information to prompts
    const promptData = prompts.map((post) => ({
      ...post.toObject(),
      liked: likedPostIds.includes(post._id.toString())
    }));

    return new Response(JSON.stringify(promptData), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return new Response("Failed to fetch all prompts", {
      status: 500,
    });
  }
};
