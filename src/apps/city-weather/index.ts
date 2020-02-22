import dayjs from 'dayjs';

import { App } from '../app';
import { LastUpdated } from '../../models';
import { SmartDisplayController } from '../../smart-display-controller';
import { StringHelper } from '../../helper';
import { OpenWeatherMapService } from './services';
import { CityWeatherData, CityWeatherSetting } from './models';

export class CityWeatherApp implements App {
    static readonly MaxCacheMinutesAge = 30;

    private readonly _data = new LastUpdated<CityWeatherData>();
    private readonly _service = new OpenWeatherMapService(this.setting);

    private _wasRendered = false;

    readonly name = 'city-weather';

    get shouldRerender(): boolean {
        return !this._wasRendered;
    }

    get isReady(): boolean {
        const cacheMinutesAge = this.calcCacheMinutesAge();

        if (cacheMinutesAge == null) {
            return false;
        }

        return cacheMinutesAge < CityWeatherApp.MaxCacheMinutesAge;
    }

    constructor(
        private controller: SmartDisplayController,
        private setting: CityWeatherSetting
    ) {}

    reset(): void {
        this._wasRendered = false;

        if (this.isReady) {
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
        const temperature = StringHelper.roundToFixed(
            this._data?.value?.temperature
        );

        this.controller.drawText({
            hexColor: '#4CFF00',
            text: `${temperature}°`,
            position: { x: 7, y: 1 }
        });

        this.showCacheAgeProgressbar();

        this._wasRendered = true;
    }

    private calcCacheMinutesAge(): number | null {
        if (this._data == null || this._data.lastUpdated == null) {
            return null;
        }

        const lastUpdate = dayjs(this._data.lastUpdated);
        const diffMinutes = dayjs().diff(lastUpdate, 'minute');

        return diffMinutes;
    }

    private showCacheAgeProgressbar(): void {
        const cacheMinutesAge = this.calcCacheMinutesAge();

        if (cacheMinutesAge == null) {
            return;
        }

        const cachePercentAge =
            cacheMinutesAge / CityWeatherApp.MaxCacheMinutesAge;
        const xEndPosition = 2 + Math.round(26 * cachePercentAge);

        this.controller.drawLine(
            { x: 2, y: 7 },
            { x: xEndPosition, y: 7 },
            '#808080'
        );
    }
}
