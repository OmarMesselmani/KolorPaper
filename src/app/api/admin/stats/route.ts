import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const totalPages = await prisma.coloringPage.count();
    const totalCategories = await prisma.category.count();

    const pageMetrics = await prisma.coloringPage.aggregate({
      _sum: { views: true, downloads: true, likes: true }
    });

    const totalMessages = await prisma.contactMessage.count();
    const unreadMessages = await prisma.contactMessage.count({ where: { read: false } });

    const popularPages = await prisma.coloringPage.findMany({
      take: 5,
      orderBy: { views: "desc" },
      select: { id: true, title: true, slug: true, views: true, downloads: true, likes: true, categorySlug: true }
    });

    const recentMessages = await prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: "desc" }
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Using basic aggregation for recent activity to avoid complex raw SQL that might differ across edge/node adapters
    const recentViews = await prisma.pageView.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        action: { in: ['view', 'download'] }
      },
      select: { createdAt: true, action: true }
    });

    const dailyActivity: Record<string, { views: number; downloads: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      dailyActivity[dateStr] = { views: 0, downloads: 0 };
    }

    for (const record of recentViews) {
      const dateStr = record.createdAt.toISOString().split("T")[0];
      if (dailyActivity[dateStr]) {
        if (record.action === "view") dailyActivity[dateStr].views++;
        else if (record.action === "download") dailyActivity[dateStr].downloads++;
      }
    }

    const activityTimeline = Object.entries(dailyActivity).map(([date, stats]) => ({
      date, ...stats
    }));

    return NextResponse.json({
      summary: {
        totalPages, totalCategories,
        totalViews: pageMetrics._sum.views || 0,
        totalDownloads: pageMetrics._sum.downloads || 0,
        totalLikes: pageMetrics._sum.likes || 0,
        totalMessages, unreadMessages
      },
      popularPages, recentMessages, activityTimeline
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}
