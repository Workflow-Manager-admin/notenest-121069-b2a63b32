import React, { useContext } from "react";
import { NotesContext } from "../context/NotesContext";

// PUBLIC_INTERFACE
function SearchBar() {
  /**
   * Search bar component for searching/filtering notes live.
   * Controlled input using NotesContext searchQuery/setSearchQuery.
   */
  const { searchQuery, setSearchQuery } = useContext(NotesContext);

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search notes..."
        aria-label="Search notes"
        autoComplete="off"
        style={{ minWidth: "200px", maxWidth: "350px", width: "100%" }}
      />
    </div>
  );
}

export default SearchBar;
