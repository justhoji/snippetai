import express from "express";
import error from "../routes/error";
import snippets from "../routes/snippets";
import users from "../routes/users";
import folders from "../routes/folders";
import tags from "../routes/tags";
import ai from "../routes/ai";
import cors from "cors";

export default function (app: express.Application) {
  app.use(cors());
  app.use(express.json());
  app.use("/api/snippets", snippets);
  app.use("/api/users", users);
  app.use("/api/folders", folders);
  app.use("/api/tags", tags);
  app.use("/api/ai", ai);
  app.use(error);
}
