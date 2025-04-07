import express from "express";
import * as deviceController from "../controllers/deviceController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate);

router.get("/", deviceController.getAllDevices);
router.post("/register/:device_id", deviceController.registerDevice);
router.put("/:device_id", deviceController.updateDevice);
router.delete("/:device_id", deviceController.deleteDevice);
router.patch("/:device_id/toggle", deviceController.toggleDevice);

export default router;
