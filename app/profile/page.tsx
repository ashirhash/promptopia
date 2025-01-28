import { getServerSession } from "next-auth";
import Profile from "@components/Profile";
import { authOptions } from "@utils/nextauth";
import { ConnectToDB } from "@utils/database";

export default async function Page() {
  const session: any = await getServerSession(authOptions);
  if (!session) {
    return (
      <div>
        <p className="desc">Please sign in to continue</p>
      </div>
    );
  }

  async function fetchPosts() {
    await ConnectToDB();
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/users/${session?.user.id}/posts`
    );
    return await response.json();
  }

  const posts = await fetchPosts();

  return (
    <>
      <Profile
        name="My"
        desc="Welcome to your personalized profile page"
        posts={posts}
      />
    </>
  );
}
