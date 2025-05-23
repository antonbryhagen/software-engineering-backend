/* Author(s): Anton Bryhagen */

import { port, useSerial } from './serialConnection.js';

/**
 * Sends a JSON message over the serial port.
 * 
 * @param {Object} jsonMessage - The JSON message to be sent.
 * @returns {void}
 */
function sendSerialJson(jsonMessage) {
    if (useSerial){
        if (!port.isOpen) {
            console.error('Serial port not open.');
            return;
        }
    
        try {
            // Convert JSON object to string and send it over the serial port
            const messageString = JSON.stringify(jsonMessage);
            port.write(messageString + '\n', (err) => {
                if (err) {
                    console.error('Error sending serial data:', err);
                } else {
                    console.log('Serial data sent:', messageString);
                }
            });
        } catch (error) {
            console.error('Error serializing JSON:', error);
        }
    }else{
        console.log("jsonMessage: ", jsonMessage);
    }
    
}

export { sendSerialJson };