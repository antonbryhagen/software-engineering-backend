import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();


const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql"
    }
);

// Creating an empty db object
const db = {
    sequelize,
    Sequelize
};


import ActionModel from "./actions.js";
import DeviceModel from "./Device.js";
import LogModel from "./Log.js";
import UserModel from "./user.js";  

// 4. Initialize all models
db.Action = ActionModel(sequelize, Sequelize.DataTypes);
db.Device = DeviceModel(sequelize, Sequelize.DataTypes);
db.Log = LogModel(sequelize, Sequelize.DataTypes);
db.User = UserModel(sequelize, Sequelize.DataTypes); 


db.User.hasMany(db.Action, { foreignKey: "userId" });
db.Action.belongsTo(db.User, { foreignKey: "userId" });

db.Device.hasMany(db.Action, { foreignKey: "deviceId" });
db.Action.belongsTo(db.Device, { foreignKey: "deviceId" });

export default db;