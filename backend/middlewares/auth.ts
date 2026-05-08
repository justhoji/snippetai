import type { Response, NextFunction } from "express";
import { userService } from "../lib/userService";
import type { Request } from "express";

export interface AuthRequest extends Request {
  userId?: string;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  const decoded = userService.verifyToken(token);
  if (!decoded) {
    return res.status(401).send({ message: "Invalid token." });
  }

  req.userId = decoded.userId;
  next();
};
