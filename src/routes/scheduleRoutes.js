import express from "express";
import jwtValidator from "../middleware/jwtValidator.js";
import { getAllSchedules, setNewSchedule, deleteSchedule } from "../controllers/scheduleController.js";

const router = express.Router();

router.post("/", jwtValidator, setNewSchedule);

router.get("/", jwtValidator, getAllSchedules);

router.delete("/:schedule_id", jwtValidator, deleteSchedule);

export default router;
