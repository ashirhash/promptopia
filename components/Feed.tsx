"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }: any) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.length > 0 ? (
        data.map((item: any) => (
          <PromptCard
            key={item._id}
            post={item}
            handleTagClick={handleTagClick}
          />
        ))
      ) : (
        <p className="desc">No more posts</p>
      )}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  // load posts
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPosts(data);
      setFilteredPosts(data);
    };

    fetchPosts();
  }, []);

  // Search filter
  useEffect(() => {
    const terms = searchText.toLowerCase().split(" ").filter(Boolean);
    const filtered = posts.filter((post: any) => {
      return terms.every((term) => {
        if (term.startsWith("@")) {
          const username = term.slice(1);
          return post.creator.username.toLowerCase().includes(username);
        } else if (term.startsWith("#")) {
          const tag = term.slice(1);
          return post.tag.toLowerCase().includes(tag);
        } else {
          return (
            post.prompt.toLowerCase().includes(term) ||
            post.creator.username.toLowerCase().includes(term) ||
            post.tag.toLowerCase().includes(term)
          );
        }
      });
    });

    setFilteredPosts(filtered);
  }, [searchText, posts]);

  const handleTagClick = (text: any) => {
    setSearchText(text);
  };

  // component
  return (
    <section className="feed">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative w-full flex justify-center"
      >
        <input
          type="text"
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList data={filteredPosts} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;
