import { RoomWeather } from './room-weather';

export interface ControllerInfo {
    version: string;
    wifirssi: string;
    wifiquality: number;
    wifissid: string;
    ip: string;
    chipID: string;
    lux: number;
    roomWeather: RoomWeather;
}
