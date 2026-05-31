import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Anonymize IP by removing the last octet for GDPR compliance
const anonymizeIp = (ip: string | undefined): string => {
  if (!ip) return "unknown";
  const cleanIp = ip.replace(/^::ffff:/, "");
  if (cleanIp.includes(":")) {
    const parts = cleanIp.split(":");
    return parts.slice(0, Math.max(parts.length - 2, 2)).join(":") + ":0:0";
  }
  const parts = cleanIp.split(".");
  if (parts.length === 4) {
    return parts.slice(0, 3).join(".") + ".0";
  }
  return "unknown";
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const ip = anonymizeIp(
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      undefined
    );
    const userAgent = req.headers.get("user-agent") || undefined;

    const page = await prisma.coloringPage.findUnique({ where: { slug } });
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const updatedPage = await prisma.coloringPage.update({
      where: { slug },
      data: { views: { increment: 1 } }
    });

    await prisma.pageView.create({
      data: {
        pageSlug: slug,
        action: "view",
        ip,
        userAgent
      }
    });

    return NextResponse.json({ views: updatedPage.views });
  } catch (error) {
    console.error("Error recording page view:", error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
