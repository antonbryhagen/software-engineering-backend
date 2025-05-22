/* Author(s): Kotayba Sayed */

import express from "express";
import jwtValidator from "../middleware/jwtValidator.js";
import { getAllActions, getActionsByDevice, getActionsByUser } from "../controllers/actionController.js";

const router = express.Router();

router.get("/", jwtValidator, getAllActions);

router.get("/device/:device_id", jwtValidator, getActionsByDevice);

router.get("/user/:user_id", jwtValidator, getActionsByUser);

export default router;
