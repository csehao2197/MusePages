import { content as c } from "./content.js";

const x = (year) => 64 + (year - 1850) / 250 * 696;
const y = (warming) => 340 - warming / 5 * 288;

function spline(points)
{
    let d = `M${points[0][0]} ${points[0][1]}`;
    for (let i = 0; i < points.length - 1; i++)
    {
        const a = points[Math.max(0, i - 1)];
        const b = points[i];
        const next = points[i + 1];
        const last = points[Math.min(points.length - 1, i + 2)];
        d += `C${b[0] + (next[0] - a[0]) / 6} ${b[1] + (next[1] - a[1]) / 6} ${next[0] - (last[0] - b[0]) / 6} ${next[1] - (last[1] - b[1]) / 6} ${next[0]} ${next[1]}`;
    }
    return d;
}
const projection = (points) => spline(points.map((v, i) => [x(2025 + i * 5), y(v)]));
const mixColor = (a, b, t) =>
{
    const channels = [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t));
    return `rgb(${channels.join(",")})`;
};

export function startScenario(motionQuery)
{
    document.querySelector("#chart").innerHTML = `<svg viewBox="0 0 800 400" role="img" aria-labelledby="chart-title chart-desc"><title id="chart-title">${c.lab.chartTitle}</title><desc id="chart-desc">${c.lab.chartDescription}</desc>
        <text x="64" y="24" class="axis-title">${c.lab.axis}</text>
        ${c.lab.yTicks.map((v) => `<line x1="64" x2="760" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="46" y="${y(v) + 5}" text-anchor="end">${v}</text>`).join("")}
        ${c.lab.ticks.map((v) => `<text x="${x(v)}" y="372" text-anchor="middle">${v}</text>`).join("")}
        <line x1="${x(2025)}" x2="${x(2025)}" y1="50" y2="340" class="today"/><text x="${x(2025) - 8}" y="45" text-anchor="end">${c.lab.today}</text>
        <path d="${spline(c.lab.history.map(([year, value]) => [x(year), y(value)]))}" class="history"/>
        <path id="projection-fill" class="projection-fill"/><path id="projection" class="projection"/>
        <circle id="endpoint" r="5"/>
        ${c.lab.stops.map((s) => `<path class="print-curve" d="${projection(s.points)}" stroke="${s.color}"/>`).join("")}
    </svg>`;
    const range = document.querySelector("#scenario");
    const curve = document.querySelector("#projection");
    const fill = document.querySelector("#projection-fill");
    const warming = document.querySelector("#warming");
    const lab = document.querySelector("#scenarios");
    let current = 50;
    let frame = 0;
    let keyboardInput = false;
    function render(position)
    {
        current = position;
        const section = Math.min(1, Math.floor(position / 50));
        const ratio = (position - section * 50) / 50;
        const a = c.lab.stops[section];
        const b = c.lab.stops[section + 1];
        const points = a.points.map((v, i) => v + (b.points[i] - v) * ratio);
        const end = points.at(-1);
        const color = mixColor(a.color, b.color, ratio);
        const heat = a.heat + (b.heat - a.heat) * ratio;
        const nearest = Math.round(position / 50);
        const stop = c.lab.stops[nearest];
        const d = projection(points);
        curve.setAttribute("d", d);
        fill.setAttribute("d", `${d}L${x(2100)} 340L${x(2025)} 340Z`);
        lab.style.setProperty("--curve", color);
        lab.style.setProperty("--heat", String(heat));
        lab.style.setProperty("--position", `${position}%`);
        warming.innerHTML = `+${end.toFixed(1)} <small>${c.lab.unit}</small>`;
        warming.dataset.value = end.toFixed(3);
        const endpoint = document.querySelector("#endpoint");
        endpoint.setAttribute("cx", String(x(2100)));
        endpoint.setAttribute("cy", String(y(end)));
        document.querySelector("#scenario-description").textContent = stop.description;
        range.setAttribute("aria-valuetext", `${stop.name}, about ${end.toFixed(1)} ${c.lab.aria}`);
        document.querySelectorAll("[data-stop]").forEach((button, i) => button.setAttribute("aria-pressed", String(i === nearest)));
    }
    function snap(value)
    {
        cancelAnimationFrame(frame);
        const target = Math.max(0, Math.min(100, value));
        range.value = String(target);
        if (motionQuery.matches)
        {
            render(target);
            return;
        }
        const start = current;
        const now = performance.now();
        function animate(time)
        {
            const t = Math.min(1, (time - now) / 500);
            const ease = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            render(start + (target - start) * ease);
            if (t < 1) frame = requestAnimationFrame(animate);
        }
        frame = requestAnimationFrame(animate);
    }
    range.addEventListener("input", () =>
    {
        cancelAnimationFrame(frame);
        render(Number(range.value));
    });
    range.addEventListener("change", () =>
    {
        if (!keyboardInput) snap(Math.round(Number(range.value) / 50) * 50);
    });
    range.addEventListener("pointerdown", () => { keyboardInput = false; });
    range.addEventListener("blur", () =>
    {
        keyboardInput = false;
        snap(Math.round(Number(range.value) / 50) * 50);
    });
    range.addEventListener("keydown", (event) =>
    {
        keyboardInput = true;
        if (event.key === "PageUp" || event.key === "PageDown")
        {
            event.preventDefault();
            snap((Math.round(Number(range.value) / 50) + (event.key === "PageUp" ? 1 : -1)) * 50);
        }
        if (event.key === "Enter") snap(Math.round(Number(range.value) / 50) * 50);
    });
    document.querySelectorAll("[data-stop]").forEach((button) => button.addEventListener("click", () => snap(Number(button.dataset.stop))));
    motionQuery.addEventListener("change", () =>
    {
        cancelAnimationFrame(frame);
        render(Number(range.value));
    });
    render(50);
}
