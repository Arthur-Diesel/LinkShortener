import { Request, Response, Router } from "express";
import { getUser, getUsers, signin, signup } from "../services/user.service";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/constants";
import { ApiError } from "../config/errors";
import { checkUserAuthenticatedMiddleware } from "../middlewares/checkUserAuthenticatedMiddleware";
import { checkUserAdminMiddleware } from "../middlewares/checkUserAdminMiddleware";
import { checkUserBody } from "../middlewares/checkUserBodyMiddleware";
import { formatUser } from "../utils/formatUser";

// checkUserAuthenticatedMiddleware
// checkUserAdminMiddleware

export async function getUsersController(_: Request, res: Response) {
  const users = await getUsers();
  return res.status(200).json({ data: { users } });
}

// checkUserAuthenticatedMiddleware,
// checkUserAdminMiddleware,
export async function getUserController(req: Request, res: Response) {
  try {
    const user = await getUser(Number(req.params.id));
    return res.status(200).json({ data: { user } });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCurrentUserController(req: Request, res: Response) {
  try {
    const user = await getUser(req.user!.id);
    const formattedUser = formatUser(user);
    return res.status(200).json({ data: { formattedUser } });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function logoutController(_: Request, res: Response) {
  return res.clearCookie("token").status(200).json({ message: "Logged out" });
}

// checkUserBody
export async function loginController(req: Request, res: Response) {
  try {
    const user = await signin(req.body.email, req.body.password);
    const token = jwt.sign({ id: user.id }, jwtSecret);
    const formattedUser = formatUser(user);
    return res
      .status(201)
      .json({ data: formattedUser })
      .cookie("token", token, { httpOnly: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function signupController(req: Request, res: Response) {
  try {
    const user = await signup(req.body.email, req.body.password);
    const token = jwt.sign({ id: user.id }, jwtSecret);
    const formattedUser = formatUser(user);
    return res
      .status(201)
      .json({ data: formattedUser })
      .cookie("token", token, { httpOnly: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}
