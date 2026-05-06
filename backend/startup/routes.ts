import express from "express";
import error from "../routes/error";
import snippets from "../routes/snippets";
import cors from "cors";

export default function (app: express.Application) {
  app.use(cors());
  app.use(express.json());
  app.use("/api/snippets", snippets);
  app.use(error);
}
