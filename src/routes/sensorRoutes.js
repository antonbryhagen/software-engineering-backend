import express from "express";
import jwtValidator from "../middleware/jwtValidator.js";
import { getAllSensors, getSensorById, registerSensor, updateSensor, deleteSensor } from "../controllers/sensorController.js";

const router = express.Router();

router.get("/", jwtValidator, getAllSensors);

router.get("/:sensor_id", jwtValidator, getSensorById);

router.patch("/:sensor_id", jwtValidator, registerSensor);

router.put("/:sensor_id", jwtValidator, updateSensor);

router.delete("/:sensor_id", jwtValidator, deleteSensor);

export default router;
