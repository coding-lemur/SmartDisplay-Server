import dayjs from 'dayjs';

import { App } from '../app';
import { SmartDisplayController } from '../../smart-display-controller';
import { DrawHelper } from '../../helper';

export class TimeApp implements App {
    private showColon = true;

    readonly name = 'time';

    constructor(private controller: SmartDisplayController) {}

    render(): void {
        this.renderTime();

        DrawHelper.renderWeekday(this.controller);

        // toggle colon
        this.showColon = !this.showColon;
    }

    private renderTime(): void {
        const format = this.showColon ? 'HH:mm' : 'HH mm';
        const time = dayjs().format(format);

        this.controller.drawText({
            hexColor: '#00C8C8',
            text: time,
            position: { x: 7, y: 1 }
        });
    }
}
