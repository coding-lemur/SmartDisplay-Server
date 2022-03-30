import { App } from './app';
import { SmartDisplayController } from '../smart-display-controller';
import { LastUpdated } from '../models';
import { loadBME280Temperature } from '../services';
import { roundToFixed, secondaryColor } from '../helper';

export class CityWeatherApp implements App {
    private readonly _data = new LastUpdated<number>();

    private _isDataLoading = false;

    readonly name = 'city-weather';
    readonly renderOnlyOneTime = true;

    get isReady() {
        const { value } = this._data;
        return value != null;
    }

    constructor(private _controller: SmartDisplayController) {}

    init() {
        this._loadData();
    }

    reset() {
        this._loadData();
    }

    render() {
        this._renderValue();
    }

    private async _loadData() {
        if (this._isDataLoading) {
            return;
        }

        this._isDataLoading = true;

        this._refreshSensorData().finally(() => {
            this._isDataLoading = false;
        });
    }

    private async _refreshSensorData() {
        try {
            const value = await loadBME280Temperature();
            console.log('BME280 temperature', value);

            this._data.value = value;
        } catch (error) {
            console.error("can't load BME280 temperature");
        }
    }

    private _renderValue() {
        const temperature = roundToFixed(this._data.value);

        this._controller.drawText({
            hexColor: secondaryColor,
            text: `${temperature}°`,
            position: { x: 7, y: 1 },
        });
    }
}
