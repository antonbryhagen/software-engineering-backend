import { parser } from "./serialConnection.js";
import db from "../../models/index.js";
import { sendSerialJson } from "./serialSender.js";

parser.on("data", async (data) => {
  try {
    console.log("Received Serial Data:", data);
    const jsonData = JSON.parse(data.trim());

    if (!jsonData.message_type) {
      console.error("Error: Missing `message_type` in received data.");
      return;
    }

    switch (jsonData.message_type) {
      case "register":
        if (jsonData.device_type) {
          const newDevice = await db.Device.create({
            deviceName: `Auto_${jsonData.device_type}`,
            deviceType: jsonData.device_type,
            status: "off",
            location: "Unknown",
            registered: false
          });

          console.log("Device Registered:", newDevice.toJSON());
          /**********  SEND ID TO ARDUINO  ***********/
          sendSerialJson({  message_type: "registered", device_id: newDevice.id });
        }

        if (jsonData.sensor_type) {
          const newSensor = await db.Sensor.create({
            sensorType: jsonData.sensor_type,
            value: 0,
            unit: "Unknown",
            location: "Unknown",
            registered: false
          });

          console.log("Sensor Registered:", newSensor.toJSON());
        }
        break;

      case "device_update":
        if (!jsonData.device_id) {
          console.error("Error: Missing `device_id` in device_update message.");
          return;
        }

        await db.Device.update(
          { status: jsonData.status || "unknown" },
          { where: { id: jsonData.device_id }, individualHooks: true }
        );

        console.log(`Device ${jsonData.device_id} updated to ${jsonData.status}`);
        break;

      case "sensor_data":
        if (!jsonData.sensor_id) {
          console.error("Error: Missing `sensor_id` in sensor_data message.");
          return;
        }

        const sensorExists = await db.Sensor.findByPk(jsonData.sensor_id);
        if (!sensorExists) {
          console.error(`Error: Sensor with ID ${jsonData.sensor_id} not found.`);
          return;
        }

        await db.Sensor.update(
          {
            value: jsonData.value || 0,
            unit: jsonData.unit || "Unknown",
            lastReading: new Date()
          },
          { where: { id: jsonData.sensor_id } }
        );

        console.log(`Sensor ${jsonData.sensor_id} updated: Value = ${jsonData.value} ${jsonData.unit}`);
        break;

      default:
        console.error("Unknown message type:", jsonData.message_type);
    }
  } catch (error) {
    console.error("Error processing serial data:", error);
  }
});
