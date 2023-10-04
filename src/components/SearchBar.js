import React from 'react';

function SearchBar({ searchQuery, handleSearchChange, inputRef }) {
  return (
    <input
      ref={inputRef}
      type="text"
      value={searchQuery}
      onChange={handleSearchChange}
      placeholder="Search Contacts"
    />
  );
}

export default SearchBar;