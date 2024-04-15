import { Router } from "express";
import {
  createLinkController,
  getMyLinksController,
  getShortUrlController,
  getValidLinksController,
  updateExcludedAdminController,
  updateExcludedController,
  updateOriginalUrlController,
} from "../controllers/link.controller";
import { checkUserAuthenticatedMiddleware } from "../middlewares/checkUserAuthenticatedMiddleware";
import { appendUserToRequestMiddleware } from "../middlewares/appendUserToRequestMiddleware";
import { checkUserAdminMiddleware } from "../middlewares/checkUserAdminMiddleware";

const router = Router();

router.get("/", getValidLinksController);

router.get("/myLinks", checkUserAuthenticatedMiddleware, getMyLinksController);

router.post("/", appendUserToRequestMiddleware, createLinkController);

router.get("/redirect/:shortUrl", getShortUrlController);

router.patch(
  "/excludeUpdate/:id",
  checkUserAuthenticatedMiddleware,
  updateExcludedController
);

router.patch(
  "/adminExcludeUpdate/:id",
  checkUserAuthenticatedMiddleware,
  checkUserAdminMiddleware,
  updateExcludedAdminController
);

router.patch(
  "/originalUrl/:id",
  checkUserAuthenticatedMiddleware,
  updateOriginalUrlController
);

export default router;
