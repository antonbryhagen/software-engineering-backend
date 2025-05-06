/* Author(s): Kotayba Sayed */
import express from "express";
import jwtValidator from "../middleware/jwtValidator.js";
import { getAllLogs, getLogsFromDate } from "../controllers/logController.js";

const router = express.Router();

router.get("/", jwtValidator, getAllLogs);

router.get("/:date", jwtValidator, getLogsFromDate);

export default router;
