const palette = ["#FF4B33", "#5B2DB3", "#17130E"];

function mulberry32(seed)
{
    return () =>
    {
        let value = seed += 0x6D2B79F5;
        value = Math.imul(value ^ value >>> 15, value | 1);
        value ^= value + Math.imul(value ^ value >>> 7, value | 61);
        return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
}

export function coverArt(seed)
{
    const random = mulberry32(seed);
    const shapes = [];
    const count = 6 + Math.floor(random() * 4);
    for (let index = 0; index < count; index++)
    {
        const x = 25 + Math.floor(random() * 290);
        const y = 25 + Math.floor(random() * 280);
        const size = 40 + Math.floor(random() * 125);
        const color = palette[index % 3];
        const kind = Math.floor(random() * 7);
        let shape;
        switch (kind)
        {
            case 0:
                shape = `<circle cx="${x}" cy="${y}" r="${size / 2}" fill="${color}"/>`;
                break;
            case 1:
                shape = `<circle cx="${x}" cy="${y}" r="${size / 2}" fill="none" stroke="${color}" stroke-width="24"/>`;
                break;
            case 2:
                shape = `<path d="M${x - size / 2},${y} a${size / 2},${size / 2} 0 0 1 ${size},0Z" fill="${color}"/>`;
                break;
            case 3:
                shape = `<rect x="${x}" y="${y}" width="${size}" height="28" fill="${color}" transform="rotate(${Math.floor(random() * 4) * 45} ${x} ${y})"/>`;
                break;
            case 4:
                shape = `<path d="M${x},${y} a${size},${size} 0 0 1 ${size},${size}" fill="none" stroke="${color}" stroke-width="28"/>`;
                break;
            case 5:
                shape = Array.from({ length: 16 }, (_, dot) => `<circle cx="${x + dot % 4 * 17}" cy="${y + Math.floor(dot / 4) * 17}" r="5" fill="${color}"/>`).join("");
                break;
            default:
                shape = `<path d="M${x},${y - size / 2} l${size / 2},${size} h-${size}Z" fill="${color}"/>`;
        }
        shapes.push(`<g style="mix-blend-mode:multiply">${shape}</g>`);
    }
    return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="400" height="400" fill="#F3EDDE"/><path d="M20 20H380V380H20Z" fill="none" stroke="#17130E" stroke-width="1"/>${shapes.join("")}<rect x="22" y="350" width="116" height="28" fill="#F3EDDE"/><text x="30" y="370" font-family="Space Mono,monospace" font-size="17" fill="#17130E">SR-${String(seed).padStart(3, "0")}</text></svg>`;
}

export function vinyl(initial = "S", brand = "Static Bloom Records")
{
    const grooves = [108, 121, 134, 147, 160, 173, 186].map(radius => `<circle cx="200" cy="200" r="${radius}" fill="none" stroke="#F3EDDE" stroke-opacity=".15" stroke-width=".8"/>`).join("");
    return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="200" cy="200" r="199" fill="#17130E"/>${grooves}<path d="M200 200L65 54A199 199 0 0 1 152 7Z" fill="#F3EDDE" opacity=".12"/><circle cx="200" cy="200" r="79" fill="#FF4B33"/><path d="M169 147L238 163L220 215L152 198Z" fill="#5B2DB3" style="mix-blend-mode:multiply"/><text x="200" y="222" text-anchor="middle" fill="#F3EDDE" font-size="66" font-family="Anton,sans-serif">${initial}</text><text x="200" y="248" text-anchor="middle" fill="#17130E" font-size="7" font-family="Space Mono,monospace">${brand.toUpperCase()} / SIDE A</text><circle cx="200" cy="200" r="4" fill="#F3EDDE"/></svg>`;
}

export function stamp(artist)
{
    const shapes =
    {
        circle: '<circle cx="100" cy="100" r="92" fill="#FF4B33"/>',
        triangle: '<path d="M100 6L198 184H2Z" fill="#5B2DB3"/>',
        square: '<path d="M12 12H188V188H12Z" fill="#17130E"/>',
        half: '<path d="M8 100A92 92 0 0 1 192 100V192H8Z" fill="#FF4B33"/>',
        ring: '<circle cx="100" cy="100" r="79" fill="none" stroke="#5B2DB3" stroke-width="27"/>'
    };
    return `<svg viewBox="0 0 200 200" aria-hidden="true">${shapes[artist.shape]}<text x="100" y="125" text-anchor="middle" font-family="Anton,sans-serif" font-size="64" fill="${artist.shape === "ring" ? "#5B2DB3" : "#F3EDDE"}">${artist.initials}</text></svg>`;
}
