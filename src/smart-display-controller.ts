import mqtt from 'mqtt';
import Color from 'color';

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
        // TODO return NULL if data too old
        return this._info.value;
    }

    constructor(private client: mqtt.Client) {
        client
            .on('message', (topic, message) => {
                if (!topic.startsWith('smartDisplay/client/out/')) {
                    return;
                }

                const lastPart = MqttHelper.getLastTopicPart(topic);
                this.processIncomingMessage(lastPart, message.toString());
            })
            .subscribe('smartDisplay/client/out/#');
    }

    private processIncomingMessage(
        command: string | null,
        message: string
    ): void {
        if (command == null) {
            return;
        }

        console.log(new Date(), 'controller cmd', command, message);

        switch (command) {
            case 'info': {
                this._info.value = JSON.parse(message);

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

                break;
            }
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
