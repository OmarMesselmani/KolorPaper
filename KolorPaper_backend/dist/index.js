import express from "express";
import cors from "cors";
import "dotenv/config";
import router from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import helmet from "helmet";
import rateLimit from "express-rate-limit";
const app = express();
app.set("trust proxy", 1);
const port = process.env.PORT || 5000;
// Enable security headers with Helmet (allow cross-origin resources for image access)
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
// Configure CORS
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman, etc.)
        // NOTE (Production): Consider restricting no-origin requests in production
        // to prevent automated abuse. Cloudflare WAF can handle this at edge level.
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Global Rate Limiting
const globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 150, // Limit each IP to 150 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests from this IP, please try again after a minute." },
});
app.use(globalLimiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Serve static uploaded files with hotlink protection
app.use("/uploads", (req, res, next) => {
    const referer = req.headers.referer || req.headers.referrer;
    if (referer) {
        try {
            const url = new URL(referer);
            const refererHostname = url.hostname.toLowerCase();
            // Allow localhost, local network, and configured trusted hosts
            const envTrustedHosts = process.env.TRUSTED_HOSTS?.split(",").map(h => h.trim().toLowerCase()) || [];
            const allowedLocalHostnames = ["localhost", "127.0.0.1", ...envTrustedHosts];
            const isLocal = allowedLocalHostnames.some(local => refererHostname === local || refererHostname.endsWith(local));
            const isSearchEngine = refererHostname.includes("google.") ||
                refererHostname.includes("bing.") ||
                refererHostname.includes("yahoo.") ||
                refererHostname.includes("pinterest.");
            if (!isLocal && !isSearchEngine) {
                // Compare referer hostname with request host header to allow self
                const requestHost = req.headers.host; // e.g. "kolorpaper.com" or "api.kolorpaper.com"
                const requestHostname = requestHost?.split(":")[0].toLowerCase();
                const isSelf = requestHostname && (refererHostname === requestHostname ||
                    refererHostname.endsWith("." + requestHostname) ||
                    requestHostname.endsWith("." + refererHostname) ||
                    // Also check standard domain match (e.g. referer on kolorpaper.com requesting api.kolorpaper.com)
                    (requestHostname.includes("kolorpaper.com") && refererHostname.includes("kolorpaper.com")));
                if (!isSelf) {
                    return res.status(403).send("Forbidden: Hotlinking is disabled.");
                }
            }
        }
        catch (err) {
            // Keep going if referer URL is invalid
        }
    }
    next();
}, express.static(path.join(__dirname, "../uploads")));
// Serve robots.txt to prevent indexing of backend assets directly
app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send("User-agent: *\nDisallow: /\n");
});
// Health Check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is healthy" });
});
// Register unified api routes
app.use("/api", router);
// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error("Unhandled API error:", err);
    res.status(500).json({ error: "Something went wrong! Internal server error." });
});
// Start Server
app.listen(port, () => {
    console.log(`🚀 Backend API server is running on http://localhost:${port}`);
});
