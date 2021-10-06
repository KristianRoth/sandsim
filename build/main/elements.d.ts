declare type ElementProps = {
    name: string;
    density: number;
    phase: Phase;
    boilingPoint: number;
    freezingPoint: number;
    color: number[];
    flamable: boolean;
};
declare enum Phase {
    GAS = 0,
    LIQUID = 1,
    DUST = 2,
    SOLID = 3
}
declare const getColor: (r: number, g: number, b: number) => number[];
declare const elementProps: ElementProps[];
declare const elementColors: number[];
