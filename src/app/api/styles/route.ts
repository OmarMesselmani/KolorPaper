import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const styles = await prisma.coloringPage.findMany({
      where: { published: true },
      select: { style: true },
      distinct: ['style'],
    });
    const uniqueStyles = styles.map((s: { style: string }) => s.style).filter(Boolean);
    return NextResponse.json(uniqueStyles);
  } catch (error) {
    console.error("Failed to fetch styles:", error);
    return NextResponse.json([], { status: 500 });
  }
}
