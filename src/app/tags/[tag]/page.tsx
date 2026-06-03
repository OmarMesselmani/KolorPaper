import { getPagesByTag } from "@/lib/data";
import ColoringCard from "@/components/ColoringCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import FilterDrawer from "@/components/FilterDrawer";
import { Suspense } from "react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);
  
  return {
    title: `${tag} Coloring Pages | KolorPaper`,
    description: `Free printable ${tag} coloring pages for kids and adults. Download high-quality ${tag} coloring sheets.`,
  };
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ difficulty?: string; ageGroup?: string }>;
}) {
  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);
  const { difficulty, ageGroup } = await searchParams;

  const results = await getPagesByTag(tag, { difficulty, ageGroup });

  return (
    <>
      <div className="max-w-[1240px] mx-auto px-6 pt-8">
        <Breadcrumbs paths={[{ title: `Tag: ${tag}`, href: `/tags/${encodedTag}` }]} />
      </div>

      <div className="max-w-[1240px] mx-auto px-6 pb-16 mt-8">
        <div className="w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F0728] dark:text-gray-100 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-8 before:bg-purple-600 before:rounded-sm m-0">
              <span>Search results for tag &quot;<span className="capitalize">{tag}</span>&quot;</span>
            </h2>
            <FilterDrawer />
          </div>
          
          {results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pb-16">
              {results.map(page => (
                <ColoringCard key={page.id} page={page} />
              ))}
            </div>
          ) : (
            <div className="text-center p-16 bg-white dark:bg-gray-900 rounded-2xl text-gray-500 dark:text-gray-400 border-2 border-dashed border-black/5 dark:border-white/5">
              <p className="text-lg font-bold mb-2">No results found.</p>
              <p className="text-sm">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
