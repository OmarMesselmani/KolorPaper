import { ColoringPage } from "@/types";
import { getAllCategories, getColoringPages } from "@/lib/data";
import ColoringCard from "./ColoringCard";

export default async function SeeMore({ currentPage }: { currentPage: ColoringPage }) {
  const allTopCategories = (await getAllCategories()).filter(c => !c.parentSlug);
  const otherCategories = allTopCategories.filter(c => c.slug !== currentPage.categorySlug);

  const seenIds = new Set<string>([currentPage.id]);
  const result: ColoringPage[] = [];

  for (const cat of otherCategories) {
    if (result.length >= 4) break;
    const pages = await getColoringPages(cat.slug);
    const page = pages.find(p => !seenIds.has(p.id));
    if (page) {
      seenIds.add(page.id);
      result.push(page);
    }
  }

  if (result.length < 4) {
    const sameCategoryPages = await getColoringPages(currentPage.categorySlug);
    for (const p of sameCategoryPages) {
      if (result.length >= 4) break;
      if (!seenIds.has(p.id)) {
        seenIds.add(p.id);
        result.push(p);
      }
    }
  }

  if (result.length === 0) return null;

  return (
    <div className="max-w-[1240px] mx-auto px-6 pb-16 print:hidden">
      <h2 className="text-3xl font-bold text-[#0F0728] mb-6 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-7 before:bg-purple-600 before:rounded-sm">
        See More
      </h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
        {result.map(page => (
          <ColoringCard key={page.id} page={page} />
        ))}
      </div>
    </div>
  );
}
