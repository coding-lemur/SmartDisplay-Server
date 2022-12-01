import dayjs from 'dayjs';

import { App } from './app';
import { SmartDisplayController } from '../smart-display-controller';
import { renderPixelProgress, secondaryColor } from '../helper/draw';
import { roundToFixed } from '../helper/string';
import { loadWeatherData } from '../services/open-weather-map';
import { CityWeatherData, LastUpdated } from '../models';

const maxCacheAgeMinutes = parseInt(
    process.env.APP_CITY_WEATHER_MAX_CACHE_AGE || '0',
    10
);

export class CityWeatherOwmApp implements App {
    private readonly _data = new LastUpdated<CityWeatherData>();

    readonly name = 'city-weather';
    readonly renderOnlyOneTime = true;

    get isReady() {
        return !this._isDataOutdated;
    }

    private get _isDataOutdated() {
        const cacheMinutesAge = this._calcCacheMinutesAge();

        if (cacheMinutesAge == null) {
            return true;
        }

        return cacheMinutesAge >= maxCacheAgeMinutes;
    }

    constructor(private _controller: SmartDisplayController) {}

    init() {
        this._refreshWeatherData();
    }

    reset() {
        if (this._isDataOutdated) {
            this._refreshWeatherData();
        }
    }

    render() {
        this._renderTemperature();
        this._renderCacheTimeout();
    }

    private _renderTemperature() {
        const temperature = roundToFixed(this._data?.value?.temperature);

        this._controller.drawText({
            hexColor: secondaryColor,
            text: `${temperature}°`,
            position: { x: 7, y: 1 },
        });
    }

    private _renderCacheTimeout() {
        renderPixelProgress(
            this._controller,
            this._calcCacheMinutesAge(),
            maxCacheAgeMinutes
        );
    }

    private _calcCacheMinutesAge() {
        if (this._data == null || this._data.lastUpdated == null) {
            return null;
        }

        const lastUpdate = dayjs(this._data.lastUpdated);
        const diffMinutes = dayjs().diff(lastUpdate, 'minute');

        return diffMinutes;
    }

    private async _refreshWeatherData() {
        try {
            const data = await loadWeatherData();
            console.log('city weather', data);

            this._data.value = data;
        } catch (error) {
            console.error("can't load open-weather-map data", error);
        }
    }
}
