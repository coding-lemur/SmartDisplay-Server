import mqtt, { IClientOptions } from 'mqtt';

import { ControllerInfo } from './models';
import { SmartDisplayController } from './smart-display-controller';
import { App } from './apps/app';
import { TimeApp } from './apps/time';
import { RoomWeatherApp } from './apps/room-weather';
import { CityWeatherApp } from './apps/city-weather';
import { DateApp } from './apps/date';
import { getLastTopicPart } from './helper/mqtt-helper';

export class Server {
    private readonly _client: mqtt.Client;
    private readonly _apps: App[] = [];
    private readonly _controller: SmartDisplayController;
    private readonly _appIterations = parseInt(
        process.env.APP_ITERATIONS || '10',
        10
    );

    private _interval: NodeJS.Timeout | null = null;
    private _currentAppIndex = 0;
    private _currentAppIteration = 0;

    private get isRunning() {
        return this._interval != null;
    }

    constructor() {
        const clientOptions: IClientOptions = {
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD,
        };

        this._client = mqtt
            .connect(process.env.MQTT_SERVER!, clientOptions)
            .subscribe('smartDisplay/server/in/#')
            .on('message', (topic, message) => {
                const command = getLastTopicPart(topic);

                if (command == null) {
                    return;
                }

                if (topic.startsWith('smartDisplay/server/in/')) {
                    this._processIncomingServerMessage(
                        command,
                        message.toString()
                    );
                } else if (topic.startsWith('smartDisplay/client/out/')) {
                    this._processOutcomingClientMessage(
                        command,
                        message.toString()
                    );
                }
            })
            .on('error', (error) => {
                console.error('MQTT', error);
            });

        this._controller = new SmartDisplayController(this._client);

        this._loadApps();
    }

    private _processIncomingServerMessage(command: string, message: string) {
        console.debug('server cmd', command, message);

        switch (command) {
            case 'power': {
                if (message === 'on' || message === 'off') {
                    const powerOn = message === 'on' ? true : false;

                    console.debug('switch power-status', powerOn);

                    this._controller.power(powerOn);

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

                this._client.publish(
                    'smartDisplay/server/out/power-state',
                    powerOn
                );
            }

            default:
                break;
        }
    }

    private _processOutcomingClientMessage(command: string, message: string) {
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

    private _loadApps() {
        const timeApp = new TimeApp(this._controller);
        const dateApp = new DateApp(this._controller);
        const roomWeather = new RoomWeatherApp(this._controller);
        const cityWeather = new CityWeatherApp(this._controller);

        this._apps.push(...[timeApp, dateApp, roomWeather, cityWeather]);
    }

    start() {
        if (this._interval != null) {
            console.warn('found running instance');
            this.stop();
        }

        this._client.publish('smartDisplay/server/out', 'started');
        console.debug('start server');

        // init all apps
        this._apps.filter((a) => a.init != null).forEach((a) => a.init!());

        this._currentAppIndex = 0;
        this._currentAppIteration = 0;

        this.renderApp();

        this._interval = setInterval(() => {
            if (this._client.connected) {
                this.renderApp();

                if (this._currentAppIteration >= this._appIterations) {
                    this.nextApp();
                }
            } else {
                console.error('client not connected');
            }

            // check controller is offline
            if (this._controller.isOffline) {
                console.debug('controller offline -> stop server');
                this.stop();
            }
        }, 1000);
    }

    stop() {
        console.debug('stop server');

        if (this._interval == null) {
            return;
        }

        clearInterval(this._interval);
        this._interval = null;
    }

    private nextApp() {
        this._currentAppIteration = 0;
        this._currentAppIndex++;

        if (this._currentAppIndex >= this._apps.length) {
            this._currentAppIndex = 0;
        }

        const app = this._apps[this._currentAppIndex];

        if (app.reset != null) {
            app.reset();
        }

        if (app.isReady === false) {
            this.nextApp();
        }
    }

    private renderApp() {
        const app = this._apps[this._currentAppIndex];

        if (this._currentAppIteration === 0) {
            console.log('app', app.name);
        }

        const shouldRender =
            app.renderOnlyOneTime === false || this._currentAppIteration === 0;

        if (shouldRender) {
            this._controller.clear();
            app.render();
            this._controller.show();
        }

        this._currentAppIteration++;
    }

    shutdown() {
        console.debug('shutdown');

        if (this._client != null) {
            this._client.end(true);
        }

        this._controller.destroy();
    }
}
