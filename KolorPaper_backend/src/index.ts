import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import "dotenv/config";
import router from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("trust proxy", true);
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve static uploaded files with hotlink protection
app.use("/uploads", (req: Request, res: Response, next: NextFunction) => {
  const referer = req.headers.referer || req.headers.referrer;
  if (referer) {
    try {
      const url = new URL(referer as string);
      const refererHostname = url.hostname.toLowerCase();
      
      // Allow localhost, local network IPs, and search engine image crawls
      const allowedLocalHostnames = ["localhost", "127.0.0.1", "192.168.0.171"];
      const isLocal = allowedLocalHostnames.some(local => refererHostname === local || refererHostname.endsWith(local));
      
      const isSearchEngine = refererHostname.includes("google.") || 
                             refererHostname.includes("bing.") || 
                             refererHostname.includes("yahoo.") || 
                             refererHostname.includes("pinterest.");
      
      if (!isLocal && !isSearchEngine) {
        // Compare referer hostname with request host header to allow self
        const requestHost = req.headers.host; // e.g. "kolorpaper.com" or "api.kolorpaper.com"
        const requestHostname = requestHost?.split(":")[0].toLowerCase();
        
        const isSelf = requestHostname && (
          refererHostname === requestHostname || 
          refererHostname.endsWith("." + requestHostname) ||
          requestHostname.endsWith("." + refererHostname) ||
          // Also check standard domain match (e.g. referer on kolorpaper.com requesting api.kolorpaper.com)
          (requestHostname.includes("kolorpaper.com") && refererHostname.includes("kolorpaper.com"))
        );
        
        if (!isSelf) {
          return res.status(403).send("Forbidden: Hotlinking is disabled.");
        }
      }
    } catch (err) {
      // Keep going if referer URL is invalid
    }
  }
  next();
}, express.static(path.join(__dirname, "../uploads")));

// Serve robots.txt to prevent indexing of backend assets directly
app.get("/robots.txt", (req: Request, res: Response) => {
  res.type("text/plain");
  res.send("User-agent: *\nDisallow: /\n");
});

// Health Check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Server is healthy" });
});

// Register unified api routes
app.use("/api", router);

// Global Error Handler Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled API error:", err);
  res.status(500).json({ error: "Something went wrong! Internal server error." });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Backend API server is running on http://localhost:${port}`);
});
