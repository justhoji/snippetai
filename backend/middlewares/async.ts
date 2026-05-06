import type { Request, Response, NextFunction, RequestHandler } from "express";

export default function catchAsync<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
>(handler: RequestHandler<P, ResBody, ReqBody, ReqQuery>) {
  return async (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
