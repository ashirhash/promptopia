"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Profile from "@components/Profile";
import { useEdgeStore } from "@utils/edgestore";
import { useLoader } from "@app/contexts/LoaderContext";

const MyProfile = () => {
  const [posts, setPosts] = useState([]);
  const { data: session }: any = useSession();
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const { setGlobalLoading } = useLoader();

  const handleEdit = (post: any) => {
    router.push(`/update-prompt?id=${post._id}`);
  };
  const handleDelete = async (post: any) => {
    setGlobalLoading(true);
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        const response = await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });
        const filteredPosts = posts.filter((p: any) => p._id !== post._id);
        setPosts(filteredPosts);
        const data = await response.json();
        const { existingImageUrls } = data;
        await Promise.all(
          existingImageUrls.map(async (url: string) => {
            try {
              await edgestore.publicImages.delete({
                url: url,
              });
            } catch (error) {
              console.error(`Failed to delete image with URL: ${url}`, error);
            }
          })
        );
      } catch (error) {
        console.error("error deleting post", error);
      }
    }
    setGlobalLoading(false);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setGlobalLoading(true);
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();
      setPosts(data);
      setGlobalLoading(false);
    };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  if (!session) {
    return (
      <div>
        <p className="desc">Please sign in to continue</p>
      </div>
    );
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
