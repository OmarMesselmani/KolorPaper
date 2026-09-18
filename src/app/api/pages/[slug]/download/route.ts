import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { detectBot } from "@/lib/botDetection";

const getRealIp = (ip: string | undefined): string => {
  if (!ip) return "unknown";
  return ip.replace(/^::ffff:/, "");
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const ip = getRealIp(req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0].trim() || undefined);
    const userAgent = req.headers.get("user-agent") || undefined;
    const country = req.headers.get("cf-ipcountry") || req.headers.get("x-vercel-ip-country") || "Unknown";

    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const downloadCount = await prisma.pageView.count({
      where: {
        ip,
        action: "download",
        createdAt: { gte: sixHoursAgo }
      }
    });

    if (downloadCount >= 50) {
      const oldestDownload = await prisma.pageView.findFirst({
        where: {
          ip,
          action: "download",
          createdAt: { gte: sixHoursAgo }
        },
        orderBy: { createdAt: 'asc' }
      });

      const nextAvailableTime = oldestDownload ? new Date(oldestDownload.createdAt.getTime() + 6 * 60 * 60 * 1000).toISOString() : null;

      return NextResponse.json({ error: "Rate limit exceeded. You can only download 50 images per 6 hours. Please try again later.", nextAvailableTime }, { status: 429 });
    }

    const page = await prisma.coloringPage.findUnique({ where: { slug } });
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Bot detection logic
    const recentViews = await prisma.pageView.count({
      where: { ip, createdAt: { gte: sixHoursAgo } }
    });
    const botStatus = detectBot(req, recentViews);

    // Only increment download count for likely humans
    let updatedDownloads = page.downloads;
    if (botStatus.classification === "LIKELY HUMAN") {
      const updatedPage = await prisma.coloringPage.update({
        where: { slug },
        data: { downloads: { increment: 1 } }
      });
      updatedDownloads = updatedPage.downloads;
    }

    await prisma.pageView.create({
      data: {
        pageSlug: slug,
        action: "download",
        ip,
        userAgent,
        country,
        asn: botStatus.asn,
        isHosting: botStatus.isHosting,
        cfBotScore: botStatus.cfBotScore,
        classification: botStatus.classification
      }
    });

    return NextResponse.json({ downloads: updatedDownloads });
  } catch (error) {
    console.error("Error recording page download:", error);
    return NextResponse.json({ error: "Failed to record download" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const ip = getRealIp(req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0].trim() || undefined);
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    
    const downloadCount = await prisma.pageView.count({
      where: {
        ip,
        action: "download",
        createdAt: { gte: sixHoursAgo }
      }
    });

    if (downloadCount >= 50) {
      const oldestDownload = await prisma.pageView.findFirst({
        where: {
          ip,
          action: "download",
          createdAt: { gte: sixHoursAgo }
        },
        orderBy: { createdAt: 'asc' }
      });

      const nextAvailableTime = oldestDownload ? new Date(oldestDownload.createdAt.getTime() + 6 * 60 * 60 * 1000).toISOString() : null;

      return NextResponse.json({ limited: true, nextAvailableTime });
    }

    return NextResponse.json({ limited: false });
  } catch (error) {
    console.error("Error checking rate limit:", error);
    return NextResponse.json({ error: "Failed to check limit" }, { status: 500 });
  }
}
