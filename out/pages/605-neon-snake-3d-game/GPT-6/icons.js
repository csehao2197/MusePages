// Lucide v0.468.0, ISC. Only these three icon nodes are included.
import createElement from "./vendor/lucide/createElement.js";

const attributes =
{
    xmlns: "http://www.w3.org/2000/svg",
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "aria-hidden": "true"
};
const speaker = ["path", { d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" }];
const nodes =
{
    pause:
    [
        ["rect", { x: 14, y: 4, width: 4, height: 16, rx: 1 }],
        ["rect", { x: 6, y: 4, width: 4, height: 16, rx: 1 }]
    ],
    volume:
    [
        speaker,
        ["path", { d: "M16 9a5 5 0 0 1 0 6" }],
        ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728" }]
    ],
    muted:
    [
        speaker,
        ["line", { x1: 22, x2: 16, y1: 9, y2: 15 }],
        ["line", { x1: 16, x2: 22, y1: 9, y2: 15 }]
    ]
};
export const icon = (name) => createElement(["svg", attributes, nodes[name]]);
