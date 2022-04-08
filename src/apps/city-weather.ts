import { App } from './app';
import { SmartDisplayController } from '../smart-display-controller';
import { renderProgressbar, secondaryColor } from '../helper/draw';
import { roundToFixed } from '../helper/string';
import {
    loadBME280Humidity,
    loadBME280Temperature,
} from '../services/home-assitant-api';
import { LastUpdated } from '../models';

export class CityWeatherApp implements App {
    private readonly _temperature = new LastUpdated<number>();
    private readonly _humidity = new LastUpdated<number>();

    private _isDataLoading = false;

    readonly name = 'city-weather';
    readonly renderOnlyOneTime = true;

    get isReady() {
        if (this._temperature.value == null) {
            console.log('not ready because temperate has no value');
            return false;
        }

        return true;
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
            const temperature = await loadBME280Temperature();
            const humidity = await loadBME280Humidity();
            console.log('bme280 values', temperature, humidity);

            this._temperature.value = temperature;
            this._humidity.value = humidity;
        } catch (e) {
            console.error('problem on fetching BME280 sensor data', e);
        } finally {
            this._isDataLoading = false;
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
