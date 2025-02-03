import { ConnectToDB } from "/lib/database";
import Share from "models/share";
import { isValidString } from "/lib/utils";

export const POST = async (req: any, { params }: any) => {
  try {
    await ConnectToDB();

    const { userId } = await req.json();
    const postId = params.id;

    if (!isValidString(userId)) {
      throw new Error(`No user ID found. Received: ${userId}`);
    }
    if (!isValidString(postId)) {
      throw new Error(`No post ID found. Received: ${postId}`);
    }

    const newShare = new Share({
      creator: userId,
      sharedPost: postId,
    });

    await newShare.save();

    return new Response("Shared successfully", {
      status: 200,
    });
  } catch (error) {
    return new Response(`Failed to comment, error: ${error}`, {
      status: 500,
    });
  }
};

export const DELETE = async (req: any) => {
  try {
    await ConnectToDB();

    const { sessionId, shareId } = await req.json();

    console.log({ sessionId, shareId });

    if (!isValidString(sessionId)) {
      throw new Error(`No session ID found. Received: ${sessionId}`);
    }
    if (!isValidString(shareId)) {
      throw new Error(`No share ID found. Received: ${shareId}`);
    }

    // Find the shared post by shareId
    const sharePost = await Share.findById(shareId);

    if (!sharePost) {
      throw new Error(`Shared post not found for ID: ${shareId}`);
    }

    console.log(sharePost.creator._id.toString(), "sharePost.creator._id ");

    // Check if the sessionId matches the creator of the shared post
    if (sharePost.creator._id.toString() !== sessionId) {
      throw new Error("You are not authorized to delete this shared post.");
    }

    // Delete the shared post if the user is authorized
    await Share.deleteOne({ id: shareId });

    return new Response("Shared post deleted successfully", {
      status: 200,
    });
  } catch (error) {
    return new Response(`Failed to delete shared post, error: ${error}`, {
      status: 500,
    });
  }
};
