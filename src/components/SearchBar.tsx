'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form className="relative w-full max-w-[400px] mx-0 md:mx-8 print:hidden group" onSubmit={handleSearch}>
      <button
        type="submit"
        disabled={!query.trim()}
        className={`absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 transition-all duration-300 z-10 p-0 border-none bg-transparent ${query.trim() ? 'cursor-pointer' : 'cursor-not-allowed'} ${isFocused ? 'text-purple-600 dark:text-purple-400 -translate-y-[calc(50%+1px)]' : 'text-gray-400 dark:text-gray-500'}`}
        aria-label="Search"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={isFocused ? "2.5" : "2"}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>
      <input 
        type="text" 
        className="w-full py-2.5 pr-11 pl-11 bg-white dark:bg-gray-900 border border-purple-600/10 dark:border-white/10 rounded-xl font-inherit text-[0.95rem] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 shadow-sm focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 focus:shadow-[0_10px_15px_-3px_rgba(124,58,237,0.1),0_4px_6px_-2px_rgba(124,58,237,0.05)] dark:focus:shadow-[0_10px_15px_-3px_rgba(168,85,247,0.15)] focus:-translate-y-[1px]"
        placeholder="Search for coloring pages..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-4 rtl:left-4 rtl:right-auto top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10 cursor-pointer flex items-center justify-center"
          aria-label="Clear search"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </form>
  );
}
