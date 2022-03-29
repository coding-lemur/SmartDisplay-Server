import { App } from '../app';
import { RoomWeather } from '../../models';
import { SmartDisplayController } from '../../smart-display-controller';
import { primaryColor, renderProgressbar, roundToFixed } from '../../helper';

export class RoomWeatherApp implements App {
    private _roomWeather: RoomWeather | undefined;

    readonly name = 'room-weather';
    readonly renderOnlyOneTime = true;

    get isReady(): boolean {
        return this._roomWeather?.temperature != null;
    }

    constructor(private _controller: SmartDisplayController) {}

    reset(): void {
        // load room-weather
        this._roomWeather = this._controller?.info?.roomWeather;
    }

    render(): void {
        this._renderTemperature();

        renderProgressbar(this._controller, this._roomWeather?.humidity, 100);
    }

    private _renderTemperature(): void {
        const temperature = roundToFixed(this._roomWeather?.temperature);

        this._controller.drawText({
            hexColor: primaryColor,
            text: `${temperature}°`,
            position: { x: 7, y: 1 },
        });
    }
}
