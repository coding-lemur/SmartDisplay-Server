import dayjs from 'dayjs';

import { App } from './app';
import { CityWeatherData, LastUpdated } from '../models';
import { OpenWeatherMapService } from '../services';
import { SmartDisplayController } from '../smart-display-controller';

export class CityWeatherApp implements App {
    private readonly _service = new OpenWeatherMapService(this.settings);
    private readonly _data = new LastUpdated<CityWeatherData>();

    private _wasRendered = false;

    readonly name = 'city-weather';

    get shouldRerender(): boolean {
        return !this._wasRendered;
    }

    get isReady(): boolean {
        if (this._data == null || this._data.lastUpdated == null) {
            return false;
        }

        const lastUpdate = dayjs(this._data.lastUpdated);
        const diffMinutes = dayjs().diff(lastUpdate, 'minute');

        return diffMinutes < 30;
    }

    constructor(
        private controller: SmartDisplayController,
        private settings: any
    ) {}

    reset(): void {
        this._wasRendered = false;

        const isReady = this.isReady;
        console.log('city reset', isReady);

        if (isReady) {
            return;
        }

        // refresh weather data
        this._service
            .loadData()
            .then(data => {
                console.log('city weather', data);
                this._data.value = data;
            })
            .catch(error =>
                console.error("can't load openweathermap data", error)
            );
    }

    render(): void {
        this.controller.drawText({
            hexColor: '#4CFF00',
            text: `${this._data?.value?.temperature}°`,
            position: { x: 7, y: 1 }
        });

        this._wasRendered = true;
    }
}
