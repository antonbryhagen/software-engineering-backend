import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

export const useSerial = true; // Set this to true to enable serial communication, false to disable

const port = useSerial ? new SerialPort({
    path: '/dev/cu.usbmodem1201', // Change this to your serial port path
    baudRate: 9600
}) : null;
const parser = useSerial ? port.pipe(new ReadlineParser( { delimiter: '\n' } )) : null;

export { port, parser };
