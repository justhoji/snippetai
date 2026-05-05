import type { Request, Response, NextFunction, RequestHandler } from "express";

export default function (handler: RequestHandler) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
