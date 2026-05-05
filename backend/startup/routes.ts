import express from "express";
import error from "../routes/error";
import cors from "cors";

export default function (app: express.Application) {
  app.use(cors());
  app.use(express.json());
  app.use(error);
}
