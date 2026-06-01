import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

// Allowed sortBy columns and order directions to prevent ORM injection
const ALLOWED_SORT_COLUMNS = ["createdAt", "views", "downloads", "likes", "title"];
const ALLOWED_ORDER = ["asc", "desc"];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("categorySlug");
    const difficulty = searchParams.get("difficulty");
    const ageGroup = searchParams.get("ageGroup");
    const search = searchParams.get("search");
    const tag = searchParams.get("tag");

    // Pagination params
    const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20") || 20));
    const skip = (page - 1) * limit;

    // Sorting params — whitelisted to prevent ORM injection
    const rawSortBy = searchParams.get("sortBy") || "createdAt";
    const rawOrder = searchParams.get("order") || "desc";
    const sortBy = (ALLOWED_SORT_COLUMNS.includes(rawSortBy) ? rawSortBy : "createdAt") as keyof Prisma.ColoringPageOrderByWithRelationInput;
    const order = (ALLOWED_ORDER.includes(rawOrder.toLowerCase()) ? rawOrder.toLowerCase() : "desc") as Prisma.SortOrder;

    const where: Prisma.ColoringPageWhereInput = { published: true };

    // 1. Category filter (can be parent or subcategory)
    if (categorySlug) {
      where.OR = [
        { categorySlug },
        { subCategorySlug: categorySlug }
      ];
    }

    // 2. Attribute filters
    if (difficulty) {
      where.difficulty = difficulty;
    }
    if (ageGroup) {
      where.ageGroup = ageGroup;
    }
    if (tag) {
      where.tags = { has: tag };
    }

    // 3. Search query (matches title, description, or category slugs)
    if (search) {
      const searchLower = search.toLowerCase().trim();

      // Find category slugs matching the search term
      const matchedCategories = await prisma.category.findMany({
        where: {
          title: {
            contains: searchLower
          }
        },
        select: { slug: true }
      });
      const categorySlugs = matchedCategories.map(c => c.slug);

      where.AND = [
        {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
            { categorySlug: { in: categorySlugs } },
            ...(categorySlugs.length > 0 ? [{ subCategorySlug: { in: categorySlugs } }] : [])
          ]
        }
      ];
    }

    const [pages, total] = await Promise.all([
      prisma.coloringPage.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
        include: {
          category: { select: { title: true, slug: true } },
          subCategory: { select: { title: true, slug: true } }
        }
      }),
      prisma.coloringPage.count({ where })
    ]);

    return NextResponse.json({
      pages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching coloring pages:", error);
    return NextResponse.json({ error: "Failed to fetch coloring pages" }, { status: 500 });
  }
}
