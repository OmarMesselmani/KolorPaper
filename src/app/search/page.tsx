import { searchColoringPages } from "@/lib/data";
import ColoringCard from "@/components/ColoringCard";
import PaginatedGrid from "@/components/PaginatedGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import FilterDrawer from "@/components/FilterDrawer";
import { Suspense } from "react";
import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kolorpaper.com';

export const metadata: Metadata = {
  title: "Search Coloring Pages - KolorPaper",
  description: "Search through thousands of free printable coloring pages for kids and adults on KolorPaper.",
  alternates: {
    canonical: `${siteUrl}/search`,
  },
  robots: {
    index: false,
    follow: true,
  },
};
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; difficulty?: string; ageGroup?: string; style?: string }>;
}) {
  const { q, difficulty, ageGroup, style } = await searchParams;
  const query = q?.trim() || "";

  const hasFilters = query || difficulty || ageGroup || style;
  const results = hasFilters ? await searchColoringPages(query, { difficulty, ageGroup, style }) : [];

  return (
    <>
      <div className="max-w-[1240px] mx-auto px-6 pt-8">
        <Breadcrumbs paths={[{ title: "Search", href: "/search" }]} />
      </div>

      <div className="max-w-[1240px] mx-auto px-6 pb-16 mt-8">
        <div className="w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F0728] dark:text-gray-100 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-8 before:bg-purple-600 before:rounded-sm m-0">
              {query ? `Search results for "${query}"` : (hasFilters ? "Filtered Results" : "Search")}
            </h2>
            <FilterDrawer />
          </div>

          {hasFilters ? (
            <>
              {results.length > 0 ? (
                <PaginatedGrid pages={results} />
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
              <p className="text-sm">Type a search term above or click the Filter button to browse.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
