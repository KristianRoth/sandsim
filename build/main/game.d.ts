export declare type GameState = {
    elements: number[][][];
    tempature: number[][];
};
export declare const initialize: () => {
    elements: number[][][];
    tempature: number[][];
};
export declare const update: (gs: GameState) => GameState;
