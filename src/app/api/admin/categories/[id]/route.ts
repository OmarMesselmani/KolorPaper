import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripHtml, sanitizeSlug } from "@/lib/sanitize";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { title, slug, description, imageUrl, imageAlt, parentSlug, sortOrder } = await req.json();

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const cleanTitle = title !== undefined ? stripHtml(title).substring(0, 100) : existing.title;
    const cleanSlug = slug !== undefined ? sanitizeSlug(slug).substring(0, 100) : existing.slug;
    const cleanDescription = description !== undefined ? (description ? stripHtml(description).substring(0, 500) : null) : existing.description;
    const cleanImageUrl = imageUrl !== undefined ? (imageUrl ? stripHtml(imageUrl).substring(0, 2048) : null) : existing.imageUrl;
    const cleanImageAlt = imageAlt !== undefined ? (imageAlt ? stripHtml(imageAlt).substring(0, 200) : null) : existing.imageAlt;
    const cleanParentSlug = parentSlug !== undefined ? (parentSlug ? sanitizeSlug(parentSlug).substring(0, 100) : null) : existing.parentSlug;

    if (slug !== undefined && !cleanSlug) {
      return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
    }

    if (slug && cleanSlug !== existing.slug) {
      const slugExists = await prisma.category.findUnique({ where: { slug: cleanSlug } });
      if (slugExists) {
        return NextResponse.json({ error: "Category slug must be unique" }, { status: 400 });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        title: cleanTitle,
        slug: cleanSlug,
        description: cleanDescription,
        imageUrl: cleanImageUrl,
        imageAlt: cleanImageAlt,
        parentSlug: cleanParentSlug,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : existing.sortOrder
      }
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { children: true }
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (category.children.length > 0) {
      return NextResponse.json({ error: "Cannot delete category with subcategories. Delete subcategories first." }, { status: 400 });
    }

    const pageCount = await prisma.coloringPage.count({
      where: {
        OR: [
          { categorySlug: category.slug },
          { subCategorySlug: category.slug }
        ]
      }
    });

    if (pageCount > 0) {
      return NextResponse.json({ error: `Cannot delete category. It is referenced by ${pageCount} coloring pages.` }, { status: 400 });
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
