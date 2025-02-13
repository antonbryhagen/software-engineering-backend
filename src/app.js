import express from "express";
import cors from "cors";

import deviceRoutes from "./routes/deviceRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/devices", deviceRoutes);

export default app;
