/* Author: Nahed Al Awlaki - Upgraded for WSS + JWT */

import WebSocket from 'ws';

//put token for auth    
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InRlc3RVc2VyIiwiYWRtaW4iOmZhbHNlLCJpYXQiOjE3NTAwMTQxMTgsImV4cCI6MTc1MDAxNzcxOH0.fr3Aa00o3QprvG5ob2-dNousjQePxm3pHMUhjWc_3gI";

// Create secure WebSocket connection with token
const ws = new WebSocket(`wss://localhost:1234/?token=${token}`, {
  rejectUnauthorized: false // Allow self-signed certs during development
});

ws.on('open', () => {
  console.log('Connected to WebSocket server securely');

  // Send Device Registration
  const deviceRegisterMessage = JSON.stringify({
    message_type: "register",
    device_type: "Light",
    pin: 1234
  });
  ws.send(deviceRegisterMessage);
  console.log('Sent device register message');

  // Send Sensor Registration after 2 seconds
  setTimeout(() => {
    const sensorRegisterMessage = JSON.stringify({
      message_type: "register",
      sensor_type: "Temperature",
      pin: 5678,
      unit: "Celsius"
    });
    ws.send(sensorRegisterMessage);
    console.log('Sent sensor register message');
  }, 2000);

  // Send Sensor Data after 5 seconds
  setTimeout(() => {
    const sensorDataMessage = JSON.stringify({
      message_type: "sensor_data",
      sensor_id: 1,  // Replace with correct sensor_id after first run
      value: 25.5,
      unit: "Celsius"
    });
    ws.send(sensorDataMessage);
    console.log('Sent sensor data message');
  }, 5000);
});

ws.on('message', (data) => {
  console.log('Received from server:', data.toString());
});

ws.on('close', () => {
  console.log('WebSocket connection closed');
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});
