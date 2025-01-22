"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTimeAgo } from "@utils/hooks";
import { useSession } from "next-auth/react";
import UserBox from "@components/UserBox";
import CommentCard from "@components/CommentCard";

interface PromptProfileProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: PromptProfileProps) => {
  const [loading, setLoading] = useState(true);
  const [hasPost, setHasPost] = useState(true);
  const [post, setPost] = useState<any>({});
  const [timestamps, setTimestamps] = useState<string>("");
  const { id } = params;
  const { data: session }: any = useSession();
  const [isCommenting, setIsCommenting] = useState(false);

  const [comment, setComment] = useState({
    userId: session?.user.id,
    parentId: "",
    content: "",
  });

  const handleComment = async (e: any) => {
    e.preventDefault();
    setIsCommenting(true);
    if (!session?.user.id) {
      console.warn("User is not logged in or session data is not available");
      return;
    }

    try {
      await fetch(`/api/prompt/${post._id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
      });
    } catch (error) {
      console.error(
        "The following error occured while liking the post: ",
        error
      );
    }
    setIsCommenting(false);
  };

  useEffect(() => {
    if (post.createdAt) {
      setTimestamps(useTimeAgo(post?.createdAt));
    }
  }, [post]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/prompt/${id}`, {
          method: "GET",
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const post = await response.json();
        setPost(post);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setHasPost(false);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  if (loading) return <div className="desc">Loading...</div>;

  if (!session)
    return (
      <>
        <div className="desc mb-3">Please sign in to continue</div>
      </>
    );

  if (!hasPost)
    return (
      <>
        <div className="desc mb-3">Post not found</div>
        <Link href="/" className="black_btn">
          Browse posts
        </Link>
      </>
    );

  return (
    <div className="w-full">
      <h2 className="font-bold md:max-w-[75%] w-full font-fig text-light-black text-4xl mb-4">
        {post.title}
      </h2>
      <div className="flex flex-col justify-start items-start md:flex-row gap-5">
        {post?.imageUrls[0] && (
          <>
            <div className="md:max-w-[75%] w-full aspect-video flex justify-start">
              <img
                src={post.imageUrls[0]}
                className="h-full w-full object-cover rounded-xl"
                alt="post snapshot"
              />
            </div>
          </>
        )}
        <div className="flex flex-col gap-3">
          <UserBox
            img={post.creator.image}
            username={post.creator.username}
            email={post.creator.email}
          />
          <p
            className="font-inter pl-2 text-sm blue_gradient"
            // onClick={() => handleTagClick && handleTagClick(post.tag)}
          >
            {post.tag}
          </p>
        </div>
      </div>
      <div className="mt-5 pb-4">
        <p className="font-satoshi font-medium text-slate-700 tracking-wide text-lg mb-2">
          {post.prompt} Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Pariatur corrupti aliquid iste, reprehenderit non provident,
          perferendis quibusdam expedita error nemo, praesentium obcaecati hic.
          Iste consequuntur, vero, quo itaque quos neque delectus facere
          dolorum, hic doloribus impedit. Corrupti quibusdam alias dolore
          impedit fugiat doloribus voluptatum inventore nostrum aspernatur, nisi
          delectus distinctio.
        </p>
        <p className="font-satoshi font-medium tracking-wider text-sm text-primary-orange">
          - {timestamps}
        </p>
      </div>
      <div className="flex flex-col my-10 py-5 border-t-2">
        <form onSubmit={handleComment} className="flex items-start gap-5">
          <textarea
            className="form_textarea shadow-lg border border-solid"
            placeholder="Write your comment..."
            onChange={(e) =>
              setComment({
                ...comment,
                content: e.target.value,
              })
            }
          />
          <button
            type="submit"
            className={`px-5 mt-3 py-1.5 md:text-base text-sm bg-primary-orange rounded-full text-white ${
              isCommenting ? "pointer-events-none" : "cursor-pointer"
            }`}
          >
            {isCommenting ? "POSTING..." : "POST"}
          </button>
        </form>
      </div>
      {post?.comments && post?.comments.length > 0 ? (
        <div className="flex flex-col gap-4 mb-10">
          {post.comments.map((comment: any, index: any) => {
            if (comment.content) {
              return (
                <CommentCard key={`comment-box-${index}`} comment={comment} />
              );
            }
          })}
        </div>
      ) : (
        <div>
          <span className="desc text-center max-w-full block w-full">
            No comments yet...
          </span>
        </div>
      )}
    </div>
  );
};

export default Page;
