'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { Category } from "@/types";

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

export default function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  // Determine badge: first 3 are "New", top downloads get "Popular"
  const badge: "Popular" | null =
    (category.downloads ?? 0) >= 800 ? "Popular" : null;

  const href = category.parentSlug ? `/${category.parentSlug}/${category.slug}` : `/${category.slug}`;

  const pageCount = category._count?.subPages ?? 0;

  const hasStats = category.downloads !== undefined || category.likes !== undefined;

  const originalImageUrl = category.imageUrl || null;
  const [currentSrc, setCurrentSrc] = useState<string | null>(originalImageUrl);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const testImgRef = useRef<HTMLImageElement | null>(null);

  // Safe URI sanitizer
  const sanitizeUrl = (url: string) => {
    try {
      return encodeURI(decodeURI(url));
    } catch {
      return url;
    }
  };

  // Function to verify and retry loading the image automatically
  const verifyAndRetryImage = useCallback((attempt: number) => {
    if (!originalImageUrl) return;

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    // Incremental backoff delay: 1s, 2s, 3s... up to max 5s
    const delay = Math.min(1000 + (attempt - 1) * 1000, 5000);

    retryTimeoutRef.current = setTimeout(() => {
      const baseClean = sanitizeUrl(originalImageUrl);
      const separator = baseClean.includes('?') ? '&' : '?';
      // Append cache-buster retry parameter
      const retryUrl = `${baseClean}${separator}_retry=${attempt}&_t=${Date.now()}`;

      if (typeof window !== 'undefined') {
        if (testImgRef.current) {
          testImgRef.current.onload = null;
          testImgRef.current.onerror = null;
        }

        const testImg = new window.Image();
        testImgRef.current = testImg;

        testImg.onload = () => {
          // Image verified and cached successfully!
          setCurrentSrc(retryUrl);
          setIsLoaded(true);
          setHasError(false);
        };

        testImg.onerror = () => {
          // Failed again, continue retrying automatically until it loads
          setRetryCount(attempt);
          verifyAndRetryImage(attempt + 1);
        };

        testImg.src = retryUrl;
      } else {
        setCurrentSrc(retryUrl);
      }
    }, delay);
  }, [originalImageUrl]);

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(false);
    const nextAttempt = retryCount + 1;
    setRetryCount(nextAttempt);
    verifyAndRetryImage(nextAttempt);
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  };

  // Reset state whenever category.imageUrl changes
  useEffect(() => {
    setCurrentSrc(originalImageUrl);
    setIsLoaded(false);
    setHasError(false);
    setRetryCount(0);

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (testImgRef.current) {
      testImgRef.current.onload = null;
      testImgRef.current.onerror = null;
      testImgRef.current = null;
    }
  }, [originalImageUrl]);

  // Retry immediately if device comes back online after an error
  useEffect(() => {
    const handleOnline = () => {
      if (hasError && originalImageUrl) {
        verifyAndRetryImage(retryCount + 1);
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [hasError, originalImageUrl, retryCount, verifyAndRetryImage]);

  // Clean up timers and image listeners on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (testImgRef.current) {
        testImgRef.current.onload = null;
        testImgRef.current.onerror = null;
        testImgRef.current = null;
      }
    };
  }, []);

  return (
    <Link
      href={href}
      className="bg-white dark:bg-gray-950 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-sm flex flex-col hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(124,58,237,0.1),0_4px_6px_-2px_rgba(124,58,237,0.05)] dark:hover:shadow-[0_10px_15px_-3px_rgba(168,85,247,0.15)] hover:border-purple-600/20 dark:hover:border-purple-500/30 group relative"
    >
      {/* Badge */}
      {badge && (
        <span
          className="absolute top-3 left-3 z-10 text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md bg-orange-600 text-white"
        >
          🔥 Popular
        </span>
      )}

      {/* Image area — rendered cleanly with auto-retry and skeleton placeholder */}
      <div className="relative w-full aspect-square bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
        {currentSrc ? (
          <>
            {/* Shimmer / Loader placeholder while image is loading or retrying */}
            {!isLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-[2px] transition-opacity duration-300">
                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-800/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                {hasError && (
                  <span className="text-[11px] font-medium text-purple-600/70 dark:text-purple-300/70 mt-2 tracking-wide animate-pulse">
                    Retrying...
                  </span>
                )}
              </div>
            )}

            {/* Category Image */}
            <Image
              key={currentSrc}
              src={currentSrc}
              alt={`${category.title} free printable coloring pages`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 16vw, 16vw"
              className={`object-contain p-4 transition-all duration-500 group-hover:scale-105 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        ) : (
          <div className="placeholder-img w-full h-full flex items-center justify-center text-8xl">🎨</div>
        )}
      </div>

      {/* Info area */}
      <div className="px-3 py-2.5 sm:px-5 sm:py-3.5 bg-white dark:bg-gray-900 border-t border-black/5 dark:border-white/5">
        <h3 className="text-sm sm:text-lg font-bold text-gray-800 dark:text-gray-100 text-center mb-0.5 sm:mb-1 truncate">
          {category.title}
        </h3>
        <p className={`text-xs sm:text-sm font-medium text-purple-700 dark:text-purple-300 text-center ${hasStats ? 'mb-1.5 sm:mb-3' : 'mb-0'}`}>
          ({pageCount}) pages
        </p>

        {/* Stats row */}
        {(category.downloads !== undefined || category.likes !== undefined) && (
          <div className="flex items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400">
            {category.downloads !== undefined && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0 0l-3-3m3 3l3-3M12 3v9" />
                </svg>
                {formatCount(category.downloads)}
              </span>
            )}
            {category.likes !== undefined && (
              <span className="flex items-center gap-1 text-rose-400">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                {formatCount(category.likes)}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
