#!/usr/bin/env node

const clear = require('clear');
const figlet = require('figlet');

import chalk from 'chalk';
import path from 'path';
import process from 'process';
import program from 'commander';
import exitHook from 'exit-hook';

import packageJson from '../package.json';
import settings from '../settings.json';

import { Server } from './server';

program
    .description(packageJson.description)
    .version(packageJson.version)
    .parse(process.argv);

clear();
console.log(
    chalk.red(
        figlet.textSync('smart-display server', { horizontalLayout: 'full' })
    )
);

const server = new Server(settings);

/*process.on('SIGTERM', code => {
    client.publish('awtrix-server', 'exit');
    return console.log(`About to exit with code ${code}`);
});*/

//process.stdin.resume(); // so the program will not close instantly

exitHook(() => {
    console.log('Exiting');
    server.shutdown();
});
