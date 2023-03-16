import mqtt from 'mqtt';
import Color from 'color';
import dayjs from 'dayjs';

import {
    ControllerInfo,
    DrawTextData,
    DrawTextDataEasy,
    LastUpdated,
    FontWeight,
    Position,
} from './models';
import { getLastTopicPart } from './utils/mqtt';

export class SmartDisplayController {
    private readonly _info = new LastUpdated<ControllerInfo>();

    private _powerStatus: boolean = true; // true = on; false = off

    get info(): ControllerInfo | null {
        return this._info?.value;
    }

    get powerStatus(): boolean {
        return this._powerStatus;
    }

    get isOffline(): boolean {
        if (this._info?.lastUpdated == null) {
            return true;
        }

        const lastUpdate = dayjs(this._info.lastUpdated);
        const diffSeconds = dayjs().diff(lastUpdate, 'second');

        return diffSeconds > 300; // more than 5 minutes old
    }

    constructor(private _client: mqtt.Client) {
        _client
            .subscribe('smartDisplay/client/out/#')
            .on('message', (topic, message) => {
                if (!topic.startsWith('smartDisplay/client/out/')) {
                    return;
                }

                const command = getLastTopicPart(topic);

                if (command == null) {
                    return;
                }

                this._processIncomingMessage(command, message.toString());
            });
    }

    private _processIncomingMessage(command: string, message: string): void {
        console.debug(new Date(), 'controller cmd', command, message);

        switch (command) {
            case 'info': {
                try {
                    const info = JSON.parse(message) as ControllerInfo;

                    this._info.value = info;
                    this._checkPowerStatus(info);
                } catch (error) {
                    console.error('error on parse info payload', error);
                }

                break;
            }

            default:
                break;
        }
    }

    private _checkPowerStatus(info: ControllerInfo): void {
        const powerOnDevice = info?.powerOn;

        // check power status
        if (powerOnDevice !== this._powerStatus) {
            // inconsistence detected
            console.warn(
                'power status inconstistence:',
                `server: ${this._powerStatus}`,
                `device: ${powerOnDevice}`
            );

            // fix status
            this.power(this._powerStatus);
        }
    }

    show(): void {
        this._client.publish('smartDisplay/client/in/show', '');
    }

    clear(): void {
        this._client.publish('smartDisplay/client/in/clear', '');
    }

    drawText(data: DrawTextDataEasy): void {
        const color = Color(data.hexColor);
        const dataOut: DrawTextData = {
            text: data.text,
            x: data.position.x,
            y: data.position.y,
            color: color.rgb().array(),
            font: data.fontWeight ?? FontWeight.Normal,
        };

        this._client.publish(
            'smartDisplay/client/in/drawText',
            JSON.stringify(dataOut)
        );
    }

    drawLine(start: Position, end: Position, hexColor: string): void {
        const color = Color(hexColor);

        const dataOut = {
            x0: start.x,
            y0: start.y,
            x1: end.x,
            y1: end.y,
            color: color.rgb().array(),
        };

        this._client.publish(
            'smartDisplay/client/in/drawLine',
            JSON.stringify(dataOut)
        );
    }

    drawPixel(position: Position, hexColor: string): void {
        const color = Color(hexColor);

        const dataOut = {
            x: position.x,
            y: position.y,
            color: color.rgb().array(),
        };

        this._client.publish(
            'smartDisplay/client/in/drawPixel',
            JSON.stringify(dataOut)
        );
    }

    fill(hexColor: string): void {
        const color = Color(hexColor);
        const dataOut = {
            color: color.rgb(),
        };

        this._client.publish(
            'smartDisplay/client/in/fill',
            JSON.stringify(dataOut)
        );
    }

    power(status: boolean): void {
        this._powerStatus = status;

        const dataOut = {
            on: status,
        };
        this._client.publish(
            'smartDisplay/client/in/power',
            JSON.stringify(dataOut)
        );
    }

    destroy(): void {
        this._client.end(true);
    }
}
