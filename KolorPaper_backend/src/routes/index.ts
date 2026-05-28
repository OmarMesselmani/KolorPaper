import { Router } from "express";
import { authenticateAdmin } from "../middleware/auth.js";
import { 
  login, 
  getStats,
  uploadFile
} from "../controllers/adminController.js";
import { 
  getCategories, 
  getCategoryBySlug, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../controllers/categoryController.js";
import { 
  getColoringPages, 
  getColoringPageBySlug, 
  recordView, 
  recordDownload, 
  recordLike, 
  createColoringPage, 
  updateColoringPage, 
  deleteColoringPage 
} from "../controllers/pageController.js";
import { 
  submitMessage, 
  getMessages, 
  markAsRead, 
  deleteMessage 
} from "../controllers/contactController.js";
import {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost
} from "../controllers/postController.js";

const router = Router();

// ==========================================
// Public Endpoints
// ==========================================

// Categories
router.get("/categories", getCategories);
router.get("/categories/:slug", getCategoryBySlug);

// Coloring Pages
router.get("/pages", getColoringPages);
router.get("/pages/:slug", getColoringPageBySlug);
router.post("/pages/:slug/view", recordView);
router.post("/pages/:slug/download", recordDownload);
router.post("/pages/:slug/like", recordLike);

// Public Stats
import { getPublicStats } from "../controllers/pageController.js";
router.get("/stats", getPublicStats);

// Contact Submission
router.post("/contact", submitMessage);

// Blog Posts
router.get("/posts", getPosts);
router.get("/posts/:slug", getPostBySlug);


// ==========================================
// Admin Endpoints
// ==========================================

// Public admin login
router.post("/admin/login", login);

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
router.post("/admin/posts", authenticateAdmin, createPost);
router.put("/admin/posts/:id", authenticateAdmin, updatePost);
router.delete("/admin/posts/:id", authenticateAdmin, deletePost);

export default router;
