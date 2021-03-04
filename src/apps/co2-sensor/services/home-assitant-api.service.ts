import fetch, { RequestInit } from 'node-fetch';

export class HomeAssistantApiService {
    async loadCo2SensorValue(): Promise<number> {
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

        return data.state;
    }
}
