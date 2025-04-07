import WebSocket from 'ws';
import { sendSerialJson } from './serialSender.js';


const WS_SERVER_URL = 'ws://localhost:8080'; 
const RECONNECT_DELAY = 5000; // 5 seconds between connection attempts

function connectToServer() {
  console.log(`Connecting to WebSocket server at ${WS_SERVER_URL}...`);
  
  const ws = new WebSocket(WS_SERVER_URL);

  ws.on('open', () => {
    console.log("Connected to server");

    // Register device and sensor
    const deviceRegister = {
      message_type: "register",
      device_type: "light",
      pin: 1
    };

    const sensorRegister = {
      message_type: "register",
      sensor_type: "temperature",
      pin: 2
    };

    ws.send(JSON.stringify(deviceRegister));

    setTimeout(() => {
      ws.send(JSON.stringify(sensorRegister));
    }, 1000);

    
    const sensorInterval = setInterval(() => {
      const tempData = {
        message_type: "sensor_data",
        sensor_id: 1,
        value: (20 + Math.random() * 5).toFixed(1), 
        unit: "celsius"
      };
      ws.send(JSON.stringify(tempData));
      console.log("Sent sensor data:", tempData);
    }, 3000);

    ws.on('close', () => {
      clearInterval(sensorInterval);
      console.log("Connection closed. Attempting to reconnect...");
      setTimeout(connectToServer, RECONNECT_DELAY);
    });
  });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log("Received from server:", message);

      if (message.message_type === "device_update") {
        
        const ack = {
          message_type: "ack",
          device_id: message.device_id,
          status: message.status
        };
        ws.send(JSON.stringify(ack));
        console.log("🔄 Sent ACK:", ack);
        
        
        sendSerialJson(ack);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on('error', (error) => {
    console.error("WebSocket error:", error.message);
    console.log(`⏳ Retrying connection in ${RECONNECT_DELAY/1000} seconds...`);
    setTimeout(connectToServer, RECONNECT_DELAY);
  });
}

// Start the connection
connectToServer();