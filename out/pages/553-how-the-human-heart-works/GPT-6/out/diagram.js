import { model, valveGeometry } from "./model.js";
import { content } from "./content.js";

const NS = "http://www.w3.org/2000/svg";
let identifier = 0;
export function node(name, attributes = {}, parent)
{
    const element = document.createElementNS(NS, name);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
    if (parent) parent.append(element);
    return element;
}

export function spline(points)
{
    const n = points.length;
    let result = `M${points[0]}`;
    for (let i = 0; i < n; i++)
    {
        const p0 = points[(i + n - 1) % n], p1 = points[i], p2 = points[(i + 1) % n], p3 = points[(i + 2) % n];
        const c1 = p1.map((v, j) => v + (p2[j] - p0[j]) / 6);
        const c2 = p2.map((v, j) => v - (p3[j] - p1[j]) / 6);
        result += `C${c1} ${c2} ${p2}`;
    }
    return result + "Z";
}

const chamberData =
{
    RA: { anchor: [332, 428], points: [[262, 272], [330, 250], [392, 276], [402, 345], [388, 410], [330, 428], [268, 404], [244, 340]], color: "#1F4BFF" },
    LA: { anchor: [626, 404], points: [[566, 266], [640, 244], [716, 266], [738, 324], [712, 386], [640, 404], [574, 388], [548, 328]], color: "#FF1F3D" },
    RV: { anchor: [350, 462], points: [[290, 478], [350, 456], [440, 462], [470, 540], [472, 622], [452, 706], [392, 672], [326, 606], [284, 540]], color: "#1F4BFF" },
    LV: { anchor: [626, 450], points: [[548, 482], [622, 446], [704, 470], [730, 550], [710, 652], [656, 738], [596, 790], [552, 716], [530, 626], [526, 546]], color: "#FF1F3D" }
};
const outline =
[
    [262, 238, "RA"], [400, 236, "RA"], [470, 250, "LA"], [550, 236, "LA"], [640, 214, "LA"],
    [742, 244, "LA"], [774, 324, "LA"], [752, 410, "LV"], [768, 500, "LV"], [768, 584, "LV"],
    [740, 676, "LV"], [676, 776, "LV"], [596, 840, "LV"], [530, 792, "LV"], [462, 742, "RV"],
    [388, 710, "RV"], [300, 632, "RV"], [252, 548, "RV"], [244, 452, "RV"], [216, 404, "RA"], [210, 330, "RA"]
];
const valves = [["tricuspid", 332, 442, 90, 44, "inlet"], ["mitral", 626, 425, 90, 52, "inlet"],
    ["pulmonary", 432, 290, -90, 22, "outlet"], ["aortic", 500, 330, -90, 24, "outlet"]];
const particleData =
[
    ["M318 0 L318 280", "always", "blue"], ["M204 836 L204 500 C204 450 236 420 290 380", "always", "blue"],
    ["M828 290 L700 290", "always", "red"], ["M828 346 L700 346", "always", "red"],
    ["M330 340 L332 442 L380 560", "inlet", "blue"], ["M640 320 L626 425 L626 580", "inlet", "red"],
    ["M380 560 L432 480 L432 188", "outlet", "blue"], ["M432 188 L172 188", "outlet", "blue"],
    ["M432 188 L828 188", "outlet", "blue"],
    ["M626 580 L612 502 C540 470 500 440 500 390 L500 160 C500 92 560 56 640 56 C730 56 792 100 792 166 L792 838", "outlet", "red"]
];

export function createDiagram(svg, options = {})
{
    const id = `plate-${++identifier}`;
    svg.setAttribute("viewBox", "0 0 1000 900");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", content.diagramDescription);
    const defs = node("defs", {}, svg);
    const hatch = node("pattern", { id: `${id}-hatch`, width: 7, height: 7, patternUnits: "userSpaceOnUse", patternTransform: "rotate(38)" }, defs);
    node("path", { d: "M0 0 V7", stroke: "#8E2A5A", "stroke-width": 1.6, opacity: 0.4 }, hatch);
    const gradient = node("linearGradient", { id: `${id}-bed` }, defs);
    node("stop", { offset: "0", "stop-color": "#1F4BFF" }, gradient);
    node("stop", { offset: "1", "stop-color": "#FF1F3D" }, gradient);
    const filter = node("filter", { id: `${id}-glow`, x: "-50%", y: "-50%", width: "200%", height: "200%" }, defs);
    node("feGaussianBlur", { stdDeviation: 8, result: "blur" }, filter);
    const merge = node("feMerge", {}, filter);
    node("feMergeNode", { in: "blur" }, merge);
    node("feMergeNode", { in: "SourceGraphic" }, merge);
    const groups = new Map();
    function group(name)
    {
        const g = node("g", { "data-part": name, class: "anatomy-part" }, svg);
        groups.set(name, g);
        return g;
    }
    function tube(parent, d, width, color)
    {
        node("path", { d, fill: "none", stroke: color === "blue" ? "#0F2A9E" : "#A80F2A", "stroke-width": width, "stroke-linecap": "butt" }, parent);
        node("path", { d, fill: "none", stroke: color === "blue" ? "#1F4BFF" : "#FF1F3D", "stroke-width": width - 12, "stroke-linecap": "butt" }, parent);
    }
    function tree(parent, x, y, angle, length, depth, color)
    {
        if (!depth) return;
        const r = angle * Math.PI / 180, nx = x + Math.cos(r) * length, ny = y + Math.sin(r) * length;
        node("path", { d: `M${x} ${y} L${nx} ${ny}`, fill: "none", stroke: color, "stroke-width": depth * 1.4, "stroke-linecap": "round" }, parent);
        tree(parent, nx, ny, angle - 26, length * 0.72, depth - 1, color);
        tree(parent, nx, ny, angle + 26, length * 0.72, depth - 1, color);
    }
    const lungs = group("lungs");
    const lung = [[66, 160], [120, 126], [168, 170], [176, 270], [160, 370], [96, 396], [46, 340], [40, 240]];
    for (const points of [lung, lung.map(([x, y]) => [1000 - x, y])])
    {
        node("path", { d: spline(points), fill: "#2A1033", stroke: "#6B4A78", "stroke-width": 3 }, lungs);
    }
    tree(lungs, 172, 188, 175, 40, 5, "#1F4BFF");
    tree(lungs, 828, 188, 5, 40, 5, "#1F4BFF");
    for (const [x, y, a] of [[172, 290, 180], [172, 346, 170], [828, 290, 0], [828, 346, 10]]) tree(lungs, x, y, a, 34, 4, "#FF1F3D");
    node("rect", { x: 176, y: 826, width: 640, height: 52, rx: 26, opacity: 0.85, fill: `url(#${id}-bed)` }, group("body"));
    tube(group("descending-aorta"), "M792 150 L792 838", 50, "red");
    const leftVeins = group("left-veins");
    tube(leftVeins, "M172 290 L300 290", 34, "red");
    tube(leftVeins, "M172 346 L300 346", 34, "red");
    const muscle = group("muscle");
    const heart = node("path", { fill: "#6A1B45", stroke: "#8E2A5A", "stroke-width": 4 }, muscle);
    const fibers = node("path", { fill: `url(#${id}-hatch)` }, muscle);
    const rightVeins = group("right-veins");
    tube(rightVeins, "M828 290 L700 290", 34, "red");
    tube(rightVeins, "M828 346 L700 346", 34, "red");
    const artery = group("pulmonary-artery");
    for (const [d, width, stroke] of [["M172 188 L828 188", 44, "#0F2A9E"], ["M432 210 L432 480", 56, "#0F2A9E"],
        ["M172 188 L828 188", 32, "#1F4BFF"], ["M432 188 L432 480", 44, "#1F4BFF"]]) node("path", { d, fill: "none", stroke, "stroke-width": width }, artery);
    const cavae = group("cavae");
    tube(cavae, "M318 0 L318 280", 50, "blue");
    tube(cavae, "M204 836 L204 500 C204 450 236 420 290 380", 50, "blue");
    const aorta = group("aorta");
    tube(aorta, "M612 502 C540 470 500 440 500 390 L500 160 C500 92 560 56 640 56 C730 56 792 100 792 166", 60, "red");
    for (const x of [590, 650, 710]) tube(aorta, `M${x} 66 L${x} 0`, 26, "red");
    node("path", { d: "M500 390 L500 160 C500 92 560 56 640 56 C730 56 792 100 792 166", fill: "none", stroke: "#FF1F3D", "stroke-width": 48 }, aorta);
    node("rect", { x: 288, y: 404, width: 88, height: 70, fill: "#1F4BFF" }, group("inlet-right"));
    node("rect", { x: 574, y: 384, width: 104, height: 84, fill: "#FF1F3D" }, group("inlet-left"));
    const chambers = Object.entries(chamberData).map(([name, chamber]) =>
        ({ ...chamber, name, path: node("path", { d: spline(chamber.points), fill: chamber.color }, group(name)) }));
    const valveInstances = valves.map(([name, cx, cy, angle, width, gate]) =>
    {
        const g = group(name);
        const paths = valveGeometry(cx, cy, angle, width, 0).map(({ hinge, d }) =>
        {
            const p = node("path", { d, fill: "none", stroke: "#FFE6D6", "stroke-width": 7, "stroke-linecap": "round" }, g);
            node("circle", { cx: hinge[0], cy: hinge[1], r: 5, fill: "#FFE6D6" }, g);
            return p;
        });
        return { name, cx, cy, angle, width, gate, paths };
    });
    const conductors = [];
    for (const [name, paths] of [["atrial", [content.svgPaths.atrial]], ["septal", [content.svgPaths.septal]], ["branches", content.svgPaths.branches]])
    {
        const g = group(name);
        const lines = paths.map((d) => node("path", { d, fill: "none", stroke: "#39FF88", "stroke-width": 2.5 }, g));
        const sparks = paths.map(() => node("circle", { r: 7, fill: "#39FF88" }, g));
        conductors.push({ name, g, lines, sparks });
    }
    const nodeDots = [node("circle", { cx: 262, cy: 262, r: 7, fill: "#39FF88" }, groups.get("atrial")),
        node("circle", { cx: 500, cy: 470, r: 6, fill: "#39FF88" }, groups.get("septal"))];
    const particleGroup = group("particles");
    const particles = options.particles === false ? [] : particleData.map(([d, gate, color]) =>
    {
        const path = node("path", { d, fill: "none", stroke: "none" }, particleGroup);
        const circles = Array.from({ length: 9 }, () => node("circle", { r: 3.5, fill: color === "blue" ? "#7F9CFF" : "#FF9AA6" }, particleGroup));
        return { path, gate, circles, distance: 0 };
    });
    if (options.labels !== false)
    {
        const labels = group("labels");
        for (const [text, x, y, fill, short] of content.labels)
        {
            const label = node("text", { x, y, fill, "text-anchor": "middle", class: "diagram-label full-label" }, labels);
            label.textContent = text;
            if (short)
            {
                const abbreviation = node("text", { x, y, fill, "text-anchor": "middle", class: "diagram-label short-label" }, labels);
                abbreviation.textContent = short;
            }
        }
    }
    const overlay = node("g", { class: "spot-overlay" }, svg);
    const leader = node("path", { stroke: "#F8EEF4", "stroke-width": 2, fill: "none" }, overlay);
    const stopLabel = node("text", { fill: "#F8EEF4", class: "stop-label", "text-anchor": "middle", y: 800, x: 500 }, overlay);
    const drop = node("circle", { r: 10, stroke: "#F8EEF4", "stroke-width": 3, fill: "#1F4BFF", visibility: "hidden" }, overlay);
    function spotlight(names = [], label = "", position)
    {
        for (const [name, g] of groups)
        {
            g.style.opacity = !names.length || names.includes(name) ? "1" : "0.22";
            g.setAttribute("filter", names.includes(name) ? `url(#${id}-glow)` : "");
        }
        stopLabel.textContent = label;
        leader.setAttribute("d", position ? `M${position} L${position[0]} 765 L500 765` : "");
        svg.dataset.spotlight = names.join(",");
    }
    function setDrop(position, red)
    {
        drop.setAttribute("visibility", "visible");
        drop.setAttribute("cx", position[0]);
        drop.setAttribute("cy", position[1]);
        drop.setAttribute("fill", red ? "#FF1F3D" : "#1F4BFF");
    }
    function update(t, rate, delta = 0, reduced = false)
    {
        const state = model(options.frozenT ?? t, options.frozenRate ?? rate);
        svg.dataset.phase = state.phase;
        for (const chamber of chambers)
        {
            const scale = chamber.name.endsWith("A") ? state.a : state.v;
            const [x, y] = chamber.anchor;
            chamber.path.setAttribute("transform", `translate(${x} ${y}) scale(${scale}) translate(${-x} ${-y})`);
        }
        const transformed = outline.map(([x, y, name]) =>
        {
            const { anchor } = chamberData[name];
            const scale = 1 - (1 - (name.endsWith("A") ? state.a : state.v)) * 0.55;
            return [anchor[0] + (x - anchor[0]) * scale, anchor[1] + (y - anchor[1]) * scale];
        });
        const d = spline(transformed);
        heart.setAttribute("d", d);
        fibers.setAttribute("d", d);
        for (const valve of valveInstances)
        {
            const geometry = valveGeometry(valve.cx, valve.cy, valve.angle, valve.width, state[valve.gate]);
            valve.paths.forEach((p, i) => p.setAttribute("d", geometry[i].d));
        }
        for (const conductor of conductors)
        {
            const progress = conductor.name === "atrial" ? state.atrialSpark : state.septalSpark;
            const active = progress >= 0 && progress <= 1;
            conductor.lines.forEach((line, i) =>
            {
                line.style.opacity = active ? "1" : "0.25";
                conductor.sparks[i].style.opacity = active ? "1" : "0";
                if (active)
                {
                    const point = line.getPointAtLength(line.getTotalLength() * progress);
                    conductor.sparks[i].setAttribute("cx", point.x);
                    conductor.sparks[i].setAttribute("cy", point.y);
                }
            });
        }
        nodeDots[0].style.opacity = state.atrialSpark >= 0 && state.atrialSpark <= 1 ? "1" : "0.25";
        nodeDots[1].style.opacity = state.septalSpark >= 0 && state.septalSpark <= 1 ? "1" : "0.25";
        particleGroup.style.visibility = reduced ? "hidden" : "visible";
        for (const particle of particles)
        {
            const length = particle.path.getTotalLength();
            const open = particle.gate === "always" || state[particle.gate] > 0.5;
            particle.distance += delta * (open ? 520 : 40);
            particle.circles.forEach((circle, i) =>
            {
                const point = particle.path.getPointAtLength((particle.distance + i * length / 9) % length);
                circle.setAttribute("cx", point.x);
                circle.setAttribute("cy", point.y);
            });
        }
    }
    update(options.frozenT ?? 0, options.frozenRate ?? 72);
    return { update, spotlight, setDrop, svg };
}

export function createValveCloseup(svg, gate, color)
{
    svg.setAttribute("viewBox", "0 0 200 140");
    node("rect", { x: 0, y: 0, width: 200, height: 140, fill: "#6A1B45" }, svg);
    node("rect", { x: 48, y: 0, width: 104, height: 140, fill: color === "blue" ? "#1F4BFF" : "#FF1F3D" }, svg);
    const paths = [0, 1].map(() => node("path", { fill: "none", stroke: "#FFE6D6", "stroke-width": 7, "stroke-linecap": "round" }, svg));
    for (const x of [48, 152]) node("circle", { cx: x, cy: 70, r: 5, fill: "#FFE6D6" }, svg);
    const dots = Array.from({ length: 6 }, (_, i) => node("circle", { cx: 70 + (i % 3) * 30, r: 3, fill: "#F8EEF4" }, svg));
    let travel = 0;
    return (state, delta, reduced) =>
    {
        valveGeometry(100, 70, 90, 52, state[gate]).forEach((shape, i) => paths[i].setAttribute("d", shape.d));
        if (state[gate] > 0.5) travel += delta * 260;
        dots.forEach((dot, i) =>
        {
            dot.style.opacity = state[gate] > 0.5 && !reduced ? "0.7" : "0";
            dot.setAttribute("cy", (travel + i * 23) % 140);
        });
    };
}
