import { App } from '../app';
import { SmartDisplayController } from '../../smart-display-controller';
import { HomeAssistantApiService } from './services';
import { LastUpdated } from '../../models';

export class Co2SensorApp implements App {
    private readonly _data = new LastUpdated<number>();
    private readonly _service = new HomeAssistantApiService();
    private readonly _alarmThreshold = parseInt(
        process.env.APP_CO2_SENSOR_ALARM_THRESHOLD || '1200',
        10
    );

    private _isDataLoading = false;

    readonly name = 'co2-sensor';
    readonly renderOnlyOneTime = true;

    get isReady(): boolean {
        return this._data.value != null;
    }

    constructor(private _controller: SmartDisplayController) {}

    reset(): void {
        if (this._isDataLoading) {
            return;
        }

        this._isDataLoading = true;

        this._refreshSensorData().finally(() => {
            this._isDataLoading = false;
        });
    }

    render(): void {
        this._renderValue();
    }

    private async _refreshSensorData(): Promise<void> {
        try {
            const value = await this._service.loadCo2SensorValue();
            console.log('co2 value', value);

            this._data.value = value;
        } catch (error) {
            console.error("can't load co2-sensor value");
        }
    }

    private _renderValue(): void {
        const co2Value = this._data.value;

        if (co2Value == null) {
            return;
        }

        const hexColor = this._getHexColor(co2Value);
        const text =
            co2Value >= this._alarmThreshold ? 'Lüften' : `CO2 ${co2Value}`;

        this._controller.drawText({
            hexColor,
            text,
            position: { x: 2, y: 1 },
        });
    }

    private _getHexColor(co2Value: number): string {
        const alarmColor = '#FF0000';
        const warnColor = '#FF6A00';
        const defaultColor = '#00C8C8';

        if (co2Value >= this._alarmThreshold) {
            return alarmColor;
        }

        if (co2Value >= 1000) {
            return warnColor;
        }

        return defaultColor;
    }
}
