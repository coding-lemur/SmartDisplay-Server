# SmartDisplay Server

## Description
Use in combination with [SmartDisplay Controller](https://github.com/MCeddy/SmartDisplay-Controller).
The server controlls the display with Apps.

You can easily add own app. All logic for the display is in the SmartDisplayController.ts.

## Whats the different to AWTRIX Server?
The SmartDisplay is an Fork of the original AWTRIX. We have some API changes and incompatible with the original project (SmartDisplay Server only works in combination with the SmartDisplay Controller).

We love the AWTRIX project but we don't like that the server is closed source, so you cant extend it.
Second: We think many users use AWTRIX servers on a raspberry pie which has limitited RAM. Every Java application is very wasteful so that we try to save memory with our server.

**SmartDisplay isn't compatible with AWTRIX anymore!** 

## Features
- open source (MIT licence)
- RAM optimized (designed for run on a Raspberry Pi)
- auto standby mode if no client is connected
- easy extendable (only implement a TypeScript interface)
- modern and platform independent architecture (nodejs)

## Setup
1. install nodejs ([example for Ubuntu/Raspbian](https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/))
2. checkout repository
3. configure MQTT broker in settings.json
4. run `npm install`
5. run `npm start`
6. connect [SmartDisplay Controller](https://github.com/MCeddy/SmartDisplay-Controller) with Server (set server IP)
7. setup a systemd service for autorestart, restart after errors
