'use client';

import { useState } from 'react';

interface LikeButtonProps {
  initialLikes?: number;
}

export default function LikeButton({ initialLikes = 340 }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikesCount(prev => prev + 1);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="relative group h-14 px-5 flex items-center justify-center bg-white dark:bg-gray-900 border border-black/5 dark:border-white/10 rounded-2xl cursor-pointer shadow-sm transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-95 select-none"
      aria-label="Like coloring page"
    >
      <svg 
        width="22" 
        height="22" 
        viewBox="0 0 24 24" 
        fill={liked ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={`transition-all duration-300 ${liked ? 'scale-110 text-red-500' : 'text-gray-400 dark:text-gray-500 group-hover:scale-110 group-hover:text-red-400'}`}
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      <span
        className={`text-base font-extrabold ml-2.5 transition-colors duration-300 ${liked ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
      >
        {likesCount.toLocaleString()}
      </span>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-gray-900/95 backdrop-blur-sm text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-xl z-10">
        {liked ? 'Liked!' : 'Like this Page'}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"></div>
      </div>
    </button>
  );
}
