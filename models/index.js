import { Sequelize } from "sequelize";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import UserModel from "./user.js";
import DeviceModel from "./device.js";
import ActionModel from "./Action.js";
import LogModel from "./Log.js";
import ScheduleModel from "./Schedule.js";
import SensorModel from "./Sensor.js";

// Setup __dirname manually (because we're using ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read config.json manually
const configPath = path.resolve(__dirname, "../config/config.json");
const configFile = JSON.parse(readFileSync(configPath, "utf-8"));

const env = process.env.NODE_ENV || "development";
const config = configFile[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = UserModel(sequelize);
db.Device = DeviceModel(sequelize);
db.Action = ActionModel(sequelize);
db.Log = LogModel(sequelize);
db.Schedule = ScheduleModel(sequelize);
db.Sensor = SensorModel(sequelize);

// Associations
db.Action.belongsTo(db.User, { foreignKey: "userId" });
db.Action.belongsTo(db.Device, { foreignKey: "deviceId" });

db.Log.belongsTo(db.Device, { foreignKey: "deviceId" });
db.Log.belongsTo(db.Sensor, { foreignKey: "sensorId" });

db.Schedule.belongsTo(db.Device, { foreignKey: "deviceId" });

db.Device.belongsTo(db.User, { foreignKey: "updatedBy" });

export default db;
