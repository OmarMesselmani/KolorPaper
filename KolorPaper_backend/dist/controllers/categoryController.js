import { prisma } from "../db.js";
// GET /api/categories
export const getCategories = async (req, res) => {
    try {
        const parentSlug = req.query.parentSlug;
        let categories;
        if (parentSlug === "null" || parentSlug === "") {
            categories = await prisma.category.findMany({
                where: { parentSlug: null },
                orderBy: { sortOrder: "asc" }
            });
        }
        else if (parentSlug) {
            categories = await prisma.category.findMany({
                where: { parentSlug },
                orderBy: { sortOrder: "asc" }
            });
        }
        else {
            categories = await prisma.category.findMany({
                orderBy: { sortOrder: "asc" }
            });
        }
        res.json(categories);
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
};
// GET /api/categories/:slug
export const getCategoryBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                children: {
                    orderBy: { sortOrder: "asc" }
                }
            }
        });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(category);
    }
    catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ error: "Failed to fetch category" });
    }
};
// POST /api/admin/categories
export const createCategory = async (req, res) => {
    try {
        const { title, slug, description, imageUrl, parentSlug, sortOrder } = req.body;
        if (!title || !slug) {
            return res.status(400).json({ error: "Title and slug are required" });
        }
        // Verify unique slug
        const existing = await prisma.category.findUnique({ where: { slug } });
        if (existing) {
            return res.status(400).json({ error: "Category slug must be unique" });
        }
        const category = await prisma.category.create({
            data: {
                title,
                slug,
                description,
                imageUrl,
                parentSlug: parentSlug || null,
                sortOrder: sortOrder ? parseInt(sortOrder) : 0
            }
        });
        res.status(201).json(category);
    }
    catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Failed to create category" });
    }
};
// PUT /api/admin/categories/:id
export const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, slug, description, imageUrl, parentSlug, sortOrder } = req.body;
        const existing = await prisma.category.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: "Category not found" });
        }
        // If slug is changed, verify uniqueness
        if (slug && slug !== existing.slug) {
            const slugExists = await prisma.category.findUnique({ where: { slug } });
            if (slugExists) {
                return res.status(400).json({ error: "Category slug must be unique" });
            }
        }
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: {
                title: title !== undefined ? title : existing.title,
                slug: slug !== undefined ? slug : existing.slug,
                description: description !== undefined ? description : existing.description,
                imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
                parentSlug: parentSlug !== undefined ? (parentSlug || null) : existing.parentSlug,
                sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : existing.sortOrder
            }
        });
        res.json(updatedCategory);
    }
    catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Failed to update category" });
    }
};
// DELETE /api/admin/categories/:id
export const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
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
    }
    catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Failed to delete category" });
    }
};
