import { Position } from './position';

export enum FontWeight {
    Normal = '',
    Big = 'big'
}

export interface DrawTextDataEasy {
    text: string;
    position: Position;
    color: string;
    fontWeight: FontWeight;
}

export interface DrawTextData {
    text: string;
    font: 'big' | '';
    color: number[];
    x: number;
    y: number;
}
