/* Author(s): Anton Bryhagen */

import express from "express";
import { deleteUserById, getAllUsers, getUserById } from "../controllers/userController.js";
import jwtValidator from "../middleware/jwtValidator.js";

/**
 * Express router for handling user routes.
 * @type {express.Router}
 */
const router = express.Router();

router.get("/:user_id", jwtValidator, getUserById);

router.get("/", jwtValidator, getAllUsers)

router.delete("/:user_id", jwtValidator, deleteUserById)

export default router;