import dayjs from 'dayjs';

import { App } from './app';
import { SmartDisplayController } from '../smart-display-controller';

export class TimeApp implements App {
    constructor(private controller: SmartDisplayController) {}

    setup(): void {}

    show(): void {
        const time = dayjs().format('HH:mm');

        this.controller.drawText({
            hexColor: '#00C8C8',
            text: time,
            position: { x: 7, y: 9 }
        });
    }
}
