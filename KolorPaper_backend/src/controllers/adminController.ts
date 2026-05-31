import { Request, Response } from "express";
import { prisma } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.JWT_SECRET) {
  console.error("❌ CRITICAL: JWT_SECRET environment variable is not defined!");
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email }
    });

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Core Counts
    const totalPages = await prisma.coloringPage.count();
    const totalCategories = await prisma.category.count();

    // 2. Aggregate metrics from ColoringPage table
    const pageMetrics = await prisma.coloringPage.aggregate({
      _sum: {
        views: true,
        downloads: true,
        likes: true
      }
    });

    // 3. Contact Messages Counts
    const totalMessages = await prisma.contactMessage.count();
    const unreadMessages = await prisma.contactMessage.count({
      where: { read: false }
    });

    // 4. Top 5 popular coloring pages
    const popularPages = await prisma.coloringPage.findMany({
      take: 5,
      orderBy: { views: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        downloads: true,
        likes: true,
        categorySlug: true
      }
    });

    // 5. Recent 5 contact messages
    const recentMessages = await prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: "desc" }
    });

    // 6. Basic analytics for recent activity (last 7 days page views/downloads)
    // Uses database-level aggregation to handle millions of rows efficiently
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dbActivity = await prisma.$queryRaw<
      { activity_date: string; action: string; count: bigint }[]
    >`
      SELECT
        TO_CHAR("createdAt", 'YYYY-MM-DD') AS activity_date,
        "action",
        COUNT(*) AS count
      FROM "PageView"
      WHERE "createdAt" >= ${sevenDaysAgo}
        AND "action" IN ('view', 'download')
      GROUP BY activity_date, "action"
      ORDER BY activity_date ASC
    `;

    // Initialize all 7 days with zeroes
    const dailyActivity: Record<string, { views: number; downloads: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      dailyActivity[dateStr] = { views: 0, downloads: 0 };
    }

    // Merge database results into the daily map
    for (const row of dbActivity) {
      const dateStr = row.activity_date;
      if (dailyActivity[dateStr]) {
        const count = Number(row.count);
        if (row.action === "view") {
          dailyActivity[dateStr].views = count;
        } else if (row.action === "download") {
          dailyActivity[dateStr].downloads = count;
        }
      }
    }

    const activityTimeline = Object.entries(dailyActivity).map(([date, stats]) => ({
      date,
      ...stats
    }));

    res.json({
      summary: {
        totalPages,
        totalCategories,
        totalViews: pageMetrics._sum.views || 0,
        totalDownloads: pageMetrics._sum.downloads || 0,
        totalLikes: pageMetrics._sum.likes || 0,
        totalMessages,
        unreadMessages
      },
      popularPages,
      recentMessages,
      activityTimeline
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
};

export const uploadFile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { fileName, fileType, base64Data } = req.body;

    if (!fileName || !base64Data) {
      return res.status(400).json({ error: "fileName and base64Data are required" });
    }

    // Clean base64 string
    const base64Image = base64Data.split(";base64,").pop();
    if (!base64Image) {
      return res.status(400).json({ error: "Invalid base64 data format" });
    }

    // Convert base64 to buffer to validate magic bytes and size
    const buffer = Buffer.from(base64Image, "base64");

    // Determine target directory inside backend
    const isImage = fileType !== "pdf";
    const targetDir = isImage ? "images" : "pdf";
    const uploadPath = path.resolve(__dirname, `../../uploads/${targetDir}`);

    // Clean and sanitize filename to prevent path traversal and shell injection
    const cleanFileName = path.basename(fileName);
    const ext = path.extname(cleanFileName).toLowerCase();

    // Define allowed extensions
    const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const allowedPdfExtensions = [".pdf"];
    const allowed = fileType === "pdf" ? allowedPdfExtensions : allowedImageExtensions;

    if (!allowed.includes(ext)) {
      return res.status(400).json({ error: `Invalid file extension. Allowed: ${allowed.join(", ")}` });
    }

    // File size validation (5MB for images, 10MB for pdfs)
    const maxSize = fileType === "pdf" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (buffer.length > maxSize) {
      return res.status(400).json({ error: `File size exceeds the limit of ${maxSize / (1024 * 1024)}MB` });
    }

    // Validate Magic Bytes to verify actual file content matches the extension
    const magic = buffer.subarray(0, 4).toString("hex").toUpperCase();
    let isValidMagic = false;

    if (ext === ".png" && magic === "89504E47") {
      isValidMagic = true;
    } else if ((ext === ".jpg" || ext === ".jpeg") && magic.startsWith("FFD8FF")) {
      isValidMagic = true;
    } else if (ext === ".gif" && magic.startsWith("474946")) {
      isValidMagic = true;
    } else if (ext === ".pdf" && magic === "25504446") {
      isValidMagic = true;
    } else if (ext === ".webp" && magic.startsWith("52494646")) { // RIFF
      const riffType = buffer.subarray(8, 12).toString("utf8");
      if (riffType === "WEBP") {
        isValidMagic = true;
      }
    }

    if (!isValidMagic) {
      return res.status(400).json({ error: "File content does not match the file extension." });
    }

    // Generate a safe unique name
    const nameWithoutExt = path.basename(cleanFileName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const safeFileName = `${nameWithoutExt}-${uniqueSuffix}${ext}`;

    // Ensure upload directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Write original file to disk
    const filePath = path.join(uploadPath, safeFileName);
    fs.writeFileSync(filePath, buffer);

    // Build absolute URL for the original file
    const protocol = req.protocol || "http";
    const host = req.get("host") || "localhost:5000";
    const absoluteUrl = `${protocol}://${host}/uploads/${targetDir}/${safeFileName}`;

    // --- Auto-generate WebP Thumbnail for images ---
    if (isImage) {
      try {
        const thumbDir = path.resolve(__dirname, "../../uploads/thumbnails");
        if (!fs.existsSync(thumbDir)) {
          fs.mkdirSync(thumbDir, { recursive: true });
        }

        const thumbFileName = `thumb-${nameWithoutExt}-${uniqueSuffix}.webp`;
        const thumbPath = path.join(thumbDir, thumbFileName);

        await sharp(buffer)
          .resize(400, 530, {
            fit: "inside",          // preserve aspect ratio, no cropping
            withoutEnlargement: true // don't upscale small images
          })
          .webp({ quality: 75 })
          .toFile(thumbPath);

        const thumbnailUrl = `${protocol}://${host}/uploads/thumbnails/${thumbFileName}`;

        return res.json({ url: absoluteUrl, thumbnailUrl });
      } catch (sharpErr) {
        // Thumbnail generation failed — still return the original upload URL
        console.error("Sharp thumbnail error:", sharpErr);
        return res.json({ url: absoluteUrl, thumbnailUrl: absoluteUrl });
      }
    }

    return res.json({ url: absoluteUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Failed to upload file due to an internal error." });
  }
};

