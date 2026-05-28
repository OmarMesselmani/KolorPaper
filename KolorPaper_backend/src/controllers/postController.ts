import { Request, Response } from "express";
import { prisma } from "../db.js";

// Helper function to format a title to a URL-friendly slug
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// GET /api/posts
export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = req.query.admin === "true";
    const where = admin ? {} : { published: true };

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { date: "desc" }
    });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// GET /api/posts/:slug
export const getPostBySlug = async (req: Request, res: Response): Promise<any> => {
  try {
    const slug = req.params.slug as string;
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// POST /api/admin/posts
export const createPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, slug: customSlug, date, author, category, excerpt, coverImage, content, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    let slug = customSlug ? slugify(customSlug) : slugify(title);
    if (!slug) {
      slug = `post-${Date.now()}`;
    }

    // Verify unique slug
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ error: "Post slug must be unique" });
    }

    // Use current date if none provided (e.g. YYYY-MM-DD)
    const postDate = date || new Date().toISOString().split("T")[0];

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        date: postDate,
        author: author || "KolorPaper Team",
        category: category || "General",
        excerpt: excerpt || "",
        coverImage: coverImage || "",
        content,
        published: published !== undefined ? !!published : true
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// PUT /api/admin/posts/:id
export const updatePost = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const { title, slug: customSlug, date, author, category, excerpt, coverImage, content, published } = req.body;

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Post not found" });
    }

    let slug = existing.slug;
    if (customSlug && customSlug !== existing.slug) {
      slug = slugify(customSlug);
      const slugExists = await prisma.blogPost.findUnique({ where: { slug } });
      if (slugExists && slugExists.id !== id) {
        return res.status(400).json({ error: "Post slug must be unique" });
      }
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        slug,
        date: date !== undefined ? date : existing.date,
        author: author !== undefined ? author : existing.author,
        category: category !== undefined ? category : existing.category,
        excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
        coverImage: coverImage !== undefined ? coverImage : existing.coverImage,
        content: content !== undefined ? content : existing.content,
        published: published !== undefined ? !!published : existing.published
      }
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
};

// DELETE /api/admin/posts/:id
export const deletePost = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Post not found" });
    }

    await prisma.blogPost.delete({ where: { id } });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};
