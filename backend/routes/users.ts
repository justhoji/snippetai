import express from "express";
import { z } from "zod";
import { userService } from "../lib/userService";
import asyncHandler from "../middlewares/async";

const router = express.Router();

const userSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().optional().nullable(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

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

    const decoded = userService.verifyToken(token);
    if (!decoded) {
      return res.status(401).send({ message: "Invalid token" });
    }

    const user = await userService.getUserById(decoded.userId);
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    res.send(user);
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

    const { email } = validation.data;
    const userExists = await userService.getUserByEmail(email);

    if (userExists) {
      return res.status(400).send({ message: "User already registered." });
    }

    const user = await userService.register(validation.data);
    const token = userService.generateToken(user.id);
    setTokenCookie(res, token);

    res.status(201).send(user);
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
    const user = await userService.login(email, password);

    if (!user) {
      return res.status(400).send({ message: "Invalid email or password." });
    }

    const token = userService.generateToken(user.id);
    setTokenCookie(res, token);

    res.send(user);
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

// Get all users
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await userService.getUsers();
    res.send(users);
  }),
);

// Delete user
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  }),
);

export default router;
