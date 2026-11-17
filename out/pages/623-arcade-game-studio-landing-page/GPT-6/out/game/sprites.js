export const palette =
{
    g: "#b7ee99",
    p: "#ff5b98",
    a: "#ffb627",
    w: "#f7eedc",
    d: "#354052",
    b: "#161b30"
};
export const runner =
[
    "....gggg....",
    "...gggggg...",
    "...gwbgwg...",
    "...gwwwgg...",
    "....wwww....",
    "..ppgggg....",
    ".pppgggggg..",
    "ppppgggg.gaa",
    "pp..gggg.gaa",
    "....gggg..aa",
    "....dddd....",
    "....dd.dd...",
    "...ddd.ddd.."
];
export const duck =
[
    "....gggg....",
    "...ggbwgg...",
    "ppgggggggg..",
    "ppgggggg.gaa",
    "ppdddddd..aa",
    "..dd.dd....."
];
export function drawSprite(ctx, grid, x, y, scale = 1)
{
    grid.forEach((row, sy) =>
    {
        [...row].forEach((cell, sx) =>
        {
            if (palette[cell])
            {
                ctx.fillStyle = palette[cell];
                ctx.fillRect(Math.floor(x + sx * scale), Math.floor(y + sy * scale), scale, scale);
            }
        });
    });
}
