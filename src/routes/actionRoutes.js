import express from "express";
import * as actionController from "../controllers/actionController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate);

router.get("/", actionController.getAllActions);

export default router;
