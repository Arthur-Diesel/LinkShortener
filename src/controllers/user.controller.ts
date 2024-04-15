import { Request, Response, Router } from "express";
import { getUser, getUsers, signin, signup } from "../services/user.service";
import jwt from "jsonwebtoken";
import { debugApi, jwtSecret } from "../config/constants";
import { ApiError } from "../config/errors";
import { formatUser } from "../utils/formatUser";

export async function getUsersController(_: Request, res: Response) {
  debugApi("Nova requisição /api/users (GET) - getUsersController");

  const users = await getUsers();

  debugApi("Retornando sucesso! - getUsersController");
  return res.status(200).json({ data: { users } });
}

export async function getUserController(req: Request, res: Response) {
  debugApi("Nova requisição /api/users/:id (GET) - getUserController");

  try {
    const user = await getUser(Number(req.params.id));

    debugApi("Retornando sucesso! - getUserController");
    return res.status(200).json({ data: { user } });
  } catch (error) {
    debugApi("Retornando falha! - getUserController");

    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCurrentUserController(req: Request, res: Response) {
  debugApi("Nova requisição /api/whoami (GET) - getCurrentUserController");

  try {
    const user = await getUser(req.user!.id);
    const formattedUser = formatUser(user);

    debugApi("Retornando sucesso! - getCurrentUserController");
    return res.status(200).json({ data: { formattedUser } });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function logoutController(_: Request, res: Response) {
  debugApi("Nova requisição /api/logout (POST) - logoutController");
  return res.clearCookie("token").status(200).json({ message: "Logged out" });
}

// checkUserBody
export async function loginController(req: Request, res: Response) {
  debugApi("Nova requisição /api/login (POST) - loginController");

  try {
    const user = await signin(req.body.email, req.body.password);
    const token = jwt.sign({ id: user.id }, jwtSecret);
    const formattedUser = formatUser(user);

    debugApi("Retornando sucesso! - loginController");
    res.cookie("token", token, { httpOnly: true });
    return res
      .status(201)
      .json({ data: formattedUser })
  } catch (error) {
    debugApi("Retornando falha! - loginController");

    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function signupController(req: Request, res: Response) {
  debugApi("Nova requisição /api/register (POST) - signupController");

  try {
    const user = await signup(req.body.email, req.body.password);
    const token = jwt.sign({ id: user.id }, jwtSecret);
    const formattedUser = formatUser(user);

    debugApi("Retornando sucesso! - signupController");
    res.cookie("token", token, { httpOnly: true });
    return res.status(201).json({ data: formattedUser });
  } catch (error) {
    debugApi("Retornando falha! - signupController");

    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}
