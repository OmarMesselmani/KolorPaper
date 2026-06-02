import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Configurations moved inside handler for Edge compatibility

export async function POST(req: NextRequest) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not defined");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    let ratelimit: Ratelimit | null = null;
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });

      ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(5, "24 h"),
        analytics: true,
      });
    }

    if (ratelimit) {
      // Get the IP address of the client
      const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_login_${ip}`);

      if (!success) {
        return NextResponse.json(
          { error: "Too many login attempts. Please try again in 24 hours." },
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

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email }
    });

    if (!admin) {
      // Artificial delay (Throttling) to slow down brute-force
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      // Artificial delay (Throttling) to slow down brute-force
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ id: admin.id, email: admin.email, name: admin.name })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return NextResponse.json({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
