import app from "./app.js";
import "dotenv/config";
import db from "../models/index.js";
import { httpsServer } from './wbserver.js';  //sure you're importing httpsServer

const PORT = process.env.PORT || 1234;

db.sequelize.sync().then(() => {
    httpsServer.on('request', app);
    httpsServer.listen(PORT, () => {
        console.log(`HTTPS + WSS Server started on port ${PORT}`);
    });
});
