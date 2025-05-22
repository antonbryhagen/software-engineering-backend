
/* Author: Nahed Al Awlaki */

import { EventEmitter } from "events";
import db from "../../models/index.js";

const fakeParser = new EventEmitter();

fakeParser.on("data", async (data) => {
  try {
    console.log("Received Fake Data:", data);
    const jsonData = JSON.parse(data.trim());

    if (!jsonData.message_type) {
      console.error("Error: Missing message_type in received data.");
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

      case "sensor_data":
        if (!jsonData.sensor_id) {
          console.error("Error: Missing `sensor_id` in sensor_data message.");
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
    console.error("Error processing fake serial data:", error);
  }
});

export { fakeParser as parser };
