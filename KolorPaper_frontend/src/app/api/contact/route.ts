import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripHtml } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const cleanName = stripHtml(name).substring(0, 100);
    const cleanEmail = stripHtml(email).substring(0, 100);
    const cleanMessage = stripHtml(message).substring(0, 2000);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    await prisma.contactMessage.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        message: cleanMessage
      }
    });

    return NextResponse.json({ success: true, message: "Message sent successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error submitting contact message:", error);
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 });
  }
}
