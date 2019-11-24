import mqtt from 'mqtt';

enum App {
    Time,
    RoomWeather,
    CityWeather
}

export class Server {
    private readonly client: mqtt.Client;

    private powerOn = true;
    private currentApp = App.Time;

    constructor(private settings: any) {
        const mqttSettings = settings.mqtt;
        this.client = mqtt.connect(mqttSettings.server, {
            username: mqttSettings.username,
            password: mqttSettings.password
        });

        this.client.publish('awtrix-server', 'started');
        this.client.subscribe('#');

        this.client.on('message', (topic, message) => {
            // message is Buffer
            console.log(message.toString());
            //client.end()
        });

        this.client.on('error', error => {
            console.error(error);
        });

        console.log("los geht's!");

        setInterval(() => {
            console.log('next app');
        }, 15000);
    }

    shutdown(): void {
        this.client.end(true);
    }
}
