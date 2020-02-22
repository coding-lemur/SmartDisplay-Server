import axios from 'axios';

import { CityWeatherData, CityWeatherSetting } from '../models';

export class OpenWeatherMapService {
    constructor(private settings: CityWeatherSetting) {}

    loadData(): Promise<CityWeatherData> {
        const { settings } = this;

        return new Promise((resolve, reject) => {
            axios
                .get('http://api.openweathermap.org/data/2.5/weather', {
                    params: {
                        id: settings.cityId,
                        appid: settings.appId,
                        units: settings.units
                    }
                })
                .then(response => {
                    const { data } = response;
                    const result: CityWeatherData = {
                        temperature: data.main.temp,
                        humidity: data.main.humidity,
                        windSpeed: data.wind.speed
                    };
                    resolve(result);
                })
                .catch(error => reject(error));
        });
    }
}
