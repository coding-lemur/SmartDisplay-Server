import dayjs from 'dayjs';

import { App } from '../app';
import { SmartDisplayController } from '../../smart-display-controller';
import { primaryColor, renderWeekday } from '../../helper';

export class TimeApp implements App {
    private _showColon = true;

    readonly name = 'time';
    readonly renderOnlyOneTime = true;

    constructor(private _controller: SmartDisplayController) {}

    render() {
        this._renderTime();

        renderWeekday(this._controller);

        // toggle colon
        //this.showColon = !this.showColon;
    }

    private _renderTime() {
        const format = this._showColon ? 'HH:mm' : 'HH mm';
        const time = dayjs().format(format);

        this._controller.drawText({
            hexColor: primaryColor,
            text: time,
            position: { x: 7, y: 1 },
        });
    }
}
