import express from "express";
import * as userController from "../controllers/userController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate);

router.get("/", userController.getAllUsers);
router.get("/:user_id", userController.getUserById);
router.delete("/:user_id", userController.deleteUserById);

export default router;
