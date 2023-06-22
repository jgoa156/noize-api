import express from "express";
import placesController from "../controllers/places";
import reviewsController from "../controllers/reviews";
import auth from "../auth";

const router = express.Router();

// GET
router.get("/", auth.verifyAuth, placesController.list);
router.get("/:id", auth.verifyAuth, placesController.list);
router.get("/closest", auth.verifyAuth, placesController.listByProximity);
router.get("/:id/reviews", auth.verifyAuth, reviewsController.listByPlace);

// POST
router.post("/", auth.verifyAuth, placesController.add);
router.post("/batch", auth.verifyAuth, placesController.batchAdd);
router.post("/:placeId/review", auth.verifyAuth, reviewsController.add);

export default router;
