import { prisma } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "kolorpaper-admin-secret-change-in-production";
export const login = async (req, res) => {
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
        const token = jwt.sign({ id: admin.id, email: admin.email, name: admin.name }, JWT_SECRET, { expiresIn: "7d" });
        res.json({
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name
            }
        });
    }
    catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const getStats = async (req, res) => {
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
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentViews = await prisma.pageView.findMany({
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                }
            },
            select: {
                action: true,
                createdAt: true
            }
        });
        // Group activities by date
        const dailyActivity = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split("T")[0];
            dailyActivity[dateStr] = { views: 0, downloads: 0 };
        }
        recentViews.forEach((v) => {
            const dateStr = v.createdAt.toISOString().split("T")[0];
            if (dailyActivity[dateStr]) {
                if (v.action === "view") {
                    dailyActivity[dateStr].views++;
                }
                else if (v.action === "download") {
                    dailyActivity[dateStr].downloads++;
                }
            }
        });
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
    }
    catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ error: "Failed to fetch admin stats" });
    }
};
