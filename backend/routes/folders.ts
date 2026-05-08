import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import asyncHandler from "../middlewares/async";
import { auth } from "../middlewares/auth";
import type { AuthRequest } from "../middlewares/auth";

const router = express.Router();

const folderSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
});

const updateFolderSchema = folderSchema.partial();

router.use(auth);

router.get(
  "/",
  asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.userId!;

    const folders = await prisma.folder.findMany({
      where: { userId },
      include: {
        _count: {
          select: { snippets: true },
        },
      },
    });

    res.send(folders);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req: AuthRequest, res) => {
    const { id } = req.params;
    const folder = await prisma.folder.findFirst({
      where: { id: id as string, userId: req.userId },
      include: {
        snippets: true,
      },
    });

    if (!folder) {
      return res.status(404).send({ message: "Folder not found" });
    }

    res.send(folder);
  }),
);

router.post(
  "/",
  asyncHandler(async (req: AuthRequest, res) => {
    const validation = folderSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send(validation.error.message);
    }

    const { name } = validation.data;

    const folder = await prisma.folder.create({
      data: {
        name,
        userId: req.userId!,
      },
    });

    res.status(201).send(folder);
  }),
);

router.put(
  "/:id",
  asyncHandler(async (req: AuthRequest, res) => {
    const { id } = req.params;
    const validation = updateFolderSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send(validation.error.message);
    }

    const folder = await prisma.folder.findFirst({
      where: { id: id as string, userId: req.userId },
    });

    if (!folder) {
      return res.status(404).send({ message: "Folder not found" });
    }

    const updatedFolder = await prisma.folder.update({
      where: { id: id as string },
      data: validation.data,
    });

    res.send(updatedFolder);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req: AuthRequest, res) => {
    const { id } = req.params;
    const folder = await prisma.folder.findFirst({
      where: { id: id as string, userId: req.userId },
    });

    if (!folder) {
      return res.status(404).send({ message: "Folder not found" });
    }

    await prisma.folder.delete({
      where: { id: id as string },
    });

    res.status(204).send();
  }),
);

export default router;
