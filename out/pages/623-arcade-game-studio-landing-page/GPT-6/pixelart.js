export function pixelart(grid, palette)
{
    const height = grid.length;
    const width = Math.max(...grid.map((row) => row.length));
    const cells = [];
    for (let y = 0; y < height; y++)
    {
        for (let x = 0; x < grid[y].length; x++)
        {
            const color = palette[grid[y][x]];
            if (color)
            {
                cells.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`);
            }
        }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges" aria-hidden="true">${cells.join("")}</svg>`;
}

export function scene(theme)
{
    const grid = Array.from({ length: 72 }, () => Array(96).fill("a"));
    const palette =
    {
        a: "#171c36", b: "#2c3150", c: "#424565", d: "#767a8b", e: "#ffca71",
        f: "#a7e4c4", g: "#e7e1cd", h: "#b45576", i: "#42354d", j: "#1d2736",
        k: "#53435c", l: "#171322", m: "#ef925c", n: "#6d9c9b", o: "#2c5e70"
    };
    const rect = (x, y, w, h, color) =>
    {
        for (let dy = y; dy < y + h; dy++)
        {
            for (let dx = x; dx < x + w; dx++)
            {
                if (grid[dy]?.[dx] !== undefined) grid[dy][dx] = color;
            }
        }
    };
    for (let n = 0; n < 32; n++) rect((n * 37 + 13) % 96, (n * 19 + 4) % 44, 1, 1, n % 3 ? "d" : "g");
    if (theme === "night")
    {
        rect(73, 9, 10, 10, "e");
        rect(71, 11, 14, 6, "e");
        rect(79, 7, 7, 10, "a");
        for (let n = 0; n < 10; n++)
        {
            const height = 15 + (n * 7) % 19;
            rect(n * 12 - 2, 68 - height, 10, height, "b");
            rect(n * 12 + 1, 64 - height, 4, 4, "b");
            rect(n * 12 + 2, 71 - height, 2, 3, "e");
        }
        rect(0, 62, 96, 10, "l");
        rect(0, 61, 96, 2, "h");
        rect(38, 51, 6, 9, "f");
        rect(39, 48, 5, 5, "g");
        rect(34, 54, 4, 6, "h");
        rect(46, 54, 4, 5, "e");
        rect(40, 60, 2, 3, "d");
        rect(43, 60, 2, 3, "d");
    }
    if (theme === "ocean")
    {
        palette.a = "#8ab8ae";
        rect(0, 23, 96, 49, "o");
        rect(0, 28, 96, 2, "n");
        for (let n = 0; n < 18; n++) rect(n * 17 % 96, 31 + n * 9 % 40, 8, 1, "n");
        rect(62, 39, 24, 8, "e");
        rect(58, 42, 31, 3, "e");
        rect(72, 22, 3, 18, "i");
        rect(65, 20, 17, 4, "f");
        rect(70, 17, 10, 5, "f");
        rect(24, 49, 17, 4, "m");
        rect(27, 53, 12, 3, "i");
        rect(32, 35, 1, 16, "g");
        for (let y = 0; y < 13; y++) rect(33, 36 + y, Math.ceil(y / 2), 1, "g");
    }
    if (theme === "post")
    {
        palette.a = "#302239";
        rect(8, 30, 43, 36, "k");
        rect(5, 28, 48, 4, "h");
        rect(13, 36, 11, 13, "e");
        rect(29, 36, 13, 13, "e");
        rect(27, 54, 12, 18, "l");
        rect(0, 66, 96, 6, "l");
        rect(66, 35, 2, 31, "d");
        rect(61, 32, 12, 3, "d");
        rect(63, 35, 8, 7, "e");
        rect(72, 54, 10, 11, "h");
        rect(74, 56, 6, 1, "l");
        rect(47, 57, 6, 9, "f");
        rect(48, 54, 4, 4, "g");
    }
    if (theme === "studio")
    {
        palette.a = "#34293e";
        rect(0, 56, 96, 16, "i");
        rect(8, 8, 35, 29, "k");
        rect(10, 10, 31, 25, "a");
        rect(12, 12, 27, 21, "b");
        rect(16, 24, 4, 9, "c");
        rect(23, 19, 5, 14, "c");
        rect(34, 15, 3, 3, "e");
        rect(24, 11, 2, 24, "k");
        rect(10, 22, 31, 2, "k");
        rect(7, 37, 39, 2, "h");
        rect(62, 11, 25, 2, "h");
        rect(65, 7, 4, 4, "e");
        rect(75, 5, 7, 6, "f");
        rect(59, 24, 17, 13, "l");
        rect(61, 26, 13, 8, "f");
        rect(65, 37, 4, 4, "d");
        rect(51, 41, 37, 4, "m");
        rect(54, 45, 3, 14, "k");
        rect(82, 45, 3, 14, "k");
        rect(77, 36, 4, 5, "g");
        rect(73, 50, 9, 9, "h");
        rect(75, 59, 2, 6, "d");
        rect(35, 54, 21, 12, "h");
        rect(31, 57, 4, 11, "h");
        rect(56, 57, 4, 11, "h");
        rect(36, 56, 18, 3, "m");
        rect(11, 53, 8, 13, "e");
        rect(10, 47, 11, 7, "f");
        rect(13, 43, 6, 6, "f");
        rect(42, 58, 5, 3, "g");
        rect(41, 57, 2, 2, "g");
        rect(46, 57, 2, 2, "g");
        rect(43, 61, 3, 3, "l");
    }
    return pixelart(grid.map((row) => row.join("")), palette);
}
