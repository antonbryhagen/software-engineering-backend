import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Log = sequelize.define("Log", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    deviceId: {
      type: DataTypes.INTEGER,
      references: { model: "Devices", key: "id" },
      allowNull: true
    },
    eventDescription: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: "Logs"
  });

  return Log;
};
