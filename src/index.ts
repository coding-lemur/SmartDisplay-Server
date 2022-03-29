#!/usr/bin/env ts-node

import clear from 'clear';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import 'dotenv/config';

import { Server } from './server';

clear();
console.log('SmartDisplay');

const locale = process.env.LOCALE;

import(`dayjs/locale/${locale}`).then(() => {
    dayjs.locale(locale);
    dayjs.extend(weekday);

    const server = new Server();
});
