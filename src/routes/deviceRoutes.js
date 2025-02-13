import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({"message": "api is running"});
})

export default router;