import { App } from './app';
import { SmartDisplayController } from '../smart-display-controller';
import { renderProgress, secondaryColor } from '../helper/draw';
import { loadStateWithTimeCheck } from '../services/home-assistant-api';

const temperatureSensorEntityId =
    process.env.HA_CITY_WEATHER_ENTITY_ID_TEMPERATURE;
const humiditySensorEntityId = process.env.HA_CITY_WEATHER_ENTITY_ID_HUMIDITY!;

const maxAgeMinutes = process.env.HA_CITY_WEATHER_MAX_AGE
    ? parseInt(process.env.HA_CITY_WEATHER_MAX_AGE, 10)
    : undefined;

export class CityWeatherHaApp implements App {
    readonly name = 'city-weather';
    readonly renderOnlyOneTime = true;

    private _temperature: number | null = null;
    private _humidity: number | null = null;

    private _isDataLoading = false;

    get isReady() {
        if (!this._temperature) {
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
        if (this._isDataLoading || !temperatureSensorEntityId) {
            return;
        }

        this._isDataLoading = true;

        try {
            const temperature = await loadStateWithTimeCheck(
                temperatureSensorEntityId,
                maxAgeMinutes
            );
            this._temperature = temperature;
            console.log('temperature', temperature);

            if (humiditySensorEntityId) {
                const humidity = await loadStateWithTimeCheck(
                    humiditySensorEntityId,
                    maxAgeMinutes
                );
                this._humidity = humidity;
                console.log('humidity', humidity);
            }
        } catch (e) {
            console.error('problem on fetching sensor data', e);
        } finally {
            this._isDataLoading = false;
        }
    }

    private _renderTemperature() {
        this._controller.drawText({
            hexColor: secondaryColor,
            text: `${this._temperature}°`,
            position: { x: 7, y: 1 },
        });
    }

    private _renderHumidity() {
        renderProgress(this._controller, this._humidity);
    }
}
