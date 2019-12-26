import mqtt from 'mqtt';

import { App } from './apps/app';
import { TimeApp } from './apps/time';
import { RoomWeatherApp } from './apps/roomWeather';
import { MqttHelper } from './helper';
import { SmartDisplayController } from './smart-display-controller';

export class Server {
    private readonly client: mqtt.Client;
    private readonly apps: App[] = [];
    private readonly controller: SmartDisplayController;

    private powerOn = true;
    private currentAppIndex = 0;
    private appIterations = 0;

    constructor(settings: any) {
        const mqttSettings = settings.mqtt;

        this.client = mqtt
            .connect(mqttSettings.server, {
                username: mqttSettings.username,
                password: mqttSettings.password
            })
            .on('message', (topic, message) => {
                if (!topic.startsWith('smartDisplay/server/in/')) {
                    return;
                }

                const lastPart = MqttHelper.getLastTopicPart(topic);
                this.processIncomingMessage(lastPart, message.toString());

                console.log('server message', topic, message.toString());
            })
            .on('error', error => {
                console.error('MQTT', error);
            });

        this.controller = new SmartDisplayController(this.client);

        this.loadApps();
    }

    private processIncomingMessage(
        command: string | null,
        message: string
    ): void {
        if (command == null) {
            return;
        }

        console.log('server cmd', command, message);

        switch (command) {
            case 'power': {
                if (message === 'on' || message === 'off') {
                    this.powerOn = message === 'on' ? true : false;
                }

                break;
            }
        }
    }

    private loadApps(): void {
        const timeApp = new TimeApp();
        const roomWeather = new RoomWeatherApp();
        this.apps.push(...[timeApp, roomWeather]);
    }

    run(): void {
        this.client.publish('smartDisplay/server/out', 'started');

        this.appIterations = 0;

        this.renderApp();

        setInterval(() => {
            if (!this.client.connected) {
                console.error('client not connected');
            }

            this.renderApp();

            if (this.appIterations >= 15) {
                this.nextApp();
            }
        }, 1000);
    }

    private nextApp(): void {
        console.log('next app');

        this.currentAppIndex++;

        if (this.currentAppIndex >= this.apps.length) {
            this.currentAppIndex = 0;
        }

        this.appIterations = 0;
    }

    private renderApp(): void {
        const app = this.apps[this.currentAppIndex];

        if (this.appIterations === 0) {
            app.reset();
        }

        this.controller.clear();
        app.render(this.controller);
        this.controller.show();

        this.appIterations++;
    }

    shutdown(): void {
        this.controller.destroy();
    }
}
