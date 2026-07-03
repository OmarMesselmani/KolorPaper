import { getPagesByTag } from "@/lib/data";
import { prisma } from "@/lib/db";
import ColoringCard from "@/components/ColoringCard";
import PaginatedGrid from "@/components/PaginatedGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import FilterDrawer from "@/components/FilterDrawer";
import { Suspense } from "react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);
  const normalizedTag = tag.toLowerCase().trim();
  
  const customData = await prisma.tag.findUnique({
    where: { name: normalizedTag }
  });

  const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);

  return {
    title: customData?.title ? customData.title : `${capitalizedTag} Coloring Pages`,
    description: customData?.description || `Free printable ${tag} coloring pages for kids and adults. Download high-quality ${tag} coloring sheets.`,
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

  const normalizedTag = tag.toLowerCase().trim();
  const customData = await prisma.tag.findUnique({
    where: { name: normalizedTag }
  });

  return (
    <>
      <div className="max-w-[1240px] mx-auto px-6 pt-8">
        <Breadcrumbs paths={[{ title: `Tag: ${tag}`, href: `/tags/${encodedTag}` }]} />
      </div>

      <div className="max-w-[1240px] mx-auto px-6 pb-16 mt-8">
        <div className="w-full">
          <div className="flex flex-col mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl md:text-4xl font-bold text-[#0F0728] dark:text-gray-100 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-8 before:bg-purple-600 before:rounded-sm m-0">
                <span>{customData?.h2 || <>Search results for tag &quot;<span className="capitalize">{tag}</span>&quot;</>}</span>
              </h1>
              <FilterDrawer />
            </div>
            {customData?.description && (
              <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-3xl">
                {customData.description}
              </p>
            )}
          </div>
          
          {results.length > 0 ? (
            <PaginatedGrid pages={results} />
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
