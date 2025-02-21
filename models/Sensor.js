import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Sensor = sequelize.define("Sensor", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sensorType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastReading: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deviceId: {
      type: DataTypes.INTEGER,
      references: { model: "Devices", key: "id" },
      allowNull: false
    }
  }, {
    tableName: "Sensors",
    timestamps: true
  });

  return Sensor;
};
