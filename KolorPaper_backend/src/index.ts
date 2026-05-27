import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import "dotenv/config";
import router from "./routes/index.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

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
