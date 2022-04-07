import { App } from './app';
import { SmartDisplayController } from '../smart-display-controller';
import { renderProgressbar, secondaryColor } from '../helper/draw-helper';
import { roundToFixed } from '../helper/string-helper';
import {
    loadBME280Humidity,
    loadBME280Temperature,
} from '../services/home-assitant-api.service';
import { LastUpdated } from '../models';

export class CityWeatherApp implements App {
    private readonly _temperature = new LastUpdated<number>();
    private readonly _humidity = new LastUpdated<number>();

    private _isDataLoading = false;

    readonly name = 'city-weather';
    readonly renderOnlyOneTime = true;

    get isReady() {
        return !this._isDataLoading && this._temperature.value != null;
    }

    constructor(private _controller: SmartDisplayController) {}

    init() {
        this._loadData();
    }

    reset() {
        this._loadData();
    }

    render() {
        this._renderTemerature();
        this._renderHumidity();
    }

    private async _loadData() {
        if (this._isDataLoading) {
            return;
        }

        this._isDataLoading = true;

        try {
            await this._refreshSensorData();
        } catch (e) {
            console.error('problem on fetching BME280 sensor data', e);
        } finally {
            this._isDataLoading = false;
        }
    }

    private async _refreshSensorData() {
        try {
            const temperature = await loadBME280Temperature();
            const humidity = await loadBME280Humidity();

            this._temperature.value = temperature;
            this._humidity.value = humidity;
        } catch (error) {
            console.error("can't load BME280 temperature");
        }
    }

    private _renderTemerature() {
        const temperature = roundToFixed(this._temperature.value);

        this._controller.drawText({
            hexColor: secondaryColor,
            text: `${temperature}°`,
            position: { x: 7, y: 1 },
        });
    }

    private _renderHumidity() {
        renderProgressbar(this._controller, this._humidity.value, 100);
    }
}
