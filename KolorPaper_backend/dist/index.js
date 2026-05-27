import express from "express";
import cors from "cors";
import "dotenv/config";
import router from "./routes/index.js";
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
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
