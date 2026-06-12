import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ isCategory: false });
  }

  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      select: { id: true }
    });
    return NextResponse.json({ isCategory: !!category });
  } catch (error) {
    console.error("Error checking category slug:", error);
    return NextResponse.json({ isCategory: false });
  }
}
