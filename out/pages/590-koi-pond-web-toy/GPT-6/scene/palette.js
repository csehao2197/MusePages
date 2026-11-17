export const palette = Object.freeze(
{
    water: "#0E3B43", vermilion: "#F2542D", cream: "#F5EFE0", gold: "#E0B04A",
    deep: "#082A31", night: "#061C24", ink: "#10262B", pad: "#2E6F5E",
    padLight: "#4C9A7A", stone: "#6F8480", stoneLight: "#8FA39D",
    wood: "#7A4A2E", blush: "#F6B8A8", ice: "#CFE6E4", amber: "#C98F3A"
});

export function mulberry32(seed)
{
    return () =>
    {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

export function angleDelta(a, b)
{
    return Math.atan2(Math.sin(b - a), Math.cos(b - a));
}

export function smoothPath(ctx, points, close = true)
{
    ctx.beginPath();
    const last = points.length - 1;
    ctx.moveTo((points[last].x + points[0].x) / 2, (points[last].y + points[0].y) / 2);
    for (let i = 0; i < points.length; i++)
    {
        const p = points[i];
        const n = points[(i + 1) % points.length];
        ctx.quadraticCurveTo(p.x, p.y, (p.x + n.x) / 2, (p.y + n.y) / 2);
    }
    if (close) ctx.closePath();
}
