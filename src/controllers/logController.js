/* Author(s): Kotayba Sayed */

import db from "../../models/index.js";
const { Log } = db;

export const getAllLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({
      attributes: ["id", "deviceId", "sensorId", "eventDescription", "timestamp"]
    });

    res.json({
      logs: logs.map(log => ({
        log_id: log.id,
        device_id: log.deviceId,
        sensor_id: log.sensorId,
        event_desc: log.eventDescription,
        time_stamp: log.timestamp
      }))
    });

  } catch (error) {
    console.log("Error fetching logs:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getLogsFromDate = async (req, res) => {
  try {
    const { date } = req.params;

    const logs = await Log.findAll({
      where: {
        timestamp: {
          [db.Sequelize.Op.gte]: new Date(date)
        }
      },
      attributes: ["id", "deviceId", "sensorId", "eventDescription", "timestamp"]
    });

    res.json({
      logs: logs.map(log => ({
        log_id: log.id,
        device_id: log.deviceId,
        sensor_id: log.sensorId,
        event_desc: log.eventDescription,
        time_stamp: log.timestamp
      }))
    });

  } catch (error) {
    console.log("Error fetching logs from date:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
