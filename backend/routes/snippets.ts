import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import asyncHandler from "../middlewares/async";
import { aiService } from "../lib/ai";
import { auth } from "../middlewares/auth";
import type { AuthRequest } from "../middlewares/auth";

const router = express.Router();

// Helper to prepare text for embedding
const getEmbeddingText = (
  title: string,
  language: string,
  code: string,
  summary?: string | null,
) => {
  return `Title: ${title}\nLanguage: ${language}\nSummary: ${summary || ""}\nCode:\n${code}`;
};

const snippetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  language: z.string().min(1, "Language is required"),
  code: z.string().min(1, "Code is required"),
  summary: z.string().optional(),
  isFavorite: z.boolean().optional(),
  folderId: z.uuid().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

const updateSnippetSchema = snippetSchema.partial();

router.use(auth);

// Get all snippets with search and filtering
router.get(
  "/",
  asyncHandler(async (req: AuthRequest, res) => {
    const { q, language, folderId, tag, isFavorite, sortBy, order, semantic } =
      req.query;
    const userId = req.userId!;

    // Handle Semantic Search
    if (semantic === "true" && q && typeof q === "string") {
      console.log(`Performing semantic search for: "${q}"`);
      try {
        const embedding = await aiService.generateEmbedding(q);
        const vectorStr = `[${embedding.join(",")}]`;

        // Use a threshold to filter out irrelevant snippets (e.g., similarity > 0.3)
        const results: any[] = await prisma.$queryRawUnsafe(
          `
          SELECT id, 1 - (embedding <=> $1::vector) as similarity
          FROM "Snippet"
          WHERE embedding IS NOT NULL 
            AND "userId" = $2 
            AND 1 - (embedding <=> $1::vector) > 0.3
          ORDER BY embedding <=> $1::vector
          LIMIT 20
        `,
          vectorStr,
          userId,
        );

        console.log(`Found ${results.length} relevant snippets.`);
        
        if (results.length === 0) {
          return res.send([]);
        }

        const ids = results.map(r => r.id);
        const snippets = await prisma.snippet.findMany({
          where: {
            id: { in: ids }
          },
          include: {
            tags: true,
            folder: true
          }
        });

        // Maintain the order from the semantic search and add similarity
        const sortedSnippets = ids.map(id => {
          const snippet = snippets.find(s => s.id === id);
          const result = results.find(r => r.id === id);
          return { ...snippet, similarity: result.similarity };
        });

        return res.send(sortedSnippets);
      } catch (error) {
        console.error("Semantic search failed:", error);
        // Fallback to keyword search if AI fails
      }
    }

    const where: any = { userId };

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
  asyncHandler(async (req: AuthRequest, res) => {
    const { id } = req.params;
    const snippet = await prisma.snippet.findFirst({
      where: { id: id as string, userId: req.userId },
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
  asyncHandler(async (req: AuthRequest, res) => {
    const validation = snippetSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send(validation.error.message);
    }

    const { title, language, code, summary, isFavorite, folderId, tags } =
      validation.data;

    const snippet = await prisma.snippet.create({
      data: {
        title,
        language,
        code,
        summary,
        isFavorite: isFavorite ?? false,
        userId: req.userId!,
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
      const embedding = await aiService.generateEmbedding(
        getEmbeddingText(title, language, code, summary),
      );
      await prisma.$executeRawUnsafe(
        `UPDATE "Snippet" SET embedding = $1::vector WHERE id = $2`,
        `[${embedding.join(",")}]`,
        snippet.id,
      );
    } catch (error) {
      console.error("Failed to generate embedding on create:", error);
    }

    res.status(201).send(snippet);
  }),
);

router.put(
  "/:id",
  asyncHandler(async (req: AuthRequest, res) => {
    const { id } = req.params;
    const validation = updateSnippetSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send(validation.error.message);
    }

    const snippet = await prisma.snippet.findFirst({
      where: { id: id as string, userId: req.userId },
    });

    if (!snippet) {
      return res.status(404).send({ message: "Snippet not found" });
    }

    const { tags, ...data } = validation.data;

    const updatedSnippet = await prisma.snippet.update({
      where: { id: id as string },
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
    if (
      data.title ||
      data.language ||
      data.code ||
      data.summary !== undefined
    ) {
      try {
        const embedding = await aiService.generateEmbedding(
          getEmbeddingText(
            updatedSnippet.title,
            updatedSnippet.language,
            updatedSnippet.code,
            updatedSnippet.summary,
          ),
        );
        await prisma.$executeRawUnsafe(
          `UPDATE "Snippet" SET embedding = $1::vector WHERE id = $2`,
          `[${embedding.join(",")}]`,
          updatedSnippet.id,
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
  asyncHandler(async (req: AuthRequest, res) => {
    const { id } = req.params;
    const snippet = await prisma.snippet.findFirst({
      where: { id: id as string, userId: req.userId },
    });

    if (!snippet) {
      return res.status(404).send({ message: "Snippet not found" });
    }

    await prisma.snippet.delete({
      where: { id: id as string },
    });

    res.status(204).send();
  }),
);

export default router;
