import { ColoringPage } from "@/types";
import { cachedGetColoringPages, shuffleArray } from "@/lib/data";
import { prisma } from "@/lib/db";
import ColoringCard from "./ColoringCard";

export default async function SeeMore({ currentPage }: { currentPage: ColoringPage }) {
  const sameCategoryPages = await cachedGetColoringPages(currentPage.categorySlug);

  const candidatePages = sameCategoryPages.filter(p => {
    if (currentPage.subCategorySlug) {
      return p.subCategorySlug !== currentPage.subCategorySlug;
    }
    return p.id !== currentPage.id;
  });

  const shuffledCandidates = shuffleArray(candidatePages);

  const result: ColoringPage[] = [];
  const seenIds = new Set<string>([currentPage.id]);

  for (const p of shuffledCandidates) {
    if (result.length >= 5) break;
    if (!seenIds.has(p.id)) {
      seenIds.add(p.id);
      result.push(p);
    }
  }

  // If we still need more pages, fetch a small random batch from the DB
  // instead of looping through every category one by one
  if (result.length < 5) {
    const needed = 5 - result.length;
    const excludeIds = Array.from(seenIds);
    try {
      const extraPages = await prisma.coloringPage.findMany({
        where: {
          published: true,
          categorySlug: { not: currentPage.categorySlug },
          id: { notIn: excludeIds },
        },
        take: needed * 3, // fetch a few extra to allow shuffling
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { title: true, slug: true } },
          subCategory: { select: { title: true, slug: true } },
        },
      });
      const parsed: ColoringPage[] = JSON.parse(JSON.stringify(extraPages));
      const shuffledExtra = shuffleArray(parsed);
      for (const p of shuffledExtra) {
        if (result.length >= 5) break;
        if (!seenIds.has(p.id)) {
          seenIds.add(p.id);
          result.push(p);
        }
      }
    } catch (error) {
      console.error("Failed to fetch extra SeeMore pages:", error);
    }
  }

  if (result.length === 0) return null;

  return (
    <div className="max-w-[1240px] mx-auto px-6 pb-16 print:hidden">
      <h2 className="text-3xl font-bold text-[#0F0728] dark:text-gray-100 mb-6 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-7 before:bg-purple-600 before:rounded-sm">
        See More
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {result.map((page, index) => (
          <div key={page.id} className={index === 4 ? "hidden lg:block" : ""}>
            <ColoringCard page={page} />
          </div>
        ))}
      </div>
    </div>
  );
}
