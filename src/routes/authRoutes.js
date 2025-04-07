import express from "express";
import * as authController from "../controllers/userController.js";

const router = express.Router();

router.post("/login", authController.authenticateUser);
router.post("/register", authController.createUser);

export default router;
