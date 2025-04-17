/* Author(s): Anton Bryhagen */

import express from "express";
import { createUser, authenticateUser } from "../controllers/userController.js";

/**
 * Express router for handling authentication routes.
 * @type {import('express').Router}
 */
const router = express.Router();

router.post("/register", createUser)

router.post("/login", authenticateUser)

export default router;