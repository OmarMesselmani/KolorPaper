import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ categories: [], tags: [], pages: [] });
    }

    const query = q.trim();

    // 1. Search Categories (limit 3)
    const categories = await prisma.category.findMany({
      where: {
        title: { contains: query }
      },
      select: { title: true, slug: true, parentSlug: true },
      take: 3
    });

    // 2. Search Tags (limit 5)
    const tags = await prisma.tag.findMany({
      where: {
        name: { contains: query }
      },
      select: { name: true },
      take: 5
    });

    // 3. Search Pages
    const pages = await prisma.coloringPage.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query } },
          { tags: { contains: query } }
        ]
      },
      select: { title: true, slug: true, thumbnailUrl: true, tags: true },
      orderBy: { views: 'desc' },
      take: 20
    });

    // Extract tags dynamically from matching pages
    const extractedTags = new Set<string>();
    tags.forEach((t: { name: string }) => extractedTags.add(t.name.toLowerCase()));

    pages.forEach((p: { tags: string | null }) => {
      try {
        const pTags = JSON.parse(p.tags || "[]");
        if (Array.isArray(pTags)) {
          pTags.forEach((t: any) => {
            if (typeof t === 'string' && t.toLowerCase().includes(query)) {
              extractedTags.add(t.toLowerCase());
            }
          });
        }
      } catch (e) {}
    });

    const finalTags = Array.from(extractedTags).slice(0, 5).map(name => ({ name }));
    const finalPages = pages.slice(0, 5).map((p: any) => ({ title: p.title, slug: p.slug, thumbnailUrl: p.thumbnailUrl }));

    return NextResponse.json({
      categories,
      tags: finalTags,
      pages: finalPages
    });
  } catch (error) {
    console.error("Live search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
