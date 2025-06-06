/* Author(s): Kotayba Sayed */
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Sensor = sequelize.define("Sensor", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sensorName: {
      type: DataTypes.STRING,
      allowNull: false,
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
    registered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    }
  },
    {
      tableName: "Sensors",
      timestamps: true
    });

  return Sensor;
};
