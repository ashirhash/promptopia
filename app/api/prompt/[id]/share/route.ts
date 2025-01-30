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
      userId: userId,
      postId
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