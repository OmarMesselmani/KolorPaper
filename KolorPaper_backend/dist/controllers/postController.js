import { prisma } from "../db.js";
import { stripHtml, sanitizeSlug } from "../utils/sanitize.js";
// Helper function to format a title to a URL-friendly slug
const slugify = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
};
// GET /api/posts
export const getPosts = async (req, res) => {
    try {
        const posts = await prisma.blogPost.findMany({
            where: { published: true },
            orderBy: { date: "desc" }
        });
        res.json(posts);
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};
// GET /api/admin/posts
export const getAdminPosts = async (req, res) => {
    try {
        const posts = await prisma.blogPost.findMany({
            orderBy: { date: "desc" }
        });
        res.json(posts);
    }
    catch (error) {
        console.error("Error fetching admin posts:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};
// GET /api/posts/:slug
export const getPostBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        const post = await prisma.blogPost.findUnique({
            where: { slug }
        });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.json(post);
    }
    catch (error) {
        console.error("Error fetching post by slug:", error);
        res.status(500).json({ error: "Failed to fetch post" });
    }
};
// POST /api/admin/posts
export const createPost = async (req, res) => {
    try {
        const { title, slug: customSlug, date, author, category, excerpt, coverImage, content, published } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }
        // Limit content size to prevent storage abuse (50KB max)
        if (content.length > 50000) {
            return res.status(400).json({ error: "Content is too long. Maximum 50,000 characters allowed." });
        }
        const cleanTitle = stripHtml(title).substring(0, 150);
        const cleanAuthor = author ? stripHtml(author).substring(0, 100) : "KolorPaper Team";
        const cleanCategory = category ? stripHtml(category).substring(0, 100) : "General";
        const cleanExcerpt = excerpt ? stripHtml(excerpt).substring(0, 500) : "";
        const cleanCoverImage = coverImage ? stripHtml(coverImage).substring(0, 2048) : "";
        const cleanDate = date ? stripHtml(date).substring(0, 20) : new Date().toISOString().split("T")[0];
        let slug = customSlug ? sanitizeSlug(customSlug) : slugify(cleanTitle);
        if (!slug) {
            slug = `post-${Date.now()}`;
        }
        slug = slug.substring(0, 150);
        // Verify unique slug
        const existing = await prisma.blogPost.findUnique({ where: { slug } });
        if (existing) {
            return res.status(400).json({ error: "Post slug must be unique" });
        }
        const post = await prisma.blogPost.create({
            data: {
                title: cleanTitle,
                slug,
                date: cleanDate,
                author: cleanAuthor,
                category: cleanCategory,
                excerpt: cleanExcerpt,
                coverImage: cleanCoverImage,
                content,
                published: published !== undefined ? !!published : true
            }
        });
        res.status(201).json(post);
    }
    catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Failed to create post" });
    }
};
// PUT /api/admin/posts/:id
export const updatePost = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, slug: customSlug, date, author, category, excerpt, coverImage, content, published } = req.body;
        const existing = await prisma.blogPost.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: "Post not found" });
        }
        // Limit content size to prevent storage abuse (50KB max)
        if (content !== undefined && content.length > 50000) {
            return res.status(400).json({ error: "Content is too long. Maximum 50,000 characters allowed." });
        }
        const cleanTitle = title !== undefined ? stripHtml(title).substring(0, 150) : existing.title;
        const cleanAuthor = author !== undefined ? stripHtml(author).substring(0, 100) : existing.author;
        const cleanCategory = category !== undefined ? stripHtml(category).substring(0, 100) : existing.category;
        const cleanExcerpt = excerpt !== undefined ? stripHtml(excerpt).substring(0, 500) : existing.excerpt;
        const cleanCoverImage = coverImage !== undefined ? stripHtml(coverImage).substring(0, 2048) : existing.coverImage;
        const cleanDate = date !== undefined ? stripHtml(date).substring(0, 20) : existing.date;
        let slug = existing.slug;
        if (customSlug && customSlug !== existing.slug) {
            slug = sanitizeSlug(customSlug);
            const slugExists = await prisma.blogPost.findUnique({ where: { slug } });
            if (slugExists && slugExists.id !== id) {
                return res.status(400).json({ error: "Post slug must be unique" });
            }
        }
        slug = slug.substring(0, 150);
        const updated = await prisma.blogPost.update({
            where: { id },
            data: {
                title: cleanTitle,
                slug,
                date: cleanDate,
                author: cleanAuthor,
                category: cleanCategory,
                excerpt: cleanExcerpt,
                coverImage: cleanCoverImage,
                content: content !== undefined ? content : existing.content,
                published: published !== undefined ? !!published : existing.published
            }
        });
        res.json(updated);
    }
    catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ error: "Failed to update post" });
    }
};
// DELETE /api/admin/posts/:id
export const deletePost = async (req, res) => {
    try {
        const id = req.params.id;
        const existing = await prisma.blogPost.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: "Post not found" });
        }
        await prisma.blogPost.delete({ where: { id } });
        res.json({ message: "Post deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Failed to delete post" });
    }
};
