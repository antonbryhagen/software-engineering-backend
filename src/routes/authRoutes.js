import express from "express";
import { createUser, authenticateUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", createUser)

router.post("/login", authenticateUser)

export default router;