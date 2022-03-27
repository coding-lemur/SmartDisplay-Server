import fetch from 'node-fetch';

import { CityWeatherData, OpenWeatherResponse } from '../models';

const cityId = process.env.APP_CITY_WEATHER_CITY_ID!;
const appId = process.env.APP_CITY_WEATHER_APP_ID!;
const units = process.env.APP_CITY_WEATHER_UNITS!;

export const loadData = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${appId}&units=${units}`;
    const response = await fetch(url);
    const data = (await response.json()) as OpenWeatherResponse;

    const result: CityWeatherData = {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
    };

    return result;
};
