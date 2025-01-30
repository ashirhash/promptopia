import { useState, useEffect } from "react";
import { CrossIcon } from "./ui/Icons";
import { useDebounce } from "../lib/hooks/hooks";

const Search = ({
  searchText,
  setSearchText,
  posts,
  setFilteredPosts,
}: any) => {
  // Local state for instant updates
  const [localSearchText, setLocalSearchText] = useState(searchText);
  const debouncedSearchText = useDebounce(localSearchText, 300);

  useEffect(() => {
    setLocalSearchText(searchText);
  }, [searchText]);

  useEffect(() => {
    setSearchText(debouncedSearchText);
  }, [debouncedSearchText, setSearchText]);

  const handleSearchChange = (e: any) => {
    setLocalSearchText(e.target.value);
  };

  const handleSearchDelete = () => {
    setLocalSearchText("");
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
      className="relative w-full max-w-xl"
    >
      <input
        type="text"
        placeholder="Search for prompts, #tags or @usernames"
        value={localSearchText} // CHANGED
        onChange={handleSearchChange} // CHANGED
        required
        className="search_input peer py-3"
      />
      <CrossIcon
        width="19px"
        height="19px"
        className={`${
          localSearchText ? "block" : "hidden"
        } cursor-pointer absolute z-10 right-2 top-[12px]`} // CHANGED
        onClick={handleSearchDelete} // CHANGED
      />
    </form>
  );
};

export default Search;
