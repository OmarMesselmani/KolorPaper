import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripHtml, sanitizeSlug } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    const { 
      title, slug, imageUrl, imageAlt, thumbnailUrl, pdfUrl, 
      categorySlug, subCategorySlug, description, difficulty, ageGroup, style, tags, published 
    } = await req.json();

    if (!title || !slug || !imageUrl || !thumbnailUrl || !categorySlug) {
      return NextResponse.json({ error: "Title, slug, imageUrl, thumbnailUrl, and categorySlug are required" }, { status: 400 });
    }

    const cleanTitle = stripHtml(title).substring(0, 100);
    const cleanSlug = sanitizeSlug(slug).substring(0, 100);
    const cleanImageUrl = stripHtml(imageUrl).substring(0, 2048);
    const cleanImageAlt = imageAlt ? stripHtml(imageAlt).substring(0, 200) : null;
    const cleanThumbnailUrl = stripHtml(thumbnailUrl).substring(0, 2048);
    const cleanPdfUrl = pdfUrl ? stripHtml(pdfUrl).substring(0, 2048) : null;
    const cleanCategorySlug = sanitizeSlug(categorySlug).substring(0, 100);
    const cleanSubCategorySlug = subCategorySlug ? sanitizeSlug(subCategorySlug).substring(0, 100) : null;
    const cleanDescription = description ? stripHtml(description).substring(0, 1000) : null;
    const cleanDifficulty = difficulty ? stripHtml(difficulty).substring(0, 50) : null;
    const cleanAgeGroup = ageGroup ? stripHtml(ageGroup).substring(0, 50) : null;
    const cleanStyle = style ? stripHtml(style).substring(0, 50) : "Cartoon";
    const cleanTags = Array.isArray(tags) ? tags.map((t: string) => stripHtml(t).substring(0, 50)) : [];

    if (!cleanTitle || !cleanSlug || !cleanImageUrl || !cleanThumbnailUrl || !cleanCategorySlug) {
      return NextResponse.json({ error: "Invalid inputs after sanitization" }, { status: 400 });
    }

    const existing = await prisma.coloringPage.findUnique({ where: { slug: cleanSlug } });
    if (existing) {
      return NextResponse.json({ error: "Page slug must be unique" }, { status: 400 });
    }

    const category = await prisma.category.findUnique({ where: { slug: cleanCategorySlug } });
    if (!category) {
      return NextResponse.json({ error: `Category '${cleanCategorySlug}' does not exist` }, { status: 400 });
    }

    if (cleanSubCategorySlug) {
      const subCategory = await prisma.category.findUnique({ where: { slug: cleanSubCategorySlug } });
      if (!subCategory) {
        return NextResponse.json({ error: `Subcategory '${cleanSubCategorySlug}' does not exist` }, { status: 400 });
      }
    }

    const page = await prisma.coloringPage.create({
      data: {
        title: cleanTitle,
        slug: cleanSlug,
        imageUrl: cleanImageUrl,
        imageAlt: cleanImageAlt,
        thumbnailUrl: cleanThumbnailUrl,
        pdfUrl: cleanPdfUrl || null,
        categorySlug: cleanCategorySlug,
        subCategorySlug: cleanSubCategorySlug || null,
        description: cleanDescription,
        difficulty: cleanDifficulty,
        ageGroup: cleanAgeGroup,
        style: cleanStyle,
        tags: cleanTags,
        published: published !== undefined ? published : true
      }
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}
