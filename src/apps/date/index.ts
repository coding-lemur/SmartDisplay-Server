import dayjs from 'dayjs';

import { App } from '../app';
import { SmartDisplayController } from '../../smart-display-controller';
import { primaryColor, renderWeekday } from '../../helper';

export class DateApp implements App {
    readonly name = 'date';
    readonly renderOnlyOneTime = true;

    constructor(private _controller: SmartDisplayController) {}

    render() {
        this._renderDate();

        renderWeekday(this._controller);
    }

    private _renderDate() {
        const date = dayjs().format('DD.MM.');

        this._controller.drawText({
            hexColor: primaryColor,
            text: date,
            position: { x: 7, y: 1 },
        });
    }
}
