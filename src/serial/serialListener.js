import { parser, useSerial } from "./serialConnection.js";
import db from "../../models/index.js";
import { sendSerialJson } from "./serialSender.js";

if (useSerial) {
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
          if (jsonData.device_type && jsonData.pin !== undefined) {
            const existingDevice = await db.Device.findOne({ where: { pin: jsonData.pin } });

            if (existingDevice) {
              console.log("Existing Device Found:", existingDevice.toJSON());
              sendSerialJson({ message_type: "registered", device_id: existingDevice.id });
              // Send saved status to device
              setTimeout(() => {sendSerialJson({ message_type: "device_update", device_id: existingDevice.id, status: existingDevice.status });}, 1000);
            } else {
              const newDevice = await db.Device.create({
                deviceName: `Auto_${jsonData.device_type}`,
                deviceType: jsonData.device_type,
                status: "off",
                location: "Unknown",
                registered: false,
                pin: jsonData.pin
              });

              console.log("New Device Registered:", newDevice.toJSON());
              sendSerialJson({ message_type: "registered", device_id: newDevice.id });
            }
          }

          else if (jsonData.sensor_type && jsonData.pin !== undefined) {
            const existingSensor = await db.Sensor.findOne({ where: { pin: jsonData.pin } });

            if (existingSensor) {
              console.log("Existing Sensor Found:", existingSensor.toJSON());
              sendSerialJson({ message_type: "registered", sensor_id: existingSensor.id });
            } else {
              const newSensor = await db.Sensor.create({
                sensorType: jsonData.sensor_type,
                value: 0,
                unit: jsonData.unit || "Unknown",
                location: "Unknown",
                registered: false,
                pin: jsonData.pin
              });

              console.log("New Sensor Registered:", newSensor.toJSON());
              sendSerialJson({ message_type: "registered", sensor_id: newSensor.id });
            }
          }

          else {
            console.error("Error: Missing `device_type`, `sensor_type`, or `pin` in register message.");
          }
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

          case "ack":
            console.log("Acknowledgment received from physical house:", jsonData);
          break;

        default:
          console.error("Unknown message type:", jsonData.message_type);
      }
    } catch (error) {
      console.error("Error processing serial data:", error);
    }
  });
}
