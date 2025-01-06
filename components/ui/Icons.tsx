import React from "react";

export const HeartIcon = ({
  className = "",
  size = 15,
  strokeColor = "#FF5722",
  fillColor = "none",
  strokeWidth = 14,
  isActive = false,
  ...props
}) => {
  return (
    <div className="flex justify-center items-start p-[6.5px] bg-accent-gray rounded-full cursor-pointer">
      <svg
        viewBox="0 0 256 256"
        xmlns="http://www.w3.org/2000/svg"
        className={`${isActive ? "animate-like" : ""} will-change-transform ${className}`}
        width={size}
        height={size}
        {...props} // Allow passing additional props like `onClick`
      >
        <rect fill="none" width="256" height="256"></rect>
        <path
          d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z"
          strokeWidth={strokeWidth}
          stroke={strokeColor}
          fill={isActive ? "#FF5722" : "none"}
        />
      </svg>
    </div>
  );
};
