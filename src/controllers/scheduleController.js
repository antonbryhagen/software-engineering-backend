/* Author(s): Anton Bryhagen */

import db from "../../models/index.js";
import schedule from "node-schedule";
import { sendSerialJson } from "../serial/serialSender.js";

const { Schedule, Device } = db;

const jobs = new Map();

/**
 * Sets a new schedule for a device.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with the created schedule details.
 * @throws {Error} If there is an error fetching logs or an internal server error occurs.
 */
export const setNewSchedule = async (req, res) => {
    try {
        const { device_id, action_type, scheduled_time } = req.body;
        const userId = req.user.user_id;

        if (!device_id || !action_type || !scheduled_time) {
            return res.status(400).json({ message: "Missing required data" });
        }

        if (action_type !== "toggle_on" && action_type !== "toggle_off") {
            return res.status(400).json({ message: "Invalid action type" });
        }

        const device = await Device.findByPk(device_id);

		if (!device) {
			return res.status(404).json({ message: "Device not found" });
		}

        // Set schedule to toggle device status
        const jobDate = new Date(scheduled_time);

        if(jobDate < new Date()){
            return res.status(400).json({ message: "Scheduled time must be in the future" });
        }

        const newSchedule = await Schedule.create({
            deviceId: device_id,
            actionType: action_type,
            scheduleTime: scheduled_time,
            userId: userId
        });


        const job = schedule.scheduleJob(jobDate, async () => {
            console.log("Scheduled job executed:", device_id, action_type);

            let newStatus;
            if (action_type == "toggle_on"){
                newStatus = "on"
            } else if (action_type == "toggle_off"){
                newStatus = "off"
            }

            const messageForDevice = {
                message_type: "device_update",
                device_id: parseInt(device_id),
                status: newStatus
            }
    
            sendSerialJson(messageForDevice);
    
            await Device.update(
                { status: newStatus, updatedBy: userId },
                { where: { id: device_id }, individualHooks: true }
            )
            await Schedule.destroy({ where: { id: newSchedule.id } });
            jobs.delete(device_id);
        });

        jobs.set(device_id, job);

        return res.status(201).json({
            message: "Created schedule",
            schedule_id: newSchedule.id,
            device_id: newSchedule.deviceId,
            action_type: newSchedule.actionType,
        });

    } catch (error) {
    console.log("Error fetching logs:", error);
    return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Retrieves all schedules from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object containing the formatted schedules.
 * @throws {Error} - If there is an error retrieving the schedules.
 */
export const getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            attributes: ["id", "deviceId", "actionType", "scheduleTime"],
        });

        const formattedSchedules = schedules.map(schedule => ({
            schedule_id: schedule.id,
            device_id: schedule.deviceId,
            action_type: schedule.actionType,
            scheduled_time: schedule.scheduleTime
        })) 

        return res.json(formattedSchedules)

    } catch (error) {
        console.log("Error getting all schedules: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * Deletes a schedule.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with a success or error message.
 * @throws {Error} If there is an error deleting the schedule.
 */
export const deleteSchedule = async (req, res) => {
    try {
        const scheduleId = req.params.schedule_id;

        const schedule = await Schedule.findByPk(scheduleId);

        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        const job = jobs.get(schedule.deviceId);
        if (job) {
            job.cancel();
            jobs.delete(schedule.deviceId);
        }

        await schedule.destroy();

        return res.status(200).json({ message: "Schedule deleted" });

    } catch (error) {
        console.log("Error deleting schedule:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}