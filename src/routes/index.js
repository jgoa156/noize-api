import express from "express";
import { parseFormidable } from "../utils";
const router = express.Router();

import authRouter from "./auth";
import usersRouter from "./users";
import reviewsRouter from "./reviews";
import tokensRouter from "./tokens";

router.use("/auth", parseFormidable, authRouter);
router.use("/users", parseFormidable, usersRouter);
router.use("/reviews", parseFormidable, reviewsRouter);
router.use("/tokens", parseFormidable, tokensRouter);

export default router;
