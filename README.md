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

- open source (MIT licence) 😍
- RAM optimized (designed for run on a Raspberry Pi) 🚀
- auto standby mode if no client is connected 🔌⚡
- easy extendable (only implement a TypeScript interface) 👩‍💻
- modern and platform independent architecture (nodejs) 🐧
- Docker support 🐳

## included apps

- time: display the current time
- date: display the currend day and month
- roomWeather: display the current room temperature (by integrated DHT22 from the controller)
- cityWeather: display the current city temperature (by openweathermap API call)

## Setup

### Standalone

1. install nodejs ([example for Ubuntu/Raspbian](https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/))
2. checkout repository
3. configure MQTT broker in settings.json
4. run `npm install`
5. run `npm start`
6. connect [SmartDisplay Controller](https://github.com/MCeddy/SmartDisplay-Controller) with Server (set server IP)
7. setup a systemd service for autorestart, restart after errors

### Docker

#### Environment Variables

You can overwrite settings by set following environment variables:

- MQTT_SERVER
- MQTT_USERNAME
- MQTT_PASSWORD
- LOCALE
- APP_CITY_WEATHER_CITY_ID
- APP_CITY_WEATHER_APP_ID
- APP_CITY_WEATHER_UNITS
- APP_CITY_WEATHER_MAX_CACHE_AGE
- APP_CITY_WEATHER_PUBLISH_DATA

## Architecture

![architecture diagram](https://github.com/Smart-Display/SmartDisplay-Server/blob/master/docs/architecture.png)
