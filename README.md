# SmartDisplay Server

![Node.js CI](https://github.com/Smart-Display/SmartDisplay-Server/workflows/Node.js%20CI/badge.svg)

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
- [Docker support 🐳](https://hub.docker.com/r/mceddy/smartdisplay-server)

## Included apps

- time: display the current time
- date: display the currend day and month
- roomWeather: display the current room temperature (by integrated DHT22 from the controller)
- cityWeather: display the current city temperature (by openweathermap API call)

## Architecture

![architecture diagram](https://github.com/Smart-Display/SmartDisplay-Server/blob/master/docs/architecture.png?raw=true)

## Setup

### Create OpenWeatherMap account (free)

1. signup at https://home.openweathermap.org/users/sign_up
2. copy your API key from https://home.openweathermap.org/api_keys
3. find ID of your city: https://openweathermap.org/find

### Standalone

1. install nodejs ([example for Ubuntu/Raspbian](https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/))
2. checkout repository
3. change settings in `.env` file (see "Environment Variables" table in Docker part for detail info)
4. run `npm install`
5. run `npm run start`
6. connect [SmartDisplay Controller](https://github.com/MCeddy/SmartDisplay-Controller) with Server (set server IP)
7. setup a systemd service for autorestart, restart after errors (see prepared service config file in "/systemd/smartdisplay.service")

### Docker

1. Getting the latest image: `docker pull mceddy/smartdisplay-server:latest`
2. Overwrite environment variables
3. Run the image: `docker run mceddy/smartdisplay-server`

#### Environment Variables

Overwrite following environment variables to setup your container:

| Name                           | Description                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| MQTT_SERVER                    | Adress of the MQTT broker in format "mqtt://192.168.1.1:1883"                                                      |
| MQTT_USERNAME                  | Username to access the MQTT Broker                                                                                 |
| MQTT_PASSWORD                  | Password of the MQTT user                                                                                          |
| APP_ITERATIONS                 | Number of seconds before switching to the next app                                                                 |
| LOCALE                         | Country code for loading date time settings (e.g. "de")                                                            |
| APP_CITY_WEATHER_APP_ID        | Your [OpenWeathermap API Key](https://home.openweathermap.org/api_keys)                                            |
| APP_CITY_WEATHER_CITY_ID       | The [City ID](https://openweathermap.org/find) for external weather data                                           |
| APP_CITY_WEATHER_UNITS         | weather data unit forma ("metric" or "imperial")                                                                   |
| APP_CITY_WEATHER_MAX_CACHE_AGE | With an free OpenWeatherMap account the count of API requests is limited. How many minutes should the data cached? |
| APP_CITY_WEATHER_PUBLISH_DATA  | On TRUE external weather data will published via MQTT if the display is active                                     |
| TZ                             | Timezone to show the correct time (e.g. "Europe/Berlin")                                                           |
