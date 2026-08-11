import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "./db";
import { cookies } from "next/headers";

export async function verifyAdminSession(req: NextRequest) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) return null;

    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!token) return null;

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (!payload.email || !payload.hash) return null;

    const admin = await prisma.adminUser.findUnique({
      where: { email: payload.email as string }
    });

    if (!admin || payload.hash !== admin.passwordHash.substring(0, 12)) {
      return null;
    }

    return { admin, token };
  } catch {
    return null;
  }
}
