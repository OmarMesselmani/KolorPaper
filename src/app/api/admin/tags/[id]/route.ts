import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Middleware handles admin authentication

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, title, description, h2 } = body;

    if (!name) {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 });
    }

    const normalizedName = name.toLowerCase().trim();

    // Check if another tag with the same name exists
    const existing = await prisma.tag.findUnique({
      where: { name: normalizedName },
    });

    if (existing && existing.id !== id) {
      return NextResponse.json({ error: 'Another tag with this name already exists' }, { status: 400 });
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name: normalizedName,
        title: title || null,
        description: description || null,
        h2: h2 || null,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Failed to update tag:', error);
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.tag.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete tag:', error);
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
}
