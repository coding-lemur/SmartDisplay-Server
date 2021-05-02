import dayjs from 'dayjs';

import { App } from '../app';
import { SmartDisplayController } from '../../smart-display-controller';
import { DrawHelper } from '../../helper';

export class TimeApp implements App {
    private _showColon = true;

    readonly name = 'time';
    readonly renderOnlyOneTime = true;

    constructor(private _controller: SmartDisplayController) {}

    render(): void {
        this._renderTime();

        DrawHelper.renderWeekday(this._controller);

        // toggle colon
        //this.showColon = !this.showColon;
    }

    private _renderTime(): void {
        const format = this._showColon ? 'HH:mm' : 'HH mm';
        const time = dayjs().format(format);

        this._controller.drawText({
            hexColor: DrawHelper.PrimaryColor,
            text: time,
            position: { x: 7, y: 1 },
        });
    }
}
