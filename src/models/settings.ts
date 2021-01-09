import { CityWeatherSetting } from 'apps/city-weather/models';

export interface Settings {
    mqtt: {
        server: string;
        username: string;
        password: string;
    };
    appIterations: number;
    locale: string;
    apps: {
        cityWeather: CityWeatherSetting;
    };
}
