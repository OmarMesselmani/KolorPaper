import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      take: 8,
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
      select: { createdAt: true, action: true, ip: true, userAgent: true }
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

    let phoneCount = 0;
    let computerCount = 0;
    let otherCount = 0;

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

      // Device Classification
      const ua = (record.userAgent || "").toLowerCase();
      if (!ua) {
        otherCount++;
      } else if (
        ua.includes("googlebot") || ua.includes("bingbot") || ua.includes("yandexbot") ||
        ua.includes("baiduspider") || ua.includes("bot") || ua.includes("python") ||
        ua.includes("curl") || ua.includes("wget")
      ) {
        otherCount++;
      } else if (ua.includes("mobi") || ua.includes("iphone") || ua.includes("ipod") || ua.includes("windows phone") || ua.includes("blackberry")) {
        phoneCount++;
      } else if (ua.includes("windows") || ua.includes("macintosh") || ua.includes("linux") || ua.includes("cros")) {
        if ((ua.includes("android") && !ua.includes("mobi")) || ua.includes("ipad")) {
          otherCount++;
        } else {
          computerCount++;
        }
      } else {
        otherCount++;
      }
    }

    const totalDeviceCount = phoneCount + computerCount + otherCount;
    const deviceStats = {
      phone: phoneCount,
      computer: computerCount,
      other: otherCount,
      total: totalDeviceCount,
      phonePercent: totalDeviceCount > 0 ? Math.round((phoneCount / totalDeviceCount) * 100) : 0,
      computerPercent: totalDeviceCount > 0 ? Math.round((computerCount / totalDeviceCount) * 100) : 0,
      otherPercent: totalDeviceCount > 0 ? Math.round((otherCount / totalDeviceCount) * 100) : 0,
    };

    const countryRangeParam = url.searchParams.get("countryRange") || rangeParam;
    const countryRange = parseInt(countryRangeParam, 10);
    const countryStartDate = new Date();
    countryStartDate.setDate(countryStartDate.getDate() - Math.max(countryRange, 1));

    const countryViews = await prisma.pageView.findMany({
      where: {
        createdAt: { gte: countryStartDate },
      },
      select: { country: true, ip: true }
    });

    const countryIPs: Record<string, Set<string>> = {};

    for (const record of countryViews) {
      const country = record.country || "Unknown";
      if (!countryIPs[country]) {
        countryIPs[country] = new Set();
      }
      if (record.ip) {
        countryIPs[country].add(record.ip);
      }
    }

    let totalUniqueVisitors = 0;
    const countryStatsList = Object.entries(countryIPs).map(([code, ipSet]) => {
      const count = ipSet.size;
      totalUniqueVisitors += count;
      return { code, count };
    });

    const topCountries = countryStatsList
      .map(item => ({
        code: item.code,
        count: item.count,
        percent: totalUniqueVisitors > 0 ? Math.round((item.count / totalUniqueVisitors) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

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
      popularPages, recentMessages, activityTimeline, deviceStats, topCountries
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}
