import { ConnectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import Likes from "@models/likes";

export const GET = async (req: Request) => {
  try {
    let userId:string | null;

    userId = req.headers.get("userid");

    console.log("userId", userId, typeof userId);
    

    await ConnectToDB();

    // Fetch all prompts
    const prompts = await Prompt.find({}).populate("creator");

    let likedPostIds: string[] = [];
    let likeCounts: Record<string, number> = {};

    // If user is logged in, fetch their liked posts
    if (userId && userId !== "null" && userId !== "undefined") {
      // this code causes error without ID
      const userLikes = await Likes.find({ userId: userId }).select("postId");
      likedPostIds = userLikes.map((like) => like.postId.toString());
    }

    // Aggregate like counts for all posts
    const likeAggregation: { _id: string; count: number }[] =
      await Likes.aggregate([
        { $group: { _id: "$postId", count: { $sum: 1 } } },
      ]);

    console.log("likeAggregation", likeAggregation);

    // Map aggregated likes to a dictionary
    likeAggregation.forEach((like) => {
      likeCounts[like._id.toString()] = like.count;
    });

    // Attach like information to prompts
    const promptsWithLikes = prompts.map((post) => ({
      ...post.toObject(),
      liked: userId ? likedPostIds.includes(post._id.toString()) : false,
      likes: likeCounts[post._id.toString()] || 0,
    }));

    console.log(promptsWithLikes);

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
