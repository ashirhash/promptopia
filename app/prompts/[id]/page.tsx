"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTimeAgo } from "@utils/hooks";
import { useSession } from "next-auth/react";
import UserBox from "@components/UserBox";
import CommentCard from "@components/CommentCard";
import { useLoader } from "@app/contexts/LoaderContext";

interface PromptProfileProps {
  params: {
    id: string;
  };
}

interface Comment {
  userId: string | null; // Adjust the type based on your actual session object
  parentId: string;
  content: string;
  createdAt: string
}

const Page = ({ params }: PromptProfileProps) => {
  const { data: session }: any = useSession();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [hasPost, setHasPost] = useState(true);
  const [post, setPost] = useState<any>({});
  const [timestamps, setTimestamps] = useState<string>("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  // the remaining data like createdAt is locally being temporarily created, mostly as a fake data to show the changed instantly to the user instaed of making an api call 
  const [comment, setComment] = useState<Comment>({
    userId: session?.user.id,
    parentId: "",
    content: "",
    createdAt: "just now"
  });
  const { setGlobalLoading } = useLoader();

  console.log(comments);
  

  const handleComment = async (e: any) => {
    e.preventDefault();
    setIsCommenting(true);
    if (!session?.user.id) {
      console.error("User is not logged in or session data is not available");
      return;
    }

    try {
      const res = await fetch(`/api/prompt/${post._id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
      });
      if(res.ok) {
        setComments([...comments, comment])
      }
    } catch (error) {
      console.error(
        "The following error occured while liking the post: ",
        error
      );
    }
    finally {
      setIsCommenting(false);
    }
  };

  const handleDelete = async (commentId: number | string) => {
    setGlobalLoading(true);
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${id}/comment`, {
          method: "DELETE",
          body: JSON.stringify({
            userId: comment.userId,
            commentId: commentId,
          }),
        });
        const filteredComments = comments.filter((item: any) => {
          return item._id !== commentId;
        });
        setComments(filteredComments);
      } catch (error) {
        console.error("error deleting post", error);
      } finally {
        setGlobalLoading(false);
      }
    }
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
        if (post.comments && post.comments.length > 0) {
          setComments(post.comments);
        }
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

  useEffect(() => {
    setComment({
      ...comment,
      userId: session?.user.id,
    });
  }, [session]);

  if (loading) return <div className="desc">Loading...</div>;

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
      {comments.length > 0 ? (
        <div className="flex flex-col gap-4 mb-10">
          {[...comments].reverse().map((comment: any, index: any) => {
            if (comment.content) {
              return (
                <CommentCard
                  key={`comment-box-${index}`}
                  comment={comment}
                  handleDelete={handleDelete}
                />
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
