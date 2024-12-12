"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";
import Search from "./Search";

export const PromptCardList = ({
  posts,
  handleTagClick,
  handleEdit,
  handleDelete,
}: any) => {
  return (
    <div className="mt-16 prompt_layout">
      {posts.length > 0 ? (
        posts.map((post: any) => (
          <PromptCard
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))
      ) : (
        <p className="desc">No more posts</p>
      )}
    </div>
  );
};

const Feed = ({ posts, handleEdit, handleDelete }: any) => {
  const [searchText, setSearchText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  const handleTagClick = (text: any) => {
    setSearchText(text);
  };

  // component
  return (
    <section className="feed">
      <Search
        searchText={searchText}
        setSearchText={setSearchText}
        posts={posts}
        filteredPosts={filteredPosts}
        setFilteredPosts={setFilteredPosts}
      />

      <PromptCardList
        posts={filteredPosts}
        handleTagClick={handleTagClick}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </section>
  );
};

export default Feed;
