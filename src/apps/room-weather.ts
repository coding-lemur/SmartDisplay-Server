import { App } from './app';
import { RoomWeather } from '../models';
import { SmartDisplayController } from '../smart-display-controller';
import { primaryColor, renderProgress } from '../helper/draw';

export class RoomWeatherApp implements App {
    private _roomWeather: RoomWeather | undefined;

    readonly name = 'room-weather';
    readonly renderOnlyOneTime = true;

    get isReady() {
        return this._roomWeather?.temperature != null;
    }

    constructor(private _controller: SmartDisplayController) {}

    reset() {
        // load room-weather
        this._roomWeather = this._controller?.info?.roomWeather;
    }

    render() {
        this._renderTemperature();

        renderProgress(this._controller, this._roomWeather?.humidity);
    }

    private _renderTemperature() {
        const temperature = this._roomWeather?.temperature.toFixed(1);

        this._controller.drawText({
            hexColor: primaryColor,
            text: `${temperature}°`,
            position: { x: 7, y: 1 },
        });
    }
}
