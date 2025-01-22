"use client";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CommentIcon, HeartIcon } from "./ui/Icons";
import { useDebounce, useTimeAgo } from "@utils/hooks";
import { PopupContext } from "./Feed";
import UserBox from "./UserBox";

interface CommentCardProps {
  comment: any;
  handleTagClick?: (e: any, postTag: string) => void;
  handleDelete?: (post: number) => void;
  handleEdit?: (post: number) => void;
}

const CommentCard = ({
  comment,
  handleTagClick,
  handleEdit,
  handleDelete,
}: CommentCardProps) => {
  //   const [copied, setCopied] = useState("");
  //   const [likes, setLikes] = useState<number>(post.likes);
  //   const [isLiked, setIsLiked] = useState<boolean>(post.liked);

  // disable liking unless user interacts with the button for avoiding side effects
  //   const [hasInteracted, setHasInteracted] = useState(false);
  const { data: session }: any = useSession();
  const router = useRouter();

  //   const handleCopy = (e: any) => {
  //     e.stopPropagation();
  //     setCopied(post.prompt);
  //     navigator.clipboard.writeText(post.prompt);
  //     setTimeout(() => setCopied(""), 3000);
  //   };

  //   const debLikes = useDebounce(likes, 1000);
  const timestamp = useTimeAgo(comment.createdAt);

  //   const handleLike = (e: any) => {
  //     e.stopPropagation();
  //     setHasInteracted(true);
  //     setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  //     setIsLiked((prev) => !prev);
  //   };

  //   useEffect(() => {
  //     setIsLiked(post.liked);
  //   }, [post.liked]);

  //   useEffect(() => {
  //     if (hasInteracted) {
  //       const updateLikes = async () => {
  //         if (!session?.user.id) {
  //           console.warn(
  //             "User is not logged in or session data is not available"
  //           );
  //           return;
  //         }

  //         try {
  //           await fetch(`/api/prompt/${post._id}/like`, {
  //             method: "PATCH",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               userId: session?.user.id,
  //             }),
  //           });
  //         } catch (error) {
  //           console.error(
  //             "The following error occured while liking the post: ",
  //             error
  //           );
  //         }
  //       };
  //       updateLikes();
  //     }
  //   }, [debLikes]);

  const isSameUser = session?.user.id !== comment.postId;

  const handleUserClick = (e: any) => {
    e.stopPropagation();
    router.push(
      isSameUser
        ? `/authors/${comment.creator._id}`
        : session
        ? "/profile"
        : "/"
    );
  };

  return (
    <div className="p-2 pb-4 border rounded-md flex flex-col gap-3">
      <div className="w-fit">
        <UserBox
          className="px-3"
          img={comment?.creator?.image}
          username={comment?.creator?.username}
          email={comment?.creator?.email}
          handleUserClick={handleUserClick}
        />
      </div>
      <div className="ml-3 flex flex-col gap-3">
        <p className="font-satoshi font-medium text-slate-700 tracking-wide text-[15px] ">
          {comment.content}
        </p>
        <div className="flex gap-2 justify-between items-center">
          <span className=" font-satoshi tracking-wide font-light text-xs text-slate-500">
            {timestamp}
          </span>
          {handleEdit && handleDelete && (
            <>
              <div className="flex">
                {handleEdit && (
                  <button
                    type="button"
                    role="button"
                    className={`bg-white p-2 rounded-lg disable_parent_hover hover:underline font-inter text-sm border-1 green_gradient hover:scale-110 transition cursor-pointer`}
                    onClick={() => handleEdit(comment)}
                  >
                    Edit
                  </button>
                )}
                {handleDelete && (
                  <button
                    type="button"
                    role="button"
                    className="p-2 font-inter disable_parent_hover hover:underline text-sm orange_gradient hover:scale-110 transition cursor-pointer"
                    onClick={() => handleDelete(comment)}
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
  );
};

export default CommentCard;
