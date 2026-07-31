'use client';

import { useMemo } from "react";
import Link from "next/link";
import { Category } from "@/types";
import CategoryCard from "./CategoryCard";

interface HomeCategoriesCarouselProps {
  categories: Category[];
}

export default function HomeCategoriesCarousel({ categories }: HomeCategoriesCarouselProps) {
  // Randomly select 20 categories on each page load/render
  const displayCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    const shuffled = [...categories].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 20);
  }, [categories]);

  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full max-w-[1240px] mx-auto px-6 mt-12 mb-16 relative">
      <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-br from-purple-600 to-pink-500 bg-clip-text text-transparent text-center pb-2 mb-8">
        Explore Coloring Themes
      </h2>

      {/* Category Cards: 2 per row (8 total) on mobile, 5 per row (20 total) on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
        {displayCategories.map((category, idx) => (
          <div key={`${category.id}-${idx}`} className={idx >= 8 ? 'hidden md:block' : ''}>
            <CategoryCard category={category} index={idx} />
          </div>
        ))}
      </div>

      {/* See All Categories Button */}
      <div className="mt-12 sm:mt-16 flex justify-center">
        <Link 
          href="/categories"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_auto] text-white px-7 py-3 rounded-full font-bold text-base shadow-sm hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 hover:bg-[position:right_center] transition-all duration-500 cursor-pointer border-none"
        >
          See All Categories
        </Link>
      </div>
    </div>
  );
}
