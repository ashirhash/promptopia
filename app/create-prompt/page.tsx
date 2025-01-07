"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Form from "@components/Form";

const CreatePrompt = () => {
  const { data: session }: any = useSession();

  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    prompt: "",
    tag: "",
    likes: 0,
  });

  const createPrompt = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("api/prompt/new", {
        method: "POST",
        body: JSON.stringify({
          prompt: post.prompt,
          userId: session?.user.id,
          tag: post.tag,
          likes: post.likes,
        }),
      });
      if (response.ok) {
        router.push("/");
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setSubmitting(false);
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
