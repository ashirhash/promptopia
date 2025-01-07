import { useState, useEffect } from "react";
import { CrossIcon } from "./ui/Icons";

const Search = ({
  searchText,
  setSearchText,
  posts,
  setFilteredPosts,
}: any) => {
  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleSearchDelete = () => {
    setSearchText("");
  };

  // Search filter
  useEffect(() => {
    const terms = searchText?.toLowerCase().split(" ").filter(Boolean);

    if (posts.length > 0) {
      const filtered = posts.filter((post: any) => {
        return terms.every((term: any) => {
          if (term.startsWith("@")) {
            const username = term.slice(1);
            return post.creator.username.toLowerCase().includes(username);
          } else if (term.startsWith("#")) {
            const tag = term.slice(1);
            return post.tag.toLowerCase().includes(tag);
          } else {
            return (
              post.prompt.toLowerCase().includes(term) ||
              post.creator.username.toLowerCase().includes(term) ||
              post.tag.toLowerCase().includes(term)
            );
          }
        });
      });
      setFilteredPosts(filtered);
    }
  }, [searchText, posts]);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="relative w-full flex justify-center"
    >
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
        <CrossIcon
          width="19px"
          height="19px"
          className={`${searchText ? "block" : "hidden"} cursor-pointer absolute z-10 right-2 top-[12px]`}
          onClick={handleSearchDelete}
        />
      </div>
    </form>
  );
};

export default Search;
