/* Author: Nahed Al Awlaki - Upgraded for WSS + JWT */

import https from 'https';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import db from '../models/index.js';
import "dotenv/config";

// Loading SSL certs
const serverOptions = {
  key: fs.readFileSync('./certificate/key.pem'), //key.pem
  cert: fs.readFileSync('./certificate/cert.pem') //cert.pem
};

// Create HTTPS server
const httpsServer = https.createServer(serverOptions);

// Create WebSocket server on top of HTTPS
const wss = new WebSocketServer({ server: httpsServer });

console.log("Secure WebSocket server running on wss://localhost:1234");

const clients = new Set();

wss.on('connection', (ws, req) => {
  // Extract token from query parameter
  const url = new URL(req.url, `https://${req.headers.host}`);
  const token = url.searchParams.get('token');

  if (!token) {
    console.log('Connection rejected: Missing token');
    ws.close(4001, 'Missing token');
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ws.user = decoded;
    clients.add(ws);
    console.log('WebSocket client authenticated:', decoded);
  } catch (err) {
    console.log('Connection rejected: Invalid token');
    ws.close(4002, 'Invalid token');
    return;
  }

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
    clients.delete(ws);
  });
});

// message handling logic
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
        } else if (sensor_type) {
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

export function sendWebSocketMessage(message) {
  const messageString = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === 1) {
      client.send(messageString);
    }
  }
}

export { wss, httpsServer };
