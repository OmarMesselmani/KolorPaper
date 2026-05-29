import jwt from "jsonwebtoken";
export const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];
    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: "Internal server error: Security configuration missing." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: "Invalid or expired token." });
    }
};
