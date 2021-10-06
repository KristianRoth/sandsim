"use strict";
var Phase;
(function (Phase) {
    Phase[Phase["GAS"] = 0] = "GAS";
    Phase[Phase["LIQUID"] = 1] = "LIQUID";
    Phase[Phase["DUST"] = 2] = "DUST";
    Phase[Phase["SOLID"] = 3] = "SOLID";
})(Phase || (Phase = {}));
const getColor = (r, g, b) => {
    return [r / 255, g / 255, b / 255, 255];
};
const elementProps = [
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
const elementColors = elementProps.reduce((acc, current) => acc.concat(current.color), []);
