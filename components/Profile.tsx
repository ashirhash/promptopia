"use client";
import { useEdgeStore } from "/lib/edgestore";
import { useLoader } from "contexts/LoaderContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Feed from "./Feed";
import { useSession } from "next-auth/react";

const Profile = ({ name, desc, posts = [] }: any) => {
  const [postsState, setPostsState] = useState(posts);
  const { edgestore } = useEdgeStore();
  const { setGlobalLoading } = useLoader();
  const router = useRouter();
  const { data: session } = useSession();

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
        setPostsState(filteredPosts);
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
      } finally {
        setGlobalLoading(false);
      }
    }
  };
  return (
    <section className="w-full">
      <h1 className="head_text">
        <span className="blue_gradient">{name} Profile</span>
      </h1>
      <p className="desc">{desc}</p>

      <Feed
        posts={postsState}
        handleDelete={session?.user && handleDelete}
        handleEdit={session?.user && handleEdit}
      />
    </section>
  );
};

export default Profile;
