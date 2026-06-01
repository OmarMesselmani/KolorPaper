import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripHtml, sanitizeSlug } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    const { title, slug, description, imageUrl, imageAlt, parentSlug, sortOrder } = await req.json();

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const cleanTitle = stripHtml(title).substring(0, 100);
    const cleanSlug = sanitizeSlug(slug).substring(0, 100);
    const cleanDescription = description ? stripHtml(description).substring(0, 500) : null;
    const cleanImageUrl = imageUrl ? stripHtml(imageUrl).substring(0, 2048) : null;
    const cleanImageAlt = imageAlt ? stripHtml(imageAlt).substring(0, 200) : null;
    const cleanParentSlug = parentSlug ? sanitizeSlug(parentSlug).substring(0, 100) : null;

    if (!cleanTitle || !cleanSlug) {
      return NextResponse.json({ error: "Invalid title or slug after sanitization" }, { status: 400 });
    }

    const existing = await prisma.category.findUnique({ where: { slug: cleanSlug } });
    if (existing) {
      return NextResponse.json({ error: "Category slug must be unique" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        title: cleanTitle,
        slug: cleanSlug,
        description: cleanDescription,
        imageUrl: cleanImageUrl,
        imageAlt: cleanImageAlt,
        parentSlug: cleanParentSlug || null,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
