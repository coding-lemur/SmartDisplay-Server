#!/usr/bin/env ts-node

import clear from 'clear';
//import process from 'process';
//import exitHook from 'exit-hook';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import 'dotenv/config';

import { Server } from './server';

clear();
console.log('SmartDisplay');

let server: Server;

/*process.on('SIGTERM', code => {
    client.publish('awtrix-server', 'exit');
    return console.log(`About to exit with code ${code}`);
});*/

//process.stdin.resume(); // so the program will not close instantly

/*exitHook(() => {
    console.debug('Exiting');

    if (server != null) {
        server.shutdown();
    }
});*/

const locale = process.env.LOCALE;

import(`dayjs/locale/${locale}`).then(() => {
    dayjs.locale(locale);
    dayjs.extend(weekday);

    server = new Server();
});
