import { ConnectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (req: any, { params }: any) => {
  try {
    await ConnectToDB();

    const prompt = await Prompt.findById(params.id).populate("creator");

    if (!prompt) return new Response("Prompt not found", { status: 404 });

    return new Response(JSON.stringify(prompt), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to fetch all prompts", {
      status: 500,
    });
  }
};

export const PATCH = async (req: any, { params }: any) => {
  const { userId, prompt, tag, imageUrls } = await req.json();

  try {
    await ConnectToDB();

    const existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    const creatorId = existingPrompt.creator.toString();

    if (creatorId !== userId) {
      return new Response("Access denied, invalid user", { status: 401 });
    }

    // Find the replaced URLs
    const existingImageUrls = existingPrompt.imageUrls || [];
    const replacedUrls = existingImageUrls.filter(
      (url: string) => !imageUrls.includes(url)
    );

    // Update the prompt details
    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;
    existingPrompt.imageUrls = imageUrls;

    await existingPrompt.save();

    return new Response(
      JSON.stringify({
        replacedUrls,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Failed to update prompt", {
      status: 500,
    });
  }
};

export const DELETE = async (req: any, { params }: any) => {
  try {
    await ConnectToDB();

    const existingPrompt = await Prompt.findByIdAndDelete(params.id);

    const existingImageUrls = existingPrompt.imageUrls || [];

    return new Response(
      JSON.stringify({
        existingImageUrls,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response("Failed to delete prompt", {
      status: 500,
    });
  }
};
