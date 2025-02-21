import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Permission = sequelize.define("Permission", {
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
    permission: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: "Permissions"
  });

  return Permission;
};
