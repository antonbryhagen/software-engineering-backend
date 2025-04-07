import db from "../models/index.js";

const { Action, User, Device } = db;

export const getAllActions = async (req, res) => {
  try {
    const actions = await Action.findAll({
      include: [
        { model: User, attributes: ["id", "username"] },
        { model: Device, attributes: ["id", "deviceName"] }
      ],
      order: [["timestamp", "DESC"]],
    });

    const formatted = actions.map(action => ({
      id: action.id,
      user: action.User?.username || "Unknown",
      device: action.Device?.deviceName || "Unknown",
      action: action.actionType,
      time: action.timestamp
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching actions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
