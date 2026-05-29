import { prisma } from "../db.js";
import { stripHtml } from "../utils/sanitize.js";
// POST /api/contact
export const submitMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: "Name, email, and message are required" });
        }
        const cleanName = stripHtml(name);
        const cleanMessage = stripHtml(message);
        if (cleanName.length > 100) {
            return res.status(400).json({ error: "Name must be 100 characters or less" });
        }
        if (cleanMessage.length > 2000) {
            return res.status(400).json({ error: "Message must be 2000 characters or less" });
        }
        const cleanEmail = stripHtml(email);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail) || cleanEmail.length > 254) {
            return res.status(400).json({ error: "Please provide a valid email address" });
        }
        const newMessage = await prisma.contactMessage.create({
            data: {
                name: cleanName,
                email: cleanEmail,
                message: cleanMessage,
                read: false
            }
        });
        res.status(201).json({
            success: true,
            message: "Your message has been submitted successfully!",
            data: { id: newMessage.id }
        });
    }
    catch (error) {
        console.error("Error submitting contact message:", error);
        res.status(500).json({ error: "Failed to submit message" });
    }
};
// Admin Endpoints
// GET /api/admin/messages
export const getMessages = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page || "1") || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || "20") || 20));
        const skip = (page - 1) * limit;
        const unreadOnly = req.query.unreadOnly === "true";
        const where = unreadOnly ? { read: false } : {};
        const [messages, total] = await prisma.$transaction([
            prisma.contactMessage.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit
            }),
            prisma.contactMessage.count({ where })
        ]);
        res.json({
            messages,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
};
// PUT /api/admin/messages/:id/read
export const markAsRead = async (req, res) => {
    try {
        const id = req.params.id;
        const { read } = req.body; // boolean
        if (read === undefined) {
            return res.status(400).json({ error: "Read status (boolean) is required" });
        }
        const message = await prisma.contactMessage.findUnique({ where: { id } });
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }
        const updated = await prisma.contactMessage.update({
            where: { id },
            data: { read: !!read }
        });
        res.json(updated);
    }
    catch (error) {
        console.error("Error updating message status:", error);
        res.status(500).json({ error: "Failed to update message status" });
    }
};
// DELETE /api/admin/messages/:id
export const deleteMessage = async (req, res) => {
    try {
        const id = req.params.id;
        const message = await prisma.contactMessage.findUnique({ where: { id } });
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }
        await prisma.contactMessage.delete({ where: { id } });
        res.json({ message: "Message deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ error: "Failed to delete message" });
    }
};
