import express from "express";
import categoriesController from "../controllers/categories";
import tagsController from "../controllers/tags";
import auth from "../auth";

const router = express.Router();

// GET
router.get("/", categoriesController.list);
router.get("/:id/tags", tagsController.list);

// POST
router.post("/:id/tags", tagsController.add);

export default router;
