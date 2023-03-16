export const hasValue = (value: string | undefined) => {
    if (value === null || value === undefined) {
        return false;
    }

    if (value === '') {
        return false;
    }

    return true;
};
