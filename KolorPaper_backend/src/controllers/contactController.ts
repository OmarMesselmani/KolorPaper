import { Request, Response } from "express";
import { prisma } from "../db.js";

// POST /api/contact
export const submitMessage = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please provide a valid email address" });
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
        read: false
      }
    });

    res.status(201).json({ 
      success: true, 
      message: "Your message has been submitted successfully!",
      data: { id: newMessage.id }
    });
  } catch (error) {
    console.error("Error submitting contact message:", error);
    res.status(500).json({ error: "Failed to submit message" });
  }
};

// Admin Endpoints

// GET /api/admin/messages
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string || "1");
    const limit = parseInt(req.query.limit as string || "20");
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
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// PUT /api/admin/messages/:id/read
export const markAsRead = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
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
  } catch (error) {
    console.error("Error updating message status:", error);
    res.status(500).json({ error: "Failed to update message status" });
  }
};

// DELETE /api/admin/messages/:id
export const deleteMessage = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;

    const message = await prisma.contactMessage.findUnique({ where: { id } });
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    await prisma.contactMessage.delete({ where: { id } });

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
};
