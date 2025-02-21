import db from "../models/index.js";

async function testDatabase() {
  try {
    console.log("Connecting to database...");
    await db.sequelize.authenticate();
    console.log("Database connection successful!");

    const testUser = await db.User.create({
      username: "test_user",
      password: "securepassword",
      admin: true
    });

    console.log("Test user created:", testUser.toJSON());

    const testDevice = await db.Device.create({
      deviceType: "Light",
      status: "off",
      deviceName: "Living Room Light"
    });

    console.log("Test device created:", testDevice.toJSON());

    const userPermission = await db.Permission.create({
      userId: testUser.id,
      deviceId: testDevice.id,
      permission: "control"
    });

    console.log("Permission assigned:", userPermission.toJSON());

    const testSensor = await db.Sensor.create({
      sensorType: "Temperature",
      value: 22.5,
      unit: "Celsius",
      deviceId: testDevice.id
    });

    console.log("Test sensor created:", testSensor.toJSON());

    const testAction = await db.Action.create({
      userId: testUser.id,
      deviceId: testDevice.id,
      actionType: "Turn On"
    });

    console.log("Action logged:", testAction.toJSON());

    const testLog = await db.Log.create({
      deviceId: testDevice.id,
      eventDescription: "Device turned on"
    });

    console.log("Event logged:", testLog.toJSON());

    const testSchedule = await db.Schedule.create({
      userId: testUser.id,
      deviceId: testDevice.id,
      actionType: "Turn Off",
      scheduleTime: new Date(Date.now() + 3600000)
    });

    console.log("Scheduled action created:", testSchedule.toJSON());

    const userWithDevices = await db.User.findAll({
      include: [
        { model: db.Permission, include: [db.Device] },
        { model: db.Action },
        { model: db.Schedule }
      ]
    });

    console.log("User and their related data:", JSON.stringify(userWithDevices, null, 2));

    console.log("All tests passed successfully.");

  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    console.log("Waiting before closing database connection...");
    setTimeout(async () => {
      await db.sequelize.close();
      console.log("Database connection closed successfully.");
    }, 1000);
  }
}

testDatabase();