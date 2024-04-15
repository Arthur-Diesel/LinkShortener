import { Router } from "express";
import userRouter from "./user.routes";
import linkRouter from "./link.routes"

const router = Router();

router.use("/users", userRouter);
router.use("/links", linkRouter);

export default router;