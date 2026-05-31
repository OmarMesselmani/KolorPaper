import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripHtml, sanitizeSlug } from "@/lib/sanitize";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { 
      title, slug, imageUrl, imageAlt, thumbnailUrl, pdfUrl, 
      categorySlug, subCategorySlug, description, difficulty, ageGroup, tags, published 
    } = await req.json();

    const existing = await prisma.coloringPage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Coloring page not found" }, { status: 404 });
    }

    const cleanTitle = title !== undefined ? stripHtml(title).substring(0, 100) : existing.title;
    const cleanSlug = slug !== undefined ? sanitizeSlug(slug).substring(0, 100) : existing.slug;
    const cleanImageUrl = imageUrl !== undefined ? stripHtml(imageUrl).substring(0, 2048) : existing.imageUrl;
    const cleanImageAlt = imageAlt !== undefined ? (imageAlt ? stripHtml(imageAlt).substring(0, 200) : null) : existing.imageAlt;
    const cleanThumbnailUrl = thumbnailUrl !== undefined ? stripHtml(thumbnailUrl).substring(0, 2048) : existing.thumbnailUrl;
    const cleanPdfUrl = pdfUrl !== undefined ? (pdfUrl ? stripHtml(pdfUrl).substring(0, 2048) : null) : existing.pdfUrl;
    const cleanCategorySlug = categorySlug !== undefined ? sanitizeSlug(categorySlug).substring(0, 100) : existing.categorySlug;
    const cleanSubCategorySlug = subCategorySlug !== undefined ? (subCategorySlug ? sanitizeSlug(subCategorySlug).substring(0, 100) : null) : existing.subCategorySlug;
    const cleanDescription = description !== undefined ? (description ? stripHtml(description).substring(0, 1000) : null) : existing.description;
    const cleanDifficulty = difficulty !== undefined ? (difficulty ? stripHtml(difficulty).substring(0, 50) : null) : existing.difficulty;
    const cleanAgeGroup = ageGroup !== undefined ? (ageGroup ? stripHtml(ageGroup).substring(0, 50) : null) : existing.ageGroup;
    const cleanTags = tags !== undefined ? (Array.isArray(tags) ? tags.map((t: string) => stripHtml(t).substring(0, 50)) : []) : existing.tags;

    if (slug !== undefined && !cleanSlug) {
      return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
    }

    if (slug && cleanSlug !== existing.slug) {
      const slugExists = await prisma.coloringPage.findUnique({ where: { slug: cleanSlug } });
      if (slugExists) {
        return NextResponse.json({ error: "Page slug must be unique" }, { status: 400 });
      }
    }

    if (categorySlug && cleanCategorySlug !== existing.categorySlug) {
      const category = await prisma.category.findUnique({ where: { slug: cleanCategorySlug } });
      if (!category) {
        return NextResponse.json({ error: `Category '${cleanCategorySlug}' does not exist` }, { status: 400 });
      }
    }

    if (cleanSubCategorySlug && cleanSubCategorySlug !== existing.subCategorySlug) {
      const subCategory = await prisma.category.findUnique({ where: { slug: cleanSubCategorySlug } });
      if (!subCategory) {
        return NextResponse.json({ error: `Subcategory '${cleanSubCategorySlug}' does not exist` }, { status: 400 });
      }
    }

    const updatedPage = await prisma.coloringPage.update({
      where: { id },
      data: {
        title: cleanTitle,
        slug: cleanSlug,
        imageUrl: cleanImageUrl,
        imageAlt: cleanImageAlt,
        thumbnailUrl: cleanThumbnailUrl,
        pdfUrl: cleanPdfUrl,
        categorySlug: cleanCategorySlug,
        subCategorySlug: cleanSubCategorySlug,
        description: cleanDescription,
        difficulty: cleanDifficulty,
        ageGroup: cleanAgeGroup,
        tags: cleanTags,
        published: published !== undefined ? published : existing.published
      }
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const page = await prisma.coloringPage.findUnique({ where: { id } });
    if (!page) {
      return NextResponse.json({ error: "Coloring page not found" }, { status: 404 });
    }

    await prisma.pageView.deleteMany({
      where: { pageSlug: page.slug }
    });

    await prisma.coloringPage.delete({ where: { id } });

    return NextResponse.json({ message: "Coloring page deleted successfully" });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
  }
}
