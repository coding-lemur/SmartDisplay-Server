export interface CityWeatherSetting {
    cityId: string;
    appId: string;
    units: 'metric' | 'imperial';
    maxCacheAgeMinutes: number;
}
