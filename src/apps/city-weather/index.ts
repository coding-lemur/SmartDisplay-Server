import dayjs from 'dayjs';

import { App } from '../app';
import { LastUpdated } from '../../models';
import { SmartDisplayController } from '../../smart-display-controller';
import {
    renderPixelProgress,
    roundToFixed,
    secondaryColor,
} from '../../helper';
import { loadData } from './services/open-weather-map.service';
import { CityWeatherData } from './models';

export class CityWeatherApp implements App {
    private readonly _data = new LastUpdated<CityWeatherData>();
    private readonly _maxCacheAgeMinutes = parseInt(
        process.env.APP_CITY_WEATHER_MAX_CACHE_AGE || '0',
        10
    );

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

        return cacheMinutesAge >= this._maxCacheAgeMinutes;
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

        renderPixelProgress(
            this._controller,
            this._calcCacheMinutesAge(),
            this._maxCacheAgeMinutes
        );
    }

    private _renderTemperature() {
        const temperature = roundToFixed(this._data?.value?.temperature);

        this._controller.drawText({
            hexColor: secondaryColor,
            text: `${temperature}°`,
            position: { x: 7, y: 1 },
        });
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
            const data = await loadData();
            console.log('city weather', data);

            this._data.value = data;
        } catch (error) {
            console.error("can't load openweathermap data", error);
        }
    }
}
