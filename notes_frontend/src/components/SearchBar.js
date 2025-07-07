import React from "react";

// PUBLIC_INTERFACE
function SearchBar() {
  /** Search bar component for searching/filtering notes (placeholder) */
  return (
    <div className="search-bar">
      {/* Search input - placeholder */}
      <input
        type="text"
        placeholder="Search notes..."
        aria-label="Search notes"
        disabled
      />
    </div>
  );
}

export default SearchBar;
