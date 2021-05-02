import dayjs from 'dayjs';

import { App } from '../app';
import { SmartDisplayController } from '../../smart-display-controller';
import { DrawHelper } from '../../helper';

export class DateApp implements App {
    readonly name = 'date';
    readonly renderOnlyOneTime = true;

    constructor(private _controller: SmartDisplayController) {}

    render(): void {
        this._renderDate();

        DrawHelper.renderWeekday(this._controller);
    }

    private _renderDate(): void {
        const date = dayjs().format('DD.MM.');

        this._controller.drawText({
            hexColor: DrawHelper.PrimaryColor,
            text: date,
            position: { x: 7, y: 1 },
        });
    }
}
