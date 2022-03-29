import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';

import { SmartDisplayController } from '../smart-display-controller';

export const primaryColor = process.env.PRIMARY_COLOR || '#00C8C8';
export const secondaryColor = process.env.SECONDARY_COLOR || '#4CFF00';

const calcProgressXPosition = (
    value: number | null | undefined,
    maxValue: number
): number | undefined => {
    if (value == null) {
        return;
    }

    const percentValue = value / maxValue;
    const xPosition = 2 + Math.round(26 * percentValue);

    return xPosition;
};

export const renderWeekday = (controller: SmartDisplayController): void => {
    const currentWeekday = dayjs().weekday();
    const getXPositionByWeekDay = (weekday: number) => weekday * 4 + 2;

    for (let weekday = 0; weekday < 7; weekday++) {
        const xPosition = getXPositionByWeekDay(weekday);
        const color = weekday === currentWeekday ? primaryColor : '#A0A0A0';

        controller.drawLine(
            { x: xPosition, y: 7 },
            { x: xPosition + 2, y: 7 },
            color
        );
    }
};

export const renderProgressbar = (
    controller: SmartDisplayController,
    value: number | null | undefined,
    maxValue: number,
    hexColor = '#A0A0A0'
): void => {
    const xEndPosition = calcProgressXPosition(value, maxValue);

    if (xEndPosition == null) {
        return;
    }

    controller.drawLine({ x: 2, y: 7 }, { x: xEndPosition, y: 7 }, hexColor);
};

export const renderPixelProgress = (
    controller: SmartDisplayController,
    value: number | null,
    maxValue: number,
    hexColor: string = '#A0A0A0'
): void => {
    const xPosition = calcProgressXPosition(value, maxValue);

    if (xPosition == null) {
        return;
    }

    controller.drawPixel({ x: xPosition, y: 7 }, hexColor);
};
