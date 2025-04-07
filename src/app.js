import express from "express";
import cors from "cors";


import deviceRoutes from "./routes/deviceRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import actionRoutes from "./routes/actionRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());


app.use("/actions", actionRoutes);
app.use("/devices", deviceRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/sensors", sensorRoutes);
app.use("/logs", logRoutes);

export default app;