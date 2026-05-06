import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import asyncHandler from "../middlewares/async";

const router = express.Router();

const snippetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  language: z.string().min(1, "Language is required"),
  code: z.string().min(1, "Code is required"),
  summary: z.string().optional(),
  isFavorite: z.boolean().optional(),
  folderId: z.uuid().nullable().optional(),
  userId: z.uuid("Invalid User ID"),
  tags: z.array(z.string()).optional(),
});

const updateSnippetSchema = snippetSchema.partial().omit({ userId: true });

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const snippets = await prisma.snippet.findMany({
      include: {
        tags: true,
        folder: true,
      },
    });
    res.send(snippets);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const snippet = await prisma.snippet.findUnique({
      where: { id: req.params.id },
      include: {
        tags: true,
        folder: true,
      },
    });

    if (!snippet) {
      return res.status(404).send({ message: "Snippet not found" });
    }

    res.send(snippet);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const validation = snippetSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send(validation.error.message);
    }

    const {
      title,
      language,
      code,
      summary,
      isFavorite,
      folderId,
      userId,
      tags,
    } = validation.data;

    const snippet = await prisma.snippet.create({
      data: {
        title,
        language,
        code,
        summary,
        isFavorite: isFavorite ?? false,
        userId,
        folderId: folderId ?? null,
        tags: {
          connectOrCreate: tags?.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: {
        tags: true,
      },
    });

    res.status(201).send(snippet);
  }),
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const validation = updateSnippetSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send(validation.error.message);
    }

    const snippet = await prisma.snippet.findUnique({
      where: { id: req.params.id },
    });

    if (!snippet) {
      return res.status(404).send({ message: "Snippet not found" });
    }

    const { tags, ...data } = validation.data;

    const updatedSnippet = await prisma.snippet.update({
      where: { id: req.params.id },
      data: {
        ...data,
        tags: tags
          ? {
              set: [],
              connectOrCreate: tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: {
        tags: true,
      },
    });

    res.send(updatedSnippet);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const snippet = await prisma.snippet.findUnique({
      where: { id: req.params.id },
    });

    if (!snippet) {
      return res.status(404).send({ message: "Snippet not found" });
    }

    await prisma.snippet.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  }),
);

export default router;
