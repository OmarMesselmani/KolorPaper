import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Middleware handles admin authentication

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10") || 10);
    const skip = (page - 1) * limit;

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.tag.count(),
    ]);

    return NextResponse.json({
      tags,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, title, description, h2, imageUrl } = body;

    if (!name) {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 });
    }

    const normalizedName = name.toLowerCase().trim();

    // Check if tag already exists
    const existing = await prisma.tag.findUnique({
      where: { name: normalizedName },
    });

    if (existing) {
      return NextResponse.json({ error: 'Tag already exists' }, { status: 400 });
    }

    const tag = await prisma.tag.create({
      data: {
        name: normalizedName,
        title: title || null,
        description: description || null,
        h2: h2 || null,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Failed to create tag:', error);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}
