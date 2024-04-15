import { NextFunction, Request, Response } from "express";
import { getUser } from "../services/user.service";

export async function checkUserAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user!.id;
  const user = await getUser(userId);
  if (!user.admin) {
    return res.status(403).json({ message: "Forbidden: User is not an admin" });
  }
  next();
}
