import db from "../models/index.js";

async function testDatabase() {
  try {
    console.log("Connecting to database...");
    await db.sequelize.authenticate();
    console.log("Database connection successful.");

    const testUser = await db.User.create({
      username: "test_user",
      password: "securepassword",
      admin: true
    });
    console.log("Test user created:", testUser.toJSON());

    const testDevice = await db.Device.create({
      deviceType: "Light",
      status: "off",
      deviceName: "Living Room Light",
      updatedBy: testUser.id
    });
    console.log("Test device created:", testDevice.toJSON());

    await db.Device.update(
      { status: "on", updatedBy: testUser.id },
      { where: { id: testDevice.id }, individualHooks: true }
    );
    console.log("Device status updated to ON.");

    const latestAction = await db.Action.findOne({
      where: { deviceId: testDevice.id },
      order: [["timestamp", "DESC"]]
    });

    if (latestAction) {
      console.log("Action was logged successfully:", latestAction.toJSON());
    } else {
      console.log("No action was logged.");
    }

  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    console.log("Waiting before closing database connection...");
    setTimeout(async () => {
      await db.sequelize.close();
      console.log("Database connection closed.");
    }, 1000);
  }
}

testDatabase();
