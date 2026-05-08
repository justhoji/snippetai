import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import asyncHandler from "../middlewares/async";
import { auth } from "../middlewares/auth";
import type { AuthRequest } from "../middlewares/auth";

const router = express.Router();

const tagSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(50),
});

// Apply auth middleware
router.use(auth);

router.get(
  "/",
  asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.userId!;
    
    // Find tags that have at least one snippet belonging to the current user
    const tags = await prisma.tag.findMany({
      where: {
        snippets: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        _count: {
          select: { 
            snippets: {
              where: { userId: userId }
            } 
          },
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
  asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.userId!;
    const { name } = req.params;
    const tag = await prisma.tag.findUnique({
      where: { name: name as string },
      include: {
        snippets: {
          where: { userId: userId },
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

// Tags are mostly created via Snippets, but keep this for manual creation if needed
router.post(
  "/",
  asyncHandler(async (req: AuthRequest, res) => {
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

export default router;
