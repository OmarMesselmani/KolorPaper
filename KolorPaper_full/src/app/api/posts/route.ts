import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "0");
    
    let posts;
    if (limit > 0) {
      posts = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: limit
      });
    } else {
      posts = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" }
      });
    }
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}
