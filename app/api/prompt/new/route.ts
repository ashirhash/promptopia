import { ConnectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const POST = async (req: any) => {
  const { userId, prompt, tag, likes } = await req.json();

  try {
    await ConnectToDB();

    const newPrompt = new Prompt({
      creator: userId,
      prompt: prompt,
      tag: tag,
      likes: likes
    });

    await newPrompt.save(); ``

    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
