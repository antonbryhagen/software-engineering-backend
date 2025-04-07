import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

export const useSerial = false; 

const port = useSerial ? new SerialPort({
    path: '/dev/cu.usbmodem1201', 
    baudRate: 9600
}) : null;
const parser = useSerial ? port.pipe(new ReadlineParser({ delimiter: '\n' })) : null;

export { port, parser };