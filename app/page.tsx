import { getServerSession } from "next-auth";
import Feed from "components/Feed";
import { authOptions } from "utils/nextauth";
import { ConnectToDB } from "utils/database";

async function fetchPosts() {
  await ConnectToDB();
  const session: any = await getServerSession(authOptions);
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/prompt`, {
      headers: {
        "Content-Type": "application/json",
        userId: session?.user?.id || "",
      }
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
      <Feed
        posts={posts}
      />
    </section>
  );
}
