import React from "react";
import Image from "next/image";

const UserBox = ({
  img,
  username,
  email,
  handleUserClick,
  className = "",
}: any) => {
  return (
    <div
      onClick={handleUserClick}
      className={`flex gap-3 relative z-10 items-center cursor-pointer p-2 hover:bg-slate-200 transition rounded-md ${className}`}
    >
      <Image
        src={img}
        alt="user_image"
        width={40}
        height={40}
        className="rounded-full object-contain"
      />

      <div className="flex flex-col">
        <h3 className="font-satoshi font-semibold text-light-black">
          {username}
        </h3>
        <p className="font-inter text-sm text-gray-500">{email}</p>
      </div>
    </div>
  );
};

export default UserBox;
