import { BadRequestException } from "../config/errors";

export function checkUserBody(req: any, res: any, next: any) {
  if (!req.body.email || !req.body.password)
    throw new BadRequestException("Email and password are required");
  next();
}
