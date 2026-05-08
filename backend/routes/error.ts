import type { Request, Response, NextFunction } from "express";

export default function (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error('Error:', err);
  return res.status(500).send({ message: err.message || "Something failed!" });
}
