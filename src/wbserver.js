
import { WebSocketServer } from 'ws';
import db from '../models/index.js'; //make sure to use the correct path to your models
const wss = new WebSocketServer({ port: 8080 }); //WebSocket port

console.log("WebSocket server running on ws://localhost:8080");

wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleDeviceMessage(data, ws);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });

  ws.on('close', () => {    
    console.log('WebSocket connection closed');
  });
});

async function handleDeviceMessage(data, ws) {
  const { message_type, device_type, sensor_type, pin, device_id, sensor_id, status, value, unit } = data;

  try {
    switch (message_type) {
      case 'register':
        if (device_type) {
          let device = await db.Device.findOne({ where: { pin } });

          if (!device) {
            device = await db.Device.create({
              deviceType: device_type,
              pin,
              deviceName: `New ${device_type}`,
              status: 'off',
              registered: false
            });
            console.log("New device registered:", device.toJSON());
          }

          ws.send(JSON.stringify({
            message_type: 'registered',
            device_id: device.id
          }));
        }

        else if (sensor_type) {
          let sensor = await db.Sensor.findOne({ where: { pin } });

          if (!sensor) {
            sensor = await db.Sensor.create({
              sensorType: sensor_type,
              pin,
              value: 0,
              unit: unit || "unknown",
              location: "Unknown",
              registered: false
            });
            console.log("New sensor registered:", sensor.toJSON());
          }

          ws.send(JSON.stringify({
            message_type: 'registered',
            sensor_id: sensor.id
          }));
        }

        break;

      case 'sensor_data':
        if (!sensor_id) {
          console.error("Missing `sensor_id` in sensor_data message.");
          return;
        }

        await db.Sensor.update(
          {
            value: value || 0,
            unit: unit || "Unknown",
            lastReading: new Date()
          },
          { where: { id: sensor_id } }
        );

        console.log(`Sensor ${sensor_id} updated: ${value} ${unit}`);

        ws.send(JSON.stringify({
          message_type: "ack",
          sensor_id
        }));

        break;

      case 'ack':
        console.log(`Device ${device_id} acknowledged: ${status}`);
        break;

      default:
        console.warn("Unknown message_type:", message_type);
    }
  } catch (error) {
    console.error('Error handling device message:', error);
  }
}