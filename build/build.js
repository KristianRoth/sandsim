var Phase;
(function (Phase) {
    Phase[Phase["GAS"] = 0] = "GAS";
    Phase[Phase["LIQUID"] = 1] = "LIQUID";
    Phase[Phase["DUST"] = 2] = "DUST";
    Phase[Phase["SOLID"] = 3] = "SOLID";
})(Phase || (Phase = {}));
var getColor = function (r, g, b) {
    return [r / 255, g / 255, b / 255, 255];
};
var elementProps = [
    {
        name: 'Sand',
        density: 1442,
        phase: Phase.DUST,
        boilingPoint: 2230,
        freezingPoint: 1550,
        color: getColor(194, 178, 128),
        flamable: false,
    },
    {
        name: 'Water',
        density: 997,
        phase: Phase.LIQUID,
        boilingPoint: 100,
        freezingPoint: 0,
        color: getColor(21, 61, 237),
        flamable: false,
    },
    {
        name: 'Wood',
        density: 497,
        phase: Phase.LIQUID,
        boilingPoint: 100,
        freezingPoint: 0,
        color: getColor(79, 53, 14),
        flamable: false,
    },
    {
        name: 'Wood',
        density: 497,
        phase: Phase.LIQUID,
        boilingPoint: 100,
        freezingPoint: 0,
        color: getColor(79, 53, 14),
        flamable: false,
    },
    {
        name: 'Wood',
        density: 497,
        phase: Phase.LIQUID,
        boilingPoint: 100,
        freezingPoint: 0,
        color: getColor(79, 53, 14),
        flamable: false,
    },
    {
        name: 'Wood',
        density: 497,
        phase: Phase.LIQUID,
        boilingPoint: 100,
        freezingPoint: 0,
        color: getColor(79, 53, 14),
        flamable: false,
    },
    {
        name: 'Wood',
        density: 497,
        phase: Phase.LIQUID,
        boilingPoint: 100,
        freezingPoint: 0,
        color: getColor(79, 53, 14),
        flamable: false,
    },
    {
        name: 'Wood',
        density: 497,
        phase: Phase.LIQUID,
        boilingPoint: 100,
        freezingPoint: 0,
        color: getColor(79, 53, 14),
        flamable: false,
    },
];
var elementColors = elementProps.reduce(function (acc, current) { return acc.concat(current.color); }, []);
var initialize = function () {
    var elements = makeArray(0, gw, gh, elementCount);
    var tempatures = makeArray(20, gw, gh);
    for (var i = 0; i < gw; i++) {
        for (var j = 0; j < gh; j++) {
            elements[i][j][0] = (i === j || i === gw - j) ? 255 : 0;
            elements[i][j][1] = 0;
            elements[i][j][2] = 0;
            elements[i][j][5] = 0;
            elements[i][j][7] = 0;
        }
    }
    gs = {
        elements: elements,
        tempature: tempatures
    };
    return gs;
};
var update = function () {
    for (var i = 0; i < gw; i++) {
        for (var j = gh - 1; j >= 0; j--) {
            doCell(i, j);
        }
    }
};
var balance = function (src, dest, balance) {
    if (balance === void 0) { balance = 0.5; }
    return map2(src, dest, function (element1, element2) {
        var sum = element1 + element2;
        var av = sum * balance;
        return { first: av, second: sum - av };
    });
};
var doCell = function (i, j) {
    var tempature = gs.tempature[i][j];
    var elements = gs.elements[i][j];
    var gasses = [];
    var gassesSum = 0;
    var liquids = [];
    var liquidsSum = 0;
    var dusts = [];
    var dustsSum = 0;
    elements.forEach(function (element, idx) {
        if (tempature > elementProps[idx].boilingPoint) {
            gasses.push(idx);
            gassesSum += element;
        }
        else if (tempature > elementProps[idx].freezingPoint) {
            liquids.push(idx);
            liquidsSum += element;
        }
        else {
            dusts.push(idx);
            dustsSum += element;
        }
    });
};
var BrushType;
(function (BrushType) {
    BrushType["SQUARE"] = "SQUARE";
    BrushType["CIRCLE"] = "CIRCLE";
})(BrushType || (BrushType = {}));
var ioState = {
    mouse: {
        x: 0,
        y: 0,
    },
    lastMouse: {
        x: 0,
        y: 0
    },
    brush: {
        currentElement: 0,
        brushSize: 10,
        elementAmount: 255,
        brushType: BrushType.CIRCLE,
    },
    debugTexture: false,
    gameParams: {
        gravity: 70
    }
};
var doIO = function () {
    ioState.lastMouse = ioState.mouse;
    var _a = [mouseX, mouseY].map(function (a) { return drag(floor(a / gridSize), 0, gw - 1); }), x = _a[0], y = _a[1];
    ioState.mouse = { x: x, y: y };
    if (0 <= mouseX && mouseX <= width && 0 <= mouseY && mouseY <= height) {
        if (mouseIsPressed) {
            if (ioState.brush.brushType === BrushType.CIRCLE) {
                plotLine(ioState.mouse.x, ioState.mouse.y, ioState.lastMouse.x, ioState.lastMouse.y)
                    .forEach(function (point) { return setEllipse(point.x, point.y, ioState.brush.brushSize, ioState.brush.currentElement, ioState.brush.elementAmount); });
            }
            if (ioState.brush.brushType === BrushType.SQUARE) {
                plotLine(ioState.mouse.x, ioState.mouse.y, ioState.lastMouse.x, ioState.lastMouse.y)
                    .forEach(function (point) { return setSquare(point.x, point.y, ioState.brush.brushSize, ioState.brush.currentElement, ioState.brush.elementAmount); });
            }
        }
    }
};
var setEllipse = function (x, y, radius, elementId, elementAmount) {
    setArea(x, y, radius, elementId, elementAmount, function (x, y, x2, y2, radius) { return Math.pow((x2 - x), 2) + Math.pow((y2 - y), 2) <= Math.pow((radius / 2), 2); });
};
var setSquare = function (x, y, radius, elementId, elementAmount) {
    setArea(x, y, radius, elementId, elementAmount, function (x, y, x2, y2, radius) { return abs(x2 - x) <= radius / 2 && abs(y2 - y) <= radius / 2; });
};
var setArea = function (x, y, radius, elementId, elementAmount, fn) {
    for (var i = 0; i < gh; i++) {
        for (var j = 0; j < gw; j++) {
            if (fn(i, j, x, y, radius)) {
                gs.elements[i][j][elementId] = elementAmount;
            }
        }
    }
};
var initializeUi = function () {
    ioState.brush.brushSize = min(gw, gh) / 10;
    var controlsDiv = document.getElementById('controls');
    var brushSizeSlider = getSliderElement('Brush size', 1, min(gw, gh) / 2, 1, ioState.brush.brushSize, function (value) { ioState.brush.brushSize = value; });
    controlsDiv.append(brushSizeSlider);
    var currentElmenetSelector = getSelectElement("Brush type", false, elementProps.map(function (e, i) { return ({ first: i, second: e.name }); }), function (value) { ioState.brush.currentElement = int(value); });
    controlsDiv.append(currentElmenetSelector);
    var elementAmountSlider = getSliderElement('Element amount', 0, 255, 1, ioState.brush.elementAmount, function (value) { ioState.brush.elementAmount = value; });
    controlsDiv.append(elementAmountSlider);
    var brushTypeSelector = getSelectElement("Brush type", true, Object.keys(BrushType).map(function (e) { return ({ first: e, second: e }); }), function (value) { ioState.brush.brushType = BrushType[value]; });
    controlsDiv.append(brushTypeSelector);
    var debugTextureCheckbox = document.createElement('input');
    debugTextureCheckbox.type = 'checkbox';
    debugTextureCheckbox.onchange = function () {
        ioState.debugTexture = debugTextureCheckbox.checked;
    };
    controlsDiv.append(getLabelElement('Enable texture debug:'));
    controlsDiv.append(debugTextureCheckbox);
    var gravityAmountSlider = getSliderElement('Gravity amount', 0, 100, 1, ioState.gameParams.gravity, function (value) { ioState.gameParams.gravity = value; });
    controlsDiv.append(gravityAmountSlider);
    var desc = document.createElement('p');
    desc.innerHTML = "Source code can be found <a target=\"_blank\" href=\"https://github.com/KristianRoth/sandsim\" >here</a>";
    controlsDiv.append(desc);
};
var getLabelElement = function (text) {
    var label = document.createElement('label');
    label.innerHTML = text;
    return label;
};
var getSliderElement = function (title, min, max, step, defaultValue, updateState) {
    var sliderContainer = document.createElement('div');
    var slider = document.createElement('input');
    var legend = getLabelElement(title + ': ' + defaultValue);
    slider.type = 'range';
    slider.min = str(min);
    slider.max = str(max);
    slider.step = str(step !== null && step !== void 0 ? step : '1');
    slider.defaultValue = str(defaultValue);
    slider.oninput = function () {
        updateState(int(slider.value));
        legend.innerHTML = title + ': ' + int(slider.value);
    };
    sliderContainer.append(legend);
    sliderContainer.append(slider);
    return sliderContainer;
};
var getSelectElement = function (title, reverse, options, updateState) {
    var selectContainer = document.createElement('div');
    var selector = document.createElement('select');
    options = (reverse) ? options.reverse() : options;
    selector.innerHTML = options.reduce(function (acc, e, i) { return acc + ("<option value=\"" + str(e.first) + "\">" + e.second + "</option>"); }, "");
    selector.onchange = function () {
        updateState(selector.options[selector.selectedIndex].value);
    };
    selectContainer.append(getLabelElement(title + ': '));
    selectContainer.append(selector);
    return selectContainer;
};
var texcoordShader;
var gridSize = 10;
var w = 1000;
var h = 1000;
var gw = w / gridSize;
var gh = h / gridSize;
var elementCount = 8;
var heightMultiplier = Math.ceil(elementCount / 3);
var elementTexture;
var loaded = function () { return true; };
var gs;
var preload = function () {
    texcoordShader = loadShader('sketch/shaders/uniform.vert', 'sketch/shaders/uniform.frag');
};
var setup = function () {
    gs = initialize();
    initializeUi();
    elementTexture = createImage(gw, gh * heightMultiplier);
    makeTexture(elementTexture);
    console.log("STARTING SETUP GridSize:", gw, gh, "Texture multiplier:", heightMultiplier, "Texture size:", elementTexture.width, elementTexture.height);
    console.log("Starting gamestate:", gs);
    createCanvas(w, h, WEBGL);
    noStroke();
};
function draw() {
    update();
    doIO();
    makeTexture(elementTexture);
    shader(texcoordShader);
    texcoordShader.setUniform('size', [gw, gh * heightMultiplier]);
    texcoordShader.setUniform('heightMultiplier', heightMultiplier);
    texcoordShader.setUniform('elementColors', elementColors);
    texcoordShader.setUniform('elementTex', elementTexture);
    texcoordShader.setUniform('showTest', ioState.debugTexture);
    if (frameCount % 100 === 0) {
        console.log("Framerate:", ceil(frameRate()));
    }
    rect(0, 0, w, h);
}
var makeTexture = function (tex) {
    tex.loadPixels();
    for (var i = 0; i < gh; i++) {
        for (var j = 0; j < gw; j++) {
            var idx = (i * gw + j) * 4;
            var m = (gw * gh * 4);
            tex.pixels[idx] = gs.elements[j][i][0];
            tex.pixels[idx + 1] = gs.elements[j][i][1];
            tex.pixels[idx + 2] = gs.elements[j][i][2];
            tex.pixels[idx + 3] = 255;
            tex.pixels[idx + m] = gs.elements[j][i][3];
            tex.pixels[idx + m + 1] = gs.elements[j][i][4];
            tex.pixels[idx + m + 2] = gs.elements[j][i][5];
            tex.pixels[idx + m + 3] = 255;
            tex.pixels[idx + 2 * m] = gs.elements[j][i][6];
            tex.pixels[idx + 2 * m + 1] = gs.elements[j][i][7];
            tex.pixels[idx + 2 * m + 2] = 255;
            tex.pixels[idx + 2 * m + 3] = 255;
        }
    }
    tex.updatePixels();
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var map2 = function (arr1, arr2, callBack) {
    var ret1 = [];
    var ret2 = [];
    for (var i = 0; i < min(arr1.length, arr2.length); i++) {
        var _a = callBack(arr1[i], arr2[i]), first = _a.first, second_1 = _a.second;
        ret1.push(first);
        ret2.push(second_1);
    }
    return { first: ret1, second: ret2 };
};
var drag = function (number, minn, maxx) {
    return min(max(number, minn), maxx);
};
var plotLine = function (x0, y0, x1, y1) {
    var dx = abs(x1 - x0);
    var sx = x0 < x1 ? 1 : -1;
    var dy = -abs(y1 - y0);
    var sy = y0 < y1 ? 1 : -1;
    var err = dx + dy;
    var points = [];
    while (true) {
        points.push({ x: x0, y: y0 });
        if (int(x0) === int(x1) && int(y0) === int(y1)) {
            break;
        }
        ;
        var e2 = 2 * err;
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
var makeArray = function (initialValue) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (args.length === 0) {
        return initialValue;
    }
    var col = [];
    var currentDim = args[0], tail = args.slice(1);
    for (var i = 0; i < currentDim; i++) {
        col.push(makeArray.apply(void 0, __spreadArrays([initialValue], tail)));
    }
    return col;
};
//# sourceMappingURL=build.js.map