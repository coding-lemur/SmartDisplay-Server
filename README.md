# SmartDisplay Server

![Node.js CI](https://github.com/Smart-Display/SmartDisplay-Server/workflows/Node.js%20CI/badge.svg)

⚠ ⚠ ⚠ This project is no longer in development. Please use [AWTRIX 3](https://blueforcer.github.io/awtrix3/) ⚠ ⚠ ⚠

## Demo

![demo](https://github.com/Smart-Display/SmartDisplay-Server/blob/master/docs/demo.gif?raw=true)

## Description

Use in combination with [SmartDisplay Controller](https://github.com/MCeddy/SmartDisplay-Controller).
The server controlls the display with Apps.

You can easily add own app. All logic for the display is in the SmartDisplayController.ts.

## Whats the different to AWTRIX Server?

The SmartDisplay Controller is a fork of the original AWTRIX. We have some API changes and incompatible with the original project (SmartDisplay Server only works in combination with the SmartDisplay Controller).

We are inspired by the AWTRIX project but we don't like that the server is closed source, so you can't extend it.
Second: We think many users use AWTRIX servers on a raspberry pi with limitited RAM. Every Java application is very wasteful so that we try to save memory with our server.

**SmartDisplay isn't compatible with AWTRIX anymore!**

## Features

- open source (MIT licence) 😍
- RAM optimized (designed for run on a Raspberry Pi) 🚀
- auto standby mode if no client is connected 🔌⚡
- easy extendable (only implement a TypeScript interface) 👩‍💻
- modern and platform independent architecture (nodejs) 🐧
- multiplatform [Docker support 🐳](https://hub.docker.com/r/mceddy/smartdisplay-server)

## Included apps

- time: display the current time
- date: display the currend day and month
- roomWeather: display the current room temperature (by integrated DHT22 from the controller)
- cityWeather: display the current city temperature (by openweathermap API call or from Home Assistant)
- [CO2 Warner](https://github.com/coding-lemur/co2-meter-esp32) (via Home Assistant)

## Architecture

![architecture diagram](https://github.com/Smart-Display/SmartDisplay-Server/blob/master/docs/architecture.png?raw=true)

## Setup

### Create OpenWeatherMap account (free, optional)

1. signup at <https://home.openweathermap.org/users/sign_up>
2. copy your API key from <https://home.openweathermap.org/api_keys>
3. find ID of your city: <https://openweathermap.org/find>

### Standalone

1. install nodejs ([example for Ubuntu/Raspbian](https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/))
2. checkout repository
3. change settings in `.env` file (see "Environment Variables" table in Docker part for detail info)
4. run `npm install`
5. run `npm run start`
6. connect [SmartDisplay Controller](https://github.com/MCeddy/SmartDisplay-Controller) with Server (set server IP)
7. setup a systemd service for autorestart, restart after errors (see prepared service config file in "/systemd/smartdisplay.service")

### Docker

1. Ensure [Docker Compose](https://docs.docker.com/compose/) is already installed
2. Overwrite environment variables in `docker-compose.yml` file
3. Open command-line and switch to folder containing the `docker-compose.yml` file
4. Create container and run with `docker-compose up -d`

#### Environment Variables

Overwrite following environment variables to setup your container:

| Name                                  | Required | Description                                                                                                        |
| ------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| TZ                                    | X        | Timezone to show the correct time (e.g. "Europe/Berlin")                                                           |
| LOCALE                                | X        | Country code for loading date time settings (e.g. "de")                                                            |
| PRIMARY_COLOR                         | X        | Color used by most texts                                                                                           |
| SECONDARY_COLOR                       | x        | Color used by city-weather app                                                                                     |
| MQTT_SERVER                           | x        | Address of the MQTT broker in format "mqtt://192.168.1.1:1883"                                                     |
| MQTT_USERNAME                         | x        | Username to access the MQTT Broker                                                                                 |
| MQTT_PASSWORD                         | x        | Password of the MQTT user                                                                                          |
| APP_ITERATIONS                        | x        | Number of seconds before switching to the next app                                                                 |
| APP_CITY_WEATHER_APP_ID               |          | Your [OpenWeathermap API Key](https://home.openweathermap.org/api_keys)                                            |
| APP_CITY_WEATHER_CITY_ID              |          | The [City ID](https://openweathermap.org/find) for external weather data                                           |
| APP_CITY_WEATHER_UNITS                |          | weather data unit forma ("metric" or "imperial")                                                                   |
| APP_CITY_WEATHER_MAX_CACHE_AGE        |          | With an free OpenWeatherMap account the count of API requests is limited. How many minutes should the data cached? |
| HA_BASE_API_URL                       |          | URL to Home Assistant API                                                                                          |
| HA_ACCESS_TOKEN                       |          | Access token for Home Assistant API                                                                                |
| HA_CITY_WEATHER_ENTITY_ID_TEMPERATURE |          | Entity ID of the temperature sensor                                                                                                                   |
| HA_CITY_WEATHER_ENTITY_ID_HUMIDITY    |          | Entity ID of the humidity sensor                                                                                                                   |
| HA_CITY_WEATHER_MAX_AGE               |          | max minutes for sensor values to accept as valid                                                                                                                   |
| APP_CO2_SENSOR_ENTITY_ID              |          | Entity ID of the CO2 sensor                                                                                        |
| APP_CO2_SENSOR_ALARM_THRESHOLD        |          | minimum sensor value to show the ventilate alarm on the display                                                    |
