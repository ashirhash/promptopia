import Profile from "components/Profile";
import { ConnectToDB } from "/lib/database";
import { getServerSession } from "next-auth";
import { authOptions } from "/lib/nextauth";

const fetchPosts = async (id: string) => {
  ConnectToDB();
  const session: any = await getServerSession(authOptions);
  const sessionId = session?.user.id
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/users/${id}/posts?sessionId=${sessionId}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
};

export default async function AuthorProfile({ params }: AuthorProps) {
  const { id } = params;
  const posts = await fetchPosts(id);

  return (
    <Profile
      name={`${posts?.[0]?.creator?.username || "User"}'s`}
      desc="Welcome to my profile"
      posts={posts}
    />
  );
}

type AuthorProps = {
  params: {
    id: string;
  };
};