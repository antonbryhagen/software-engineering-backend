import express from "express";
import * as sensorController from "../controllers/sensorController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate);

router.get("/", sensorController.getAllSensors);
router.get("/:sensor_id", sensorController.getSensorById);
router.post("/register/:sensor_id", sensorController.registerSensor);
router.put("/:sensor_id", sensorController.updateSensor);
router.delete("/:sensor_id", sensorController.deleteSensor);

export default router;
