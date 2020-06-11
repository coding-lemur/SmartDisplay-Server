import dayjs from 'dayjs';

import { App } from '../app';
import { SmartDisplayController } from '../../smart-display-controller';
import { DrawHelper } from '../../helper';

export class DateApp implements App {
    readonly name = 'date';
    readonly renderOnlyOneTime = true;

    constructor(private controller: SmartDisplayController) {}

    render(): void {
        this.renderDate();

        DrawHelper.renderWeekday(this.controller);
    }

    private renderDate(): void {
        const date = dayjs().format('DD.MM.');

        this.controller.drawText({
            hexColor: '#00C8C8',
            text: date,
            position: { x: 7, y: 1 }
        });
    }
}
