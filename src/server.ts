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

    private interval: NodeJS.Timeout | null = null;
    private currentAppIndex = 0;
    private appIterations = 0;

    constructor(settings: any) {
        const mqttSettings = settings.mqtt;

        this.client = mqtt
            .connect(mqttSettings.server, {
                username: mqttSettings.username,
                password: mqttSettings.password
            })
            .subscribe('smartDisplay/server/in/#')
            .on('message', (topic, message) => {
                if (!topic.startsWith('smartDisplay/server/in/')) {
                    return;
                }

                const lastPart = MqttHelper.getLastTopicPart(topic);
                this.processIncomingMessage(lastPart, message.toString());
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

        console.debug('server cmd', command, message);

        switch (command) {
            case 'power': {
                if (message === 'on' || message === 'off') {
                    const powerOn = message === 'on' ? true : false;

                    console.debug('switch power-status', powerOn);

                    this.controller.power(powerOn);

                    if (powerOn) {
                        this.startInterval();
                    } else {
                        this.stopInterval();
                    }
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

        this.startInterval();
    }

    private startInterval(): void {
        console.debug('startInterval()');

        this.appIterations = 0;

        this.renderApp();

        this.interval = setInterval(() => {
            if (!this.client.connected) {
                console.error('client not connected');
            }

            this.renderApp();

            if (this.appIterations >= 15) {
                this.nextApp();
            }
        }, 1000);
    }

    private stopInterval(): void {
        console.debug('stopInterval()');

        if (this.interval == null) {
            return;
        }

        clearInterval(this.interval);
    }

    private nextApp(): void {
        console.debug('next app');

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
        console.debug('shutdown');

        this.controller.destroy();
    }
}
