import { ConnectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const POST = async (req: Request) => {
  const { userId, prompt, tag, likes, images } = await req.json();

  try {
    await ConnectToDB();

    const imageUrls: String[] = images;

    const newPrompt = new Prompt({
      creator: userId,
      prompt,
      tag,
      likes,
      imageUrls,
    });

    await newPrompt.save();

    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
