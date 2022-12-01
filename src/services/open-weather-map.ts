import axios from 'axios';

import { CityWeatherData, OpenWeatherResponse } from '../models';

const cityId = process.env.APP_CITY_WEATHER_CITY_ID!;
const appId = process.env.APP_CITY_WEATHER_APP_ID!;
const units = process.env.APP_CITY_WEATHER_UNITS!;

export const loadWeatherData = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${appId}&units=${units}`;
    const response = await axios.get<OpenWeatherResponse>(url);
    const { data } = response;
    console.log('open-weather-map', data);

    const result: CityWeatherData = {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
    };

    return result;
};
