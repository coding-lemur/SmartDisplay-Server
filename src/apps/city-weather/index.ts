import dayjs from 'dayjs';

import { App } from '../app';
import { LastUpdated } from '../../models';
import { SmartDisplayController } from '../../smart-display-controller';
import { StringHelper, DrawHelper } from '../../helper';
import { OpenWeatherMapService } from './services';
import { CityWeatherData } from './models';

export class CityWeatherApp implements App {
    private readonly _data = new LastUpdated<CityWeatherData>();
    private readonly _service = new OpenWeatherMapService();
    private readonly _maxCacheAgeMinutes = parseInt(
        process.env.APP_CITY_WEATHER_MAX_CACHE_AGE || '0',
        10
    );

    readonly name = 'city-weather';
    readonly renderOnlyOneTime = true;

    get isReady(): boolean {
        return !this._isDataOutdated;
    }

    private get _isDataOutdated(): boolean {
        const cacheMinutesAge = this._calcCacheMinutesAge();

        if (cacheMinutesAge == null) {
            return true;
        }

        return cacheMinutesAge >= this._maxCacheAgeMinutes;
    }

    constructor(private _controller: SmartDisplayController) {}

    init(): void {
        this._refreshWeatherData();
    }

    reset(): void {
        if (this._isDataOutdated) {
            this._refreshWeatherData();
        }
    }

    render(): void {
        this._renderTemperature();

        DrawHelper.renderPixelProgress(
            this._controller,
            this._calcCacheMinutesAge(),
            this._maxCacheAgeMinutes
        );
    }

    private _renderTemperature(): void {
        const temperature = StringHelper.roundToFixed(
            this._data?.value?.temperature
        );

        this._controller.drawText({
            hexColor: DrawHelper.SecondaryColor,
            text: `${temperature}°`,
            position: { x: 7, y: 1 },
        });
    }

    private _calcCacheMinutesAge(): number | null {
        if (this._data == null || this._data.lastUpdated == null) {
            return null;
        }

        const lastUpdate = dayjs(this._data.lastUpdated);
        const diffMinutes = dayjs().diff(lastUpdate, 'minute');

        return diffMinutes;
    }

    private async _refreshWeatherData(): Promise<void> {
        try {
            const data = await this._service.loadData();
            console.log('city weather', data);

            this._data.value = data;
        } catch (error) {
            console.error("can't load openweathermap data", error);
        }
    }
}
