import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import asyncHandler from "../middlewares/async";

const router = express.Router();

const userSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().min(1, "Name is required").optional().nullable(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .nullable(),
});

const updateUserSchema = userSchema.partial();

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

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        snippets: true,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send(user);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send(validation.error.message);
    }

    const { email, name, password } = validation.data;

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).send({ message: "User already registered." });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).send(userWithoutPassword);
  }),
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const validation = updateUserSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send(validation.error);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: validation.data,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.send(userWithoutPassword);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    await prisma.user.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  }),
);

export default router;
