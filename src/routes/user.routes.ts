import { Router } from "express";
import { checkUserAuthenticatedMiddleware } from "../middlewares/checkUserAuthenticatedMiddleware";
import { checkUserAdminMiddleware } from "../middlewares/checkUserAdminMiddleware";
import {
  getCurrentUserController,
  getUserController,
  getUsersController,
  loginController,
  logoutController,
  signupController,
} from "../controllers/user.controller";

const router = Router();

router.get(
  "/",
  checkUserAuthenticatedMiddleware,
  checkUserAdminMiddleware,
  getUsersController
);

router.get(
  "/:id",
  checkUserAuthenticatedMiddleware,
  checkUserAdminMiddleware,
  getUserController
);

router.post("/logout", logoutController);

router.post("/login", loginController);

router.post("/register", signupController);

router.get(
  "/whoami",
  checkUserAuthenticatedMiddleware,
  getCurrentUserController
);

export default router;
