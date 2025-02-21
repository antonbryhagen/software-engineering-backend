import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Device = sequelize.define("Device", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    deviceType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "off"
    },
    lastUpdate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deviceName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: "Devices",
    timestamps: true
  });

  return Device;
};