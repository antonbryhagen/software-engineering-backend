import app from "./app.js";
import "dotenv/config";
import db from "../models/index.js";

const PORT = process.env.PORT || 1234;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log("Server started");
    });
});
