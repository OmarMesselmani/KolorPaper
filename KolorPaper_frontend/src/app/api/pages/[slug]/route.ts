import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const page = await prisma.coloringPage.findUnique({
      where: { slug },
      include: {
        category: { select: { title: true, slug: true } },
        subCategory: { select: { title: true, slug: true } }
      }
    });

    if (!page) {
      return NextResponse.json({ error: "Coloring page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error fetching coloring page:", error);
    return NextResponse.json({ error: "Failed to fetch coloring page" }, { status: 500 });
  }
}
