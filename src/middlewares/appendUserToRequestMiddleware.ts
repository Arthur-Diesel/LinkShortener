import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/constants";
import { NextFunction, Request, Response } from "express";
import cookie from "cookie";

export async function appendUserToRequestMiddleware(
  req: Request,
  _: Response,
  next: NextFunction
) {
  if (req.headers.cookie && cookie.parse(req.headers.cookie).token) {
    const parsedCookie = cookie.parse(req.headers.cookie);
    const token = parsedCookie.token;

    jwt.verify(token, jwtSecret, (err: Error | null, decoded: any) => {
      if (!err) {
        req.user = decoded;
      }
    });
  }
  next();
}
