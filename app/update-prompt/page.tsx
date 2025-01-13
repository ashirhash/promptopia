"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Form from "@components/Form";
import { useEdgeStore } from "@utils/edgestore";

const UpdatePromptWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdatePrompt />
    </Suspense>
  );
};

const UpdatePrompt = () => {
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const promptId = useSearchParams().get("id");
  const { data: session, status }: any = useSession();

  const [submitting, setSubmitting] = useState(false);
  const [isUserAllowed, setIsUserAllowed] = useState(2); // 2: loading, 1: allowed, 0: not allowed
  const [post, setPost] = useState({
    prompt: "",
    tag: "",
    images: [] as File[] | string[],
    imageUrls: [] as string[],
  });

  useEffect(() => {
    const getPromptDetails = async () => {
      if (status !== "authenticated" || !session || !promptId) return;

      try {
        const response = await fetch(`/api/prompt/${promptId}`);
        const data = await response.json();

        if (data.creator._id !== session.user.id) {
          setIsUserAllowed(0); // Not allowed
          return;
        }

        setPost({
          prompt: data.prompt,
          tag: data.tag,
          images: data.imageUrls,
          imageUrls: data.imageUrls,
        });

        setIsUserAllowed(1); // Allowed
      } catch (error) {
        console.error(error);
        setIsUserAllowed(0); // Not allowed
      }
    };

    if (status === "authenticated") {
      getPromptDetails();
    }
  }, [promptId, session, status]);

  const updatePrompt = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);

    const imageUrls = await Promise.all(
      post.images.map(async (image) => {
        if (image instanceof File) {
          try {
            const res = await edgestore.publicImages.upload({ file: image });
            return res.url;
          } catch (error) {
            console.error(error);
          }
        } else {
          return image;
        }
      })
    );

    if (!promptId) return alert("Prompt ID not found");

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        body: JSON.stringify({
          userId: session?.user.id,
          prompt: post.prompt,
          tag: post.tag,
          imageUrls: imageUrls,
        }),
      });
      if (response.ok) {
        router.push("/");
        const data = await response.json();
        const { replacedUrls } = data;
        await Promise.all(
          replacedUrls.map(async (url: string) => {
            try {
              await edgestore.publicImages.delete({
                url: url,
              });
            } catch (error) {
              console.error(`Failed to delete image with URL: ${url}`, error);
            }
          })
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div>
        <p className="desc">Loading session...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div>
        <p className="desc">Please sign in to continue</p>
      </div>
    );
  }

  if (!promptId) {
    return <div className="desc text-center">No prompt ID found</div>;
  }

  if (isUserAllowed === 2) {
    return (
      <div className="desc text-center">
        Checking if you are allowed to edit...
      </div>
    );
  }

  if (isUserAllowed === 0) {
    return (
      <div className="desc text-center">
        You are not allowed to edit this prompt as you are not the author
      </div>
    );
  }

  return (
    <Form
      type="Update"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={updatePrompt}
    />
  );
};

export default UpdatePromptWrapper;
