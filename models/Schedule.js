import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Schedule = sequelize.define("Schedule", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
    scheduleTime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: "Schedules"
  });

  return Schedule;
};
