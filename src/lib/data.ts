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
