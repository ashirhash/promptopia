import React from "react";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-accent-gray-transparent z-[9999] fade-in">
      <div className="w-12 h-12 border-4 border-t-accent-orange border-white rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
