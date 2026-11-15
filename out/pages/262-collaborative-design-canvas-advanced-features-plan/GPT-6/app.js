const $ = (id) => document.getElementById(id);
let shapes;
let selected = new Set();
let clipboard = [];
let serial = 4;
let drag = null;
const initial = () => [
    { id: 1, name: "Sunrise", type: "circle", x: 110, y: 252, w: 156, h: 156, color: "#eb7547" },
    { id: 2, name: "Lavender block", type: "rect", x: 300, y: 285, w: 160, h: 116, color: "#a69aca" },
    { id: 3, name: "Lime thought", type: "rect", x: 505, y: 245, w: 125, h: 165, color: "#bfd67a" }
];
const chosen = () => shapes.filter((shape) => selected.has(shape.id));
function render(message)
{
    $("shapes").replaceChildren();
    $("layers").replaceChildren();
    shapes.forEach((shape) =>
    {
        const element = document.createElementNS("http://www.w3.org/2000/svg", shape.type === "circle" ? "ellipse" : "rect");
        if (shape.type === "circle")
        {
            for (const [key, value] of Object.entries({ cx: shape.x + shape.w / 2, cy: shape.y + shape.h / 2, rx: shape.w / 2, ry: shape.h / 2 })) element.setAttribute(key, value);
        }
        else
        {
            for (const [key, value] of Object.entries({ x: shape.x, y: shape.y, width: shape.w, height: shape.h, rx: 2 })) element.setAttribute(key, value);
        }
        element.setAttribute("fill", shape.color);
        element.setAttribute("data-shape", shape.id);
        element.setAttribute("aria-label", shape.name);
        if (selected.has(shape.id))
        {
            element.setAttribute("stroke", "#7962bd");
            element.setAttribute("stroke-width", "3");
            element.setAttribute("stroke-dasharray", "5 3");
        }
        $("shapes").append(element);
        const label = document.createElement("label");
        label.className = "layer";
        const check = document.createElement("input");
        check.type = "checkbox";
        check.dataset.layer = shape.id;
        check.checked = selected.has(shape.id);
        const name = document.createElement("span");
        name.textContent = shape.name;
        label.append(check, name);
        $("layers").append(label);
    });
    const selection = chosen();
    $("selected-count").textContent = `${selection.length} selected`;
    $("shape-count").textContent = `${shapes.length} layers`;
    ["x", "y", "name", "color"].forEach((key) =>
    {
        $(key).disabled = selection.length === 0;
        $(key).value = selection[0]?.[key] ?? (key === "color" ? "#000000" : "");
    });
    document.querySelectorAll("[data-align]").forEach((button) => button.disabled = selection.length < 2);
    document.querySelectorAll("[data-distribute]").forEach((button) => button.disabled = selection.length < 3);
    $("copy").disabled = $("duplicate").disabled = $("delete").disabled = !selection.length;
    $("paste").disabled = clipboard.length === 0;
    if (message) $("status").textContent = message;
}
function clone(offset, source)
{
    const added = source.map((shape) => ({ ...shape, id: serial++, name: `${shape.name} copy`, x: shape.x + offset, y: shape.y + offset }));
    shapes.push(...added);
    selected = new Set(added.map((shape) => shape.id));
    render(`${added.length} layer(s) added.`);
}
function duplicate()
{
    if (chosen().length) clone(20, chosen());
}
function copy()
{
    if (!chosen().length) return;
    clipboard = chosen().map((shape) => ({ ...shape }));
    render("Copied to the internal clipboard.");
}
$("layers").addEventListener("change", (event) =>
{
    const id = Number(event.target.dataset.layer);
    event.target.checked ? selected.add(id) : selected.delete(id);
    render();
});
$("duplicate").addEventListener("click", duplicate);
$("copy").addEventListener("click", copy);
$("paste").addEventListener("click", () => { if (clipboard.length) clone(30, clipboard); });
$("delete").addEventListener("click", () =>
{
    shapes = shapes.filter((shape) => !selected.has(shape.id));
    selected.clear();
    render("Selection deleted.");
});
$("add").addEventListener("click", () =>
{
    const id = serial++;
    shapes.push({ id, name: "New rectangle", type: "rect", x: 330, y: 270, w: 120, h: 90, color: "#b4cfe4" });
    selected = new Set([id]);
    render("Rectangle added.");
});
["x", "y", "name", "color"].forEach((key) => $(key).addEventListener("input", () =>
{
    const value = ["x", "y"].includes(key) ? Number($(key).value) : $(key).value;
    if ((["x", "y"].includes(key) && (!Number.isFinite(value) || $(key).value === "")) || (key === "name" && !value.trim())) return;
    chosen().forEach((shape) => shape[key] = value);
    render("Properties updated.");
    $(key).focus();
}));
document.querySelectorAll("[data-align]").forEach((button) => button.addEventListener("click", () =>
{
    const group = chosen();
    if (group.length < 2) return;
    const mode = button.dataset.align;
    const minX = Math.min(...group.map((s) => s.x));
    const minY = Math.min(...group.map((s) => s.y));
    const maxX = Math.max(...group.map((s) => s.x + s.w));
    const maxY = Math.max(...group.map((s) => s.y + s.h));
    const centerX = group.reduce((sum, s) => sum + s.x + s.w / 2, 0) / group.length;
    const centerY = group.reduce((sum, s) => sum + s.y + s.h / 2, 0) / group.length;
    group.forEach((s) =>
    {
        if (mode === "left") s.x = minX;
        if (mode === "right") s.x = maxX - s.w;
        if (mode === "top") s.y = minY;
        if (mode === "bottom") s.y = maxY - s.h;
        if (mode === "centerX") s.x = centerX - s.w / 2;
        if (mode === "centerY") s.y = centerY - s.h / 2;
    });
    render(`Aligned ${group.length} layers: ${mode}.`);
}));
document.querySelectorAll("[data-distribute]").forEach((button) => button.addEventListener("click", () =>
{
    const axis = button.dataset.distribute;
    const dimension = axis === "x" ? "w" : "h";
    const group = chosen().sort((a, b) => a[axis] - b[axis]);
    if (group.length < 3) return;
    const start = group[0][axis];
    const end = group.at(-1)[axis] + group.at(-1)[dimension];
    const gap = (end - start - group.reduce((sum, s) => sum + s[dimension], 0)) / (group.length - 1);
    let cursor = start;
    group.forEach((s) => { s[axis] = cursor; cursor += s[dimension] + gap; });
    render("Equal spacing applied.");
}));
document.addEventListener("keydown", (event) =>
{
    if (event.target.closest("input, textarea, select, [contenteditable]")) return;
    const command = event.ctrlKey || event.metaKey;
    if (command && ["d", "c", "v"].includes(event.key.toLowerCase()))
    {
        event.preventDefault();
        if (event.key.toLowerCase() === "d") duplicate();
        if (event.key.toLowerCase() === "c") copy();
        if (event.key.toLowerCase() === "v" && clipboard.length) clone(30, clipboard);
        return;
    }
    const deltas = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (deltas[event.key] && chosen().length)
    {
        event.preventDefault();
        const amount = event.shiftKey ? 10 : 1;
        const [dx, dy] = deltas[event.key];
        chosen().forEach((shape) => { shape.x += dx * amount; shape.y += dy * amount; });
        render(`Moved ${amount}px.`);
    }
});
$("canvas").addEventListener("pointerdown", (event) =>
{
    const target = event.target.closest("[data-shape]");
    if (!target) return;
    const id = Number(target.dataset.shape);
    if (!selected.has(id)) selected = new Set([id]);
    drag = { x: event.clientX, y: event.clientY, shapes: chosen().map((s) => ({ id: s.id, x: s.x, y: s.y })) };
    $("canvas").setPointerCapture(event.pointerId);
    $("canvas").focus();
    render();
});
$("canvas").addEventListener("pointermove", (event) =>
{
    if (!drag) return;
    const scale = 800 / $("canvas").getBoundingClientRect().width;
    drag.shapes.forEach((origin) =>
    {
        const s = shapes.find((entry) => entry.id === origin.id);
        s.x = Math.round(origin.x + (event.clientX - drag.x) * scale);
        s.y = Math.round(origin.y + (event.clientY - drag.y) * scale);
    });
    render("Moving selection.");
});
$("canvas").addEventListener("pointerup", () => drag = null);
$("canvas").addEventListener("pointercancel", () => drag = null);
$("reset").addEventListener("click", () =>
{
    shapes = initial();
    selected.clear();
    clipboard = [];
    serial = 4;
    render("Canvas reset.");
});
shapes = initial();
render();
