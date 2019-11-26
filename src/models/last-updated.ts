export class LastUpdated<T> {
    private _value: T | null = null;
    private _lastUpdated: Date | null = null;

    set value(v: T | null) {
        this._value = v;
        this._lastUpdated = new Date();
    }

    get value(): T | null {
        return this._value;
    }

    get lastUpdated(): Date | null {
        return this._lastUpdated;
    }
}
