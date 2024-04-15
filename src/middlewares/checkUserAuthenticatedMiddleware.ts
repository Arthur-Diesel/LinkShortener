import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/constants";
import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      // This will add a new property to the Request object
      user?: {
        id: number;
      };
    }
  }
}

export async function checkUserAuthenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, jwtSecret, (err: Error | null, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Forbidden: Invalid token" });
    }

    req.user = decoded;
    next();
  });
}
