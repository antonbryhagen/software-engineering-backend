import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Device = sequelize.define(
    "Device",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      deviceType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "off",
      },
      lastUpdate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deviceName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      registered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Users", key: "id" },
      },
      pin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      }
    },
    {
      tableName: "Devices",
      timestamps: true,
    }
  );

  Device.beforeUpdate(async (device) => {
    if (device.changed("status")) {
      await sequelize.models.Action.create({
        userId: device.updatedBy,
        deviceId: device.id,
        actionType: `Device turned ${device.status}`,
      });
    }
  });

  return Device;
};