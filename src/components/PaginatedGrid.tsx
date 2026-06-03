'use client';
import { useState } from "react";
import { ColoringPage } from "@/types";
import ColoringCard from "./ColoringCard";

export default function PaginatedGrid({ pages }: { pages: ColoringPage[] }) {
  const [visibleCount, setVisibleCount] = useState(12);

  const visiblePages = pages.slice(0, visibleCount);
  const hasMore = visibleCount < pages.length;

  const loadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pb-8">
        {visiblePages.map(page => (
          <ColoringCard key={page.id} page={page} />
        ))}
      </div>
      
      {hasMore && (
        <div className="mt-4 flex justify-center pb-16">
          <button 
            onClick={loadMore}
            className="px-8 py-3 bg-gradient-to-br from-purple-600 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 cursor-pointer"
          >
            See More
          </button>
        </div>
      )}
      {!hasMore && <div className="pb-16"></div>}
    </>
  );
}
