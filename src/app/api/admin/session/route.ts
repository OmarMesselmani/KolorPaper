import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

interface AdminSessionPayload {
  id?: string;
  email?: string;
  name?: string;
}

export async function GET() {
  try {
    const token = (await cookies()).get("admin_token")?.value;

    if (!token || !JWT_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const session = payload as AdminSessionPayload;

    if (!session.id || !session.email || !session.name) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      admin: {
        id: session.id,
        email: session.email,
        name: session.name,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
