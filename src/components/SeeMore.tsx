import { ColoringPage } from "@/types";
import { getAllCategories, getColoringPages } from "@/lib/data";
import ColoringCard from "./ColoringCard";

export default async function SeeMore({ currentPage }: { currentPage: ColoringPage }) {
  const sameCategoryPages = await getColoringPages(currentPage.categorySlug);

  let candidatePages = sameCategoryPages.filter(p => {
    if (currentPage.subCategorySlug) {
      return p.subCategorySlug !== currentPage.subCategorySlug;
    }
    return p.id !== currentPage.id;
  });

  for (let i = candidatePages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidatePages[i], candidatePages[j]] = [candidatePages[j], candidatePages[i]];
  }

  const result: ColoringPage[] = [];
  const seenIds = new Set<string>([currentPage.id]);

  for (const p of candidatePages) {
    if (result.length >= 4) break;
    if (!seenIds.has(p.id)) {
      seenIds.add(p.id);
      result.push(p);
    }
  }

  if (result.length < 4) {
    const allTopCategories = (await getAllCategories()).filter(c => !c.parentSlug);
    const otherCategories = allTopCategories.filter(c => c.slug !== currentPage.categorySlug);
    
    let otherPages: ColoringPage[] = [];
    for (const cat of otherCategories) {
      const pages = await getColoringPages(cat.slug);
      otherPages = otherPages.concat(pages);
    }
    
    for (let i = otherPages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherPages[i], otherPages[j]] = [otherPages[j], otherPages[i]];
    }
    
    for (const p of otherPages) {
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
