import express from "express";
import { z } from "zod";
import asyncHandler from "../middlewares/async";
import { tagService } from "../lib/tagService";
import { auth } from "../middlewares/auth";
import type { AuthRequest } from "../middlewares/auth";

const router = express.Router();

const tagSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(50),
});

router.use(auth);

router.get(
  "/",
  asyncHandler(async (req: AuthRequest, res) => {
    const tags = await tagService.getTags(req.userId!);
    res.send(tags);
  }),
);

router.get(
  "/:name",
  asyncHandler(async (req: AuthRequest, res) => {
    const tag = await tagService.getTagByName(
      req.params.name as string,
      req.userId!,
    );

    if (!tag) {
      return res.status(404).send({ message: "Tag not found" });
    }

    res.send(tag);
  }),
);

router.post(
  "/",
  asyncHandler(async (req: AuthRequest, res) => {
    const validation = tagSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send(validation.error.message);
    }

    const tag = await tagService.upsertTag(validation.data.name);

    res.status(201).send(tag);
  }),
);

export default router;
