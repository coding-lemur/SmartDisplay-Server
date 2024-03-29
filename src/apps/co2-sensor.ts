import { App } from './app';
import { SmartDisplayController } from '../smart-display-controller';
import { loadStateWithTimeCheck, toNumber } from '../services/home-assistant-api';
import { LastUpdated } from '../models';

const co2SensorEntityId = process.env.APP_CO2_SENSOR_ENTITY_ID!;

export class Co2SensorApp implements App {
    private readonly _data = new LastUpdated<number>();
    private readonly _alarmThreshold = parseInt(
        process.env.APP_CO2_SENSOR_ALARM_THRESHOLD || '1200',
        10
    );

    private _isDataLoading = false;

    readonly name = 'co2-sensor';
    readonly renderOnlyOneTime = true;

    get isReady() {
        const { value } = this._data;

        if (value == null || value < this._alarmThreshold) {
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
        this._renderCo2Value();
    }

    private async _loadData() {
        if (this._isDataLoading) {
            return;
        }

        this._isDataLoading = true;

        try {
            const value = await loadStateWithTimeCheck(co2SensorEntityId, 5);
            console.log('co2 value', value);

            this._data.value = toNumber(value);
        } catch (e) {
            console.error('problem on fetching co2 sensor data', e);
        } finally {
            this._isDataLoading = false;
        }
    }

    private _renderCo2Value() {
        const co2Value = this._data.value;

        if (co2Value == null) {
            return;
        }

        this._controller.drawText({
            hexColor: '#FF0000',
            text: 'co2 max',
            position: { x: 3, y: 1 },
        });
    }
}
