import express from "express";
import reviewsController from "../controllers/reviews";
import auth from "../auth";

const router = express.Router();

// GET
router.get("/", auth.verifyAuth, reviewsController.list);
router.get("/:id", auth.verifyAuth, reviewsController.list);

// DELETE
router.delete(
	"/:id",
	auth.verifyAuth,
	reviewsController.remove
); // Delete review

export default router;
