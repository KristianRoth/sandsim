export const map2 = (arr1, arr2, callBack) => {
    let ret1 = [];
    let ret2 = [];
    for (let i = 0; i < min(arr1.length, arr2.length); i++) {
        let { first, second } = callBack(arr1[i], arr2[i]);
        ret1.push(first);
        ret2.push(second);
    }
    return { first: ret1, second: ret2 };
};
export const drag = (number, minn, maxx) => {
    return min(max(number, minn), maxx);
};
export const plotLine = (x0, y0, x1, y1) => {
    let dx = abs(x1 - x0);
    let sx = x0 < x1 ? 1 : -1;
    let dy = -abs(y1 - y0);
    let sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    let points = [];
    while (true) {
        points.push({ x: x0, y: y0 });
        if (int(x0) === int(x1) && int(y0) === int(y1)) {
            break;
        }
        ;
        let e2 = 2 * err;
        if (e2 >= dy) {
            err += dy;
            x0 += sx;
        }
        if (e2 <= dx) {
            err += dx;
            y0 += sy;
        }
    }
    return points;
};
export const makeArray = (initialValue, ...args) => {
    if (args.length === 0) {
        return initialValue;
    }
    let col = [];
    const [currentDim, ...tail] = args;
    for (let i = 0; i < currentDim; i++) {
        col.push(makeArray(initialValue, ...tail));
    }
    return col;
};