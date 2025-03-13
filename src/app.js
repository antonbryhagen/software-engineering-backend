import express from "express";
import cors from "cors";

import deviceRoutes from "./routes/deviceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import "./serial/serialListener.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/devices", deviceRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes)

export default app;
