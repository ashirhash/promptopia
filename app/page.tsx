"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Feed from "@components/Feed";
import { useLoader } from "./contexts/LoaderContext";

const Home = () => {
  const { data: session }: any = useSession();
  const { setGlobalLoading } = useLoader();
  // load posts
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setGlobalLoading(true)
        const response = await fetch(`/api/prompt`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            userId: session?.user.id,
          },
        });
        const data = await response.json();
        setPosts(data);
      } catch (error) { 
        console.error("Error fetching posts", error);
      }
      finally {
        setGlobalLoading(false)
      }
    };
    fetchPosts();
  }, [session]);

  return (
    <section className="w-full flex items-center flex-col">
      <h1 className="head_text text-center">
        Discover and Share
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center"> AI-Powered Prompts</span>
      </h1>
      <p className="desc text-center">
        Promptopia is an open-source AI tool for modern world to discover,
        create and share creative prompts
      </p>
      <Feed posts={posts} setPosts={setPosts} />
    </section>
  );
};

export default Home;
