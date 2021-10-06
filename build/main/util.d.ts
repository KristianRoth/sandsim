import { MouseState } from "./io";
declare type Pair<A, B> = {
    first: A;
    second: B;
};
declare type NestedArray<T> = T | NestedArray<T>[];
export declare const map2: <A>(arr1: A[], arr2: A[], callBack: (a: A, b: A) => Pair<A, A>) => Pair<A[], A[]>;
export declare const drag: (number: number, minn: number, maxx: number) => number;
export declare const plotLine: (x0: number, y0: number, x1: number, y1: number) => MouseState[];
export declare const makeArray: <A>(initialValue: A, ...args: number[]) => NestedArray<A>;
export {};
