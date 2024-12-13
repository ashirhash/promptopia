import { ConnectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import Likes from "@models/likes";

export const GET = async (req: any) => {
  try {
    const userId = await req.headers.get("userid");

    await ConnectToDB();

    const prompts = await Prompt.find({}).populate("creator");

    let likedPostIds = [];

    let likeCounts: any = {};

    if (userId) {
      const userLikes = await Likes.find({ userId }).select("postId");
      likedPostIds = userLikes.map((like: any) => like.postId.toString());
    }

    const likeAggregation = await Likes.aggregate([
      { $group: { _id: "$postId", count: { $sum: 1 } } },
    ]);

    console.log("Like aggregation:", likeAggregation);

    likeAggregation.forEach((like: any) => {
      likeCounts[like._id.toString()] = like.count;
    });

    const promptsWithLikes = prompts.map((post) => ({
      ...post.toObject(),
      liked: userId && likedPostIds.includes(post._id.toString()),
      likeCount: likeCounts[post._id.toString()] || 0,
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
