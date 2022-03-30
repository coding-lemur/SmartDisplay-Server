export interface OpenWeatherResponse {
    main: { temp: number; humidity: number };
    wind: {
        speed: number;
    };
}
