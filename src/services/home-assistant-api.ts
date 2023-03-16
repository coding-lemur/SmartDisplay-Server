import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import dayjs from 'dayjs';

const baseApiUrl = process.env.HA_BASE_API_URL!;
const accessToken = process.env.HA_ACCESS_TOKEN!;

type HaResponse = {state: string, last_updated: string}

const loadState = async (entityId: string) => {
    const url = `${baseApiUrl}/states/${entityId}`;

    const options: AxiosRequestConfig = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    };

    const response = await axios.get<any, AxiosResponse<HaResponse, any>>(url, options);
    const { state, last_updated } = response.data;

    return { state, last_updated };
};

export const loadStateWithTimeCheck = async (
    entityId: string,
    maxAgeMinutes: number = 5
) => {
    const { state, last_updated } = await loadState(entityId);

    if (state === 'unavailable') {
        console.log(`state '${entityId}' unavailable`);
        return null;
    }

    const diffMinutes = dayjs().diff(last_updated, 'minute');

    if (diffMinutes >= maxAgeMinutes) {
        console.log(`state '${entityId}' is too old`, diffMinutes);
        return null;
    }

    return state as string;
};
