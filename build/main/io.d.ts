declare type IOState = {
    mouse: MouseState;
    lastMouse: MouseState;
    brush: BrushState;
    debugTexture: boolean;
    gameParams: GameParams;
};
export declare type MouseState = {
    x: number;
    y: number;
};
declare type BrushState = {
    currentElement: number;
    brushSize: number;
    elementAmount: number;
    brushType: BrushType;
};
declare type GameParams = {
    gravity: number;
};
declare enum BrushType {
    SQUARE = "SQUARE",
    CIRCLE = "CIRCLE"
}
export declare let ioState: IOState;
export declare const doIO: () => void;
export declare const initializeUi: () => void;
export {};
