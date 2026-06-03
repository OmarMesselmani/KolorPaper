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
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-[0_10px_15px_-3px_rgba(124,58,237,0.3)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
          >
            See More
          </button>
        </div>
      )}
      {!hasMore && <div className="pb-16"></div>}
    </>
  );
}
