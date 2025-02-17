import express from "express";
import cors from "cors";

import deviceRoutes from "./routes/deviceRoutes.js";
import authRoutes from "./routes/authRoutes.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/devices", deviceRoutes);

app.use("/auth", authRoutes)

export default app;
