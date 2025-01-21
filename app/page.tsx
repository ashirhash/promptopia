import { ConnectToDB } from "@utils/database";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Feed from "@components/Feed";


async function fetchPosts() {
  await ConnectToDB();

  const session: any = await getServerSession(authOptions);

  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/prompt`, {
      headers: {
        "Content-Type": "application/json",
        userId: session?.user?.id || "",
      },
      cache: "no-store",
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function Home() {
  const posts = await fetchPosts();

  return (
    <section className="w-full flex items-center flex-col">
      <h1 className="head_text text-center">
        Discover and Share
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center"> AI-Powered Prompts</span>
      </h1>
      <p className="desc text-center">
        Promptopia is an open-source AI tool for modern world to discover,
        create and share creative prompts
      </p>
      <Feed
        posts={posts}
      />
    </section>
  );
}
