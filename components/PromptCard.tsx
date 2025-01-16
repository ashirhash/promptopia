"use client";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CommentIcon, HeartIcon } from "./ui/Icons";
import { useDebounce, useTimeAgo } from "@utils/hooks";
import { PopupContext } from "./Feed";

interface PromptCardProps {
  post: any;
  handleTagClick?: (e: any, postTag: string) => void;
  handleDelete?: (post: number) => void;
  handleEdit?: (post: number) => void;
}

const PromptCard = ({
  post,
  handleTagClick,
  handleEdit,
  handleDelete,
}: PromptCardProps) => {
  const [copied, setCopied] = useState("");
  const [likes, setLikes] = useState<number>(post.likes);
  const [isLiked, setIsLiked] = useState<boolean>(post.liked);

  // disable liking unless user interacts with the button for avoiding side effects
  const [hasInteracted, setHasInteracted] = useState(false);
  const { data: session }: any = useSession();
  const router = useRouter();

  const handleCopy = (e: any) => {
    e.stopPropagation();
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(""), 3000);
  };

  const debLikes = useDebounce(likes, 1000);
  const timestamp = useTimeAgo(post.createdAt);

  const handleLike = (e: any) => {
    e.stopPropagation();
    setHasInteracted(true);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked((prev) => !prev);
  };

  useEffect(() => {
    setIsLiked(post.liked);
  }, [post.liked]);

  useEffect(() => {
    if (hasInteracted) {
      const updateLikes = async () => {
        if (!session?.user.id) {
          console.warn(
            "User is not logged in or session data is not available"
          );
          return;
        }

        try {
          await fetch(`/api/prompt/${post._id}/like`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: session?.user.id,
            }),
          });
        } catch (error) {
          console.error(
            "The following error occured while liking the post: ",
            error
          );
        }
      };
      updateLikes();
    }
  }, [debLikes]);

  const isSameUser = session?.user.id !== post.creator._id;

  const handleCardClick = (e: any) => {
    router.push(`/prompts/${post._id}`);
  };

  const { setIsOpen, setSelectedImage } = useContext(PopupContext);

  const handleImageClick = (e: any, src: string) => {
    e.stopPropagation();
    setIsOpen(true);
    setSelectedImage(src);
  };

  const handleUserClick = (e: any) => {
    e.stopPropagation();
    router.push(
      isSameUser ? `/authors/${post.creator._id}` : session ? "/profile" : "/"
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className={`prompt_card cursor-pointer hover:bg-slate-200 transition`}
    >
      <div className="flex justify-between items-start gap-5">
        <div className="flex-1 flex flex-col item items-start justify-between gap-3">
          {post.title && (
            <h2 className="font-semibold font-fig text-xl">{post.title}</h2>
          )}
          {post.imageUrls && post.imageUrls.length > 0 && (
            <div
              className="disable_parent_hover relative z-10 transition hover:scale-105 will-change-transform"
              onClick={(e) => handleImageClick(e, post.imageUrls[0])}
            >
              <img
                src={post.imageUrls[0]}
                alt="post cover image"
                className="rounded-xl w-full aspect-video object-cover"
              />
            </div>
          )}
          <div className="disable_parent_hover flex gap-3 items-center w-full justify-between ">
            <div
              onClick={handleUserClick}
              className={`flex gap-3 relative z-10 items-center cursor-pointer p-2 hover:bg-slate-200 transition rounded-md`}
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
            </div>

            <div className="copy_btn " onClick={handleCopy}>
              <Image
                alt="copy button"
                src={
                  copied ? "/assets/icons/tick.svg" : "/assets/icons/copy.svg"
                }
                width={15}
                height={15}
              />
            </div>
          </div>

          <p className=" font-satoshi text-sm text-gray-700">{post.prompt}</p>
          <p
            className="disable_parent_hover font-inter text-sm block pb-3 blue_gradient cursor-pointer"
            onClick={(e) => handleTagClick && handleTagClick(e, post.tag)}
          >
            {post.tag}
          </p>
          <div className="flex flex-col gap-3 w-full">
            <div className="flex justify-start items-center gap-4 w-full">
              <div
                className={`${
                  session?.user ? "disable_parent_hover" : "pointer-events-none"
                } flex items-center gap-2 select-none cursor-pointer`}
                onClick={session?.user && handleLike}
              >
                <HeartIcon
                  className={`${
                    session?.user ? "hover:bg-slate-300" : ""
                  }  transition p-[6.5px] bg-accent-gray rounded-full cursor-pointer`}
                  isActive={isLiked}
                />
                <span className="font-inter text-sm text-gray-700">
                  {likes}
                </span>
              </div>
              <div
                className={`${
                  session?.user ? "disable_parent_hover" : "pointer-events-none"
                } flex items-center gap-2 select-none cursor-pointer`}
              >
                <CommentIcon
                  size={30}
                  className={`${
                    session?.user ? "hover:bg-slate-300" : ""
                  }  transition p-[6.5px] bg-accent-gray rounded-full cursor-pointer`}
                />
                <span className="font-inter text-sm text-gray-700">
                  {likes}
                </span>
              </div>
              {handleEdit && handleDelete && (
                <>
                  <div className="flex">
                    {handleEdit && (
                      <button
                        type="button"
                        role="button"
                        className={`p-2 disable_parent_hover hover:underline font-inter text-sm green_gradient cursor-pointer`}
                        onClick={() => handleEdit(post)}
                      >
                        Edit
                      </button>
                    )}
                    {handleDelete && (
                      <button
                        type="button"
                        role="button"
                        className="p-2 font-inter disable_parent_hover hover:underline text-sm orange_gradient cursor-pointer"
                        onClick={() => handleDelete(post)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
            <span className=" font-satoshi tracking-wide font-light text-xs text-slate-500">
              {timestamp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
