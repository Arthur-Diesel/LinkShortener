export function checkUserBody(req: any, res: any, next: any) {
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ message: "Email and password are required" });
  next();
}
