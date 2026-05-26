import { searchColoringPages } from "@/lib/data";
import ColoringCard from "@/components/ColoringCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import SearchFilters from "@/components/SearchFilters";
import { Suspense } from "react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; difficulty?: string; ageGroup?: string }>;
}) {
  const { q, difficulty, ageGroup } = await searchParams;
  const query = q?.trim() || "";

  const hasFilters = query || difficulty || ageGroup;
  const results = hasFilters ? await searchColoringPages(query, { difficulty, ageGroup }) : [];

  return (
    <>
      <div className="max-w-[1240px] mx-auto px-6 pt-8">
        <Breadcrumbs paths={[{ title: "Search", href: "/search" }]} />
      </div>

      <div className="max-w-[1240px] mx-auto px-6 pb-16 flex gap-8 items-start flex-col lg:flex-row mt-8">
        <Suspense fallback={<div className="w-full lg:w-64 h-96 bg-gray-100 dark:bg-gray-900 animate-pulse rounded-3xl flex-shrink-0"></div>}>
          <SearchFilters />
        </Suspense>

        <div className="flex-1 w-full">
          {hasFilters ? (
            <>
              <h2 className="text-4xl font-extrabold mb-8 text-gray-800 dark:text-gray-100">
                {query ? `Search results for "${query}"` : "Filtered Results"}
              </h2>
              {results.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8 pb-16">
                  {results.map(page => (
                    <ColoringCard key={page.id} page={page} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-16 bg-white dark:bg-gray-900 rounded-2xl text-gray-500 dark:text-gray-400 border-2 border-dashed border-black/5 dark:border-white/5">
                  <p className="text-lg font-bold mb-2">No results found.</p>
                  <p className="text-sm">Try adjusting your filters or search term.</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-16 bg-white dark:bg-gray-900 rounded-2xl text-gray-500 dark:text-gray-400 border-2 border-dashed border-black/5 dark:border-white/5">
              <p className="text-lg font-bold mb-2">Start your search</p>
              <p className="text-sm">Type a search term above or select filters on the left.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
