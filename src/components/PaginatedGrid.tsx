'use client';
import { useState } from "react";
import { ColoringPage } from "@/types";
import ColoringCard from "./ColoringCard";
import LoadMore from "./LoadMore";

export default function PaginatedGrid({ pages, columns = 5 }: { pages: ColoringPage[], columns?: 4 | 5 }) {
  const itemsPerPage = 16;
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);

  const visiblePages = pages.slice(0, visibleCount);
  const hasMore = visibleCount < pages.length;

  const loadMore = () => {
    setVisibleCount(prev => prev + itemsPerPage);
  };

  const lgColsClass = columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-5';

  return (
    <>
      <div className={`grid grid-cols-2 md:grid-cols-3 ${lgColsClass} gap-4 sm:gap-6 pb-8`}>
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
