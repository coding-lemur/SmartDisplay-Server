import { App } from './app';
import { SmartDisplayController } from '../smart-display-controller';

export class RoomWeather implements App {
    constructor(private controller: SmartDisplayController) {}

    reset(): void {}

    render(): void {
        this.controller.drawText({
            hexColor: '#00C8C8',
            text: '4°',
            position: { x: 7, y: 1 }
        });
    }
}
