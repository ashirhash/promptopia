"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Profile from "@components/Profile";

const MyProfile = () => {
  const [posts, setPosts] = useState([]);
  const { data: session }: any = useSession();
  const router = useRouter();

  const handleEdit = (post: any) => {
    router.push(`/update-prompt?id=${post._id}`);
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
      } catch (error) {
        console.error("error deleting post", error);
      }
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();
      setPosts(data);
    };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  if (!session) {
    return (
      <div>
        <p className="desc">Please sign in to continue</p>
      </div>
    )
  }

  return (
    <>
      <Profile
        name="My"
        desc="Welcome to your personalized profile page"
        posts={posts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default MyProfile;
