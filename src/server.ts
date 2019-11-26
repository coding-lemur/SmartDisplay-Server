import mqtt from 'mqtt';

import { App } from './apps/app';
import { TimeApp } from './apps/time';
import { SmartDisplayController } from './smart-display-controller';

export class Server {
    private readonly client: mqtt.Client;
    private readonly apps: App[] = [];
    private readonly controller: SmartDisplayController;

    private powerOn = true;
    private currentAppIndex = 0;

    constructor(settings: any) {
        const mqttSettings = settings.mqtt;

        this.client = mqtt
            .connect(mqttSettings.server, {
                username: mqttSettings.username,
                password: mqttSettings.password
            })
            .on('message', (topic, message) => {
                if (!topic.startsWith('smart-display/server/in/')) {
                    return;
                }

                const parts = topic.split('/');
                const lastPart = parts[parts.length - 1];

                this.processIncomingMessage(lastPart, message.toString());

                console.log('server message', topic, message.toString());
            })
            .on('error', error => {
                console.error(error);
            });

        this.controller = new SmartDisplayController(this.client);

        this.loadApps();
    }

    private processIncomingMessage(command: string, message: string) {
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

        this.apps.push(timeApp);

        for (const app of this.apps) {
            app.setup();
        }
    }

    run(): void {
        console.log('go!');
        this.client.publish('smart-display/server/out', 'started');

        this.showApp();

        setInterval(() => {
            console.log('next app');

            this.nextApp();
            this.showApp();
        }, 15000);
    }

    private nextApp(): void {
        this.currentAppIndex++;

        if (this.currentAppIndex >= this.apps.length) {
            this.currentAppIndex = 0;
        }
    }

    private showApp(): void {
        const app = this.apps[this.currentAppIndex];
        app.show();
    }

    shutdown(): void {
        this.controller.destroy();
    }
}
