import mqtt, { IClientOptions } from 'mqtt';

import { MqttHelper } from './helper';
import { SmartDisplayController } from './smart-display-controller';
import { App } from './apps/app';
import { TimeApp } from './apps/time';
import { RoomWeatherApp } from './apps/room-weather';
import { CityWeatherApp } from './apps/city-weather';

export class Server {
    private readonly client: mqtt.Client;
    private readonly apps: App[] = [];
    private readonly controller: SmartDisplayController;

    private interval: NodeJS.Timeout | null = null;
    private currentAppIndex = 0;
    private appIterations = 0;

    private get inRunning(): boolean {
        return this.interval != null;
    }

    constructor(settings: any) {
        const { server, username, password } = settings.mqtt;
        const clientOptions: IClientOptions = {
            username,
            password
        };

        this.client = mqtt
            .connect(server, clientOptions)
            .subscribe('smartDisplay/server/in/#')
            .on('message', (topic, message) => {
                const command = MqttHelper.getLastTopicPart(topic);

                if (command == null) {
                    return;
                }

                if (topic.startsWith('smartDisplay/server/in/')) {
                    this.processIncomingServerMessage(
                        command,
                        message.toString()
                    );
                } else if (topic.startsWith('smartDisplay/client/out/')) {
                    this.processOutcomingClientMessage(
                        command,
                        message.toString()
                    );
                }
            })
            .on('error', error => {
                console.error('MQTT', error);
            });

        this.controller = new SmartDisplayController(this.client);

        this.loadApps(settings.apps);
    }

    private processIncomingServerMessage(
        command: string,
        message: string
    ): void {
        console.debug('server cmd', command, message);

        switch (command) {
            case 'power': {
                if (message === 'on' || message === 'off') {
                    const powerOn = message === 'on' ? true : false;

                    console.debug('switch power-status', powerOn);

                    this.controller.power(powerOn);

                    if (powerOn) {
                        this.start();
                    } else {
                        this.stop();
                    }
                }

                break;
            }
        }
    }

    private processOutcomingClientMessage(
        command: string,
        message: string
    ): void {
        // check info from client but server is in standby (no running interval)
        if (command === 'info' && !this.inRunning) {
            this.start();
        }
    }

    private loadApps(settings: any): void {
        const timeApp = new TimeApp(this.controller);
        const roomWeather = new RoomWeatherApp(this.controller);
        const cityWeather = new CityWeatherApp(
            this.controller,
            settings.cityWeather
        );
        this.apps.push(...[timeApp, roomWeather, cityWeather]);
    }

    start(): void {
        this.client.publish('smartDisplay/server/out', 'started');
        console.debug('start server');

        this.appIterations = 0;

        this.renderApp();

        this.interval = setInterval(() => {
            if (this.client.connected) {
                this.renderApp();

                if (this.appIterations >= 15) {
                    this.nextApp();
                }
            } else {
                console.error('client not connected');
            }

            // check controller is offline
            if (this.controller.isOffline) {
                console.debug('controller offline -> stop server');
                this.stop();
            }
        }, 1000);
    }

    stop(): void {
        console.debug('stop server');

        if (this.interval == null) {
            return;
        }

        clearInterval(this.interval);
        this.interval = null;
    }

    private nextApp(): void {
        this.appIterations = 0;
        this.currentAppIndex++;

        if (this.currentAppIndex >= this.apps.length) {
            this.currentAppIndex = 0;
        }

        const app = this.apps[this.currentAppIndex];
        console.debug('next app', app.name);

        app.reset();

        if (!app.isReady) {
            this.nextApp();
        }
    }

    private renderApp(): void {
        const app = this.apps[this.currentAppIndex];

        if (app.shouldRerender) {
            this.controller.clear();
            app.render();
            this.controller.show();
        }

        this.appIterations++;
    }

    shutdown(): void {
        console.debug('shutdown');

        if (this.client != null) {
            this.client.end(true);
        }

        this.controller.destroy();
    }
}
