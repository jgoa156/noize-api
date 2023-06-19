import express from "express";
import { parseFormidable } from "../utils";
const router = express.Router();

import authRouter from "./auth";
import usersRouter from "./users";
import placesRouter from "./places";
import reviewsRouter from "./reviews";
import tokensRouter from "./tokens";
import categoriesRouter from "./categories";
import tagsRouter from "./tags";

router.use("/auth", parseFormidable, authRouter);
router.use("/users", parseFormidable, usersRouter);
router.use("/places", parseFormidable, placesRouter);
router.use("/reviews", parseFormidable, reviewsRouter);
router.use("/tokens", parseFormidable, tokensRouter);
router.use("/categories", parseFormidable, categoriesRouter);
router.use("/tags", parseFormidable, tagsRouter);

export default router;
