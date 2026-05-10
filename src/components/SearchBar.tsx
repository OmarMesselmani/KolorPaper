'use client';

import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Searching for: ${query}`);
    // Implement search logic or redirection here
  };

  return (
    <form className="search-container no-print" onSubmit={handleSearch}>
      <svg 
        className="search-icon" 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={isFocused ? 'var(--primary)' : 'currentColor'} 
        strokeWidth={isFocused ? "2.5" : "2"} 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ 
          transition: 'all 0.3s ease',
          zIndex: 10,
          transform: isFocused ? 'translateY(calc(-50% - 1px))' : 'translateY(-50%)'
        }}
      >
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input 
        type="text" 
        className="search-input" 
        placeholder="Search for coloring pages..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </form>
  );
}
