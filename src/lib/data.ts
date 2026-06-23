import { cache } from "react";
import { Category, ColoringPage } from "@/types";
import { prisma } from "@/lib/db";

// Remove API_URL as we now fetch directly from the database in Server Components

export async function getAllCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { pages: true, subPages: true }
        }
      }
    });
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Failed to fetch all categories:", error);
    return [];
  }
}

export async function getCategories(parentSlug?: string): Promise<Category[]> {
  try {
    const where = parentSlug ? { parentSlug } : { parentSlug: null };
    const categories = await prisma.category.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { pages: true, subPages: true }
        }
      }
    });
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: {
          orderBy: { sortOrder: "asc" },
          include: {
            _count: {
              select: { pages: true, subPages: true }
            }
          }
        },
        _count: {
          select: { pages: true, subPages: true }
        }
      }
    });
    return category ? JSON.parse(JSON.stringify(category)) : null;
  } catch (error) {
    console.error("Failed to fetch category by slug:", error);
    return null;
  }
}

export async function getColoringPages(
  categorySlug: string,
  filters?: { difficulty?: string; ageGroup?: string }
): Promise<ColoringPage[]> {
  try {
    const where: any = { published: true };
    if (categorySlug) {
      where.OR = [
        { categorySlug },
        { subCategorySlug: categorySlug }
      ];
    }
    if (filters?.difficulty) where.difficulty = filters.difficulty;
    if (filters?.ageGroup) where.ageGroup = filters.ageGroup;

    const pages = await prisma.coloringPage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        category: { select: { title: true, slug: true } },
        subCategory: { select: { title: true, slug: true } }
      }
    });
    return JSON.parse(JSON.stringify(pages));
  } catch (error) {
    console.error("Failed to fetch coloring pages:", error);
    return [];
  }
}

export async function getAllColoringPages(): Promise<ColoringPage[]> {
  try {
    const pages = await prisma.coloringPage.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 10000,
      include: {
        category: { select: { title: true, slug: true } },
        subCategory: { select: { title: true, slug: true } }
      }
    });
    return JSON.parse(JSON.stringify(pages));
  } catch (error) {
    console.error("Failed to fetch all coloring pages:", error);
    return [];
  }
}

export async function getColoringPageBySlug(slug: string): Promise<ColoringPage | null> {
  try {
    const page = await prisma.coloringPage.findUnique({
      where: { slug },
      include: {
        category: { select: { title: true, slug: true } },
        subCategory: { select: { title: true, slug: true } }
      }
    });
    return page ? JSON.parse(JSON.stringify(page)) : null;
  } catch (error) {
    console.error("Failed to fetch coloring page by slug:", error);
    return null;
  }
}

export async function searchColoringPages(
  query: string,
  filters?: { difficulty?: string; ageGroup?: string }
): Promise<ColoringPage[]> {
  try {
    const where: any = { published: true };
    if (filters?.difficulty) where.difficulty = filters.difficulty;
    if (filters?.ageGroup) where.ageGroup = filters.ageGroup;

    if (query) {
      const searchLower = query.toLowerCase().trim();
      const matchedCategories: Array<{ slug: string }> =
        await prisma.category.findMany({
          where: { title: { contains: searchLower } },
          select: { slug: true }
        });

      const categorySlugs: string[] = matchedCategories.map(
        (c: { slug: string }) => c.slug
      );

      where.AND = [
        {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { categorySlug: { in: categorySlugs } },
            ...(categorySlugs.length > 0 ? [{ subCategorySlug: { in: categorySlugs } }] : [])
          ]
        }
      ];
    }

    const pages = await prisma.coloringPage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        category: { select: { title: true, slug: true } },
        subCategory: { select: { title: true, slug: true } }
      }
    });
    return JSON.parse(JSON.stringify(pages));
  } catch (error) {
    console.error("Failed to search coloring pages:", error);
    return [];
  }
}

export async function getPagesByTag(
  tag: string,
  filters?: { difficulty?: string; ageGroup?: string }
): Promise<ColoringPage[]> {
  try {
    const where: any = { published: true, tags: { has: tag } };
    if (filters?.difficulty) where.difficulty = filters.difficulty;
    if (filters?.ageGroup) where.ageGroup = filters.ageGroup;

    const pages = await prisma.coloringPage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        category: { select: { title: true, slug: true } },
        subCategory: { select: { title: true, slug: true } }
      }
    });
    return JSON.parse(JSON.stringify(pages));
  } catch (error) {
    console.error("Failed to fetch coloring pages by tag:", error);
    return [];
  }
}

const HOME_PAGE_INCLUDE = {
  category: { select: { title: true, slug: true } },
  subCategory: { select: { title: true, slug: true } },
};

// Fetch only the data the home page actually needs (3 sorted lists)
// instead of pulling all 10,000 rows and sorting client-side.
export async function getHomePageData(limit: number = 120): Promise<{
  newest: ColoringPage[];
  mostDownloaded: ColoringPage[];
  mostLiked: ColoringPage[];
}> {
  try {
    const where = { published: true };
    const [newest, mostDownloaded, mostLiked] = await Promise.all([
      prisma.coloringPage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        include: HOME_PAGE_INCLUDE,
      }),
      prisma.coloringPage.findMany({
        where,
        orderBy: { downloads: "desc" },
        take: limit,
        include: HOME_PAGE_INCLUDE,
      }),
      prisma.coloringPage.findMany({
        where,
        orderBy: { likes: "desc" },
        take: limit,
        include: HOME_PAGE_INCLUDE,
      }),
    ]);
    return {
      newest: JSON.parse(JSON.stringify(newest)),
      mostDownloaded: JSON.parse(JSON.stringify(mostDownloaded)),
      mostLiked: JSON.parse(JSON.stringify(mostLiked)),
    };
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
    return { newest: [], mostDownloaded: [], mostLiked: [] };
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// React cache() deduplicates calls with the same arguments within a single
// server request. generateMetadata and the page component now share results
// instead of hitting the database twice for the same slug.
export const cachedGetColoringPageBySlug = cache(getColoringPageBySlug);
export const cachedGetCategoryBySlug = cache(getCategoryBySlug);
export const cachedGetAllCategories = cache(getAllCategories);
export const cachedGetColoringPages = cache(getColoringPages);

// ── Sitemap-optimised queries (minimal columns, no caching needed) ──

type SitemapCategory = { slug: string; parentSlug: string | null; updatedAt: Date };
type SitemapPage = { slug: string; categorySlug: string; subCategorySlug: string | null; updatedAt: Date };
type SitemapPost = { slug: string; updatedAt: Date };
type SitemapTag = { name: string; updatedAt: Date };

export async function getSitemapCategories(): Promise<SitemapCategory[]> {
  try {
    return await prisma.category.findMany({
      select: { slug: true, parentSlug: true, updatedAt: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch sitemap categories:", error);
    return [];
  }
}

export async function getSitemapColoringPages(): Promise<SitemapPage[]> {
  try {
    return await prisma.coloringPage.findMany({
      where: { published: true },
      select: {
        slug: true,
        categorySlug: true,
        subCategorySlug: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch sitemap coloring pages:", error);
    return [];
  }
}

export async function getSitemapBlogPosts(): Promise<SitemapPost[]> {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch sitemap blog posts:", error);
    return [];
  }
}

export async function getSitemapTags(): Promise<SitemapTag[]> {
  try {
    return await prisma.tag.findMany({
      select: { name: true, updatedAt: true },
    });
  } catch (error) {
    console.error("Failed to fetch sitemap tags:", error);
    return [];
  }
}
