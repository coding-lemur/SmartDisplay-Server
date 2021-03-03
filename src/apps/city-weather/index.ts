import dayjs from 'dayjs';
import { MqttClient } from 'mqtt';

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
    private readonly _publishWeatherData =
        process.env.APP_CITY_WEATHER_PUBLISH_DATA?.toLowerCase() === 'true';

    readonly name = 'city-weather';
    readonly renderOnlyOneTime = true;

    get isReady(): boolean {
        return !this.isDataOutdated;
    }

    private get isDataOutdated(): boolean {
        const cacheMinutesAge = this.calcCacheMinutesAge();

        if (cacheMinutesAge == null) {
            return true;
        }

        return cacheMinutesAge >= this._maxCacheAgeMinutes;
    }

    constructor(
        private controller: SmartDisplayController,
        private client: MqttClient
    ) {}

    init(): void {
        this.refreshWeatherData();
    }

    reset(): void {
        if (this.isDataOutdated) {
            this.refreshWeatherData();
        }
    }

    render(): void {
        this.renderTemperature();

        DrawHelper.renderPixelProgress(
            this.controller,
            this.calcCacheMinutesAge(),
            this._maxCacheAgeMinutes
        );
    }

    private renderTemperature(): void {
        const temperature = StringHelper.roundToFixed(
            this._data?.value?.temperature
        );

        this.controller.drawText({
            hexColor: '#4CFF00',
            text: `${temperature}°`,
            position: { x: 7, y: 1 },
        });
    }

    private calcCacheMinutesAge(): number | null {
        if (this._data == null || this._data.lastUpdated == null) {
            return null;
        }

        const lastUpdate = dayjs(this._data.lastUpdated);
        const diffMinutes = dayjs().diff(lastUpdate, 'minute');

        return diffMinutes;
    }

    private refreshWeatherData(): void {
        this._service
            .loadData()
            .then((data) => {
                console.log('city weather', data);

                this._data.value = data;

                if (this._publishWeatherData) {
                    this.client.publish(
                        'smartDisplay/server/out/cityWeather',
                        JSON.stringify(data)
                    );
                }
            })
            .catch((error) =>
                console.error("can't load openweathermap data", error)
            );
    }
}
