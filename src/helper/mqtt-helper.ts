export class MqttHelper {
    static getLastTopicPart(topic: string): string | null {
        if (topic == null || topic === '' || topic.indexOf('/') === -1) {
            return null;
        }

        const parts = topic.split('/');
        const lastPart = parts[parts.length - 1];

        return lastPart;
    }
}
