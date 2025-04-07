import app from "./app.js";
import "dotenv/config";
import db from "./models/index.js";
import "./wbServer.js"; 

const PORT = process.env.PORT || 1234;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`HTTP server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to connect to database:", err);
});
