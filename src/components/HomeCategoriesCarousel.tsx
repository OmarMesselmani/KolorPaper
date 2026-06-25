'use client';

import { useRef, useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { Category } from "@/types";

// Custom easing function (easeInOutCubic)
function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// Custom smooth scroll function to control the duration precisely
function smoothScroll(element: HTMLElement, distance: number, duration: number) {
  let start: number | null = null;
  const initialLeft = element.scrollLeft;

  // Temporarily disable snap to prevent browser from fighting the animation
  element.style.scrollSnapType = 'none';

  const step = (timestamp: number) => {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const percentage = Math.min(progress / duration, 1);
    
    element.scrollLeft = initialLeft + (distance * easeInOutCubic(percentage));

    if (progress < duration) {
      window.requestAnimationFrame(step);
    } else {
      // Re-enable snap after animation finishes
      element.style.scrollSnapType = 'x mandatory';
    }
  };

  window.requestAnimationFrame(step);
}
import CategoryCard from "./CategoryCard";

interface HomeCategoriesCarouselProps {
  categories: Category[];
}

export default function HomeCategoriesCarousel({ categories }: HomeCategoriesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Duplicate categories to create a seamless infinite scrolling effect without bloating the DOM
  const displayCategories = [...categories, ...categories, ...categories];

  const slide = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const firstChild = scrollRef.current.children[0] as HTMLElement;
    if (!firstChild) return;
    
    // Calculate exact width including gap (gap-6 is 24px)
    const cardWidth = firstChild.offsetWidth + 24; 
    const slideAmount = cardWidth * 2; // slide 2 cards at a time
    
    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    const totalCards = scrollRef.current.children.length;
    const middleCardIndex = Math.floor(totalCards / 2);
    
    // Seamless infinite loop jump
    if (direction === 'right' && scrollRef.current.scrollLeft >= maxScroll - slideAmount * 2) {
       scrollRef.current.scrollLeft = middleCardIndex * cardWidth;
    } else if (direction === 'left' && scrollRef.current.scrollLeft <= slideAmount * 2) {
       scrollRef.current.scrollLeft = middleCardIndex * cardWidth;
    }

    // Use custom smooth scroll with 800ms duration for a slower, more premium slide
    smoothScroll(scrollRef.current, direction === 'right' ? slideAmount : -slideAmount, 800);
  }, []);

  const startAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      slide('right');
    }, 8000);
  }, [slide]);

  useEffect(() => {
    if (!isHovered) {
      startAutoPlay();
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoPlay, isHovered]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    slide(direction);
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full max-w-[1240px] mx-auto px-6 mt-16 relative group">
      <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-br from-purple-600 to-orange-500 bg-clip-text text-transparent text-center pb-2 mb-10">
        Explore Coloring Themes
      </h2>

      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left Arrow */}
        <button
          onClick={() => handleManualScroll('left')}
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 cursor-pointer bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 rounded-full shadow-lg flex items-center justify-center text-purple-600 dark:text-purple-400 hover:scale-110 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-500 dark:hover:text-white transition-all opacity-20 hover:opacity-100"
          aria-label="Scroll left"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Carousel Container */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-8 pt-4 px-2 no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayCategories.map((category, idx) => (
            <div 
              key={`${category.id}-${idx}`} 
              className="flex-shrink-0 w-[160px] sm:w-[210px] snap-start"
            >
              <CategoryCard category={category} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => handleManualScroll('right')}
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 cursor-pointer bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 rounded-full shadow-lg flex items-center justify-center text-purple-600 dark:text-purple-400 hover:scale-110 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-500 dark:hover:text-white transition-all opacity-20 hover:opacity-100"
          aria-label="Scroll right"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* See All Categories Button */}
      <div className="mt-8 flex justify-center pb-4">
        <Link 
          href="/categories"
          className="px-8 py-3 bg-gradient-to-br from-purple-600 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 cursor-pointer border-none"
        >
          See All Categories
        </Link>
      </div>
    </div>
  );
}
