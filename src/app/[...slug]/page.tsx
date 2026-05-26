import { getCategoryBySlug, getCategories, getColoringPages, getColoringPageBySlug } from "@/lib/data";
import Image from "next/image";
import CategoryCard from "@/components/CategoryCard";
import ColoringCard from "@/components/ColoringCard";
import PrintButton from "@/components/PrintButton";
import DownloadPdf from "@/components/DownloadPdf";
import DownloadImageButton from "@/components/DownloadImageButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import LikeButton from "@/components/LikeButton";
import RelatedCard from "@/components/RelatedCard";
import SeeMore from "@/components/SeeMore";
import PageStats from "@/components/PageStats";
import FilterDrawer from "@/components/FilterDrawer";
import { notFound } from "next/navigation";

export default async function DynamicPage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ difficulty?: string; ageGroup?: string }>;
}) {
  const { slug } = await params;
  const { difficulty, ageGroup } = await searchParams;
  const lastSlug = slug[slug.length - 1];

  const breadcrumbPaths = await Promise.all(slug.map(async (s, i) => {
    const cat = await getCategoryBySlug(s);
    const page = await getColoringPageBySlug(s);
    return {
      title: cat?.title || page?.title || s,
      href: `/${slug.slice(0, i + 1).join('/')}`
    };
  }));

  const coloringPage = await getColoringPageBySlug(lastSlug);
  if (coloringPage) {
    const targetSlug = coloringPage.subCategorySlug || coloringPage.categorySlug;
    const allPages = await getColoringPages(targetSlug);
    let relatedPages = allPages.filter(p => p.id !== coloringPage.id);
    if (relatedPages.length === 0 && coloringPage.subCategorySlug) {
      const parentPages = await getColoringPages(coloringPage.categorySlug);
      relatedPages = parentPages.filter(p => p.id !== coloringPage.id);
    }

    return (
      <>
        <div className="max-w-[1240px] mx-auto px-6 pt-8">
          <Breadcrumbs paths={breadcrumbPaths} />
        </div>

        <div className="max-w-[1240px] mx-auto px-6 pb-16">
          <div className="flex gap-8 items-start flex-wrap lg:flex-nowrap mt-8">
            {/* Image Column */}
            <div className="flex-[0.9] max-w-[450px] min-w-[300px] w-full bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-[0_10px_15px_-3px_rgba(124,58,237,0.1),0_4px_6px_-2px_rgba(124,58,237,0.05)] dark:shadow-[0_10px_15px_-3px_rgba(168,85,247,0.1)] border border-black/5 dark:border-white/5">
              <Image src={coloringPage.imageUrl} alt={coloringPage.title} width={450} height={600} className="w-full h-auto rounded-xl block printable-area" />
            </div>

            {/* Info Column */}
            <div className="flex-1 min-w-[320px] pt-4">
              <h2 className="text-4xl font-bold text-[#0F0728] dark:text-gray-100 mb-6">{coloringPage.title}</h2>
              <p className="text-lg leading-relaxed text-gray-500 dark:text-gray-400 mb-10">{coloringPage.description}</p>

              <div className="flex gap-4 flex-wrap print:hidden">
                <PrintButton />
                <DownloadPdf imageUrl={coloringPage.imageUrl} title={coloringPage.title} pdfUrl={coloringPage.pdfUrl} />
                <DownloadImageButton imageUrl={coloringPage.imageUrl} title={coloringPage.title} />
                <LikeButton initialLikes={coloringPage.likes} />
              </div>

              <PageStats views={coloringPage.views} downloads={coloringPage.downloads} likes={coloringPage.likes} className="mt-6" />

              {(coloringPage.difficulty || coloringPage.ageGroup) && (
                <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 flex gap-8 print:hidden">
                  {coloringPage.difficulty && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Difficulty</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200 capitalize">{coloringPage.difficulty}</span>
                      </div>
                    </div>
                  )}
                  
                  {coloringPage.ageGroup && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-500 dark:text-orange-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Age Group</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200 capitalize">{coloringPage.ageGroup}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            {relatedPages.length > 0 && (
              <div className="w-full lg:w-80 min-w-[280px] bg-white dark:bg-gray-900 p-6 rounded-3xl border border-black/5 dark:border-white/5 shadow-[0_10px_15px_-3px_rgba(124,58,237,0.05)] print:hidden flex flex-col gap-6 flex-shrink-0">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-4 m-0">
                  Related Sheets
                </h3>
                <div className="flex flex-col gap-4">
                  {relatedPages.map(page => (
                    <RelatedCard key={page.id} page={page} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <SeeMore currentPage={coloringPage} />
      </>
    );
  }

  const category = await getCategoryBySlug(lastSlug);
  if (category) {
    const subCategories = await getCategories(category.slug);
    const pages = await getColoringPages(category.slug, { difficulty, ageGroup });

    return (
      <>
        <div className="max-w-[1240px] mx-auto px-6 pt-8">
          <Breadcrumbs paths={breadcrumbPaths} />
          <h2 className="text-4xl font-extrabold my-8 text-gray-800 dark:text-gray-100">{category.title}</h2>
        </div>

        <div className="max-w-[1240px] mx-auto px-6">
          {subCategories.length > 0 && (
            <div className="mb-16">
              <h3 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-6 before:bg-purple-600 before:rounded-sm">Subcategories</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-16">
                {subCategories.map(sub => <CategoryCard key={sub.id} category={sub} />)}
              </div>
            </div>
          )}

          {pages.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-6 before:bg-purple-600 before:rounded-sm">Coloring Pages</h3>
                <FilterDrawer />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-16">
                {pages.map(page => <ColoringCard key={page.id} page={page} />)}
              </div>
            </div>
          )}

          {subCategories.length === 0 && pages.length === 0 && (
            <div className="text-center p-16 bg-white dark:bg-gray-900 rounded-2xl text-gray-500 dark:text-gray-400 border-2 border-dashed border-black/5 dark:border-white/5">
              <p className="mb-4">No drawings found matching your filters in this category.</p>
              {(difficulty || ageGroup) && (
                <FilterDrawer />
              )}
            </div>
          )}
        </div>
      </>
    );
  }

  return notFound();
}
