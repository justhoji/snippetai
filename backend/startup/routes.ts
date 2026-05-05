import express from "express";
import users from "../routes/users";
import error from "../routes/error";
import cors from "cors";

export default function (app: express.Application) {
  app.use(cors());
  app.use(express.json());
  app.use("/users", users);
  app.use(error);
}
