import { ROAD_LINES } from "./world.js";

export function drawMinimap(world, driver, missions, traffic)
{
    const canvas = document.getElementById("minimap");
    const ctx = canvas.getContext("2d");
    const scale = 360 / 224;
    const X = (x) => 180 + x * scale;
    const Y = (z) => 180 - z * scale;
    ctx.fillStyle = "#e8e4cf";
    ctx.fillRect(0, 0, 360, 360);
    ctx.strokeStyle = "#b4bdac";
    ctx.lineWidth = 14 * scale;
    for (const road of ROAD_LINES)
    {
        ctx.beginPath();
        ctx.moveTo(X(road), Y(-106));
        ctx.lineTo(X(road), Y(106));
        ctx.moveTo(X(-106), Y(road));
        ctx.lineTo(X(106), Y(road));
        ctx.stroke();
    }
    for (const block of world.mapBlocks)
    {
        ctx.fillStyle = block.park ? "#7f9d6c" : "#c2b49a";
        ctx.fillRect(X(block.x - 12), Y(block.z + 12), 24 * scale, 24 * scale);
    }
    function dot(x, z, radius, color)
    {
        ctx.beginPath();
        ctx.arc(X(x), Y(z), radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
    for (const car of traffic.cars) dot(car.x, car.z, 2.5, "#86958a");
    for (const car of world.poolCars) dot(car.x, car.z, 4.4, "#62ad8e");
    const target = missions.target();
    if (target)
    {
        dot(target.x, target.z, 9, "#e5aa78");
        dot(target.x, target.z, 5, "#bd633c");
    }
    const { x, z, yaw } = driver.state;
    ctx.save();
    ctx.translate(X(x), Y(z));
    ctx.rotate(yaw);
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(6, 6);
    ctx.lineTo(0, 3);
    ctx.lineTo(-6, 6);
    ctx.closePath();
    ctx.fillStyle = "#183e34";
    ctx.strokeStyle = "#fff4d8";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}
