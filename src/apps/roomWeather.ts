import { App } from './app';
import { SmartDisplayController } from '../smart-display-controller';

export class RoomWeatherApp implements App {
    constructor() {}

    reset(): void {}

    render(controller: SmartDisplayController): void {
        if (
            controller.info == null ||
            controller.info.roomWeather == null ||
            controller.info.roomWeather.temperature == null
        ) {
            return;
        }

        const { temperature } = controller.info.roomWeather;

        controller.drawText({
            hexColor: '#00C8C8',
            text: `${temperature}°`,
            position: { x: 7, y: 1 }
        });
    }
}
