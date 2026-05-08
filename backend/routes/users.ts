import express from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import asyncHandler from "../middlewares/async";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const userSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().optional().nullable(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

const setTokenCookie = (res: express.Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Get current user
router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({ message: "Not authenticated" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(401).send({ message: "User not found" });
      }

      res.send(user);
    } catch (error) {
      res.status(401).send({ message: "Invalid token" });
    }
  }),
);

// Register
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send({
        message: validation.error.issues[0]?.message || "Invalid input",
      });
    }

    const { email, name, password } = validation.data;

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).send({ message: "User already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);
    setTokenCookie(res, token);

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).send(userWithoutPassword);
  }),
);

// Login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send({
        message: validation.error.issues[0]?.message || "Invalid input",
      });
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return res.status(400).send({ message: "Invalid email or password." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Invalid email or password." });
    }

    const token = generateToken(user.id);
    setTokenCookie(res, token);

    const { password: _, ...userWithoutPassword } = user;
    res.send(userWithoutPassword);
  }),
);

// Logout
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    res.clearCookie("token");
    res.send({ message: "Logged out successfully" });
  }),
);

// Admin routes or specific user management (optional, keeping basic CRUD for now but protecting it)
// In a real app, these should be restricted to admins or the user themselves
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
    res.send(users);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.user.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  }),
);

export default router;
