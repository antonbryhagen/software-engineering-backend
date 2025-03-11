import express from "express";
import jwtValidator from "../middleware/jwtValidator.js";

import { getAllDevices, updateDevice, deleteDevice, toggleDevice, registerDevice } from "../controllers/deviceController.js";


const router = express.Router();

router.patch("/:device_id", jwtValidator, registerDevice)

router.get("/", jwtValidator, getAllDevices)

router.put("/:device_id", jwtValidator, updateDevice)

router.delete("/:device_id", jwtValidator, deleteDevice)

router.patch("/:device_id/toggle", jwtValidator, toggleDevice)


export default router;
