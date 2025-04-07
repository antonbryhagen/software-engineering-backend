import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Action = sequelize.define("Action", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "Users", key: "id" },
    },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "Devices", key: "id" },
    },
    actionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "Actions",
    timestamps: false,
  });

  return Action;
};
