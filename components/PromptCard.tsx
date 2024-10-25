"use client";
import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

interface PromptCardProps {
  post: any;
  handleTagClick?: ({}) => void;
  handleEdit?: () => void;
  handleDelete?: () => void;
}

const PromptCard = ({
  post,
  handleTagClick,
  handleEdit,
  handleDelete,
}: PromptCardProps) => {
  const [copied, setCopied] = useState("");
  const { data: session }: any = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(""), 3000);
  };
  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        <div className="flex-1 flex flex-col item items-start justify-between gap-3">
          <div className="flex gap-3 items-center w-full justify-between ">
            <div className="flex gap-3 items-center cursor-pointer">
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

          <p className=" font-satoshi text-sm text-gray-700">
            {post.prompt}
          </p>
          <p
            className="font-inter text-sm blue_gradient cursor-pointer"
            onClick={() => handleTagClick && handleTagClick(post.tag)}
          >
            {post.tag}
          </p>
          {session?.user.id === post.creator._id && pathName === "/profile" && (
            <div className="flex gap-3 mt-5">
              <p
                className="font-inter text-sm green_gradient cursor-pointer"
                onClick={handleEdit}
              >
                Edit
              </p>
              <p
                className="font-inter text-sm orange_gradient cursor-pointer"
                onClick={handleDelete}
              >
                Delete
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
