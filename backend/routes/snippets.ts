import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import asyncHandler from "../middlewares/async";
import { aiService } from "../lib/ai";

const router = express.Router();

// Helper to prepare text for embedding
const getEmbeddingText = (title: string, language: string, code: string, summary?: string | null) => {
  return `Title: ${title}\nLanguage: ${language}\nSummary: ${summary || ""}\nCode:\n${code}`;
};

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

// Get all snippets with search and filtering
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { q, language, folderId, tag, isFavorite, sortBy, order, semantic } = req.query;

    // Handle Semantic Search
    if (semantic === "true" && q && typeof q === "string") {
      const embedding = await aiService.generateEmbedding(q);
      const vectorStr = `[${embedding.join(",")}]`;

      const snippets = await prisma.$queryRawUnsafe(`
        SELECT id, title, language, summary, "isFavorite", "folderId", "userId", "createdAt", "updatedAt",
               1 - (embedding <=> $1::vector) as similarity
        FROM "Snippet"
        WHERE embedding IS NOT NULL
        ORDER BY embedding <=> $1::vector
        LIMIT 20
      `, vectorStr);

      return res.send(snippets);
    }

    const where: any = {};

    // Keyword Search (Title, Code, Summary)
    if (q && typeof q === "string") {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { code: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
      ];
    }

    // Filters
    if (language && typeof language === "string") {
      where.language = language;
    }

    if (folderId && typeof folderId === "string") {
      where.folderId = folderId === "null" ? null : folderId;
    }

    if (isFavorite === "true") {
      where.isFavorite = true;
    }

    if (tag && typeof tag === "string") {
      where.tags = {
        some: {
          name: tag,
        },
      };
    }

    // Sorting
    const sortField = typeof sortBy === "string" ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? "asc" : "desc";

    const snippets = await prisma.snippet.findMany({
      where,
      include: {
        tags: true,
        folder: true,
      },
      orderBy: {
        [sortField]: sortOrder,
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

    // Generate and store embedding
    try {
      const embedding = await aiService.generateEmbedding(getEmbeddingText(title, language, code, summary));
      await prisma.$executeRawUnsafe(
        `UPDATE "Snippet" SET embedding = $1::vector WHERE id = $2`,
        `[${embedding.join(",")}]`,
        snippet.id
      );
    } catch (error) {
      console.error("Failed to generate embedding on create:", error);
    }

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

    // Update embedding if relevant fields changed
    if (data.title || data.language || data.code || data.summary !== undefined) {
      try {
        const embedding = await aiService.generateEmbedding(
          getEmbeddingText(
            updatedSnippet.title,
            updatedSnippet.language,
            updatedSnippet.code,
            updatedSnippet.summary
          )
        );
        await prisma.$executeRawUnsafe(
          `UPDATE "Snippet" SET embedding = $1::vector WHERE id = $2`,
          `[${embedding.join(",")}]`,
          updatedSnippet.id
        );
      } catch (error) {
        console.error("Failed to update embedding on put:", error);
      }
    }

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
