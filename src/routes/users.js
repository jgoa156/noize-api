import express from "express";
import usersController from "../controllers/users";
import reviewsController from "../controllers/reviews";
import auth from "../auth";

const router = express.Router();

// GET
router.get("/:userId/reviews", auth.verifyAuth, reviewsController.listByUser);

// POST
router.post("/:userId/review", auth.verifyAuth, reviewsController.add); // Add review
router.post(
	"/:id/email/sendLink",
	auth.verifyAuth,
	usersController.sendEmailLink
); // Send confirm email link

// PUT
router.put("/:id/name", auth.verifyAuth, usersController.updateName); // Update user name
router.put(
	"/:id/picture",
	auth.verifyAuth,
	usersController.updateProfilePicture
); // Update user profile picture

export default router;
