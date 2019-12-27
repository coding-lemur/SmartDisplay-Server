import { RoomWeather, Network } from './';

export interface ControllerInfo {
    version: string;
    chipID: string;
    lux: number;
    powerOn: boolean;
    network: Network;
    roomWeather: RoomWeather;
}
