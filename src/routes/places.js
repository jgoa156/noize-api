import express from "express";
import placesController from "../controllers/places";
import reviewsController from "../controllers/reviews";
import auth from "../auth";

const router = express.Router();

// GET
router.get("/", auth.verifyAuth, placesController.list);
router.get("/:placeId", auth.verifyAuth, placesController.list);
router.get("/:placeId/reviews", auth.verifyAuth, reviewsController.listByPlace);

// POST
router.post("/", auth.verifyAuth, placesController.add);

export default router;
