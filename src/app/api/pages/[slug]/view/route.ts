import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { detectBot } from "@/lib/botDetection";

// No longer anonymizing IP to allow full IP tracking in dashboard
const getRealIp = (ip: string | undefined): string => {
  if (!ip) return "unknown";
  return ip.replace(/^::ffff:/, ""); // Just clean IPv4-mapped IPv6
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const ip = getRealIp(
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      undefined
    );
    const userAgent = req.headers.get("user-agent") || undefined;
    const country = req.headers.get("cf-ipcountry") || req.headers.get("x-vercel-ip-country") || "Unknown";

    const page = await prisma.coloringPage.findUnique({ where: { slug } });
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Check if the user has viewed this page in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingView = await prisma.pageView.findFirst({
      where: {
        pageSlug: slug,
        action: "view",
        ip,
        createdAt: {
          gte: twentyFourHoursAgo
        }
      }
    });

    if (existingView) {
      return NextResponse.json({ views: page.views });
    }

    // Bot detection logic
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const recentViews = await prisma.pageView.count({
      where: { ip, createdAt: { gte: sixHoursAgo } }
    });
    const botStatus = detectBot(req, recentViews);

    // Only increment view count for likely humans
    let updatedViews = page.views;
    if (botStatus.classification === "LIKELY HUMAN") {
      const updatedPage = await prisma.coloringPage.update({
        where: { slug },
        data: { views: { increment: 1 } }
      });
      updatedViews = updatedPage.views;
    }

    await prisma.pageView.create({
      data: {
        pageSlug: slug,
        action: "view",
        ip,
        userAgent,
        country,
        asn: botStatus.asn,
        isHosting: botStatus.isHosting,
        cfBotScore: botStatus.cfBotScore,
        classification: botStatus.classification
      }
    });

    return NextResponse.json({ views: updatedViews });
  } catch (error) {
    console.error("Error recording page view:", error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
