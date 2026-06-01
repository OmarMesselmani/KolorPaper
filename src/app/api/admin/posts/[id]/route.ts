import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripHtml, sanitizeSlug } from "@/lib/sanitize";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { title, slug, date, author, category, excerpt, coverImage, content, published } = await req.json();

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const cleanTitle = title !== undefined ? stripHtml(title).substring(0, 150) : existing.title;
    const cleanSlug = slug !== undefined ? sanitizeSlug(slug).substring(0, 100) : existing.slug;
    const cleanDate = date !== undefined ? stripHtml(date).substring(0, 20) : existing.date;
    const cleanAuthor = author !== undefined ? stripHtml(author).substring(0, 50) : existing.author;
    const cleanCategory = category !== undefined ? stripHtml(category).substring(0, 50) : existing.category;
    const cleanExcerpt = excerpt !== undefined ? stripHtml(excerpt).substring(0, 300) : existing.excerpt;
    const cleanCoverImage = coverImage !== undefined ? stripHtml(coverImage).substring(0, 2048) : existing.coverImage;
    const postContent = content !== undefined ? content : existing.content;
    const isPublished = published !== undefined ? Boolean(published) : existing.published;

    if (slug && cleanSlug !== existing.slug) {
      const slugExists = await prisma.blogPost.findUnique({ where: { slug: cleanSlug } });
      if (slugExists) {
        return NextResponse.json({ error: "Post slug must be unique" }, { status: 400 });
      }
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title: cleanTitle,
        slug: cleanSlug,
        date: cleanDate,
        author: cleanAuthor,
        category: cleanCategory,
        excerpt: cleanExcerpt,
        coverImage: cleanCoverImage,
        content: postContent,
        published: isPublished
      }
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
