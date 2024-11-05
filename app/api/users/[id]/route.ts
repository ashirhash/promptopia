import { ConnectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import User from "@models/user";

export const GET = async (req: any, { params }: any) => {
  try {
    await ConnectToDB();

    const creator = await User.findById(params.id);

    if (!creator) {
      return new Response("User not found", {
        status: 404,
      });
    }

    return new Response(JSON.stringify({creator}), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to fetch user and prompts", {
      status: 500,
    });
  }
};
