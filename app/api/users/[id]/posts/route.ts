import { ConnectToDB } from "/lib/database";
import Prompt from "models/prompt";
import Likes from "models/like";

export const GET = async (req: Request, res: any) => {
  try {
    await ConnectToDB();
    const { params } = res;
    const userId = params.id;
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("sessionId");

    // Fetch all prompts created by the user specified in the params
    const prompts = await Prompt.find({
      creator: userId,
    }).populate("creator");

    let likedPostIds: string[] = [];

    if (sessionId && sessionId !== "null" && sessionId !== "undefined") {
      const userLikes = await Likes.find({ userId: sessionId }).select("postId");
      likedPostIds = userLikes.map((like) => like.postId.toString());
    }

    const promptsWithLikes = prompts.map((post) => ({
      ...post.toObject(),
      liked: likedPostIds.includes(post._id.toString()), // Check if the post is liked by the user
    }));

    return new Response(JSON.stringify(promptsWithLikes), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return new Response("Failed to fetch all prompts", {
      status: 500,
    });
  }
};
