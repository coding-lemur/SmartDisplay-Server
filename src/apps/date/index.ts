import dayjs from 'dayjs';

import { App } from '../app';
import { SmartDisplayController } from '../../smart-display-controller';

export class DateApp implements App {
    private _wasRendered = false;

    readonly name = 'date';

    get shouldRerender(): boolean {
        return !this._wasRendered;
    }

    readonly isReady = true;

    constructor(private controller: SmartDisplayController) {}

    reset(): void {
        this._wasRendered = false;
    }

    render(): void {
        const date = dayjs().format('DD.MM.');

        this.controller.drawText({
            hexColor: '#00C8C8',
            text: date,
            position: { x: 7, y: 1 },
        });

        this._wasRendered = true;
    }
}
