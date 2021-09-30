var elementColors = [
    1, 0, 0, 1,
    0, 1, 0, 1,
    0, 0, 1, 1,
    1, 0, 1, 1,
    1, 1, 0, 1,
];
var initialize = function () {
    var elements = [];
    for (var i = 0; i < gw; i++) {
        var col = [];
        for (var j = 0; j < gh; j++) {
            var eArray = [];
            for (var e = 0; e < elementCount; e++) {
                eArray.push(0);
            }
            eArray[0] = (i === j || i === gw - j) ? 255 : 0;
            eArray[1] = (abs(int(gw / 2) - i) < 3) ? 255 : 0;
            eArray[2] = (j == 0) ? 255 : 0;
            eArray[5] = 0;
            eArray[7] = 0;
            col.push(eArray);
        }
        elements.push(col);
    }
    gs = {
        elements: elements,
        elementColors: elementColors
    };
    return gs;
};
var update = function (gs) {
    for (var i = 0; i < gw; i++) {
        for (var j = gh - 1; j >= 0; j--) {
            for (var x = -1; x <= 1; x += 2) {
                if (j + x < gh && j + x >= 0) {
                    var balanced = balance(gs.elements[i][j + x], gs.elements[i][j], (x === 1) ? 0.7 : 0.5);
                    gs.elements[i][j + x] = balanced.first;
                    gs.elements[i][j] = balanced.second;
                }
                if (i + x < gw && i + x >= 0) {
                    var balanced = balance(gs.elements[i + x][j], gs.elements[i][j]);
                    gs.elements[i + x][j] = balanced.first;
                    gs.elements[i][j] = balanced.second;
                }
            }
        }
    }
    return gs;
};
var balance = function (src, dest, balance) {
    if (balance === void 0) { balance = 0.5; }
    return map2(src, dest, function (element1, element2) {
        var sum = element1 + element2;
        var av = sum * balance;
        return { first: av, second: sum - av };
    });
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
var showTexture = false;
var gs;
var preload = function () {
    texcoordShader = loadShader('sketch/shaders/uniform.vert', 'sketch/shaders/uniform.frag');
};
var setup = function () {
    gs = initialize();
    elementTexture = createImage(gw, gh * heightMultiplier);
    makeTexture(gs, elementTexture);
    elementTexture.loadPixels();
    console.log(elementTexture.pixels);
    console.log("STARTING SETUP GridSize:", gw, gh, "Texture multiplier:", heightMultiplier, "Texture size:", elementTexture.width, elementTexture.height);
    createCanvas(w, h, WEBGL);
    noStroke();
    console.log(gs);
};
function draw() {
    mouse();
    gs = update(gs);
    makeTexture(gs, elementTexture);
    if (showTexture) {
        background(frameCount % 2 === 0 ? 255 : 0);
        image(elementTexture, 0, 0, 100, 200);
        return;
    }
    shader(texcoordShader);
    texcoordShader.setUniform('size', [gw, gh * heightMultiplier]);
    texcoordShader.setUniform('heightMultiplier', heightMultiplier);
    texcoordShader.setUniform('elementColors', gs.elementColors);
    texcoordShader.setUniform('elementTex', elementTexture);
    if (frameCount % 100 === 0) {
        console.log(frameRate());
    }
    rect(0, 0, w, h);
}
var makeTexture = function (gs, tex) {
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
var mouse = function () {
    if (mouseIsPressed) {
        var _a = [mouseX, mouseY].map(function (a) { return drag(floor(a / gridSize), 0, gw - 1); }), i = _a[0], j = _a[1];
        gs.elements[i][j][0] = 255;
    }
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
//# sourceMappingURL=build.js.map