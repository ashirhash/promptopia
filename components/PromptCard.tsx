"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HeartIcon } from "./ui/Icons";
import { useDebounce, useTimeAgo } from "@utils/hooks";
import Link from "next/link";

interface PromptCardProps {
  post: any;
  handleTagClick?: ({}) => void;
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

  const handleCopy = (e:any) => {
    e.preventDefault();
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(""), 3000);
  };

  const debLikes = useDebounce(likes, 1000);
  const timestamp = useTimeAgo(post.createdAt);

  const handleLike = () => {
    if (session) {
      setHasInteracted(true);
      setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
      setIsLiked((prev) => !prev);
    }
  };

  useEffect(() => {
    setIsLiked(post.liked);
  }, [post.liked]);

  useEffect(() => {
    if (hasInteracted) {
      const updateLikes = async () => {
        if (!session.user.id) {
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

  return (
    <Link
      href={`/prompts/${post._id}`}
      className={`prompt_card cursor-pointer hover:bg-slate-200 transition`}
    >
      <div className="flex justify-between items-start gap-5">
        <div className="flex-1 flex flex-col item items-start justify-between gap-3">
          {post.imageUrls && post.imageUrls.length > 0 && (
            <img
              src={post.imageUrls[0]}
              alt="post cover image"
              className="rounded-xl w-full aspect-video object-cover"
            />
          )}
          <div className="disable_parent_hover flex gap-3 items-center w-full justify-between ">
            <Link
              href={
                isSameUser
                  ? `/authors/${post.creator._id}`
                  : session
                  ? "/profile"
                  : "/"
              }
              // onClick={() => handleUserClick()}
              className={`flex gap-3 relative z-10 items-center cursor-pointer p-2 hover:bg-slate-200 transition rounded-lg`}
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
            className="font-inter text-sm blue_gradient cursor-pointer"
            onClick={() => handleTagClick && handleTagClick(post.tag)}
          >
            {post.tag}
          </p>
          <div className="flex flex-col gap-3 w-full">
            <div className="flex justify-between items-center gap-3 w-full mt-3">
              <div
                className="flex items-center gap-2 select-none cursor-pointer"
                onClick={() => handleLike()}
              >
                <HeartIcon className="disable_parent_hover hover:bg-slate-300 transition " isActive={isLiked} />
                <span className="font-inter text-sm text-gray-700">
                  {likes}
                </span>
              </div>
              <div className="flex gap-4">
                {handleEdit && (
                  <p
                    className={`font-inter text-sm green_gradient cursor-pointer`}
                    onClick={() => handleEdit(post)}
                  >
                    Edit
                  </p>
                )}
                {handleDelete && (
                  <p
                    className="font-inter text-sm orange_gradient cursor-pointer"
                    onClick={() => handleDelete(post)}
                  >
                    Delete
                  </p>
                )}
              </div>
            </div>
            <span className=" font-satoshi tracking-wide font-light text-xs text-slate-500">
              {timestamp}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PromptCard;
