import process from 'process';

import { Settings } from '../models';
import settingsFile from '../../settings.json';

// TODO use any library
export class SettingsHelper {
    static loadSettings(): Settings {
        const { env } = process;
        const { mqtt, apps } = settingsFile;
        const { cityWeather } = apps;

        const settings: Settings = {
            mqtt: {
                server: env.MQTT_SERVER || mqtt.server,
                username: env.MQTT_USERNAME || mqtt.username,
                password: env.MQTT_PASSWORD || mqtt.password,
            },
            locale: env.LOCALE || settingsFile.locale,
            apps: {
                cityWeather: {
                    cityId: env.APP_CITY_WEATHER_CITY_ID || cityWeather.cityId,
                    appId: env.APP_CITY_WEATHER_APP_ID || cityWeather.appId,
                    units: env.APP_CITY_WEATHER_UNITS || cityWeather.units,
                    maxCacheAgeMinutes:
                        env.APP_CITY_WEATHER_MAX_CACHE_AGE == null
                            ? cityWeather.maxCacheAgeMinutes
                            : parseInt(env.APP_CITY_WEATHER_MAX_CACHE_AGE, 10),
                    publishWeatherData:
                        env.APP_CITY_WEATHER_PUBLISH_DATA == null
                            ? cityWeather.publishWeatherData
                            : env.APP_CITY_WEATHER_PUBLISH_DATA?.toLowerCase() ===
                              'true',
                },
            },
        };

        return settings;
    }
}
