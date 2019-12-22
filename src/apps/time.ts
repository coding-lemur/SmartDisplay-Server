import dayjs from 'dayjs';

import { App } from './app';
import { SmartDisplayController } from '../smart-display-controller';

export class TimeApp implements App {
    constructor(private controller: SmartDisplayController) {}

    setup(): void {}

    show(): void {
        const time = dayjs().format('HH:mm');

        // time
        this.controller.drawText({
            hexColor: '#00C8C8',
            text: time,
            position: { x: 7, y: 9 }
        });

        // weekday
        const weekday = dayjs().weekday();
        const xPosition = weekday * 4 + 2;
        console.log('weekday', weekday, xPosition);

        this.controller.drawLine(
            { x: xPosition, y: 7 },
            { x: xPosition + 2, y: 7 },
            '#00C8C8'
        );
    }
}
