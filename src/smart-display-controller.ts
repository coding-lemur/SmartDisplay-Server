import mqtt from 'mqtt';
import Color from 'color';
import dayjs from 'dayjs';

import {
    ControllerInfo,
    ControllerSettings,
    DrawTextData,
    DrawTextDataEasy,
    LastUpdated,
    FontWeight,
    Position
} from './models';
import { MqttHelper } from './helper';

export class SmartDisplayController {
    private readonly _info = new LastUpdated<ControllerInfo>();

    private _powerStatus: boolean = true; // true = on; false = off

    get info(): ControllerInfo | null {
        if (this._info == null || this._info.lastUpdated == null) {
            return null;
        }

        const lastUpdate = dayjs(this._info.lastUpdated);
        const diffSeconds = dayjs().diff(lastUpdate, 'second');

        if (diffSeconds > 60) {
            console.warn('info too old', diffSeconds);
            return null;
        }

        return this._info.value;
    }

    get powerStatus(): boolean {
        return this._powerStatus;
    }

    constructor(private client: mqtt.Client) {
        client
            .subscribe('smartDisplay/client/out/#')
            .on('message', (topic, message) => {
                if (!topic.startsWith('smartDisplay/client/out/')) {
                    return;
                }

                const lastPart = MqttHelper.getLastTopicPart(topic);
                this.processIncomingMessage(lastPart, message.toString());
            });
    }

    private processIncomingMessage(
        command: string | null,
        message: string
    ): void {
        if (command == null) {
            return;
        }

        console.debug(new Date(), 'controller cmd', command, message);

        switch (command) {
            case 'info': {
                try {
                    this._info.value = JSON.parse(message);

                    this.checkPowerStatus();
                } catch (error) {
                    console.error('error on parse info payload', error);
                }

                break;
            }
        }
    }

    private checkPowerStatus(): void {
        const powerOnDevice = this._info.value?.powerOn;

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

    changeSettings(settings: ControllerSettings): void {
        this.client.publish(
            'smartDisplay/client/in/changeSettings',
            JSON.stringify(settings)
        );
    }

    show(): void {
        this.client.publish('smartDisplay/client/in/show', '');
    }

    clear(): void {
        this.client.publish('smartDisplay/client/in/clear', '');
    }

    drawText(data: DrawTextDataEasy): void {
        const color = Color(data.hexColor);
        const dataOut: DrawTextData = {
            text: data.text,
            x: data.position.x,
            y: data.position.y,
            color: color.rgb().array(),
            font: data.fontWeight ?? FontWeight.Normal
        };

        this.client.publish(
            'smartDisplay/client/in/drawText',
            JSON.stringify(dataOut)
        );
    }

    drawLine(start: Position, end: Position, hexColor: string): void {
        const color = Color(hexColor);

        const dataOut: any = {
            x0: start.x,
            y0: start.y,
            x1: end.x,
            y1: end.y,
            color: color.rgb().array()
        };

        this.client.publish(
            'smartDisplay/client/in/drawLine',
            JSON.stringify(dataOut)
        );
    }

    fill(hexColor: string): void {
        const color = Color(hexColor);
        const dataOut = {
            color: color.rgb()
        };

        this.client.publish(
            'smartDisplay/client/in/fill',
            JSON.stringify(dataOut)
        );
    }

    power(status: boolean): void {
        this._powerStatus = status;

        const dataOut = {
            on: status
        };
        this.client.publish(
            'smartDisplay/client/in/power',
            JSON.stringify(dataOut)
        );
    }

    destroy(): void {
        this.client.end(true);
    }
}
