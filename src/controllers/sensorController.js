/* Author(s): Kotayba Sayed */

import db from "../../models/index.js";

const { Sensor, Log } = db;

export const getAllSensors = async (req, res) => {
  try {
    const sensors = await Sensor.findAll({
      attributes: ["id", "sensorName", "sensorType", "value", "unit", "location", "lastReading", "registered"]
    });

    res.json(sensors.map(sensor => ({
      sensor_id: sensor.id,
      sensor_name: sensor.sensorName,
      sensor_type: sensor.sensorType,
      value: sensor.sensorType === "button" ? (sensor.value === 0 ? "off" : "on") : sensor.value,
      unit: sensor.unit,
      location: sensor.location,
      last_reading: sensor.lastReading,
      registered: sensor.registered
    })));

  } catch (error) {
    console.log("Error fetching sensors:", error);
    await Log.create({ eventDescription: "Error fetching sensors: " + error });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSensorById = async (req, res) => {
  try {
    const sensor = await Sensor.findByPk(req.params.sensor_id);

    if (!sensor) {
      return res.status(404).json({ message: "Sensor not found" });
    }

    res.json({
      sensor_id: sensor.id,
      sensor_name: sensor.sensorName,
      sensor_type: sensor.sensorType,
      value: sensor.sensorType === "button" ? (sensor.value === 0 ? "off" : "on") : sensor.value,
      unit: sensor.unit,
      location: sensor.location,
      last_reading: sensor.lastReading,
      registered: sensor.registered
    });

  } catch (error) {
    console.log("Error fetching sensor:", error);
    await Log.create({ eventDescription: "Error fetching sensor: " + error });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const registerSensor = async (req, res) => {
  try {
    if (!req.user.admin) {
      return res.status(403).json({ message: "Invalid authorization" });
    }

    const { sensor_name, location } = req.body;
    const sensor = await Sensor.findByPk(req.params.sensor_id);

    if (!sensor) {
      return res.status(404).json({ message: "Sensor not found" });
    }

    sensor.sensorName = sensor_name || sensor.sensorName;
    sensor.location = location || sensor.location;
    sensor.registered = true;

    await sensor.save();

    res.json({ message: "Sensor registered", sensor_id: sensor.id, sensor_name: sensor.sensorName });

  } catch (error) {
    console.log("Error registering sensor:", error);
    await Log.create({ eventDescription: "Error registering sensor: " + error });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateSensor = async (req, res) => {
  try {
    if (!req.user.admin) {
      return res.status(403).json({ message: "Invalid authorization" });
    }

    const { sensor_name, location } = req.body;
    const sensor = await Sensor.findByPk(req.params.sensor_id);

    if (!sensor) {
      return res.status(404).json({ message: "Sensor not found" });
    }

    sensor.sensorName = sensor_name || sensor.sensorName;
    sensor.location = location || sensor.location;

    await sensor.save();

    res.json({ message: "Sensor updated", sensor_name: sensor.sensorName });

  } catch (error) {
    console.log("Error updating sensor:", error);
    await Log.create({ eventDescription: "Error updating sensor: " + error });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteSensor = async (req, res) => {
  try {
    if (!req.user.admin) {
      return res.status(403).json({ message: "Invalid authorization" });
    }

    const sensor = await Sensor.findByPk(req.params.sensor_id);

    if (!sensor) {
      return res.status(404).json({ message: "Sensor not found" });
    }

    await sensor.destroy();

    res.json({ message: "Sensor deleted" });

  } catch (error) {
    console.log("Error deleting sensor:", error);
    await Log.create({ eventDescription: "Error deleting sensor: " + error });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
