import express from "express";
import { z } from "zod";
import asyncHandler from "../middlewares/async";
import { snippetService } from "../lib/snippetService";
import { auth } from "../middlewares/auth";
import type { AuthRequest } from "../middlewares/auth";

const router = express.Router();

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

    if (semantic === "true" && q && typeof q === "string") {
      const result = await snippetService.getSemanticSnippets(userId, q);
      return res.send(result);
    }

    const filters = {
      q: typeof q === "string" ? q : undefined,
      language: typeof language === "string" ? language : undefined,
      folderId:
        typeof folderId === "string"
          ? folderId === "null"
            ? null
            : folderId
          : undefined,
      tag: typeof tag === "string" ? tag : undefined,
      isFavorite: isFavorite === "true" ? true : undefined,
      sortBy: typeof sortBy === "string" ? sortBy : undefined,
      order: (order === "asc" ? "asc" : "desc") as "asc" | "desc",
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 20,
    };

    const result = await snippetService.getSnippets(userId, filters);
    res.send(result);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req: AuthRequest, res) => {
    const { id } = req.params;
    const snippet = await snippetService.getSnippetById(id as string, req.userId!);

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

    const snippet = await snippetService.createSnippet(
      req.userId!,
      validation.data,
    );

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

    const updatedSnippet = await snippetService.updateSnippet(
      id as string,
      req.userId!,
      validation.data,
    );

    if (!updatedSnippet)
      return res.status(404).send({ message: "Snippet not found" });

    res.send(updatedSnippet);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req: AuthRequest, res) => {
    const { id } = req.params;
    const result = await snippetService.deleteSnippet(id as string, req.userId!);

    if (!result) return res.status(404).send({ message: "Snippet not found" });

    res.status(204).send();
  }),
);

export default router;
