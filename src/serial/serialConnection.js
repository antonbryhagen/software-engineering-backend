/* Author(s): Anton Bryhagen */

import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

export const useSerial = false; 

/**
 * Serial port connection.
 *
 * @type {SerialPort|null}
 */
const port = useSerial ? new SerialPort({
    path: '/dev/cu.usbmodem1201', // Change this to your serial port path
    baudRate: 9600
}) : null;
/**
 * The parser used for serial communication.
 */
const parser = useSerial ? port.pipe(new ReadlineParser({ delimiter: '\n' })) : null;

export { port, parser };
