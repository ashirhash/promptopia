"use client";
import { useState, useEffect } from "react";
import Profile from "@components/Profile";

interface Post {}

interface Creator {
  username: string;
}

interface AuthorProfileProps {
  params: {
    id: string;
  };
}

const AuthorProfile = ({ params }: AuthorProfileProps) => {
  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const { id } = params;

  const handleEdit = (post: any) => {
    `/update-prompt?id=${post._id}`;
  };
  const handleDelete = async (post: any) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = posts.filter((p: any) => p._id !== post._id);

        setPosts(filteredPosts);
      } catch (error) {}
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${id}/posts`);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        console.log("Fetched data:", data);

        setCreator(data[0]?.creator || null);
        setPosts(data || []);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUserData();
  }, [id]);

  if (loading) return <div className="desc">Loading...</div>;

  return (
    <Profile
      name={`${creator?.username || "User"}'s`}
      desc="Welcome to my profile"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default AuthorProfile;
