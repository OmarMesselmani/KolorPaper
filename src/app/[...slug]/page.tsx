import { getCategoryBySlug, getCategories, getColoringPages, getColoringPageBySlug } from "@/lib/data";
import CategoryCard from "@/components/CategoryCard";
import ColoringCard from "@/components/ColoringCard";
import PrintButton from "@/components/PrintButton";
import DownloadPdf from "@/components/DownloadPdf";
import DownloadImageButton from "@/components/DownloadImageButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import LikeButton from "@/components/LikeButton";
import DownloadImage from "@/components/DownloadImage";
import RelatedCard from "@/components/RelatedCard";
import { notFound } from "next/navigation";

export default async function DynamicPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
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
            <div className="flex-[0.9] max-w-[450px] min-w-[300px] w-full bg-white p-6 rounded-3xl shadow-[0_10px_15px_-3px_rgba(124,58,237,0.1),0_4px_6px_-2px_rgba(124,58,237,0.05)] border border-black/5">
              <img src={coloringPage.imageUrl} alt={coloringPage.title} className="w-full h-auto rounded-xl block printable-area" />
            </div>

            {/* Info Column */}
            <div className="flex-1 min-w-[320px] pt-4">
              <h2 className="text-5xl font-black bg-gradient-to-br from-purple-600 to-orange-500 bg-clip-text text-transparent mb-6">{coloringPage.title}</h2>
              <p className="text-lg leading-relaxed text-gray-500 mb-10">{coloringPage.description}</p>

              <div className="flex gap-4 flex-wrap print:hidden">
                <PrintButton />
                <DownloadImage imageUrl={coloringPage.imageUrl} title={coloringPage.title} />
                <DownloadPdf imageUrl={coloringPage.imageUrl} title={coloringPage.title} pdfUrl={coloringPage.pdfUrl} />
                <DownloadImageButton imageUrl={coloringPage.imageUrl} title={coloringPage.title} />
                <LikeButton initialLikes={coloringPage.likes} />
              </div>
            </div>

            {/* Sidebar Column */}
            {relatedPages.length > 0 && (
              <div className="w-full lg:w-80 min-w-[280px] bg-white p-6 rounded-3xl border border-black/5 shadow-[0_10px_15px_-3px_rgba(124,58,237,0.05)] print:hidden flex flex-col gap-6 flex-shrink-0">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b border-black/5 pb-4 m-0">
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
      </>
    );
  }

  const category = await getCategoryBySlug(lastSlug);
  if (category) {
    const subCategories = await getCategories(category.slug);
    const pages = await getColoringPages(category.slug);

    return (
      <>
        <div className="max-w-[1240px] mx-auto px-6 pt-8">
          <Breadcrumbs paths={breadcrumbPaths} />
          <h2 className="text-4xl font-extrabold my-8 text-gray-800">{category.title}</h2>
        </div>

        <div className="max-w-[1240px] mx-auto px-6">
          {subCategories.length > 0 && (
            <div className="mb-16">
              <h3 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-6 before:bg-purple-600 before:rounded-sm">Subcategories</h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8 pb-16">
                {subCategories.map(sub => <CategoryCard key={sub.id} category={sub} />)}
              </div>
            </div>
          )}

          {pages.length > 0 && (
            <div className="mb-16">
              <h3 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-6 before:bg-purple-600 before:rounded-sm">Coloring Pages</h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8 pb-16">
                {pages.map(page => <ColoringCard key={page.id} page={page} />)}
              </div>
            </div>
          )}

          {subCategories.length === 0 && pages.length === 0 && (
            <div className="text-center p-16 bg-white rounded-2xl text-gray-500 border-2 border-dashed border-black/5">
              <p>No drawings found in this category yet. Stay tuned!</p>
            </div>
          )}
        </div>
      </>
    );
  }

  return notFound();
}
