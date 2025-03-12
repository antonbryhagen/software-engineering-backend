import { parser } from "./testSerialListener.js";

const sendFakeData = () => {
  const fakeDeviceRegistration = JSON.stringify({
    message_type: "register",
    device_type: "Light"
  });

  const fakeSensorRegistration = JSON.stringify({
    message_type: "register",
    sensor_type: "Temperature"
  });

  console.log("Sending Fake Device Registration:", fakeDeviceRegistration);
  parser.emit("data", fakeDeviceRegistration);

  setTimeout(() => {
    console.log("Sending Fake Sensor Registration:", fakeSensorRegistration);
    parser.emit("data", fakeSensorRegistration);
  }, 2000);
};

const sendFakeSensorData = () => {
  const fakeTemperatureData = JSON.stringify({
    message_type: "sensor_data",
    sensor_id: 1,
    value: 25.5,
    unit: "Celsius"
  });

  console.log("Sending Fake Sensor Data:", fakeTemperatureData);
  parser.emit("data", fakeTemperatureData);
};

setTimeout(sendFakeData, 3000);
setTimeout(sendFakeSensorData, 6000);
