import express from "express";
import authController from "../controllers/auth";
const router = express.Router();

// POST
router.post("/login", authController.login);
router.post("/signUp", authController.signUp);
router.post("/refreshToken", authController.refreshToken);

router.post("/sendPasswordLink", authController.sendPasswordLink);

// PUT
router.put("/:token/updatePassword", authController.updatePassword);
router.put("/:token/confirmEmail", authController.confirmEmail);

export default router;
