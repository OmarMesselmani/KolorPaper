import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const sessionResult = await verifyAdminSession(req);
    
    if (!sessionResult) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { admin } = sessionResult;

    return NextResponse.json({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
