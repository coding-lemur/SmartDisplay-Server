export const roundToFixed = (
    value: number | null | undefined,
    fractionDigits = 1
) => {
    if (value == null) {
        return null;
    }

    const factor = Math.pow(10, fractionDigits);

    return (Math.round((value + Number.EPSILON) * factor) / factor).toFixed(
        fractionDigits
    );
};

export const hasValue = (value: string | undefined) => {
    if (value === null || value === undefined) {
        return false;
    }

    if (value === '') {
        return false;
    }

    return true;
};
