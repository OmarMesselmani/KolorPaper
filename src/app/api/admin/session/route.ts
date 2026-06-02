import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

interface AdminSessionPayload {
  id?: string;
  email?: string;
  name?: string;
}

export async function GET(req: NextRequest) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not defined");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const token = (await cookies()).get("admin_token")?.value;

    if (!token) {
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
