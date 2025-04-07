import express from "express";
import * as logController from "../controllers/logController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate);

router.get("/", logController.getAllLogs);
router.get("/from/:date", logController.getLogsFromDate);

export default router;
