import fetch from 'node-fetch';

import { CityWeatherData, CityWeatherSetting } from '../models';

export class OpenWeatherMapService {
    constructor(private settings: CityWeatherSetting) {}

    async loadData(): Promise<CityWeatherData> {
        const { cityId, appId, units } = this.settings;
        const url = `http://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${appId}&units=${units}`;

        const response = await fetch(url);
        const data = await response.json();
        const result: CityWeatherData = {
            temperature: data.main.temp,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        };

        return result;
    }
}
