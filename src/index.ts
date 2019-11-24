#!/usr/bin/env node

const clear = require('clear');
const figlet = require('figlet');

import chalk from 'chalk';
import path from 'path';
import process from 'process';
import program from 'commander';
import exitHook from 'exit-hook';
import mqtt from 'mqtt';

import packageJson from '../package.json';
import settings from '../settings.json';

enum App {
    Time,
    RoomWeather,
    CityWeather
}

let powerOn = true;
let currentApp = App.Time;

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

console.log("los geht's!");

const mqttSettings = settings.mqtt;
const client = mqtt.connect(mqttSettings.server, {
    username: mqttSettings.username,
    password: mqttSettings.password
});

client.publish('awtrix-server', 'started');
client.subscribe('#');

client.on('message', (topic, message) => {
    // message is Buffer
    console.log(message.toString());
    //client.end()
});

client.on('error', error => {
    console.error(error);
});

/*process.on('SIGTERM', code => {
    client.publish('awtrix-server', 'exit');
    return console.log(`About to exit with code ${code}`);
});*/

//process.stdin.resume(); // so the program will not close instantly

exitHook(() => {
    console.log('Exiting');
    client.end(true);
});

setInterval(() => {
    console.log('next app');
}, 15000);
