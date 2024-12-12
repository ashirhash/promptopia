"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Feed from "@components/Feed";

const Home = () => {

  const {data: session}: any = useSession()

  // load posts
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/prompt?userId=${session?.user.id}`);
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <section className="w-full flex items-center flex-col">
      <h1 className="head_text text-center">
        Discover and Share
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center">AI-Powered Prompts</span>
      </h1>
      <p className="desc text-center">
        Promptopia is an open-source AI tool for modern world to discover,
        create and share creative prompts
      </p>

      <Feed posts={posts} setPosts={setPosts}/>
    </section>
  );
};

export default Home;
