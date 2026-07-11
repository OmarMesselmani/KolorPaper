import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "100", 10);
    
    // We want to fetch recent page views and group them by IP
    // Since Prisma doesn't easily support fetching the latest User-Agent per grouped IP natively without complex aggregations,
    // we'll fetch the raw records for the last N days and aggregate in memory for better bot heuristics.
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days
    
    const pageViews = await prisma.pageView.findMany({
      where: {
        createdAt: { gte: startDate },
        ip: { not: null }
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        ip: true,
        action: true,
        userAgent: true,
        country: true,
        createdAt: true
      }
    });

    const visitorsMap = new Map<string, {
      ip: string;
      userAgent: string;
      country: string;
      views: number;
      downloads: number;
      likes: number;
      lastActive: Date;
      status: 'Real User' | 'Suspicious' | 'Bot';
    }>();

    for (const pv of pageViews) {
      if (!pv.ip) continue;
      
      const ip = pv.ip;
      if (!visitorsMap.has(ip)) {
        visitorsMap.set(ip, {
          ip,
          userAgent: pv.userAgent || 'Unknown',
          country: pv.country || 'Unknown',
          views: 0,
          downloads: 0,
          likes: 0,
          lastActive: pv.createdAt,
          status: 'Real User'
        });
      }
      
      const visitor = visitorsMap.get(ip)!;
      if (pv.action === 'view') visitor.views++;
      else if (pv.action === 'download') visitor.downloads++;
      else if (pv.action === 'like') visitor.likes++;
    }

    // Bot detection heuristics
    const botUserAgents = ['bot', 'crawler', 'spider', 'curl', 'wget', 'python', 'postman', 'httpclient', 'headless', 'puppeteer'];
    
    const visitors = Array.from(visitorsMap.values()).map(visitor => {
      const uaLower = visitor.userAgent.toLowerCase();
      let isBotUa = botUserAgents.some(botWord => uaLower.includes(botWord));
      
      let status: 'Real User' | 'Suspicious' | 'Bot' = 'Real User';
      
      if (isBotUa) {
        status = 'Bot';
      } else if (visitor.downloads > 50 && visitor.views < 5) {
        status = 'Suspicious'; // High download to view ratio
      } else if ((visitor.views + visitor.downloads) > 500) {
        status = 'Suspicious'; // Exceptionally high volume
      }
      
      return { ...visitor, status };
    });

    // Sort by last active desc
    visitors.sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime());

    return NextResponse.json({
      visitors: visitors.slice(0, limit)
    });
  } catch (error) {
    console.error("Error fetching visitors:", error);
    return NextResponse.json({ error: "Failed to fetch visitors" }, { status: 500 });
  }
}
