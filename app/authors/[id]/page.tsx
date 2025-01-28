import Profile from "@components/Profile";

type AuthorProps = {
  params: {
    id: string;
  };
};

const fetchPosts = async (id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/users/${id}/posts`
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
  console.log(posts);

  return (
    <Profile
      name={`${posts[0]?.creator?.username || "User"}'s`}
      desc="Welcome to my profile"
      posts={posts}
    />
  );
}
