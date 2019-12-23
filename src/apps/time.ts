import dayjs from 'dayjs';

import { App } from './app';
import { SmartDisplayController } from '../smart-display-controller';

export class TimeApp implements App {
    constructor(private controller: SmartDisplayController) {}

    setup(): void {}

    show(): void {
        this.controller.clear();

        this.renderTime();
        this.renderWeekday();

        this.controller.show();
    }

    private renderTime(): void {
        const time = dayjs().format('HH:mm');

        this.controller.drawText({
            hexColor: '#00C8C8',
            text: time,
            position: { x: 7, y: 9 }
        });
    }

    private renderWeekday(): void {
        const currentWeekday = dayjs().weekday();
        const getXPositionByWeekDay = (weekday: number) => weekday * 4 + 2;

        for (let weekday = 0; weekday < 7; weekday++) {
            const xPosition = getXPositionByWeekDay(weekday);
            const color = weekday === currentWeekday ? '#00C8C8' : '#A0A0A0';

            this.controller.drawLine(
                { x: xPosition, y: 7 },
                { x: xPosition + 2, y: 7 },
                color
            );
        }
    }
}
