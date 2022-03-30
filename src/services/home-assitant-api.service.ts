import axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';

const baseApiUrl = process.env.HA_BASE_API_URL!;
const accessToken = process.env.HA_ACCESS_TOKEN!;

const co2SensorEntityId = process.env.APP_CO2_SENSOR_ENTITY_ID!;
const bme280SensorEntityId = 'sensor.bme280_temperature'; // TOOD use env varibale

const loadState = async (entityId: string) => {
    const url = `${baseApiUrl}/states/${entityId}`;

    const options: AxiosRequestConfig = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    };

    const response = await axios.get(url, options);
    const { state, last_updated } = response.data;

    return { state, last_updated };
};

export const loadCo2SensorValue = async () => {
    const { state, last_updated } = await loadState(co2SensorEntityId);

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
};

export const loadBME280Temperature = async () => {
    const { state, last_updated } = await loadState(bme280SensorEntityId);

    if (state === 'unavailable') {
        console.log('BME280 temperature value unavailable');
        return null;
    }

    const diffMinutes = dayjs().diff(last_updated, 'minute');

    if (diffMinutes >= 5) {
        console.log('BME280 temperature is too old', diffMinutes);
        return null;
    }

    return Number(state);
};
