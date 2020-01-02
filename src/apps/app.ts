import { SmartDisplayController } from '../smart-display-controller';

export interface App {
    readonly name: string;
    readonly shouldRerender: boolean;
    readonly isReady: boolean;

    reset(): void;
    render(): void;
}
