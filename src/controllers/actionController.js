import db from "../../models/index.js";

const { Action, User, Device } = db;

export const getAllActions = async (req, res) => {
  try {
    const actions = await Action.findAll({
      include: [
        { model: User, attributes: ["id", "username"] },
        { model: Device, attributes: ["id", "deviceName"] }
      ],
      attributes: ["id", "actionType", "timestamp"]
    });

    res.json({
      actions: actions.map(action => ({
        action_id: action.id,
        user: action.User ? { user_id: action.User.id, username: action.User.username } : null,
        device: action.Device ? { device_id: action.Device.id, device_name: action.Device.deviceName } : null,
        action_type: action.actionType,
        timestamp: action.timestamp
      }))
    });

  } catch (error) {
    console.log("Error fetching actions:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getActionsByDevice = async (req, res) => {
  try {
    const { device_id } = req.params;

    const actions = await Action.findAll({
      where: { deviceId: device_id },
      include: [{ model: User, attributes: ["id", "username"] }],
      attributes: ["id", "actionType", "timestamp"]
    });

    res.json({
      actions: actions.map(action => ({
        action_id: action.id,
        user: action.User ? { user_id: action.User.id, username: action.User.username } : null,
        action_type: action.actionType,
        timestamp: action.timestamp
      }))
    });

  } catch (error) {
    console.log("Error fetching actions for device:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getActionsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const actions = await Action.findAll({
      where: { userId: user_id },
      include: [{ model: Device, attributes: ["id", "deviceName"] }],
      attributes: ["id", "actionType", "timestamp"]
    });

    res.json({
      actions: actions.map(action => ({
        action_id: action.id,
        device: action.Device ? { device_id: action.Device.id, device_name: action.Device.deviceName } : null,
        action_type: action.actionType,
        timestamp: action.timestamp
      }))
    });

  } catch (error) {
    console.log("Error fetching actions for user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
