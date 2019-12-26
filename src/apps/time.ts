import dayjs from 'dayjs';

import { App } from './app';
import { SmartDisplayController } from '../smart-display-controller';

export class TimeApp implements App {
    private showColon = true;

    constructor() {}

    reset(): void {}

    render(controller: SmartDisplayController): void {
        this.renderTime(controller);
        this.renderWeekday(controller);

        // toggle colon
        this.showColon = !this.showColon;
    }

    private renderTime(controller: SmartDisplayController): void {
        const format = this.showColon ? 'HH:mm' : 'HH mm';
        const time = dayjs().format(format);

        controller.drawText({
            hexColor: '#00C8C8',
            text: time,
            position: { x: 7, y: 1 }
        });
    }

    private renderWeekday(controller: SmartDisplayController): void {
        const currentWeekday = dayjs().weekday();
        const getXPositionByWeekDay = (weekday: number) => weekday * 4 + 2;

        for (let weekday = 0; weekday < 7; weekday++) {
            const xPosition = getXPositionByWeekDay(weekday);
            const color = weekday === currentWeekday ? '#00C8C8' : '#A0A0A0';

            controller.drawLine(
                { x: xPosition, y: 7 },
                { x: xPosition + 2, y: 7 },
                color
            );
        }
    }
}
