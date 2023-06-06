import express from "express";
import tokensController from "../controllers/tokens";

const router = express.Router();

// GET
router.get("/:token", tokensController.find);

export default router;
