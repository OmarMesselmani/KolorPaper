import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) return NextResponse.json({ error: "No secret" }, { status: 500 });

    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (!payload.email || !payload.hash) {
      return NextResponse.json({ error: "Invalid token structure" }, { status: 401 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email: payload.email as string }
    });

    if (!admin || payload.hash !== admin.passwordHash.substring(0, 12)) {
      return NextResponse.json({ error: "Session invalidated" }, { status: 401 });
    }

    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
