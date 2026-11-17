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

export function makeArray(n = 48, pattern = "random", seed = 2048)
{
    const random = mulberry32(seed);
    const a = Array.from({ length: n }, (_, k) => Math.round(5 + 95 * (k + 1) / n));
    if (pattern === "random")
    {
        for (let i = n - 1; i > 0; i--)
        {
            const j = Math.floor(random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
    }
    else if (pattern === "nearly")
    {
        for (let k = 0; k < Math.floor(n * 0.1); k++)
        {
            const i = Math.floor(random() * n);
            const j = Math.min(n - 1, i + 1 + Math.floor(random() * 3));
            [a[i], a[j]] = [a[j], a[i]];
        }
    }
    else if (pattern === "reversed")
    {
        a.reverse();
    }
    else if (pattern === "few")
    {
        return a.map(() => (1 + Math.floor(random() * 5)) * 20);
    }
    return a;
}
