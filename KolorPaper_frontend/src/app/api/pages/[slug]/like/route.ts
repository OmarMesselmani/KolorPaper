import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
    const body = await req.json();
    const action = body.action; // "like" or "unlike"
    const ip = anonymizeIp(
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      undefined
    );
    const userAgent = req.headers.get("user-agent") || "unknown";
    
    const page = await prisma.coloringPage.findUnique({ where: { slug } });
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const existingLike = await prisma.pageView.findFirst({
      where: {
        pageSlug: slug,
        action: "like",
        ip
      }
    });

    if (action === "unlike") {
      if (existingLike) {
        const newLikes = Math.max(0, page.likes - 1);
        const updatedPage = await prisma.coloringPage.update({
          where: { slug },
          data: { likes: newLikes }
        });

        await prisma.pageView.delete({
          where: { id: existingLike.id }
        });

        return NextResponse.json({ likes: updatedPage.likes, liked: false });
      }
      return NextResponse.json({ likes: page.likes, liked: false });
    } else {
      // action === "like"
      if (!existingLike) {
        const newLikes = page.likes + 1;
        const updatedPage = await prisma.coloringPage.update({
          where: { slug },
          data: { likes: newLikes }
        });

        await prisma.pageView.create({
          data: {
            pageSlug: slug,
            action: "like",
            ip,
            userAgent
          }
        });

        return NextResponse.json({ likes: updatedPage.likes, liked: true });
      }
      return NextResponse.json({ likes: page.likes, liked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "Failed to update like status" }, { status: 500 });
  }
}
