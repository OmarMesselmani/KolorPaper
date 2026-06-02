import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripHtml } from "@/lib/sanitize";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Redis initialization moved inside the request handler for Cloudflare compatibility

export async function POST(req: NextRequest) {
  try {
    let ratelimit: Ratelimit | null = null;
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });

      ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(2, "1 h"),
        analytics: true,
      });
    }

    if (ratelimit) {
      // Get the IP address of the client
      const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_contact_${ip}`);

      if (!success) {
        return NextResponse.json(
          { error: "You have reached the maximum number of messages. Please try again in an hour." },
          { 
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            }
          }
        );
      }
    }

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
