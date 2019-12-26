import { App } from './app';
import { SmartDisplayController } from '../smart-display-controller';

export class RoomWeather implements App {
    constructor() {}

    reset(): void {}

    render(controller: SmartDisplayController): void {
        controller.drawText({
            hexColor: '#00C8C8',
            text: '4°',
            position: { x: 7, y: 1 }
        });
    }
}
