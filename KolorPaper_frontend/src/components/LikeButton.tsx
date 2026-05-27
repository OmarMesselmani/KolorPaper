'use client';

import { useState, useEffect } from 'react';

interface LikeButtonProps {
  slug: string;
  initialLikes?: number;
}

export default function LikeButton({ slug, initialLikes = 0 }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Check if liked on mount
  useEffect(() => {
    try {
      const storedLikes = localStorage.getItem("kolorpaper-likes");
      if (storedLikes) {
        const likedSlugs = JSON.parse(storedLikes) as string[];
        if (likedSlugs.includes(slug)) {
          setLiked(true);
        }
      }
    } catch (e) {
      console.error("Failed to read likes from localStorage", e);
    }
  }, [slug]);

  // Keep likesCount in sync with initialLikes changes
  useEffect(() => {
    setLikesCount(initialLikes);
  }, [initialLikes]);

  const handleLike = async () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount(prev => nextLiked ? prev + 1 : Math.max(0, prev - 1));

    // Update localStorage
    try {
      const storedLikes = localStorage.getItem("kolorpaper-likes");
      let likedSlugs: string[] = [];
      if (storedLikes) {
        likedSlugs = JSON.parse(storedLikes) as string[];
      }

      if (nextLiked) {
        if (!likedSlugs.includes(slug)) {
          likedSlugs.push(slug);
        }
      } else {
        likedSlugs = likedSlugs.filter(s => s !== slug);
      }
      localStorage.setItem("kolorpaper-likes", JSON.stringify(likedSlugs));
    } catch (e) {
      console.error("Failed to save likes to localStorage", e);
    }

    // Call backend API
    try {
      const res = await fetch(`${API_URL}/pages/${slug}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: nextLiked ? "like" : "unlike",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.likes === 'number') {
          setLikesCount(data.likes);
        }
        if (data && typeof data.liked === 'boolean') {
          setLiked(data.liked);
          // Sync with localStorage
          try {
            const storedLikes = localStorage.getItem("kolorpaper-likes");
            let likedSlugs: string[] = [];
            if (storedLikes) {
              likedSlugs = JSON.parse(storedLikes) as string[];
            }
            if (data.liked) {
              if (!likedSlugs.includes(slug)) likedSlugs.push(slug);
            } else {
              likedSlugs = likedSlugs.filter(s => s !== slug);
            }
            localStorage.setItem("kolorpaper-likes", JSON.stringify(likedSlugs));
          } catch (e) {
            console.error(e);
          }
        }
      }
    } catch (error) {
      console.error("Failed to record like on backend:", error);
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
