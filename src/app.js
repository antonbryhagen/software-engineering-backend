import express from "express";
import cors from "cors";

import deviceRoutes from "./routes/deviceRoutes.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import actionRoutes from "./routes/actionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";

import "./serial/serialListener.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/devices", deviceRoutes);
app.use("/sensors", sensorRoutes);
app.use("/logs", logRoutes);
app.use("/actions", actionRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/schedules", scheduleRoutes);

export default app;
