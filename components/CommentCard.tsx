"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDebounce, useTimeAgo } from "@utils/hooks";
import UserBox from "./UserBox";

interface CommentCardProps {
  comment: any;
  handleDelete?: (commentId: number | string) => void;
  handleEdit?: (post: number) => void;
}

const CommentCard = ({ comment, handleDelete }: CommentCardProps) => {
  const { data: session }: any = useSession();
  const router = useRouter();
  const timestamp = useTimeAgo(comment.createdAt);
  const isSameUser = session?.user.id === comment.creator._id;

  const handleUserClick = (e: any) => {
    e.stopPropagation();
    router.push(
      isSameUser
        ? session
          ? "/profile"
          : "/"
        : `/authors/${comment.creator._id}`
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
          {isSameUser && handleDelete && (
            <>
              <div className="flex">
                {handleDelete && (
                  <button
                    type="button"
                    role="button"
                    className="p-2 font-inter disable_parent_hover hover:underline text-sm orange_gradient hover:scale-110 transition cursor-pointer"
                    onClick={() => handleDelete(comment._id)}
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
