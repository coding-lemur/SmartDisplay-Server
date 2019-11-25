import { App } from './apps/app';
import { TimeApp } from './apps/time';
import { SmartDisplayController } from './smart-display-controller';

export class Server {
    private readonly apps: App[] = [];
    private readonly controller: SmartDisplayController;

    private powerOn = true;
    private currentAppIndex = 0;

    constructor(private settings: any) {
        this.controller = new SmartDisplayController(settings);

        this.loadApps();
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
