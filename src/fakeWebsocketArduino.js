import WebSocket from 'ws';
//this one is for the fake arduino that test on the server through wifi, not the arduino itself.
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('🔌 Connected to WebSocket server');

  // Send Device Registration
  const deviceRegisterMessage = JSON.stringify({
    message_type: "register",
    device_type: "Light",
    pin: 1234
  });
  ws.send(deviceRegisterMessage);
  console.log('Sent device register message');

  // Send Sensor Registration
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

  // Send Sensor Data
  setTimeout(() => {
    const sensorDataMessage = JSON.stringify({
      message_type: "sensor_data",
      sensor_id: 1,
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
