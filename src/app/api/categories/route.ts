import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parentSlug = searchParams.get("parentSlug");

    let categories;
    if (parentSlug === "null" || parentSlug === "") {
      categories = await prisma.category.findMany({
        where: { parentSlug: null },
        orderBy: { sortOrder: "asc" },
        include: {
          _count: {
            select: { pages: true, subPages: true }
          }
        }
      });
    } else if (parentSlug) {
      categories = await prisma.category.findMany({
        where: { parentSlug },
        orderBy: { sortOrder: "asc" },
        include: {
          _count: {
            select: { pages: true, subPages: true }
          }
        }
      });
    } else {
      categories = await prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
          _count: {
            select: { pages: true, subPages: true }
          }
        }
      });
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
