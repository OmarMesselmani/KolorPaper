import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripHtml, sanitizeSlug } from "@/lib/sanitize";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching admin posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, slug, date, author, category, excerpt, coverImage, content, published } = await req.json();

    if (!title || !slug || !date || !content || !coverImage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanTitle = stripHtml(title).substring(0, 150);
    const cleanSlug = sanitizeSlug(slug).substring(0, 100);
    const cleanDate = stripHtml(date).substring(0, 20);
    const cleanAuthor = author ? stripHtml(author).substring(0, 50) : "KolorPaper Team";
    const cleanCategory = category ? stripHtml(category).substring(0, 50) : "Uncategorized";
    const cleanExcerpt = excerpt ? stripHtml(excerpt).substring(0, 300) : "";
    const cleanCoverImage = stripHtml(coverImage).substring(0, 2048);
    const isPublished = published !== undefined ? Boolean(published) : true;

    const existing = await prisma.blogPost.findUnique({ where: { slug: cleanSlug } });
    if (existing) {
      return NextResponse.json({ error: "Post slug must be unique" }, { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: {
        title: cleanTitle,
        slug: cleanSlug,
        date: cleanDate,
        author: cleanAuthor,
        category: cleanCategory,
        excerpt: cleanExcerpt,
        coverImage: cleanCoverImage,
        content: content,
        published: isPublished
      }
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
