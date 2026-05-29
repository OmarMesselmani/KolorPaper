import { Router } from "express";
import { authenticateAdmin } from "../middleware/auth.js";
import { login, getStats, uploadFile } from "../controllers/adminController.js";
import { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { getColoringPages, getColoringPageBySlug, recordView, recordDownload, recordLike, createColoringPage, updateColoringPage, deleteColoringPage } from "../controllers/pageController.js";
import { submitMessage, getMessages, markAsRead, deleteMessage } from "../controllers/contactController.js";
import { getPosts, getPostBySlug, getAdminPosts, createPost, updatePost, deletePost } from "../controllers/postController.js";
const router = Router();
// ==========================================
// Public Endpoints
// ==========================================
import rateLimit from "express-rate-limit";
// Rate limiters for specific operations
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per 15 minutes
    message: { error: "Too many login attempts. Please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 contact messages per hour
    message: { error: "Too many messages sent. Please try again in an hour." },
    standardHeaders: true,
    legacyHeaders: false,
});
const interactionLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // 30 page interactions (likes, downloads, views) per minute
    message: { error: "Too many page interactions. Please slow down." },
    standardHeaders: true,
    legacyHeaders: false,
});
// Categories
router.get("/categories", getCategories);
router.get("/categories/:slug", getCategoryBySlug);
// Coloring Pages
router.get("/pages", getColoringPages);
router.get("/pages/:slug", getColoringPageBySlug);
router.post("/pages/:slug/view", interactionLimiter, recordView);
router.post("/pages/:slug/download", interactionLimiter, recordDownload);
router.post("/pages/:slug/like", interactionLimiter, recordLike);
// Public Stats
import { getPublicStats } from "../controllers/pageController.js";
router.get("/stats", getPublicStats);
// Contact Submission
router.post("/contact", contactLimiter, submitMessage);
// Blog Posts
router.get("/posts", getPosts);
router.get("/posts/:slug", getPostBySlug);
// ==========================================
// Admin Endpoints
// ==========================================
// Public admin login
router.post("/admin/login", loginLimiter, login);
// Protected admin endpoints (Requires authenticateAdmin middleware)
router.get("/admin/stats", authenticateAdmin, getStats);
router.post("/admin/upload", authenticateAdmin, uploadFile);
// Protected Categories CRUD
router.post("/admin/categories", authenticateAdmin, createCategory);
router.put("/admin/categories/:id", authenticateAdmin, updateCategory);
router.delete("/admin/categories/:id", authenticateAdmin, deleteCategory);
// Protected Coloring Pages CRUD
router.post("/admin/pages", authenticateAdmin, createColoringPage);
router.put("/admin/pages/:id", authenticateAdmin, updateColoringPage);
router.delete("/admin/pages/:id", authenticateAdmin, deleteColoringPage);
// Protected Contact Messages
router.get("/admin/messages", authenticateAdmin, getMessages);
router.put("/admin/messages/:id/read", authenticateAdmin, markAsRead);
router.delete("/admin/messages/:id", authenticateAdmin, deleteMessage);
// Protected Blog Posts CRUD
router.get("/admin/posts", authenticateAdmin, getAdminPosts);
router.post("/admin/posts", authenticateAdmin, createPost);
router.put("/admin/posts/:id", authenticateAdmin, updatePost);
router.delete("/admin/posts/:id", authenticateAdmin, deletePost);
export default router;
