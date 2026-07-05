'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ColoringPage } from "@/types";

function formatCount(n: number): string {
  if (n >= 1_000_000) {
    const formatted = (n / 1_000_000).toFixed(1);
    return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}M`;
  }
  if (n >= 1_000) {
    const formatted = (n / 1_000).toFixed(1);
    return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}K`;
  }
  return String(n);
}

export default function ColoringCard({ page }: { page: ColoringPage }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(page.likes || 0);

  useEffect(() => {
    try {
      const storedLikes = localStorage.getItem("kolorpaper-likes");
      if (storedLikes) {
        const likedSlugs = JSON.parse(storedLikes) as string[];
        if (likedSlugs.includes(page.slug)) {
          setLiked(true);
        }
      }
    } catch (e) {
      console.error("Failed to read likes from localStorage", e);
    }
  }, [page.slug]);

  // Keep likesCount in sync with page.likes changes
  useEffect(() => {
    setLikesCount(page.likes || 0);
  }, [page.likes]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
        if (!likedSlugs.includes(page.slug)) {
          likedSlugs.push(page.slug);
        }
      } else {
        likedSlugs = likedSlugs.filter(s => s !== page.slug);
      }
      localStorage.setItem("kolorpaper-likes", JSON.stringify(likedSlugs));
    } catch (err) {
      console.error("Failed to save likes to localStorage", err);
    }

    // Call backend API
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
    try {
      const res = await fetch(`${API_URL}/pages/${page.slug}/like`, {
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
        }
      }
    } catch (error) {
      console.error("Failed to like:", error);
    }
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if we already have a print container
    let printContainer = document.getElementById('print-container');
    if (!printContainer) {
      printContainer = document.createElement('div');
      printContainer.id = 'print-container';
      document.body.appendChild(printContainer);
      
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          body > *:not(#print-container) {
            display: none !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: white !important;
          }
          #print-container {
            display: flex !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            align-items: center;
            justify-content: center;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 99999 !important;
          }
          #print-container img {
            max-width: 100%;
            max-height: 100vh;
            object-fit: contain;
          }
          @page { margin: 0; size: auto; }
        }
        @media screen {
          #print-container {
            display: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    printContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = page.imageUrl;
    printContainer.appendChild(img);

    const triggerPrint = () => {
      window.print();
    };

    if (img.complete) {
      triggerPrint();
    } else {
      img.onload = triggerPrint;
      // Fallback in case of slow connection
      setTimeout(triggerPrint, 1500);
    }

    // Track print event as download on backend
    const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
    fetch(`${API_URL}/pages/${page.slug}/download`, { method: 'POST' })
      .catch(err => console.error("Failed to track print download", err));
  };

  const [isNew, setIsNew] = useState(false);
  useEffect(() => {
    if (page.createdAt) {
      setIsNew((Date.now() - new Date(page.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000);
    }
  }, [page.createdAt]);
  return (
    <Link href={page.subCategorySlug ? `/${page.categorySlug}/${page.subCategorySlug}/${page.slug}` : `/${page.categorySlug}/${page.slug}`} className="block bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(124,58,237,0.1),0_4px_6px_-2px_rgba(124,58,237,0.05)] hover:border-purple-600/20 dark:hover:border-purple-500/30 group relative">
      <div className="w-full aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-gray-800 border-b border-black/5 dark:border-white/5 relative">
        <div className="relative w-full h-full">
          <Image
            src={page.thumbnailUrl}
            alt={`Free printable ${page.title} coloring page`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Badge (Right) */}
        {isNew && (
          <span className="absolute bottom-3 left-3 z-10 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md bg-purple-600 text-white">
            New
          </span>
        )}

        {/* Buttons (Top Right) */}
        <div className="absolute top-3 right-3 z-10 flex gap-2 print:hidden">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="w-9 h-9 rounded-full bg-white dark:bg-gray-950 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 group/btn"
            aria-label="Like coloring page"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-all duration-300 ${liked ? 'text-red-500 scale-110' : 'text-gray-400 dark:text-gray-500 group-hover/btn:text-red-500 group-hover/btn:scale-110'}`}
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="w-9 h-9 rounded-full bg-white dark:bg-gray-950 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 hover:bg-gradient-to-tr hover:from-violet-600 hover:to-indigo-600 hover:text-white hover:border-transparent text-gray-500 dark:text-gray-400"
            aria-label="Print coloring page"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
          </button>
        </div>
      </div>
      <div className="p-5 bg-white dark:bg-gray-900 flex flex-col gap-3">
        <h3 className="font-bold text-xs md:text-sm text-gray-900 dark:text-white m-0 truncate">{page.title}</h3>
        
        {/* Stats Footer */}
        <div className="hidden items-center gap-4 text-xs font-semibold text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5 group/stat hover:text-purple-600 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover/stat:opacity-100 group-hover/stat:scale-110 transition-all">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{page.views !== undefined ? formatCount(page.views) : '0'}</span>
          </div>
          
          <div className="flex items-center gap-1.5 group/stat hover:text-orange-500 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover/stat:opacity-100 group-hover/stat:scale-110 transition-all">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{page.downloads !== undefined ? formatCount(page.downloads) : '0'}</span>
          </div>
          
          <div className="flex items-center gap-1.5 group/stat hover:text-red-500 transition-colors">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-all duration-300 ${liked ? 'text-red-500 scale-110' : 'opacity-70 group-hover/stat:opacity-100 group-hover/stat:scale-110'}`}
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span className={liked ? 'text-red-500 font-extrabold' : ''}>{likesCount !== undefined ? formatCount(likesCount) : '0'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
