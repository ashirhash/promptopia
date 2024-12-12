import { ConnectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import Likes from "@models/likes";

export const PATCH = async (req: any, { params }: any) => {
  try {
    await ConnectToDB();

    const { userId } = await req.json();
    const postId = params.id

    console.log(userId, postId);

    const existingLike = await Likes.findOne({ postId, userId });

    if (existingLike) {
      return new Response("User has already liked this post", {
        status: 400,
      });
    }

    const newLikedPost = new Likes({userId, postId})
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
