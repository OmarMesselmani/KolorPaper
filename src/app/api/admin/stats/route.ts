import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const rangeParam = url.searchParams.get("range") || "7";
    const range = parseInt(rangeParam, 10);
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

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Math.max(range, 7)); // At least 7 days to ensure yesterday is covered

    const recentViews = await prisma.pageView.findMany({
      where: {
        createdAt: { gte: startDate },
        action: { in: ['view', 'download', 'like'] }
      },
      select: { createdAt: true, action: true, ip: true }
    });

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split("T")[0];
    
    let yesterdayViews = 0, yesterdayDownloads = 0, yesterdayLikes = 0;

    const timelineData: Record<string, { views: number; downloads: number; likes: number; ips: Set<string> }> = {};
    
    if (range === 365) {
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        timelineData[monthStr] = { views: 0, downloads: 0, likes: 0, ips: new Set() };
      }
    } else {
      for (let i = range - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        timelineData[dateStr] = { views: 0, downloads: 0, likes: 0, ips: new Set() };
      }
    }

    for (const record of recentViews) {
      const fullDateStr = record.createdAt.toISOString().split("T")[0];
      
      if (fullDateStr === yesterdayStr) {
        if (record.action === "view") yesterdayViews++;
        else if (record.action === "download") yesterdayDownloads++;
        else if (record.action === "like") yesterdayLikes++;
      }

      let bucketKey = fullDateStr;
      if (range === 365) {
        bucketKey = fullDateStr.substring(0, 7);
      }

      if (timelineData[bucketKey]) {
        if (record.action === "view") timelineData[bucketKey].views++;
        else if (record.action === "download") timelineData[bucketKey].downloads++;
        else if (record.action === "like") timelineData[bucketKey].likes++;
        if (record.ip) timelineData[bucketKey].ips.add(record.ip);
      }
    }

    const activityTimeline = Object.entries(timelineData).map(([date, stats]) => ({
      date, 
      views: stats.views,
      downloads: stats.downloads,
      likes: stats.likes,
      visitors: stats.ips.size
    }));

    return NextResponse.json({
      summary: {
        totalPages, totalCategories,
        totalViews: pageMetrics._sum.views || 0,
        totalDownloads: pageMetrics._sum.downloads || 0,
        totalLikes: pageMetrics._sum.likes || 0,
        yesterdayViews,
        yesterdayDownloads,
        yesterdayLikes,
        totalMessages, unreadMessages
      },
      popularPages, recentMessages, activityTimeline
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}
