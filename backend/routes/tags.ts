import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import asyncHandler from "../middlewares/async";

const router = express.Router();

const tagSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(50),
});

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { snippets: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    res.send(tags);
  }),
);

router.get(
  "/:name",
  asyncHandler(async (req, res) => {
    const tag = await prisma.tag.findUnique({
      where: { name: req.params.name },
      include: {
        snippets: {
          include: {
            folder: true,
          },
        },
      },
    });

    if (!tag) {
      return res.status(404).send({ message: "Tag not found" });
    }

    res.send(tag);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const validation = tagSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send(validation.error.message);
    }

    const tag = await prisma.tag.upsert({
      where: { name: validation.data.name },
      update: {},
      create: { name: validation.data.name },
    });

    res.status(201).send(tag);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const tag = await prisma.tag.findUnique({
      where: { id: req.params.id },
    });

    if (!tag) {
      return res.status(404).send({ message: "Tag not found" });
    }

    await prisma.tag.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  }),
);

export default router;
