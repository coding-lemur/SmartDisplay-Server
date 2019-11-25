import mqtt from 'mqtt';
import Color from 'color';

import {
    RoomWeather,
    ControllerInfo,
    ControllerSettings,
    DrawTextData,
    DrawTextDataEasy,
    FontWeight
} from './models';

export class SmartDisplayController {
    private readonly client: mqtt.Client;

    // TODO maybe save the date when value was updated
    private info: ControllerInfo | null = null;
    private roomWeather: RoomWeather | null = null;
    private lux: number | null = null;

    constructor(private settings: any) {
        const mqttSettings = settings.mqtt;

        this.client = mqtt.connect(mqttSettings.server, {
            username: mqttSettings.username,
            password: mqttSettings.password
        });

        this.client.publish('smart-display/server/out', 'started'); // TODO maybe move to server.ts
        this.client.subscribe('smart-display/client/out/#');

        this.client.on('message', (topic, message) => {
            // message is Buffer
            console.log(message.toString());
            //client.end()
        });

        this.client.on('error', error => {
            console.error(error);
        });
    }

    getInfo(): ControllerInfo | null {
        this.client.publish('smartDisplay/client/in/info', '');

        return null;
    }

    getRoomWeather(): RoomWeather | null {
        this.client.publish('smart-display/client/in/roomWeather', '');

        return null;
    }

    getLux(): number | null {
        this.client.publish('smartDisplay/client/in/lux', '');

        return null;
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
        const color = Color(data.color);
        const dataOut: DrawTextData = {
            text: data.text,
            x: data.position.x,
            y: data.position.y,
            color: color.rgb().array(),
            font: data.fontWeight
        };

        this.client.publish(
            'smartDisplay/client/in/drawText',
            JSON.stringify(dataOut)
        );
    }

    destroy(): void {
        this.client.end(true);
    }
}
