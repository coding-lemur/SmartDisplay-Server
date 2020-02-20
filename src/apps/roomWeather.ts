import { App } from './app';
import { RoomWeather } from '../models';
import { SmartDisplayController } from '../smart-display-controller';

export class RoomWeatherApp implements App {
    private _wasRendered = false;
    private _roomWeather: RoomWeather | undefined;

    readonly name = 'room-weather';

    get shouldRerender(): boolean {
        return !this._wasRendered;
    }

    get isReady(): boolean {
        return this._roomWeather?.temperature != null;
    }

    constructor(private controller: SmartDisplayController) {}

    reset(): void {
        this._wasRendered = false;

        // load room-weather
        this._roomWeather = this.controller?.info?.roomWeather;
    }

    render(): void {
        this.controller.drawText({
            hexColor: '#00C8C8',
            text: `${this._roomWeather?.temperature}°`,
            position: { x: 7, y: 1 }
        });

        this._wasRendered = true;
    }
}
