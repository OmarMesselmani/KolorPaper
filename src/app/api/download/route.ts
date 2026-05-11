import { NextRequest, NextResponse } from "next/server";
import { generatePdfFromImage } from "@/lib/pdfGenerator";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, title } = await req.json();

    if (!imageUrl || !title) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // تصحيح الرابط إذا كان يبدأ بـ / (صور محلية في public)
    const absoluteUrl = imageUrl.startsWith('/') 
      ? `${req.nextUrl.origin}${imageUrl}` 
      : imageUrl;

    const pdfBlob = await generatePdfFromImage(absoluteUrl, title);

    return new Response(pdfBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(title)}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
