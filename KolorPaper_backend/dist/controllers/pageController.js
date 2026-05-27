import { prisma } from "../db.js";
// GET /api/pages
export const getColoringPages = async (req, res) => {
    try {
        const categorySlug = req.query.categorySlug;
        const difficulty = req.query.difficulty;
        const ageGroup = req.query.ageGroup;
        const search = req.query.search;
        // Pagination params
        const page = parseInt(req.query.page || "1");
        const limit = parseInt(req.query.limit || "20");
        const skip = (page - 1) * limit;
        // Sorting params
        const sortBy = req.query.sortBy || "createdAt"; // createdAt, views, downloads, likes, title
        const order = req.query.order || "desc"; // asc, desc
        const where = { published: true };
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
        const [pages, total] = await prisma.$transaction([
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
        res.json({
            pages,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error("Error fetching coloring pages:", error);
        res.status(500).json({ error: "Failed to fetch coloring pages" });
    }
};
// GET /api/pages/:slug
export const getColoringPageBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        const page = await prisma.coloringPage.findUnique({
            where: { slug },
            include: {
                category: { select: { title: true, slug: true } },
                subCategory: { select: { title: true, slug: true } }
            }
        });
        if (!page) {
            return res.status(404).json({ error: "Coloring page not found" });
        }
        res.json(page);
    }
    catch (error) {
        console.error("Error fetching coloring page:", error);
        res.status(500).json({ error: "Failed to fetch coloring page" });
    }
};
// POST /api/pages/:slug/view
export const recordView = async (req, res) => {
    try {
        const slug = req.params.slug;
        const ip = req.ip;
        const userAgent = req.headers["user-agent"];
        const page = await prisma.coloringPage.findUnique({ where: { slug } });
        if (!page) {
            return res.status(404).json({ error: "Page not found" });
        }
        // Increment view count and record log in transaction
        const [updatedPage] = await prisma.$transaction([
            prisma.coloringPage.update({
                where: { slug },
                data: { views: { increment: 1 } }
            }),
            prisma.pageView.create({
                data: {
                    pageSlug: slug,
                    action: "view",
                    ip,
                    userAgent
                }
            })
        ]);
        res.json({ views: updatedPage.views });
    }
    catch (error) {
        console.error("Error recording page view:", error);
        res.status(500).json({ error: "Failed to record view" });
    }
};
// POST /api/pages/:slug/download
export const recordDownload = async (req, res) => {
    try {
        const slug = req.params.slug;
        const ip = req.ip;
        const userAgent = req.headers["user-agent"];
        const page = await prisma.coloringPage.findUnique({ where: { slug } });
        if (!page) {
            return res.status(404).json({ error: "Page not found" });
        }
        // Increment downloads count and record log in transaction
        const [updatedPage] = await prisma.$transaction([
            prisma.coloringPage.update({
                where: { slug },
                data: { downloads: { increment: 1 } }
            }),
            prisma.pageView.create({
                data: {
                    pageSlug: slug,
                    action: "download",
                    ip,
                    userAgent
                }
            })
        ]);
        res.json({ downloads: updatedPage.downloads });
    }
    catch (error) {
        console.error("Error recording page download:", error);
        res.status(500).json({ error: "Failed to record download" });
    }
};
// POST /api/pages/:slug/like
export const recordLike = async (req, res) => {
    try {
        const slug = req.params.slug;
        const { action } = req.body; // "like" (increment) or "unlike" (decrement)
        const page = await prisma.coloringPage.findUnique({ where: { slug } });
        if (!page) {
            return res.status(404).json({ error: "Page not found" });
        }
        const value = action === "unlike" ? -1 : 1;
        // Ensure likes do not go below 0
        const newLikes = Math.max(0, page.likes + value);
        const updatedPage = await prisma.coloringPage.update({
            where: { slug },
            data: { likes: newLikes }
        });
        res.json({ likes: updatedPage.likes });
    }
    catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ error: "Failed to update like status" });
    }
};
// Admin Endpoints
// POST /api/admin/pages
export const createColoringPage = async (req, res) => {
    try {
        const { title, slug, imageUrl, thumbnailUrl, pdfUrl, categorySlug, subCategorySlug, description, difficulty, ageGroup, published } = req.body;
        if (!title || !slug || !imageUrl || !thumbnailUrl || !categorySlug) {
            return res.status(400).json({
                error: "Title, slug, imageUrl, thumbnailUrl, and categorySlug are required"
            });
        }
        // Verify slug uniqueness
        const existing = await prisma.coloringPage.findUnique({ where: { slug } });
        if (existing) {
            return res.status(400).json({ error: "Page slug must be unique" });
        }
        // Verify category exists
        const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
        if (!category) {
            return res.status(400).json({ error: `Category '${categorySlug}' does not exist` });
        }
        // Verify subcategory exists if provided
        if (subCategorySlug) {
            const subCategory = await prisma.category.findUnique({ where: { slug: subCategorySlug } });
            if (!subCategory) {
                return res.status(400).json({ error: `Subcategory '${subCategorySlug}' does not exist` });
            }
        }
        const page = await prisma.coloringPage.create({
            data: {
                title,
                slug,
                imageUrl,
                thumbnailUrl,
                pdfUrl: pdfUrl || null,
                categorySlug,
                subCategorySlug: subCategorySlug || null,
                description,
                difficulty,
                ageGroup,
                published: published !== undefined ? published : true
            }
        });
        res.status(201).json(page);
    }
    catch (error) {
        console.error("Error creating page:", error);
        res.status(500).json({ error: "Failed to create page" });
    }
};
// PUT /api/admin/pages/:id
export const updateColoringPage = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, slug, imageUrl, thumbnailUrl, pdfUrl, categorySlug, subCategorySlug, description, difficulty, ageGroup, published } = req.body;
        const existing = await prisma.coloringPage.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: "Coloring page not found" });
        }
        // Validate unique slug
        if (slug && slug !== existing.slug) {
            const slugExists = await prisma.coloringPage.findUnique({ where: { slug } });
            if (slugExists) {
                return res.status(400).json({ error: "Page slug must be unique" });
            }
        }
        // Validate category exists if changed
        if (categorySlug && categorySlug !== existing.categorySlug) {
            const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
            if (!category) {
                return res.status(400).json({ error: `Category '${categorySlug}' does not exist` });
            }
        }
        // Validate subcategory exists if changed
        if (subCategorySlug && subCategorySlug !== existing.subCategorySlug) {
            const subCategory = await prisma.category.findUnique({ where: { slug: subCategorySlug } });
            if (!subCategory) {
                return res.status(400).json({ error: `Subcategory '${subCategorySlug}' does not exist` });
            }
        }
        const updatedPage = await prisma.coloringPage.update({
            where: { id },
            data: {
                title: title !== undefined ? title : existing.title,
                slug: slug !== undefined ? slug : existing.slug,
                imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
                thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : existing.thumbnailUrl,
                pdfUrl: pdfUrl !== undefined ? (pdfUrl || null) : existing.pdfUrl,
                categorySlug: categorySlug !== undefined ? categorySlug : existing.categorySlug,
                subCategorySlug: subCategorySlug !== undefined ? (subCategorySlug || null) : existing.subCategorySlug,
                description: description !== undefined ? description : existing.description,
                difficulty: difficulty !== undefined ? difficulty : existing.difficulty,
                ageGroup: ageGroup !== undefined ? ageGroup : existing.ageGroup,
                published: published !== undefined ? published : existing.published
            }
        });
        res.json(updatedPage);
    }
    catch (error) {
        console.error("Error updating page:", error);
        res.status(500).json({ error: "Failed to update page" });
    }
};
// DELETE /api/admin/pages/:id
export const deleteColoringPage = async (req, res) => {
    try {
        const id = req.params.id;
        const page = await prisma.coloringPage.findUnique({ where: { id } });
        if (!page) {
            return res.status(404).json({ error: "Coloring page not found" });
        }
        // First delete page views to prevent foreign key issues
        await prisma.pageView.deleteMany({
            where: { pageSlug: page.slug }
        });
        await prisma.coloringPage.delete({ where: { id } });
        res.json({ message: "Coloring page deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting page:", error);
        res.status(500).json({ error: "Failed to delete page" });
    }
};
