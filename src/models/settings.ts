export interface Settings {
    mqtt: {
        server: string;
        username: string;
        password: string;
    };
    locale: string;
    apps: {
        cityWeather: {
            cityId: string;
            appId: string;
            units: string;
            maxCacheAgeMinutes: number;
            publishWeatherData: boolean;
        };
    };
}
