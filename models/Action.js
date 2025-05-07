/* Author(s): Kotayba Sayed */
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Action = sequelize.define("Action", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "Users", key: "id" },
      allowNull: false
    },
    deviceId: {
      type: DataTypes.INTEGER,
      references: { model: "Devices", key: "id" },
      allowNull: false
    },
    actionType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: "Actions"
  });

  return Action;
};
