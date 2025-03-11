import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

export const port = new SerialPort({
    path: '/dev/cu.usbmodem11201', // Change this to your serial port path
    baudRate: 9600
});

export const parser = port.pipe(new ReadlineParser( { delimiter: '\n' } ));