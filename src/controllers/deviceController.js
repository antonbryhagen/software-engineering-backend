import bcrypt from "bcrypt";
import db from "../../models/index.js"

const { Device } = db;

/*export const addDeviceToDB = async (req, res) => {
    try {
        const { device_name, device_type, location, status } = req.body;

        if (!device_name || !device_type || !location) {
            return res.status(400).json({message: "Missing required data"});
        } 

        const newDevice = await Device.create({
            deviceName: device_name,
            deviceType: device_type,
            status: status ? status : "off", //default off status, else pass in status wanted
            lastUpdate: new Date()
            //location: location,
        });

        return res.status(201).json({
            message: "Device added to database",
            device_id: newDevice.id,
            device_name: newDevice.deviceName,
            status: newDevice.status
        })

    } catch (error) {
        console.log("Error adding device: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}*/

export const getAllDevices = async (req, res) => {
    try {

        const devices = await Device.findAll({
            attributes: ["id", "deviceType", "deviceName", "status", "location", "lastUpdate", "updatedAt", "createdAt", "registered"],
        });

        const formattedDevices = devices.map(device => ({
            device_id: device.id,
            device_name: device.deviceName,
            device_type: device.deviceType,
            status: device.status,
            location: device.location,
            last_update: device.lastUpdate,
            updated_at: device.updatedAt,
            created_at: device.createdAt,
            registered: device.registered
        })) 

        res.json(formattedDevices)

    } catch (error) {
        console.log("Error getting all devices: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const registerDevice = async (req, res) => {

    try {

        if(!req.user.admin){
            return res.status(403).json({ message: "Invalid authorization" });
        }

        const id = req.params.device_id;
        const { device_name, location, status } = req.body;

        const currentDevice = await Device.findByPk(id);

		if (!currentDevice){
			return res.status(404).json({ message: "Device not found" });
		}

        if (!device_name || !location) {
            return res.status(400).json({ message: "Missing required data" });
        }

        currentDevice.deviceName = device_name;
        currentDevice.status = status || currentDevice.status;
        currentDevice.location = location;
        currentDevice.registered = true;

		await currentDevice.save();

        res.json( {
            message: "Device registered",
            device_id: currentDevice.id,
            device_name: device_name,
            status: status ? status : currentDevice.status
        } );

    } catch (error) {
        console.log("Error registering device: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateDevice = async (req, res) => {

    try {
        if(!req.user.admin){
            return res.status(403).json({ message: "Invalid authorization" });
        }

        const id = req.params.device_id;
        const { device_name, device_type, location } = req.body;

        const currentDevice = await Device.findByPk(id);

		if (!currentDevice){
			return res.status(404).json({ message: "Device not found" });
		}

        currentDevice.deviceName = device_name || currentDevice.deviceName;
        /*SHOULD NOT BE SET BY API, TROUGH ARDUINO / SIMULATED HOUSEcurrentDevice.deviceType = device_type || currentDevice.deviceType;*/
        currentDevice.location = location || currentDevice.location;

		await currentDevice.save();

        res.json( {message: "Device updated"} );

    } catch (error) {
        console.log("Error updating device: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteDevice = async (req, res) => {
	try{
		const id = req.params.device_id;

		const device = await Device.findByPk(id);

		if (!device){
			return res.status(404).json({ message: "Device not found" });
		}

		await device.destroy();
	
		res.json({ message: "Device deleted" });

	} catch (error) {
		console.log("Error updating device: ", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
	
}

export const toggleDevice = async (req, res) => {
    try{
		const id = req.params.device_id;
        const newStatus = req.body.status;

		const device = await Device.findByPk(id);

		if (!device) {
			return res.status(404).json({ message: "Device not found" });
		}

        if (!newStatus) {
            return res.status(400).json({ message: "No updated status provided" });
        }

        //TODO Send message to actual device to toggle

        const messageForDevice = {
            message_type: "device_update",
            device_id: parseInt(id),
            status: newStatus
        }

        console.log(messageForDevice)

		device.status = newStatus;

		await device.save();
	
		res.json({ device_id: device.id, status: newStatus });

	} catch (error) {
		console.log("Error updating device: ", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
}