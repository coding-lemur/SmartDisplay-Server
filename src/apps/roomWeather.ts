import { App } from './app';
import { SmartDisplayController } from '../smart-display-controller';

export class RoomWeatherApp implements App {
    constructor() {}

    reset(): void {}

    render(controller: SmartDisplayController): void {
        if (controller.info == null) {
            controller.drawText({
                hexColor: '#FF0000',
                text: 'NO DATA',
                position: { x: 7, y: 1 }
            });

            return;
        }

        const roomWeather = controller.info?.roomWeather;

        controller.drawText({
            hexColor: '#00C8C8',
            text: `${roomWeather?.temperature}°`,
            position: { x: 7, y: 1 }
        });
    }
}
