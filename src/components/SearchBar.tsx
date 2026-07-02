'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface SearchBarProps {
  onSearch?: () => void;
}

interface SearchResult {
  categories: { title: string; slug: string; parentSlug: string | null }[];
  tags: { name: string }[];
  pages: { title: string; slug: string; thumbnailUrl: string }[];
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);

  // Debounced live search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Live search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false); // Close dropdown
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      if (onSearch) {
        onSearch();
      }
    }
  };

  const hasResults = results && (results.categories.length > 0 || results.tags.length > 0 || results.pages.length > 0);

  return (
    <form ref={formRef} className="relative w-full max-w-[400px] mx-0 md:mx-8 print:hidden group" onSubmit={handleSearch}>
      <button
        type="submit"
        disabled={!query.trim()}
        className={`absolute left-4 rtl:right-4 rtl:left-auto top-[21px] -translate-y-1/2 transition-all duration-300 z-10 p-0 border-none bg-transparent ${query.trim() ? 'cursor-pointer' : 'cursor-default'} ${isFocused ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500'}`}
        aria-label="Search"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isFocused ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>
      
      <input 
        type="text" 
        className="w-full py-2.5 pr-11 pl-11 bg-white dark:bg-gray-900 border border-purple-600/10 dark:border-white/10 rounded-full font-inherit text-[0.95rem] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 shadow-sm focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 focus:shadow-[0_10px_15px_-3px_rgba(124,58,237,0.1),0_4px_6px_-2px_rgba(124,58,237,0.05)] dark:focus:shadow-[0_10px_15px_-3px_rgba(168,85,247,0.15)] focus:-translate-y-[1px]"
        placeholder="Search for coloring pages..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute right-4 rtl:left-4 rtl:right-auto top-[21px] -translate-y-1/2 z-10">
          <div className="w-4 h-4 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Clear Button */}
      {query && !isLoading && (
        <button
          type="button"
          onClick={() => { setQuery(''); setResults(null); }}
          className="absolute right-4 rtl:left-4 rtl:right-auto top-[21px] -translate-y-1/2 p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10 cursor-pointer flex items-center justify-center"
          aria-label="Clear search"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}

      {/* Dropdown Results */}
      {isFocused && query.trim().length >= 2 && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[400px]">
          
          {!isLoading && !hasResults && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              No results found for "{query}"
            </div>
          )}

          <div className="overflow-y-auto overscroll-contain flex-grow">
            {/* Categories */}
            {results && results.categories.length > 0 && (
              <div className="border-b border-gray-50 dark:border-gray-800/50 pb-2">
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</div>
                {results.categories.map((cat) => (
                  <Link 
                    key={cat.slug} 
                    href={cat.parentSlug ? `/${cat.parentSlug}/${cat.slug}` : `/${cat.slug}`}
                    onClick={() => setIsFocused(false)}
                    className="flex items-center px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-black dark:text-white hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2.28a2 2 0 01.948.236l.792.396A2 2 0 0010.916 5H20a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                    {cat.title}
                  </Link>
                ))}
              </div>
            )}

            {/* Tags */}
            {results && results.tags.length > 0 && (
              <div className="border-b border-gray-50 dark:border-gray-800/50 pb-2">
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Tags</div>
                {results.tags.map((tag) => (
                  <Link 
                    key={tag.name} 
                    href={`/tags/${encodeURIComponent(tag.name)}`}
                    onClick={() => setIsFocused(false)}
                    className="flex items-center px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-black dark:text-white hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors"
                  >
                    <span className="text-purple-500 mr-2 font-bold">#</span>
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Pages */}
            {results && results.pages.length > 0 && (
              <div className="pb-2">
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Coloring Pages</div>
                {results.pages.map((page) => (
                  <Link 
                    key={page.slug} 
                    href={`/page/${page.slug}`}
                    onClick={() => setIsFocused(false)}
                    className="flex items-center px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-black dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 mr-3 border border-gray-200 dark:border-gray-700">
                      <Image src={page.thumbnailUrl} alt={page.title} fill className="object-cover" sizes="40px" />
                    </div>
                    <span className="text-sm font-medium line-clamp-1">{page.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          {hasResults && (
            <div className="p-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 text-center">
              <button
                type="submit"
                className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer border-none bg-transparent w-full p-2"
              >
                See all results for "{query}"
              </button>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
