import express from "express";
import { prisma } from "../lib/prisma";
import asyncMiddleware from "../middlewares/async";
const router = express.Router();

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const users = await prisma.user.findMany();
    res.send(users);
  }),
);

export default router;
