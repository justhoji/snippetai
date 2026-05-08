import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import asyncHandler from "../middlewares/async";
import { embeddingService } from "../lib/embeddingService";
import { auth } from "../middlewares/auth";
import type { AuthRequest } from "../middlewares/auth";

const router = express.Router();

const SNIPPET_INCLUDE = {
  tags: true,
  folder: true,
} as const;

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

router.get(
  "/",
  asyncHandler(async (req: AuthRequest, res) => {
    const {
      q,
      language,
      folderId,
      tag,
      isFavorite,
      sortBy,
      order,
      semantic,
      page,
      limit,
    } = req.query;
    const userId = req.userId!;

    // 1. Handle Semantic Search
    if (semantic === "true" && q && typeof q === "string") {
      const results = await embeddingService.searchSimilarSnippets(q, userId);

      if (results.length === 0)
        return res.send({
          snippets: [],
          pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
        });

      const ids = results.map((r) => r.id);
      const snippets = await prisma.snippet.findMany({
        where: { id: { in: ids } },
        include: SNIPPET_INCLUDE,
      });

      const sortedSnippets = ids.map((id) => {
        const snippet = snippets.find((s) => s.id === id);
        const result = results.find((r) => r.id === id);
        return { ...snippet, similarity: result?.similarity };
      });

      return res.send({
        snippets: sortedSnippets,
        pagination: {
          total: sortedSnippets.length,
          page: 1,
          limit: sortedSnippets.length,
          totalPages: 1,
        },
      });
    }

    const where: any = { userId };

    if (q && typeof q === "string") {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { code: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
      ];
    }

    if (language && typeof language === "string") where.language = language;
    if (folderId && typeof folderId === "string")
      where.folderId = folderId === "null" ? null : folderId;
    if (isFavorite === "true") where.isFavorite = true;
    if (tag && typeof tag === "string") {
      where.tags = { some: { name: tag } };
    }

    const sortField = typeof sortBy === "string" ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? "asc" : "desc";

    // Pagination parameters
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [snippets, total] = await Promise.all([
      prisma.snippet.findMany({
        where,
        include: SNIPPET_INCLUDE,
        orderBy: { [sortField]: sortOrder },
        skip,
        take: limitNum,
      }),
      prisma.snippet.count({ where }),
    ]);

    res.send({
      snippets,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req: AuthRequest, res) => {
    const { id } = req.params;
    const snippet = await prisma.snippet.findFirst({
      where: { id: id as string, userId: req.userId },
      include: SNIPPET_INCLUDE,
    });

    if (!snippet) return res.status(404).send({ message: "Snippet not found" });
    res.send(snippet);
  }),
);

router.post(
  "/",
  asyncHandler(async (req: AuthRequest, res) => {
    const validation = snippetSchema.safeParse(req.body);
    if (!validation.success)
      return res.status(400).send(validation.error.message);

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
      include: SNIPPET_INCLUDE,
    });

    embeddingService.updateSnippetEmbedding(snippet);

    res.status(201).send(snippet);
  }),
);

router.put(
  "/:id",
  asyncHandler(async (req: AuthRequest, res) => {
    const { id } = req.params;
    const validation = updateSnippetSchema.safeParse(req.body);
    if (!validation.success)
      return res.status(400).send(validation.error.message);

    const existingSnippet = await prisma.snippet.findFirst({
      where: { id: id as string, userId: req.userId },
    });

    if (!existingSnippet)
      return res.status(404).send({ message: "Snippet not found" });

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
      include: SNIPPET_INCLUDE,
    });

    // Update embedding if relevant fields changed
    if (
      data.title ||
      data.language ||
      data.code ||
      data.summary !== undefined
    ) {
      embeddingService.updateSnippetEmbedding(updatedSnippet);
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

    if (!snippet) return res.status(404).send({ message: "Snippet not found" });

    await prisma.snippet.delete({ where: { id: id as string } });
    res.status(204).send();
  }),
);

export default router;
