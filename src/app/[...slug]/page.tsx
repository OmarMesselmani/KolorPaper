import { getCategoryBySlug, getCategories, getColoringPages, getColoringPageBySlug } from "@/lib/data";
import Image from "next/image";
import Tag from "@/components/Tag";
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
import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kolorpaper.com';

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params;
  const lastSlug = slug[slug.length - 1];

  const coloringPage = await getColoringPageBySlug(lastSlug);
  if (coloringPage) {
    const url = `${siteUrl}/${slug.join('/')}`;
    const title = `${coloringPage.title} - Free Printable Coloring Page`;
    const description = coloringPage.description || `Download and print this free ${coloringPage.title} coloring page for kids.`;
    const imageUrl = coloringPage.thumbnailUrl || coloringPage.imageUrl;
    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        siteName: 'KolorPaper',
        images: [
          {
            url: imageUrl,
            alt: `Free printable ${coloringPage.title} coloring page`,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  }

  const category = await getCategoryBySlug(lastSlug);
  if (category) {
    const url = `${siteUrl}/${slug.join('/')}`;
    const title = `${category.title} Coloring Pages - Free Printable`;
    const description = category.description || `Explore our collection of free printable ${category.title} coloring pages for kids and adults. Download and print high-quality coloring sheets.`;
    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        siteName: 'KolorPaper',
        images: category.imageUrl ? [
          {
            url: category.imageUrl,
            alt: `${category.title} coloring pages`,
          },
        ] : undefined,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: category.imageUrl ? [category.imageUrl] : undefined,
      },
    };
  }

  return {
    title: "Not Found",
  };
}

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
    const relatedPages = allPages
      .filter(p => p.id !== coloringPage.id)
      .reverse()
      .slice(0, 4);

    return (
      <>
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "ImageObject",
              "name": `${coloringPage.title} Free Printable Coloring Page`,
              "description": coloringPage.description || `Free printable ${coloringPage.title} coloring page for kids.`,
              "contentUrl": coloringPage.imageUrl,
              "thumbnailUrl": coloringPage.thumbnailUrl || coloringPage.imageUrl,
              "license": `${siteUrl}/terms-of-use`,
              "acquireLicensePage": `${siteUrl}/${slug.join('/')}`,
              "creator": {
                "@type": "Organization",
                "name": "KolorPaper"
              }
            })
          }}
        />
        <div className="max-w-[1240px] mx-auto px-6 pt-8 print:hidden">
          <Breadcrumbs paths={breadcrumbPaths} />
        </div>

        <div className="max-w-[1240px] mx-auto px-6 pb-16">
          <div className="flex gap-8 items-start flex-wrap lg:flex-nowrap mt-8">
            {/* Image Column */}
            <div className="flex-[0.9] max-w-[450px] min-w-[300px] w-full bg-white dark:bg-gray-900 p-0 rounded-3xl overflow-hidden shadow-[0_10px_15px_-3px_rgba(124,58,237,0.1),0_4px_6px_-2px_rgba(124,58,237,0.05)] dark:shadow-[0_10px_15px_-3px_rgba(168,85,247,0.1)] border border-black/5 dark:border-white/5">
              {/* Screen preview: uses optimized/thumbnail image */}
              <Image
                src={coloringPage.thumbnailUrl || coloringPage.imageUrl}
                alt={`Free printable ${coloringPage.title} coloring page for kids`}
                width={450}
                height={600}
                className="w-full h-auto block print:hidden"
              />
              {/* Print layout: uses high-resolution original image */}
              <img
                src={coloringPage.imageUrl}
                alt={`Free printable ${coloringPage.title} coloring page for kids high resolution`}
                className="hidden print:block w-full h-auto rounded-xl printable-area"
              />
            </div>

            {/* Info Column */}
            <div className="flex-1 min-w-[320px] pt-4 print:hidden">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">{coloringPage.title}</h1>
              <p className="text-sm sm:text-base leading-relaxed text-gray-500 dark:text-gray-400 mb-6">{coloringPage.description}</p>

              <div className="flex gap-4 flex-wrap print:hidden">
                <PrintButton slug={coloringPage.slug} imageUrl={coloringPage.imageUrl} title={coloringPage.title} />
                <DownloadPdf imageUrl={coloringPage.imageUrl} title={coloringPage.title} pdfUrl={coloringPage.pdfUrl} slug={coloringPage.slug} />
                <DownloadImageButton imageUrl={coloringPage.imageUrl} title={coloringPage.title} slug={coloringPage.slug} />
                <LikeButton slug={coloringPage.slug} initialLikes={coloringPage.likes} />
              </div>

              <PageStats slug={coloringPage.slug} views={coloringPage.views} downloads={coloringPage.downloads} likes={coloringPage.likes} className="mt-6" />

              {(coloringPage.difficulty || coloringPage.ageGroup) && (
                <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 flex flex-col gap-6 print:hidden">
                  {coloringPage.difficulty && (
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Difficulty: <span className={`capitalize font-black ${coloringPage.difficulty === 'easy' ? 'text-[#34c759]' :
                              coloringPage.difficulty === 'hard' ? 'text-[#ff3b30]' :
                                'text-[#ff9500]'
                            }`}>{coloringPage.difficulty}</span>
                        </span>

                        {/* Custom Difficulty Slider */}
                        <div className="relative w-36 h-7 flex items-center">
                          {/* Track */}
                          <div className="w-full h-3.5 rounded-full bg-gradient-to-r from-[#34c759] via-[#ffcc00] via-[#ff9500] to-[#ff3b30] border-2 border-white dark:border-gray-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]" />

                          {/* Thumb */}
                          <div
                            className="absolute w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.25)] border border-gray-200/50 transition-all duration-700 ease-out"
                            style={{
                              left: coloringPage.difficulty === 'easy' ? '15%' : coloringPage.difficulty === 'hard' ? '85%' : '50%',
                              transform: 'translateX(-50%)'
                            }}
                          >
                            <div
                              className={`w-3 h-3 rounded-full transition-colors duration-500 ${coloringPage.difficulty === 'easy' ? 'bg-[#34c759]' : coloringPage.difficulty === 'hard' ? 'bg-[#ff3b30]' : 'bg-[#ff9500]'
                                }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {coloringPage.ageGroup && (
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Age Group</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200 capitalize">
                          {coloringPage.ageGroup === 'adults' ? 'adults' : coloringPage.ageGroup}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            {(relatedPages.length > 0 || (coloringPage.tags && coloringPage.tags.length > 0)) && (
              <div className="w-full lg:w-80 min-w-[280px] print:hidden flex flex-col gap-6 flex-shrink-0">
                {relatedPages.length > 0 && (
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-black/5 dark:border-white/5 shadow-[0_10px_15px_-3px_rgba(124,58,237,0.05)] flex flex-col gap-6">
                    <h3 className="text-xl font-bold text-[#0F0728] dark:text-gray-100 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-5 before:bg-purple-600 before:rounded-sm m-0">
                      Related Sheets
                    </h3>
                    <div className="flex flex-col gap-4">
                      {relatedPages.map(page => (
                        <RelatedCard key={page.id} page={page} />
                      ))}
                    </div>
                  </div>
                )}

                {coloringPage.tags && coloringPage.tags.length > 0 && (
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-black/5 dark:border-white/5 shadow-[0_10px_15px_-3px_rgba(124,58,237,0.05)] flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-[#0F0728] dark:text-gray-100 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-5 before:bg-purple-600 before:rounded-sm m-0">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {coloringPage.tags.map(tag => (
                        <Tag key={tag} name={tag} />
                      ))}
                    </div>
                  </div>
                )}
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
          <h1 className="text-4xl font-extrabold mt-8 mb-3 text-gray-800 dark:text-gray-100">{category.title}</h1>
          {category.description && (
            <p className="text-sm sm:text-base leading-relaxed text-gray-500 dark:text-gray-400 mb-8 max-w-3xl">
              {category.description}
            </p>
          )}
        </div>

        <div className="max-w-[1240px] mx-auto px-6">
          {subCategories.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-6 before:bg-purple-600 before:rounded-sm">Subcategories</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pb-16">
                {subCategories.map(sub => <CategoryCard key={sub.id} category={sub} />)}
              </div>
            </div>
          )}

          {pages.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-6 before:bg-purple-600 before:rounded-sm">Coloring Pages</h2>
                <FilterDrawer />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pb-16">
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
