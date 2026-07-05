import { cachedGetCategoryBySlug, cachedGetColoringPageBySlug, getCategories, cachedGetColoringPages, cachedGetAllCategories, cachedGetAllCustomTagNames } from "@/lib/data";
import Image from "next/image";
import Tag from "@/components/Tag";
import CategoryCard from "@/components/CategoryCard";
import ColoringCard from "@/components/ColoringCard";
import PrintButton from "@/components/PrintButton";
import DownloadPdf from "@/components/DownloadPdf";
import Breadcrumbs from "@/components/Breadcrumbs";
import PaginatedGrid from "@/components/PaginatedGrid";
import LikeButton from "@/components/LikeButton";
import RelatedCard from "@/components/RelatedCard";
import SeeMore from "@/components/SeeMore";
import PageStats from "@/components/PageStats";
import FilterDrawer from "@/components/FilterDrawer";
import CustomTagSidebarCard from "@/components/CustomTagSidebarCard";
import CopyLinkButton from "@/components/CopyLinkButton";
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

  // Run both lookups in parallel - only one will match
  const [coloringPage, category] = await Promise.all([
    cachedGetColoringPageBySlug(lastSlug),
    cachedGetCategoryBySlug(lastSlug),
  ]);

  if (coloringPage) {
    const url = `${siteUrl}/${slug.join('/')}`;
    const title = `${coloringPage.title}`;
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

  if (category) {
    const url = `${siteUrl}/${slug.join('/')}`;
    const title = `${category.title} Coloring Pages`;
    const description = category.description || `Explore our collection of free printable ${category.title} coloring pages for kids and adults. Download high-quality coloring sheets.`;
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

  // Run both lookups in parallel (cached, so shared with generateMetadata)
  const [coloringPage, category] = await Promise.all([
    cachedGetColoringPageBySlug(lastSlug),
    cachedGetCategoryBySlug(lastSlug),
  ]);

  // Build breadcrumbs efficiently: one query per slug segment, reuse last slug data
  const breadcrumbPaths = await Promise.all(slug.map(async (s, i) => {
    // For the last slug, reuse the already-fetched data
    if (s === lastSlug) {
      return {
        title: coloringPage?.title || category?.title || s,
        href: `/${slug.slice(0, i + 1).join('/')}`
      };
    }
    // For parent slugs, they are always categories (cached)
    const cat = await cachedGetCategoryBySlug(s);
    return {
      title: cat?.title || s,
      href: `/${slug.slice(0, i + 1).join('/')}`
    };
  }));

  if (coloringPage) {
    const targetSlug = coloringPage.subCategorySlug || coloringPage.categorySlug;
    const allRelated = (await cachedGetColoringPages(targetSlug))
      .filter(p => p.id !== coloringPage.id);

    // Shuffle array randomly
    for (let i = allRelated.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allRelated[i], allRelated[j]] = [allRelated[j], allRelated[i]];
    }

    const relatedPages = allRelated.slice(0, 4);

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
              },
              "creditText": "KolorPaper",
              "copyrightNotice": `© ${new Date().getFullYear()} KolorPaper`
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

            </div>

            {/* Info Column */}
            <div className="flex-1 min-w-[320px] pt-4 print:hidden">
              <h1 className="text-xl md:text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">{coloringPage.title}</h1>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-500 dark:text-gray-400 mb-6">{coloringPage.description}</p>

              <div className="flex flex-col gap-4 w-full max-w-[450px] print:hidden">
                <div className="flex gap-4 w-full">
                  <div className="flex-1">
                    <PrintButton slug={coloringPage.slug} imageUrl={coloringPage.imageUrl} title={coloringPage.title} />
                  </div>
                  <div className="flex-1">
                    <LikeButton slug={coloringPage.slug} initialLikes={coloringPage.likes} />
                  </div>
                </div>
                <div className="w-full">
                  <DownloadPdf imageUrl={coloringPage.imageUrl} title={coloringPage.title} pdfUrl={coloringPage.pdfUrl} slug={coloringPage.slug} />
                </div>
              </div>

              <PageStats slug={coloringPage.slug} views={coloringPage.views} downloads={coloringPage.downloads} likes={coloringPage.likes} className="mt-6" />

              {(coloringPage.difficulty || coloringPage.ageGroup || coloringPage.style) && (
                <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 flex flex-row items-center gap-6 sm:gap-12 flex-nowrap print:hidden overflow-x-auto no-scrollbar w-full">
                  {coloringPage.difficulty && (
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Difficulty: <span className={`capitalize font-black ${coloringPage.difficulty === 'very easy' ? 'text-[#34c759]' :
                              coloringPage.difficulty === 'easy' ? 'text-[#8bc34a]' :
                              coloringPage.difficulty === 'hard' ? 'text-[#ff9500]' :
                              coloringPage.difficulty === 'very hard' ? 'text-[#ff3b30]' :
                                'text-[#ffcc00]'
                            }`}>{coloringPage.difficulty}</span>
                        </span>

                        {/* Custom Difficulty Slider */}
                        <div className="relative w-28 h-7 flex items-center">
                          {/* Track */}
                          <div className="w-full h-3.5 rounded-full bg-gradient-to-r from-[#34c759] via-[#ffcc00] via-[#ff9500] to-[#ff3b30] border-2 border-white dark:border-gray-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]" />

                          {/* Thumb */}
                          <div
                            className="absolute w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.25)] border border-gray-200/50 transition-all duration-700 ease-out"
                            style={{
                              left: coloringPage.difficulty === 'very easy' ? '10%' : coloringPage.difficulty === 'easy' ? '30%' : coloringPage.difficulty === 'hard' ? '70%' : coloringPage.difficulty === 'very hard' ? '90%' : '50%',
                              transform: 'translateX(-50%)'
                            }}
                          >
                            <div
                              className={`w-3 h-3 rounded-full transition-colors duration-500 ${coloringPage.difficulty === 'very easy' ? 'bg-[#34c759]' : coloringPage.difficulty === 'easy' ? 'bg-[#8bc34a]' : coloringPage.difficulty === 'hard' ? 'bg-[#ff9500]' : coloringPage.difficulty === 'very hard' ? 'bg-[#ff3b30]' : 'bg-[#ffcc00]'
                                }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {coloringPage.ageGroup && (
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Age Group:</span>
                        <span className="font-bold text-gray-850 dark:text-gray-200 capitalize text-sm sm:text-base">
                          {coloringPage.ageGroup === 'adults' ? 'adults' : coloringPage.ageGroup}
                        </span>
                      </div>
                    </div>
                  )}

                  {coloringPage.style && (
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Style:</span>
                        <span className="font-bold text-gray-850 dark:text-gray-200 capitalize text-sm sm:text-base">
                          {coloringPage.style}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Share Actions */}
              <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 print:hidden">
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Share with Friends</h3>
                <div className="flex gap-4">
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${siteUrl}/${slug.join('/')}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-11 h-11 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all hover:scale-110 duration-200 cursor-pointer"
                    aria-label="Share on Facebook"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                    </svg>
                  </a>
                  <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${siteUrl}/${slug.join('/')}`)}&text=${encodeURIComponent(`Check out this free printable coloring page: ${coloringPage.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-11 h-11 bg-gray-50 text-gray-800 dark:bg-gray-800/40 dark:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all hover:scale-110 duration-200 cursor-pointer"
                    aria-label="Share on X"
                  >
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                  </a>
                  <a 
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${coloringPage.title} Free Printable Coloring Page - ${siteUrl}/${slug.join('/')}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-11 h-11 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-full hover:bg-green-100 dark:hover:bg-green-900/40 transition-all hover:scale-110 duration-200 cursor-pointer"
                    aria-label="Share on WhatsApp"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21l1.65-3.8a9 9 0 113.4 2.9L3 21" />
                    </svg>
                  </a>
                  <CopyLinkButton url={`${siteUrl}/${slug.join('/')}`} />
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            {(() => {
              let parsedTags: string[] = [];
              try { parsedTags = coloringPage.tags ? JSON.parse(String(coloringPage.tags)) : []; } catch(e) {}
              return (relatedPages.length > 0 || parsedTags.length > 0) && (
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

                {parsedTags.length > 0 && (
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-black/5 dark:border-white/5 shadow-[0_10px_15px_-3px_rgba(124,58,237,0.05)] flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-[#0F0728] dark:text-gray-100 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-5 before:bg-purple-600 before:rounded-sm m-0">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {parsedTags.map(tag => (
                        <Tag key={tag} name={tag} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )})()}
          </div>
        </div>

        <SeeMore currentPage={coloringPage} />
      </>
    );
  }

  if (category) {
    // Run sub-queries in parallel
    const [subCategories, pages, customTagNames] = await Promise.all([
      getCategories(category.slug),
      cachedGetColoringPages(category.slug, { difficulty, ageGroup }),
      category.parentSlug ? cachedGetAllCustomTagNames() : Promise.resolve([]),
    ]);

    let categoryTags: string[] = [];
    // Only display tags on subcategories, and only if they are Custom Tags
    if (category.parentSlug && customTagNames.length > 0) {
      const allPageTags = Array.from(new Set(pages.flatMap(p => { try { return p.tags ? JSON.parse(String(p.tags)) : [] } catch(e) { return [] } })));
      categoryTags = allPageTags.filter(tag => customTagNames.includes(tag)).sort();
    }

    return (
      <>
        <div className="max-w-[1240px] mx-auto px-6 pt-8">
          <Breadcrumbs paths={breadcrumbPaths} />
          <h1 className="text-4xl font-extrabold mt-8 mb-3 text-gray-800 dark:text-gray-100">{category.title}</h1>
          {category.description && (
            <p className="text-sm sm:text-base leading-relaxed text-gray-500 dark:text-gray-400 mb-6 max-w-3xl">
              {category.description}
            </p>
          )}
        </div>

        <div className="max-w-[1240px] mx-auto px-6">
          <div className="flex gap-8 items-start flex-col lg:flex-row">
            <div className="flex-1 min-w-[320px] w-full order-2 lg:order-1">
              {subCategories.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2 md:gap-3 before:content-[''] before:block before:w-1 before:h-5 md:before:h-6 before:bg-purple-600 before:rounded-sm">Subcategories</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 pb-16">
                    {subCategories.map(sub => <CategoryCard key={sub.id} category={sub} />)}
                  </div>
                </div>
              )}

              {pages.length > 0 && subCategories.length === 0 && (
                <div className="mb-16">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 md:gap-3 before:content-[''] before:block before:w-1 before:h-5 md:before:h-6 before:bg-purple-600 before:rounded-sm">Coloring Pages</h2>
                    <FilterDrawer />
                  </div>
                  <PaginatedGrid pages={pages} columns={categoryTags.length > 0 ? 4 : 5} />
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

            {categoryTags.length > 0 && (
              <div className="w-full lg:w-48 min-w-[190px] flex flex-col gap-4 flex-shrink-0 mb-16 lg:pt-2 order-1 lg:order-2">
                <h3 className="text-xl font-bold text-[#0F0728] dark:text-gray-100 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-5 before:bg-purple-600 before:rounded-sm m-0 mb-2">
                  Related Topics
                </h3>
                <div className="grid grid-cols-2 lg:flex lg:flex-col gap-3 lg:gap-4">
                  {categoryTags.map(tag => (
                    <CustomTagSidebarCard key={tag} name={tag} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return notFound();
}
