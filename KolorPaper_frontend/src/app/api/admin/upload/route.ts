import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType, base64Data } = await req.json();

    if (!fileName || !base64Data) {
      return NextResponse.json({ error: "fileName and base64Data are required" }, { status: 400 });
    }

    const base64Image = base64Data.split(";base64,").pop();
    if (!base64Image) {
      return NextResponse.json({ error: "Invalid base64 data format" }, { status: 400 });
    }

    const buffer = Buffer.from(base64Image, "base64");

    const isImage = fileType !== "pdf";
    const targetDir = isImage ? "images" : "pdf";
    const uploadPath = path.join(process.cwd(), `public/uploads/${targetDir}`);

    const cleanFileName = path.basename(fileName);
    const ext = path.extname(cleanFileName).toLowerCase();

    const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const allowedPdfExtensions = [".pdf"];
    const allowed = fileType === "pdf" ? allowedPdfExtensions : allowedImageExtensions;

    if (!allowed.includes(ext)) {
      return NextResponse.json({ error: `Invalid file extension. Allowed: ${allowed.join(", ")}` }, { status: 400 });
    }

    const maxSize = fileType === "pdf" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (buffer.length > maxSize) {
      return NextResponse.json({ error: `File size exceeds the limit of ${maxSize / (1024 * 1024)}MB` }, { status: 400 });
    }

    // Very basic magic bytes validation (simplification for Next.js app)
    const magic = buffer.subarray(0, 4).toString("hex").toUpperCase();
    let isValidMagic = false;
    if (ext === ".png" && magic === "89504E47") isValidMagic = true;
    else if ((ext === ".jpg" || ext === ".jpeg") && magic.startsWith("FFD8FF")) isValidMagic = true;
    else if (ext === ".gif" && magic.startsWith("474946")) isValidMagic = true;
    else if (ext === ".pdf" && magic === "25504446") isValidMagic = true;
    else if (ext === ".webp" && magic.startsWith("52494646")) isValidMagic = true;

    if (!isValidMagic) {
      return NextResponse.json({ error: "File content does not match the file extension." }, { status: 400 });
    }

    const nameWithoutExt = path.basename(cleanFileName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const safeFileName = `${nameWithoutExt}-${uniqueSuffix}${ext}`;

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const filePath = path.join(uploadPath, safeFileName);
    fs.writeFileSync(filePath, buffer);

    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host") || "localhost:3000";
    // NOTE: Serving from /uploads because it's inside public/
    const absoluteUrl = `${protocol}://${host}/uploads/${targetDir}/${safeFileName}`;

    if (isImage) {
      try {
        const thumbDir = path.join(process.cwd(), "public/uploads/thumbnails");
        if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

        const thumbFileName = `thumb-${nameWithoutExt}-${uniqueSuffix}.webp`;
        const thumbPath = path.join(thumbDir, thumbFileName);

        await sharp(buffer)
          .resize(400, 530, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 75 })
          .toFile(thumbPath);

        const thumbnailUrl = `${protocol}://${host}/uploads/thumbnails/${thumbFileName}`;

        return NextResponse.json({ url: absoluteUrl, thumbnailUrl });
      } catch (sharpErr) {
        console.error("Sharp thumbnail error:", sharpErr);
        return NextResponse.json({ url: absoluteUrl, thumbnailUrl: absoluteUrl });
      }
    }

    return NextResponse.json({ url: absoluteUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file due to an internal error." }, { status: 500 });
  }
}
