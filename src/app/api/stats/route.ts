import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const totalPages = await prisma.coloringPage.count({ where: { published: true } });
    const totalCategories = await prisma.category.count();
    
    const pageMetrics = await prisma.coloringPage.aggregate({
      where: { published: true },
      _sum: { downloads: true }
    });

    return NextResponse.json({
      totalPages,
      totalCategories,
      totalDownloads: pageMetrics._sum.downloads || 0
    });
  } catch (error) {
    console.error("Error fetching public stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
