import { SmartDisplayController } from '../smart-display-controller';

export interface App {
    reset(): void;
    render(controller: SmartDisplayController): void;
}
