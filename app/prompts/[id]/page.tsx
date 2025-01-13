"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTimeAgo } from "@utils/hooks";

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
        <div className="">
          <Link
            href={`/authors/${post.creator._id}`}
            className={`flex gap-3 items-center cursor-pointer hover:bg-slate-200 transition rounded-lg mb-3 p-2`}
          >
            <Image
              src={post.creator.image}
              alt="user_image"
              width={40}
              height={40}
              className="rounded-full object-contain"
            />

            <div className="flex flex-col">
              <h3 className="font-satoshi font-semibold text-gray-900">
                {post.creator.username}
              </h3>
              <p className="font-inter text-sm text-gray-500">
                {post.creator.email}
              </p>
            </div>
          </Link>
          <p
            className="font-inter pl-2 text-sm blue_gradient cursor-pointer"
            // onClick={() => handleTagClick && handleTagClick(post.tag)}
          >
            {post.tag}
          </p>
        </div>
      </div>
      <div className="">
        <p className="font-satoshi font-medium mt-5 text-slate-700 tracking-wide text-lg mb-2">
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
    </div>
  );
};

export default Page;
