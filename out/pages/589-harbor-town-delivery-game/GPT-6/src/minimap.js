import { roads, depot, jobs, content } from "./content.js";

export function createMinimap(canvas)
{
    const ctx = canvas.getContext("2d");
    canvas.setAttribute("aria-label", content.miniAria);
    const position = value => 18 + (value + 34) / 68 * 158;
    function render(van, missions)
    {
        ctx.clearRect(0, 0, 194, 146);
        ctx.save();
        ctx.scale(1, 0.73);
        ctx.fillStyle = "#e8eadc";
        ctx.fillRect(10, 10, 174, 174);
        ctx.lineWidth = 9;
        ctx.strokeStyle = "#fffdf6";
        roads.forEach(road =>
        {
            ctx.beginPath();
            ctx.moveTo(position(road), position(-32));
            ctx.lineTo(position(road), position(32));
            ctx.moveTo(position(-32), position(road));
            ctx.lineTo(position(32), position(road));
            ctx.stroke();
        });
        jobs.forEach((job, index) =>
        {
            ctx.beginPath();
            ctx.fillStyle = index < missions.state.delivered ? "#557d68" : "#c2c6b3";
            ctx.arc(position(job.x), position(job.z), 3, 0, Math.PI * 2);
            ctx.fill();
        });
        const target = missions.target();
        if (target && missions.state.phase !== "won")
        {
            ctx.fillStyle = "#da8534";
            ctx.beginPath();
            ctx.arc(position(target.x), position(target.z), 6, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = "#355750";
        ctx.fillRect(position(depot.x) - 3, position(depot.z) - 3, 6, 6);
        ctx.translate(position(van.x), position(van.z));
        ctx.rotate(-van.heading);
        ctx.fillStyle = "#cc6339";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -7);
        ctx.lineTo(5, 5);
        ctx.lineTo(-5, 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    return { render };
}
