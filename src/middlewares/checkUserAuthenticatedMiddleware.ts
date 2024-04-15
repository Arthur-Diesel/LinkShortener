import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/constants";
import { NextFunction, Request, Response } from "express";
import cookie from "cookie";

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
  if (!req.headers.cookie || !cookie.parse(req.headers.cookie).token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const parsedCookie = cookie.parse(req.headers.cookie);
  const token = parsedCookie.token;

  jwt.verify(token, jwtSecret, (err: Error | null, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Forbidden: Invalid token" });
    }

    req.user = decoded;
    next();
  });
}
