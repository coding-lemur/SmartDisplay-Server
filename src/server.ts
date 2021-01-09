import mqtt, { IClientOptions } from 'mqtt';

import { MqttHelper } from './helper';
import { ControllerInfo, Settings } from './models';
import { SmartDisplayController } from './smart-display-controller';
import { App } from './apps/app';
import { TimeApp } from './apps/time';
import { RoomWeatherApp } from './apps/room-weather';
import { CityWeatherApp } from './apps/city-weather';
import { DateApp } from './apps/date';

export class Server {
    private readonly settings: Settings;
    private readonly client: mqtt.Client;
    private readonly apps: App[] = [];
    private readonly controller: SmartDisplayController;

    private interval: NodeJS.Timeout | null = null;
    private currentAppIndex = 0;
    private currentAppIteration = 0;

    private get isRunning(): boolean {
        return this.interval != null;
    }

    constructor(settings: Settings) {
        this.settings = settings;

        const { server, username, password } = settings.mqtt;
        const clientOptions: IClientOptions = {
            username,
            password,
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
            .on('error', (error) => {
                console.error('MQTT', error);
            });

        this.controller = new SmartDisplayController(this.client);

        this.loadApps();
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

            case 'power-state': {
                const powerOn = this.isRunning ? 'on' : 'off';

                this.client.publish(
                    'smartDisplay/server/out/power-state',
                    powerOn
                );
            }

            default:
                break;
        }
    }

    private processOutcomingClientMessage(
        command: string,
        message: string
    ): void {
        switch (command) {
            case 'info':
                // check info from client but server is in standby (no running interval)
                const info = JSON.parse(message) as ControllerInfo;

                if (!this.isRunning && info.powerOn === true) {
                    console.log(
                        "start server because controller isn't powered off"
                    );

                    this.start();
                }
                break;
            case 'button':
                if (this.isRunning && message === 'pressed') {
                    this.nextApp();
                }
                break;
        }
    }

    private loadApps(): void {
        const appSettings = this.settings.apps;
        const timeApp = new TimeApp(this.controller);
        const dateApp = new DateApp(this.controller);
        const roomWeather = new RoomWeatherApp(this.controller);
        const cityWeather = new CityWeatherApp(
            this.controller,
            this.client,
            appSettings.cityWeather
        );
        this.apps.push(...[timeApp, dateApp, roomWeather, cityWeather]);
    }

    start(): void {
        if (this.interval != null) {
            console.warn('found running instance');
            this.stop();
        }

        this.client.publish('smartDisplay/server/out', 'started');
        console.debug('start server');

        // init all apps
        this.apps.filter((a) => a.init != null).forEach((a) => a.init!());

        this.currentAppIndex = 0;
        this.currentAppIteration = 0;

        this.renderApp();

        const { appIterations } = this.settings;

        this.interval = setInterval(() => {
            if (this.client.connected) {
                this.renderApp();

                if (this.currentAppIteration >= appIterations) {
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
        this.currentAppIteration = 0;
        this.currentAppIndex++;

        if (this.currentAppIndex >= this.apps.length) {
            this.currentAppIndex = 0;
        }

        const app = this.apps[this.currentAppIndex];

        if (app.reset != null) {
            app.reset();
        }

        if (app.isReady === false) {
            this.nextApp();
        }
    }

    private renderApp(): void {
        const app = this.apps[this.currentAppIndex];

        if (this.currentAppIteration === 0) {
            console.log('app', app.name);
        }

        const shouldRender =
            app.renderOnlyOneTime === false || this.currentAppIteration === 0;

        if (shouldRender) {
            this.controller.clear();
            app.render();
            this.controller.show();
        }

        this.currentAppIteration++;
    }

    shutdown(): void {
        console.debug('shutdown');

        if (this.client != null) {
            this.client.end(true);
        }

        this.controller.destroy();
    }
}
