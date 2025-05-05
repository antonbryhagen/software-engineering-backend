/* Author(s): Anton Bryhagen */

import bcrypt from "bcrypt";
import db from "../../models/index.js"
import { status } from "init";
import { where } from "sequelize";
import { sendSerialJson } from "../serial/serialSender.js";
import { sendWebSocketJson } from '../wbSocketSender.js';

const { Device } = db;
const { Log } = db;

/**
 * Retrieves all devices from the database.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response containing the list of devices.
 * @throws {Error} - If there is an error retrieving the devices.
 */
export const getAllDevices = async (req, res) => {
    try {

        const { registered } = req.query;

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

        if (registered) {
            const filteredDevices = formattedDevices.filter(device => device.registered === (registered === 'true'));
            return res.json(filteredDevices);
        }

        res.json(formattedDevices)

    } catch (error) {
        console.log("Error getting all devices: ", error);

        await Log.create({
            deviceId: null,
            eventDescription: "Error getting all devices." + error,
        });
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * Registers a device.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the registered device details.
 * @throws {Error} - If there is an error registering the device.
 */
export const registerDevice = async (req, res) => {
    let id;
    try {

        if(!req.user.admin){
            return res.status(403).json({ message: "Invalid authorization" });
        }

        id = req.params.device_id;
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
        await Log.create({
            deviceId: id,
            eventDescription: "Error registering device. " + error,
        });
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * Updates a device.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with update confirmation message
 * @throws {Error} - If there is an error updating the device.
 */
export const updateDevice = async (req, res) => {
    let id;
    try {
        if(!req.user.admin){
            return res.status(403).json({ message: "Invalid authorization" });
        }

        id = req.params.device_id;
        const { device_name, device_type, location } = req.body;

        const currentDevice = await Device.findByPk(id);

		if (!currentDevice){
			return res.status(404).json({ message: "Device not found" });
		}

        currentDevice.deviceName = device_name || currentDevice.deviceName;
        /*SHOULD NOT BE SET BY API, TROUGH ARDUINO / SIMULATED HOUSEcurrentDevice.deviceType = device_type || currentDevice.deviceType;*/
        currentDevice.location = location || currentDevice.location;

		await currentDevice.save();

        return res.json( {message: "Device updated"} );

    } catch (error) {
        console.log("Error updating device: ", error);
        await Log.create({
            deviceId: id,
            eventDescription: "Error updating device. " + error,
        });
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * Deletes a device.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with a message indicating the success or failure of the deletion.
 * @throws {Error} - If there is an error deleting the device.
 */
export const deleteDevice = async (req, res) => {
    let id;
	try{

        if(!req.user.admin){
            return res.status(403).json({ message: "Invalid authorization" });
        }

		id = req.params.device_id;

		const device = await Device.findByPk(id);

		if (!device){
			return res.status(404).json({ message: "Device not found" });
		}

		await device.destroy();
	
		res.json({ message: "Device deleted" });

	} catch (error) {
		console.log("Error deleting device: ", error);
        await Log.create({
            deviceId: id,
            eventDescription: "Error deleting device. " + error,
        });
		return res.status(500).json({ message: "Internal Server Error" });
	}
	
}

/**
 * Toggles the status of a device.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the updated device status.
 * @throws {Error} - If an error occurs while toggling the device.
 */
export const toggleDevice = async (req, res) => {
    let id;
    try{
		id = req.params.device_id;
        const newStatus = req.body.status;
        const userId = req.user.user_id;

		const device = await Device.findByPk(id);

		if (!device) {
			return res.status(404).json({ message: "Device not found" });
		}

        if (!newStatus) {
            return res.status(400).json({ message: "No updated status provided" });
        }

        const messageForDevice = {
            message_type: "device_update",
            device_id: parseInt(id),
            status: newStatus
        }

        sendSerialJson(messageForDevice);
        sendWebSocketJson(messageForDevice);

        await Device.update(
            { status: newStatus, updatedBy: userId },
            { where: { id }, individualHooks: true }
        )
	
		res.json({ device_id: device.id, status: newStatus });

	} catch (error) {
		console.log("Error toggling device: ", error);
        await Log.create({
            deviceId: id,
            eventDescription: "Error toggling device. " + error,
        });
		return res.status(500).json({ message: "Internal Server Error" });
	}
}