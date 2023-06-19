import express from "express";
import tagsController from "../controllers/tags";

const router = express.Router();

// GET
router.get("/", tagsController.list);

export default router;
