import { App } from './app';
import { CityWeatherData } from '../models';
import { OpenWeatherMapService } from '../services';
import { SmartDisplayController } from '../smart-display-controller';

export class CityWeatherApp implements App {
    private readonly _service = new OpenWeatherMapService(this.settings);

    private _data: CityWeatherData | undefined;

    readonly name = 'city-weather';
    readonly shouldRerender = true;

    get isReady(): boolean {
        return this._data != null;
    }

    constructor(
        private controller: SmartDisplayController,
        private settings: any
    ) {}

    reset(): void {
        const data = this._service.loadData().then(data => {
            this._data = data;
        });
    }

    render(): void {
        throw new Error('Method not implemented.');
    }
}
