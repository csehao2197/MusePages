import { content as c } from "./content.js";

export function startFlows(svg, motionQuery)
{
    const ns = "http://www.w3.org/2000/svg";
    let industry = 0;
    let paused = false;
    let visible = true;
    let frame = 0;
    let previous = 0;
    let time = 0;
    const group = svg.querySelector("#particles");
    const flows = c.flows.map((flow) =>
    {
        const path = svg.querySelector(`#path-${flow.id}`);
        const length = path.getTotalLength();
        const points = new Float32Array(480);
        for (let i = 0; i < 240; i++)
        {
            const p = path.getPointAtLength(length * i / 239);
            points[i * 2] = p.x;
            points[i * 2 + 1] = p.y;
        }
        const circles = Array.from({length: 44}, (_, i) =>
        {
            const circle = document.createElementNS(ns, "circle");
            circle.setAttribute("r", String(2.5 + i % 4 * .5));
            circle.setAttribute("fill", `var(--${flow.color})`);
            circle.setAttribute("opacity", String(flow.opacity || 1));
            group.appendChild(circle);
            return circle;
        });
        return {...flow, path, points, circles};
    });
    function draw()
    {
        flows.forEach((f) =>
        {
            const fossil = f.id === "fossil";
            const value = fossil ? 1 + industry * 9 : f.value;
            const count = fossil ? Math.round(3 + industry * 37) : Math.max(3, Math.min(44, Math.round(value / 3)));
            const speed = (.05 + value / 1500) * (fossil ? 1 + industry * 2 : 1);
            f.path.setAttribute("stroke-width", String(motionQuery.matches ? Math.max(1.5, value / 20) : fossil ? 1 + industry * 6 : 1.5));
            f.path.setAttribute("opacity", String(motionQuery.matches ? .8 : fossil ? .65 : .25));
            f.circles.forEach((circle, i) =>
            {
                circle.style.display = i < count && !motionQuery.matches ? "" : "none";
                if (i >= count) return;
                const u = (time * speed + i / count) % 1 * 239;
                const a = Math.floor(u);
                const b = Math.min(239, a + 1);
                const t = u - a;
                circle.setAttribute("cx", String(f.points[a * 2] * (1 - t) + f.points[b * 2] * t));
                circle.setAttribute("cy", String(f.points[a * 2 + 1] * (1 - t) + f.points[b * 2 + 1] * t));
            });
            f.path.dataset.count = String(count);
            f.path.dataset.speed = String(speed);
        });
    }
    function tick(now)
    {
        if (previous) time += Math.min(.05, (now - previous) / 1000);
        previous = now;
        draw();
        frame = requestAnimationFrame(tick);
    }
    function synchronize()
    {
        cancelAnimationFrame(frame);
        previous = 0;
        draw();
        if (!paused && visible && !document.hidden && !motionQuery.matches) frame = requestAnimationFrame(tick);
    }
    new IntersectionObserver(([entry]) =>
    {
        visible = entry.isIntersecting;
        synchronize();
    }).observe(document.querySelector("#story"));
    document.addEventListener("visibilitychange", synchronize);
    motionQuery.addEventListener("change", synchronize);
    document.querySelector("#motion-toggle").addEventListener("click", (event) =>
    {
        paused = !paused;
        event.currentTarget.setAttribute("aria-pressed", String(paused));
        event.currentTarget.textContent = paused ? c.hero.resume : c.hero.pause;
        synchronize();
    });
    synchronize();
    return {
        setIndustry(value)
        {
            industry = value;
            svg.dataset.industry = industry.toFixed(3);
            draw();
        }
    };
}
