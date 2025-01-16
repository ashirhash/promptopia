"use client";

import { useState, useEffect, createContext } from "react";
import PromptCard from "./PromptCard";
import Search from "./Search";
import { Dialog, DialogPanel } from "@headlessui/react";

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

export const PopupContext = createContext<any>({
  setIsOpen: () => {},
  setSelectedImage: () => {},
});

const Feed = ({ posts, handleEdit, handleDelete }: any) => {
  const [searchText, setSearchText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  const handleTagClick = (e:any, text: any) => {
    e.stopPropagation();
    setSearchText(text);
  };

  return (
    <section className="feed">
      <Dialog
        open={isOpen}
        onClose={setIsOpen && (() => setIsOpen(false))}
        className="relative z-50"
      >
        <div className="fixed bg-slate-200/60 inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-[800px] w-full animate-fadeInFast">
            <img
              src={selectedImage}
              alt="active post image"
              className="aspect-video object-contain w-full rounded-lg"
            />
          </DialogPanel>
        </div>
      </Dialog>
      <Search
        searchText={searchText}
        setSearchText={setSearchText}
        posts={posts}
        filteredPosts={filteredPosts}
        setFilteredPosts={setFilteredPosts}
      />
      <PopupContext.Provider value={{ setIsOpen, setSelectedImage }}>
        <PromptCardList
          posts={filteredPosts}
          handleTagClick={handleTagClick}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </PopupContext.Provider>
    </section>
  );
};

export default Feed;
