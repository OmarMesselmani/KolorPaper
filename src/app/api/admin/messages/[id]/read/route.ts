import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { read } = await req.json();

    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: { read: Boolean(read) }
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Error updating message read status:", error);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}
