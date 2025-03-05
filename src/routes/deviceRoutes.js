import express from "express";
import jwtValidator from "../middleware/jwtValidator.js";

import { getAllDevices,	addDeviceToDB, updateDevice, deleteDevice, toggleDevice } from "../controllers/deviceController.js";


const router = express.Router();

router.post("/", jwtValidator, addDeviceToDB )

router.get("/", jwtValidator, getAllDevices)

router.put("/:device_id", jwtValidator, updateDevice)

router.delete("/:device_id", jwtValidator, deleteDevice)

router.post("/:device_id/toggle", jwtValidator, toggleDevice)


export default router;
