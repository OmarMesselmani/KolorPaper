'use client';
import { useState } from "react";
import { ColoringPage } from "@/types";
import ColoringCard from "./ColoringCard";
import LoadMore from "./LoadMore";

export default function PaginatedGrid({ pages }: { pages: ColoringPage[] }) {
  const [visibleCount, setVisibleCount] = useState(15);

  const visiblePages = pages.slice(0, visibleCount);
  const hasMore = visibleCount < pages.length;

  const loadMore = () => {
    setVisibleCount(prev => prev + 15);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 pb-8">
        {visiblePages.map(page => (
          <ColoringCard key={page.id} page={page} />
        ))}
      </div>

      {hasMore && (
        <LoadMore 
          onClick={loadMore} 
          label="See More..." 
        />
      )}
      {!hasMore && <div className="pb-16"></div>}
    </>
  );
}
