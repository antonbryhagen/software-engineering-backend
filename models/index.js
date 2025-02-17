// models/index.js (ESM version)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Sequelize from "sequelize";
import process from "process";
import configFile from "../config/config.json" assert { type: "json" };

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

// We'll store models here
const db = {};

// Read all JS files in this directory (except index.js itself)
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

// Dynamically import each model file
for (const file of modelFiles) {
  // Import the model file
  const modelModule = await import(path.join(__dirname, file));
  // The default export from each model file is a function: (sequelize, DataTypes) => model
  const model = modelModule.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// If any models have an associate() method, call it
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach sequelize instances
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export as the default ESM export
export default db;
