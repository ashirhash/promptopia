import React from "react";
import Image from "next/image";

const UserBox = ({
  img,
  username,
  handleUserClick,
  className = "",
}: any) => {
  return (
    <div
      onClick={handleUserClick}
      className={`flex gap-3 relative z-10 items-center cursor-pointer transition-all rounded-md ${className}`}
    >
      <Image
        src={img}
        alt="user_image"
        width={40}
        height={40}
        className="rounded-lg object-contain"
      />

      <div className="flex flex-col">
        <h3 className="font-fig font-semibold text-[16px] text-light-black">
          {username}
        </h3>
      </div>
    </div>
  );
};

export default UserBox;
