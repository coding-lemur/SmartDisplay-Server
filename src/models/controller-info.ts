import { RoomWeather, Network } from './';

export interface ControllerInfo {
    version: string;
    chipID: string;
    lux: number;
    network: Network;
    roomWeather: RoomWeather;
}
