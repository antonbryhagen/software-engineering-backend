import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Sequelize from "sequelize";
import process from "process";
import configFile from "../config/config.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = configFile[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {};

const modelFiles = fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      !file.endsWith(".test.js")
    );
  });

for (const file of modelFiles) {
  const modelModule = await import(path.join(__dirname, file));
  const model = modelModule.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

db.User.hasMany(db.Permission, { foreignKey: "userId" });
db.User.hasMany(db.Action, { foreignKey: "userId" });
db.User.hasMany(db.Schedule, { foreignKey: "userId" });

db.Device.hasMany(db.Sensor, { foreignKey: "deviceId" });
db.Device.hasMany(db.Permission, { foreignKey: "deviceId" });
db.Device.hasMany(db.Action, { foreignKey: "deviceId" });
db.Device.hasMany(db.Log, { foreignKey: "deviceId" });
db.Device.hasMany(db.Schedule, { foreignKey: "deviceId" });

db.Sensor.belongsTo(db.Device, { foreignKey: "deviceId" });
db.Sensor.hasMany(db.Log, { foreignKey: "sensorId" });

db.Permission.belongsTo(db.User, { foreignKey: "userId" });
db.Permission.belongsTo(db.Device, { foreignKey: "deviceId" });

db.Action.belongsTo(db.User, { foreignKey: "userId" });
db.Action.belongsTo(db.Device, { foreignKey: "deviceId" });

db.Log.belongsTo(db.Device, { foreignKey: "deviceId" });
db.Log.belongsTo(db.Sensor, { foreignKey: "sensorId" });

db.Schedule.belongsTo(db.User, { foreignKey: "userId" });
db.Schedule.belongsTo(db.Device, { foreignKey: "deviceId" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(" Database connected");
    await sequelize.sync({ alter: true });
    console.log(" Tables synchronized");
  } catch (error) {
    console.error(" Database connection error:", error);
  }
};

initDB();

export default db;
