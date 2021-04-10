import fetch, { RequestInit } from 'node-fetch';
import dayjs from 'dayjs';

export class HomeAssistantApiService {
    async loadCo2SensorValue(): Promise<number | null> {
        const baseApiUrl = process.env.APP_CO2_SENSOR_BASE_API_URL;
        const entityId = process.env.APP_CO2_SENSOR_ENTITY_ID;
        const accessToken = process.env.APP_CO2_SENSOR_ACCESS_TOKEN;

        const url = `${baseApiUrl}/states/${entityId}`;

        const options: RequestInit = {
            method: 'GET',
            headers: [
                ['Authorization', `Bearer ${accessToken}`],
                ['Content-Type', 'application/json'],
            ],
        };
        const response = await fetch(url, options);
        const data = await response.json();
        const { state, last_updated } = data;

        if (state === 'unavailable') {
            console.log('co2 value unavailable');
            return null;
        }

        const diffMinutes = dayjs().diff(last_updated, 'minute');

        if (diffMinutes >= 5) {
            console.log('co2 value is too old', diffMinutes);
            return null;
        }

        return state;
    }
}
