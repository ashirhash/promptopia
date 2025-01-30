"use client";

import { useState, useEffect, createContext } from "react";
import PromptCard from "./PromptCard";
import Search from "./Search";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useLoader } from "contexts/LoaderContext";
import { useToast } from "/lib/hooks/use-toast";

export const PromptCardList = ({
  posts,
  handleTagClick,
  handleEdit,
  handleDelete,
}: any) => {
  return (
    <div className="mt-10 prompt_layout">
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
  setShareId: () => {},
});

const Feed = ({ posts, handleEdit, handleDelete }: any) => {
  const [searchText, setSearchText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [shareId, setShareId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data: session }: any = useSession();
  const { setGlobalLoading } = useLoader();
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      setGlobalLoading(true);
      const response = await fetch(`api/prompt/${shareId}/share`, {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user.id,
        }),
      });
      if (response.ok) {
        toast({
          title: "Shared!",
          description: "Post has been shared successfully",
        });
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast({
        title: "Failed to share post",
        description: "Something went wrong",
      });
    } finally {
      setGlobalLoading(false);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  const handleTagClick = (e: any, text: any) => {
    e.stopPropagation();
    setSearchText(text);
  };

  const handleClosePopup = () => {
    setIsOpen(false);
    setSelectedImage("");
    setShareId("");
  };

  return (
    <section className="feed">
      <Dialog
        open={isOpen}
        onClose={handleClosePopup}
        className="relative z-50"
      >
        <div className="fixed bg-slate-200/60 inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-[800px] w-full animate-fadeInFast">
            {selectedImage && selectedImage !== "" && (
              <>
                <img
                  src={selectedImage}
                  alt="active post image"
                  className="aspect-video object-contain w-full rounded-lg"
                />
              </>
            )}

            {shareId && shareId !== "" && (
              <div className="flex bg-white w-fit mx-auto p-8 rounded-lg justify-center items-center flex-col">
                <p className="desc mt-0 mb-3">Share to your profile</p>
                <button
                  type="button"
                  onClick={handleShare}
                  className="black_btn"
                >
                  Share now
                </button>
              </div>
            )}
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
      <PopupContext.Provider
        value={{ setIsOpen, setSelectedImage, setShareId }}
      >
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
