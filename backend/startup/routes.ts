import express from "express";
import error from "../routes/error";
import snippets from "../routes/snippets";
import users from "../routes/users";
import folders from "../routes/folders";
import tags from "../routes/tags";
import ai from "../routes/ai";
import cors from "cors";
import cookieParser from "cookie-parser";

export default function (app: express.Application) {
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:5174"],
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use("/api/snippets", snippets);
  app.use("/api/users", users);
  app.use("/api/folders", folders);
  app.use("/api/tags", tags);
  app.use("/api/ai", ai);
  app.use(error);
}
