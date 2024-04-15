import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/constants";
import { NextFunction, Request, Response } from "express";

export async function appendUserToRequestMiddleware(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const token = req.cookies.token;

  jwt.verify(token, jwtSecret, (err: Error | null, decoded: any) => {
    if (!err) {
      req.user = decoded;
    }

    next();
  });
}
