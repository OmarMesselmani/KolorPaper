import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const message = await prisma.contactMessage.findUnique({ where: { id } });
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    await prisma.contactMessage.delete({ where: { id } });

    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
