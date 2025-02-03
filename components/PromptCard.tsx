"use client";
import { useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CommentIcon, HeartIcon, ShareIcon } from "./ui/Icons";
import { useDebounce, useTimeAgo } from "../lib/hooks/hooks";
import { PopupContext } from "./Feed";
import UserBox from "./UserBox";

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
  const [likes, setLikes] = useState<number>(post.likes);
  const [isLiked, setIsLiked] = useState<boolean>(post.liked);

  // disable liking unless user interacts with the button for avoiding side effects
  const [hasInteracted, setHasInteracted] = useState(false);
  const { data: session }: any = useSession();
  const router = useRouter();

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

  const { setIsOpen, setSelectedImage, setShareId } = useContext(PopupContext);

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

  const handleShare = (e: any, src: string) => {
    e.stopPropagation();
    setIsOpen(true);
    setShareId(src);
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

          <div className="disable_parent_hover flex gap-3 items-center w-full justify-between ">
            <UserBox
              img={post.creator.image}
              username={post.creator.username}
              email={post.creator.email}
              handleUserClick={handleUserClick}
            />
          </div>
          <p className=" font-satoshi text-sm text-gray-700">{post.prompt}</p>
          <p
            className="disable_parent_hover font-inter text-sm block blue_gradient cursor-pointer"
            onClick={(e) => handleTagClick && handleTagClick(e, post.tag)}
          >
            {post.tag}
          </p>
          <span className=" font-satoshi tracking-wide font-light text-xs text-slate-500">
            {timestamp}
          </span>
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
          <div className="flex flex-col justify-start gap-4 w-full">
            <div className="flex gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`${
                    session?.user
                      ? "disable_parent_hover"
                      : "pointer-events-none"
                  } flex items-center gap-2 select-none cursor-pointer`}
                  onClick={session?.user && handleLike}
                >
                  <div
                    className={`${
                      session?.user ? "hover:bg-slate-300" : ""
                    }  transition  bg-accent-gray rounded-lg cursor-pointer`}
                  >
                    <HeartIcon className="p-[6.5px]" isActive={isLiked} />
                  </div>
                  <span className="font-inter text-sm text-gray-700">
                    {likes}
                  </span>
                </div>
                <div
                  className={`flex disable_parent_hover items-center gap-2 select-none cursor-pointer`}
                >
                  <CommentIcon
                    size={30}
                    className={`hover:bg-slate-300 transition p-[6.5px] bg-accent-gray rounded-lg cursor-pointer`}
                  />
                  <span className="font-inter text-sm text-gray-700">
                    {post.commentCount}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  onClick={(e: any) => handleShare(e, post._id)}
                  className={`${
                    session?.user
                      ? "disable_parent_hover"
                      : "pointer-events-none"
                  } flex items-center gap-2 select-none cursor-pointer`}
                >
                  <ShareIcon
                    size={30}
                    className={`${
                      session?.user
                        ? " hover:bg-slate-300"
                        : "pointer-events-none"
                    }  transition p-[5.5px] bg-accent-gray rounded-lg cursor-pointer`}
                  />
                  <span className="font-inter text-sm text-gray-700">
                    {post.shares}
                  </span>
                </div>
              </div>
            </div>
            {handleEdit && handleDelete && (
              <>
                <div className="flex">
                  {handleEdit && (
                    <button
                      type="button"
                      role="button"
                      className={`bg-white p-2 rounded-lg disable_parent_hover hover:underline font-inter text-sm border-1 green_gradient hover:scale-110 transition cursor-pointer`}
                      onClick={() => handleEdit(post)}
                    >
                      Edit
                    </button>
                  )}
                  {handleDelete && (
                    <button
                      type="button"
                      role="button"
                      className="p-2 font-inter disable_parent_hover hover:underline text-sm orange_gradient hover:scale-110 transition cursor-pointer"
                      onClick={() => handleDelete(post)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
