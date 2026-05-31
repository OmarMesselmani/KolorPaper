import { Request, Response } from "express";
import { prisma } from "../db.js";
import { stripHtml, sanitizeSlug } from "../utils/sanitize.js";

// GET /api/categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const parentSlug = req.query.parentSlug as string | undefined;

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

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// GET /api/categories/:slug
export const getCategoryBySlug = async (req: Request, res: Response): Promise<any> => {
  try {
    const slug = req.params.slug as string;
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

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

// POST /api/admin/categories
export const createCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, slug, description, imageUrl, imageAlt, parentSlug, sortOrder } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ error: "Title and slug are required" });
    }

    const cleanTitle = stripHtml(title).substring(0, 100);
    const cleanSlug = sanitizeSlug(slug).substring(0, 100);
    const cleanDescription = description ? stripHtml(description).substring(0, 500) : null;
    const cleanImageUrl = imageUrl ? stripHtml(imageUrl).substring(0, 2048) : null;
    const cleanImageAlt = imageAlt ? stripHtml(imageAlt).substring(0, 200) : null;
    const cleanParentSlug = parentSlug ? sanitizeSlug(parentSlug).substring(0, 100) : null;

    if (!cleanTitle || !cleanSlug) {
      return res.status(400).json({ error: "Invalid title or slug after sanitization" });
    }

    // Verify unique slug
    const existing = await prisma.category.findUnique({ where: { slug: cleanSlug } });
    if (existing) {
      return res.status(400).json({ error: "Category slug must be unique" });
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

    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

// PUT /api/admin/categories/:id
export const updateCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const { title, slug, description, imageUrl, imageAlt, parentSlug, sortOrder } = req.body;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Category not found" });
    }

    const cleanTitle = title !== undefined ? stripHtml(title).substring(0, 100) : existing.title;
    const cleanSlug = slug !== undefined ? sanitizeSlug(slug).substring(0, 100) : existing.slug;
    const cleanDescription = description !== undefined ? (description ? stripHtml(description).substring(0, 500) : null) : existing.description;
    const cleanImageUrl = imageUrl !== undefined ? (imageUrl ? stripHtml(imageUrl).substring(0, 2048) : null) : existing.imageUrl;
    const cleanImageAlt = imageAlt !== undefined ? (imageAlt ? stripHtml(imageAlt).substring(0, 200) : null) : existing.imageAlt;
    const cleanParentSlug = parentSlug !== undefined ? (parentSlug ? sanitizeSlug(parentSlug).substring(0, 100) : null) : existing.parentSlug;

    if (slug !== undefined && !cleanSlug) {
      return res.status(400).json({ error: "Invalid slug format" });
    }

    // If slug is changed, verify uniqueness
    if (slug && cleanSlug !== existing.slug) {
      const slugExists = await prisma.category.findUnique({ where: { slug: cleanSlug } });
      if (slugExists) {
        return res.status(400).json({ error: "Category slug must be unique" });
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

    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

// DELETE /api/admin/categories/:id
export const deleteCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { children: true }
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Check if category has children
    if (category.children.length > 0) {
      return res.status(400).json({ 
        error: "Cannot delete category with subcategories. Delete subcategories first." 
      });
    }

    // Check if category is used by pages
    const pageCount = await prisma.coloringPage.count({
      where: {
        OR: [
          { categorySlug: category.slug },
          { subCategorySlug: category.slug }
        ]
      }
    });

    if (pageCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete category. It is referenced by ${pageCount} coloring pages.` 
      });
    }

    await prisma.category.delete({ where: { id } });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};
