import express from "express";
import { z } from "zod";
import { folderService } from "../lib/folderService";
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
    const folders = await folderService.getFolders(req.userId!);
    res.send(folders);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req: AuthRequest, res) => {
    const { id } = req.params;
    const folder = await folderService.getFolderById(id as string, req.userId!);

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

    const folder = await folderService.createFolder(
      req.userId!,
      validation.data,
    );

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

    const updatedFolder = await folderService.updateFolder(
      id as string,
      req.userId!,
      validation.data,
    );

    if (!updatedFolder) {
      return res.status(404).send({ message: "Folder not found" });
    }

    res.send(updatedFolder);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req: AuthRequest, res) => {
    const { id } = req.params;
    const result = await folderService.deleteFolder(id as string, req.userId!);

    if (!result) {
      return res.status(404).send({ message: "Folder not found" });
    }

    res.status(204).send();
  }),
);

export default router;
