import { ConnectToDB } from "@utils/database";
import Comment from "@models/comments";

export const POST = async (req: any, { params }: any) => {
  try {
    await ConnectToDB();

    const request = await req.json();
    console.log(request);

    const { userId, parentId, content } = request;
    const postId = params.id;

    if (
      !userId ||
      userId === "" ||
      userId === "null" ||
      userId === "undefined"
    ) {
      throw new Error("no user id found");
    }

    if (!content || content.trim() === "") {
      throw new Error("Comment content cannot be empty");
    }

    const parentNotValid =
      !parentId ||
      parentId === "" ||
      parentId === "null" ||
      parentId === "undefined";

    //create a new comment in db
    const newComment = new Comment({
      userId,
      postId,
      parentId: parentNotValid ? null : parentId,
      content,
    });

    await newComment.save();
    return new Response("Commented successfully", {
      status: 200,
    });
  } catch (error) {
    return new Response(`Failed to comment, error: ${error}`, {
      status: 500,
    });
  }
};

export const DELETE = async (req: any, { params }: any) => {
  try {
    await ConnectToDB();

    // get all resources
    const { userId, commentId } = await req.json();
    const postId = params.id;

    // handle resource validations
    if (!userId) {
      throw new Error("No user id found");
    }

    if (!postId) {
      throw new Error("No post id found");
    }
    
    if (!postId) {
      throw new Error("No post id found");
    }

    // delete comment
    const comment = await Comment.findById(commentId);

    console.log(comment);

    return new Response("Comment deleted successfully", {
      status: 200,
    });
  } catch (error) {
    return new Response(`Failed to delete comment, error: ${error}`, {
      status: 500,
    });
  }
};
