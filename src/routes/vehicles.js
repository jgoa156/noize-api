import express from "express";
import vehiclesController from "../controllers/vehicles";

const router = express.Router();

// GET
router.get("/", vehiclesController.list);
router.get("/:id", vehiclesController.list);

export default router;
