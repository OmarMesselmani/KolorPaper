import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

function verifyMagicBytes(buffer: Uint8Array): string | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return 'image/png';
  }

  // GIF: GIF8 (47 49 46 38)
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
    return 'image/gif';
  }

  // WEBP: RIFF....WEBP
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
    return 'image/webp';
  }

  // PDF: %PDF (25 50 44 46)
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return 'application/pdf';
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const R2_ENDPOINT = process.env.R2_ENDPOINT || "";
    const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
    const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
    const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "";
    const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

    if (!R2_ENDPOINT || !R2_BUCKET_NAME) {
      return NextResponse.json({ error: "R2 Storage is not configured" }, { status: 500 });
    }

    const s3Client = new S3Client({
      region: "auto",
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });

    const { fileName, fileType, base64Data, thumbBase64Data } = await req.json();

    if (!fileName || !base64Data) {
      return NextResponse.json({ error: "fileName and base64Data are required" }, { status: 400 });
    }

    const base64Image = base64Data.split(";base64,").pop();
    if (!base64Image) {
      return NextResponse.json({ error: "Invalid base64 data format" }, { status: 400 });
    }

    // Decoding base64 to Uint8Array for Edge compatibility
    const binaryString = atob(base64Image);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const buffer = bytes;

    const isImage = fileType !== "pdf";
    const targetDir = isImage ? "images" : "pdf";

    // Basic filename parsing for edge (no path module)
    const cleanFileName = fileName.split('/').pop()?.split('\\').pop() || "upload";
    const ext = cleanFileName.includes('.') ? `.${cleanFileName.split('.').pop()?.toLowerCase()}` : "";

    const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const allowedPdfExtensions = [".pdf"];
    const allowed = fileType === "pdf" ? allowedPdfExtensions : allowedImageExtensions;

    if (!allowed.includes(ext)) {
      return NextResponse.json({ error: `Invalid file extension. Allowed: ${allowed.join(", ")}` }, { status: 400 });
    }

    // Verify magic bytes (actual file content)
    const detectedMimeType = verifyMagicBytes(buffer);
    if (!detectedMimeType) {
      return NextResponse.json({ error: "Invalid or corrupted file content. Magic bytes verification failed." }, { status: 400 });
    }

    // Ensure the detected content matches the expected fileType category
    if (fileType === "pdf" && detectedMimeType !== "application/pdf") {
      return NextResponse.json({ error: "File content does not match a valid PDF format." }, { status: 400 });
    }
    if (fileType !== "pdf" && !detectedMimeType.startsWith("image/")) {
      return NextResponse.json({ error: "File content does not match a valid image format." }, { status: 400 });
    }

    const maxSize = fileType === "pdf" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (buffer.length > maxSize) {
      return NextResponse.json({ error: `File size exceeds the limit of ${maxSize / (1024 * 1024)}MB` }, { status: 400 });
    }

    const nameWithoutExt = cleanFileName.replace(ext, "")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const safeFileName = `${nameWithoutExt}-${uniqueSuffix}${ext}`;
    
    const s3Key = `uploads/${targetDir}/${safeFileName}`;

    let contentType = "application/octet-stream";
    if (ext === ".pdf") contentType = "application/pdf";
    else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".gif") contentType = "image/gif";

    await s3Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: contentType,
    }));

    // Generate public URL based on the R2 Public URL endpoint
    const absoluteUrl = `${R2_PUBLIC_URL.replace(/\/$/, '')}/${s3Key}`;

    if (isImage) {
      let thumbnailUrl = absoluteUrl;

      // If a pre-compressed thumbnail was sent from the client
      if (thumbBase64Data) {
        const thumbBase64Image = thumbBase64Data.split(";base64,").pop();
        if (thumbBase64Image) {
          const tBinaryString = atob(thumbBase64Image);
          const tBytes = new Uint8Array(tBinaryString.length);
          for (let i = 0; i < tBinaryString.length; i++) {
              tBytes[i] = tBinaryString.charCodeAt(i);
          }
          const tBuffer = tBytes;

          const tDetectedMimeType = verifyMagicBytes(tBuffer);
          if (!tDetectedMimeType || !tDetectedMimeType.startsWith("image/")) {
            return NextResponse.json({ error: "Invalid thumbnail content." }, { status: 400 });
          }
          
          const tS3Key = `uploads/thumbnails/thumb-${safeFileName}`;
          
          await s3Client.send(new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: tS3Key,
            Body: tBuffer,
            ContentType: contentType, // Usually same as original or webp
          }));
          
          thumbnailUrl = `${R2_PUBLIC_URL.replace(/\/$/, '')}/${tS3Key}`;
        }
      } else {
        // Fallback: Cloudflare Image Resizing URL if no thumb sent
        const protocol = req.headers.get("x-forwarded-proto") || "https";
        const host = req.headers.get("host") || "";
        if (host) {
          thumbnailUrl = `${protocol}://${host}/cdn-cgi/image/width=400,quality=75/${s3Key}`;
        }
      }

      return NextResponse.json({ url: absoluteUrl, thumbnailUrl });
    }

    return NextResponse.json({ url: absoluteUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file due to an internal error." }, { status: 500 });
  }
}

