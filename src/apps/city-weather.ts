import { App } from './app';
import { SmartDisplayController } from '../smart-display-controller';
import { renderProgress, secondaryColor } from '../helper/draw';
import { roundToFixed } from '../helper/string';
import { loadStateWithTimeCheck } from '../services/home-assistant-api';
import { LastUpdated } from '../models';

// TODO use env variable
/*const temperatureSensorEntityId = 'sensor.bme280_temperature';
const humiditySensorEntityId = 'sensor.bme280_humidity';*/

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
        this._renderTemperature();
        this._renderHumidity();
    }

    private async _loadData() {
        if (this._isDataLoading) {
            return;
        }

        this._isDataLoading = true;

        try {
            const temperature = await loadStateWithTimeCheck(
                'sensor.openweathermap_temperature',
                70
            ); //await loadBME280Temperature();
            const humidity = await loadStateWithTimeCheck(
                'sensor.openweathermap_humidity',
                70
            ); //await loadBME280Humidity();
            console.log('values', temperature, humidity);

            this._temperature.value = temperature;
            this._humidity.value = humidity;
        } catch (e) {
            console.error('problem on fetching BME280 sensor data', e);
        } finally {
            this._isDataLoading = false;
        }
    }

    private _renderTemperature() {
        const temperature = roundToFixed(this._temperature.value);

        this._controller.drawText({
            hexColor: secondaryColor,
            text: `${temperature}°`,
            position: { x: 7, y: 1 },
        });
    }

    private _renderHumidity() {
        renderProgress(this._controller, this._humidity.value, 100);
    }
}
