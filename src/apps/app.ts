export interface App {
    readonly name: string;
    readonly isReady?: boolean;
    readonly renderOnlyOneTime?: boolean;

    init?(): void;
    reset?(): void;
    render(): void;
}
