"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEdgeStore } from "utils/edgestore";
import { useLoader } from "contexts/LoaderContext";

import Form from "components/Form";

const CreatePrompt = () => {
  const { data: session }: any = useSession();
  const { edgestore } = useEdgeStore();

  const router = useRouter();
  const { setGlobalLoading } = useLoader();

  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    title: "",
    prompt: "",
    md: "",
    tag: "",
    likes: 0,
    images: [] as File[],
    imageUrls: [] as string[],
  });

  const createPrompt = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setGlobalLoading(true);

    const imageUrls = await Promise.all(
      post.images.map(async (image) => {
        try {
          const res = await edgestore.publicImages.upload({ file: image });
          return res.url;
        } catch (error) {
          console.error(error);
        }
      })
    );

    try {
      const response = await fetch("api/prompt/new", {
        method: "POST",
        body: JSON.stringify({
          title: post.title,
          prompt: post.prompt,
          userId: session?.user.id,
          tag: post.tag,
          likes: post.likes,
          images: imageUrls,
        }),
      });
      if (response.ok) {
        router.push("/");
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setSubmitting(false);
      setGlobalLoading(false);
    }
  };

  if (!session) {
    return (
      <div>
        <p className="desc">Please sign in to continue</p>
      </div>
    );
  }

  return (
    <Form
      type="Create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={createPrompt}
    />
  );
};

export default CreatePrompt;
