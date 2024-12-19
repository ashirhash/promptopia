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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${id}/posts`);
        if (!response.ok) throw new Error("Network response was not ok");

        const posts = await response.json();
        setCreator(posts[0]?.creator || null);
        setPosts(posts || []);

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
      posts={posts}
    />
  );
};

export default AuthorProfile;
