export const HeartIcon = ({
  className = "",
  size = 28,
  strokeColor = "#FF5722",
  fillColor = "none",
  strokeWidth = 14,
  isActive = false,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      className={`${
        isActive ? "animate-like" : ""
      } will-change-transform  ${className}`}
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
  );
};

export const CrossIcon = ({
  className = "",
  size = 15,
  strokeColor = "#FF5722",
  fillColor = "#000",
  strokeWidth = 14,
  isActive = false,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -0.5 25 25"
      fill="none"
      className={`${className}`}
      width={size}
      height={size}
      {...props}
    >
      <path
        d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z"
        fill={fillColor}
      />
    </svg>
  );
};

export const CloudIcon = ({
  className = "",
  size = 25,
  strokeColor = "#FF5722",
  fillColor = "#fff",
  strokeWidth = 14,
  isActive = false,
  ...props
}) => {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 16"
      className={`${className}`}
      width={size}
      height={size}
      {...props}
    >
      <path
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
      />
    </svg>
  );
};

export const CommentIcon = ({
  className = "",
  size = 28,
  strokeColor = "#FF5722",
  fillColor = "#fff",
  strokeWidth = 1.35,
  isActive = false,
  ...props
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${className}`}
        width={size}
        height={size}
        {...props}
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M13 8H7" />
        <path d="M17 12H7" />
      </svg>
    </>
  );
};

export const ShareIcon = ({
  className = "",
  size = 28,
  strokeColor = "#FF5722",
  fillColor = "#fff",
  strokeWidth = 1.15,
  isActive = false,
  ...props
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${className}`}
        width={size}
        height={size}
        {...props}
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0" />

        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M9 12C9 13.3807 7.88071 14.5 6.5 14.5C5.11929 14.5 4 13.3807 4 12C4 10.6193 5.11929 9.5 6.5 9.5C7.88071 9.5 9 10.6193 9 12Z"
            stroke="#FF5722"
            strokeWidth={strokeWidth}
          />{" "}
          <path
            d="M14 6.5L9 10"
            stroke="#FF5722"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />{" "}
          <path
            d="M14 17.5L9 14"
            stroke="#FF5722"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />{" "}
          <path
            d="M19 18.5C19 19.8807 17.8807 21 16.5 21C15.1193 21 14 19.8807 14 18.5C14 17.1193 15.1193 16 16.5 16C17.8807 16 19 17.1193 19 18.5Z"
            stroke="#FF5722"
            strokeWidth={strokeWidth}
          />{" "}
          <path
            d="M19 5.5C19 6.88071 17.8807 8 16.5 8C15.1193 8 14 6.88071 14 5.5C14 4.11929 15.1193 3 16.5 3C17.8807 3 19 4.11929 19 5.5Z"
            stroke="#FF5722"
            strokeWidth={strokeWidth}
          />{" "}
        </g>
      </svg>
  
    </>
  );
};
