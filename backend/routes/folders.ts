import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import asyncHandler from "../middlewares/async";

const router = express.Router();

const folderSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
  userId: z.uuid("Invalid User ID"),
});

const updateFolderSchema = folderSchema.partial().omit({ userId: true });

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res
        .status(400)
        .send({ message: "userId query parameter is required" });
    }

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
  asyncHandler(async (req, res) => {
    const folder = await prisma.folder.findUnique({
      where: { id: req.params.id },
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
  asyncHandler(async (req, res) => {
    const validation = folderSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send(validation.error.message);
    }

    const { name, userId } = validation.data;

    const folder = await prisma.folder.create({
      data: {
        name,
        userId,
      },
    });

    res.status(201).send(folder);
  }),
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const validation = updateFolderSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send(validation.error.message);
    }

    const folder = await prisma.folder.findUnique({
      where: { id: req.params.id },
    });

    if (!folder) {
      return res.status(404).send({ message: "Folder not found" });
    }

    const updatedFolder = await prisma.folder.update({
      where: { id: req.params.id },
      data: validation.data,
    });

    res.send(updatedFolder);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const folder = await prisma.folder.findUnique({
      where: { id: req.params.id },
    });

    if (!folder) {
      return res.status(404).send({ message: "Folder not found" });
    }

    await prisma.folder.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  }),
);

export default router;
