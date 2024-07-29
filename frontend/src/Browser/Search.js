import "./Browser.css";
import { useState } from "react";

const Search = ({ onSearch, showSearch }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (e) => {
    const searchTerm = e.target.value;
    setSearchInput(searchTerm);
    onSearch(searchTerm);
  };

  return (
    <form className="Search">
      {showSearch && (
        <input
          type="text"
          className="search-input"
          placeholder="Search here"
          onChange={handleChange}
          value={searchInput}
        />
      )}
    </form>
  );
};

export default Search;
