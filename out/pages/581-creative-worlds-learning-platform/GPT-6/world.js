const palette = ["#eb966f", "#9aa9cf", "#a4bf9e", "#c5a6d2", "#e7c56e"];

export function starter(kind = "dream")
{
    const piece = (type, x, z, color, size = 1, rotation = 0) => ({ type, x, z, color, size, rotation });
    const objects = kind === "blank" ? [] :
    [
        piece("house", -.55, -.25, kind === "feeling" ? "#b69acb" : "#e68c65", 1.05),
        piece("tree", -2.05, -.7, "#91b59d", 1.15),
        piece("tree", 1.45, -.85, "#b2a1ce", 1.35),
        piece("tree", 2.15, .55, "#a4bd9b", .9),
        piece("tree", -1.6, 1, "#b4c6a7", .65),
        piece("friend", .8, 1.05, "#dbab61", .9),
        piece("star", 1.9, -1.6, "#eacb85", .65)
    ];
    if (kind === "habitat")
    {
        objects[0] = piece("tree", -.55, -.25, "#79a990", 1.55);
        objects.push(piece("friend", -.5, .8, "#d8aa97", 1.1));
    }
    return {
        id: null,
        name: { story: "A home for someone new", habitat: "Our tiny habitat", feeling: "My feeling island", blank: "My brand new world" }[kind] || "My somewhere happy",
        theme: kind === "feeling" ? "night" : "day",
        reflection: "",
        objects
    };
}

function tint(hex, amount)
{
    const value = Number.parseInt(hex.slice(1), 16);
    const channels = [value >> 16, (value >> 8) & 255, value & 255];
    return `#${channels.map((channel) => Math.round(Math.max(0, Math.min(255, channel + amount))).toString(16).padStart(2, "0")).join("")}`;
}

export class LittleWorld
{
    constructor(canvas, project, options = {})
    {
        this.canvas = canvas;
        this.project = project;
        this.angle = -.48;
        this.options = options;
        this.selected = -1;
        this.active = -1;
        this.resize = new ResizeObserver(() => this.draw());
        this.resize.observe(canvas);
        this.draw();
    }

    point(x, y, z)
    {
        const rx = x * Math.cos(this.angle) - z * Math.sin(this.angle);
        const rz = x * Math.sin(this.angle) + z * Math.cos(this.angle);
        return [this.width * .5 + rx * this.unit, this.height * .64 + rz * this.unit * .45 - y * this.unit, rz + y * .55];
    }

    ground(px, py)
    {
        const rx = (px - this.width * .5) / this.unit;
        const rz = (py - this.height * .64) / (this.unit * .45);
        return {
            x: Math.max(-2.6, Math.min(2.6, rx * Math.cos(this.angle) + rz * Math.sin(this.angle))),
            z: Math.max(-1.85, Math.min(1.85, -rx * Math.sin(this.angle) + rz * Math.cos(this.angle)))
        };
    }

    hit(px, py)
    {
        return this.project.objects.map((object, index) =>
        {
            const p = this.point(object.x, object.size * .6, object.z);
            return { index, distance: Math.hypot((px - p[0]) / (object.size * this.unit * .7), (py - p[1]) / (object.size * this.unit)) };
        }).filter((hit) => hit.distance < 1).sort((a, b) => a.distance - b.distance)[0]?.index ?? -1;
    }

    draw()
    {
        const bounds = this.canvas.getBoundingClientRect();
        if (!bounds.width || !bounds.height)
        {
            return;
        }
        this.width = bounds.width;
        this.height = bounds.height;
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = Math.round(this.width * ratio);
        this.canvas.height = Math.round(this.height * ratio);
        const ctx = this.canvas.getContext("2d");
        ctx.scale(ratio, ratio);
        this.ctx = ctx;
        this.unit = Math.min(this.width / 8.6, this.height / 6.7);
        this.faces = [];
        const night = this.project.theme === "night";
        const ocean = this.project.theme === "ocean";
        const w = this.width;
        const h = this.height;
        if (this.options.background !== false)
        {
            ctx.fillStyle = night ? "#d7cee9" : ocean ? "#d4e9e9" : "#e8e2f1";
            ctx.fillRect(0, 0, w, h);
        }
        ctx.fillStyle = night ? "#fff6d8" : "#f7debd";
        ctx.beginPath();
        ctx.arc(w * .77, h * .21, this.unit * .58, 0, Math.PI * 2);
        ctx.fill();
        if (night)
        {
            ctx.fillStyle = "#d7cee9";
            ctx.beginPath();
            ctx.arc(w * .79, h * .19, this.unit * .52, 0, Math.PI * 2);
            ctx.fill();
        }
        this.cloud(w * .2, h * .3, this.unit * .42);
        this.cloud(w * .87, h * .48, this.unit * .3);
        this.cloud(w * .64, h * .1, this.unit * .25);
        ctx.fillStyle = "#786484";
        for (const [x, y, radius] of [[.18, .16, 2], [.87, .33, 2], [.37, .1, 1.5], [.1, .52, 1.5], [.91, .7, 2]])
        {
            ctx.globalAlpha = .5;
            ctx.beginPath();
            ctx.arc(w * x, h * y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#64527715";
        ctx.beginPath();
        ctx.ellipse(w * .51, h * .89, this.unit * 2.8, this.unit * .36, 0, 0, Math.PI * 2);
        ctx.fill();
        const ring = Array.from({ length: 14 }, (_, index) =>
        {
            const angle = index * Math.PI * 2 / 14;
            return [Math.cos(angle) * 3.3, 0, Math.sin(angle) * 2.35];
        });
        const land = ocean ? "#9dc7b6" : night ? "#b6b9cf" : "#b9c9a1";
        this.face(ring, land);
        ring.forEach((point, index) =>
        {
            const next = ring[(index + 1) % ring.length];
            const lower = [point[0] * .83, -.75 - (index % 3) * .11, point[2] * .83];
            const nextLower = [next[0] * .83, -.75 - ((index + 1) % 3) * .11, next[2] * .83];
            this.face([point, next, nextLower, lower], index % 2 ? "#c7b2c5" : "#b9a2c0");
            this.face([lower, nextLower, [0, -1.35, 0]], index % 2 ? "#aa96b6" : "#b5a2bd");
        });
        const path = [[-.65, .015, 1.9], [-.3, .015, 1.45], [-.15, .015, .8], [-.55, .015, .4]];
        path.forEach((p, index) => this.disc(p, .22 - index * .014, "#e8d1b3", 9));
        this.disc([1.2, .015, -.1], .58, ocean ? "#75b5c5" : "#9bc5c8", 14, .7);
        [[-2.6, .3], [2.4, -.5], [1.65, 1.45], [-.75, -1.7], [-2.4, 1.05]].forEach(([x, z], index) =>
        {
            this.ball([x, .11, z], .12, index % 2 ? "#d4acbc" : "#dbd8bb", 7);
        });
        this.project.objects.forEach((object, index) => this.object(object, index));
        this.faces.sort((a, b) => a.depth - b.depth);
        for (const face of this.faces)
        {
            ctx.fillStyle = face.color;
            ctx.beginPath();
            face.points.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = face.color;
            ctx.lineWidth = .55;
            ctx.stroke();
        }
        if (this.selected >= 0 && this.project.objects[this.selected])
        {
            const object = this.project.objects[this.selected];
            const p = this.point(object.x, .04, object.z);
            ctx.strokeStyle = "#79528f";
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.ellipse(p[0], p[1], object.size * this.unit * .7, object.size * this.unit * .25, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    cloud(x, y, size)
    {
        const ctx = this.ctx;
        ctx.fillStyle = "#fffdf393";
        ctx.beginPath();
        ctx.ellipse(x, y, size * 1.7, size * .5, 0, 0, Math.PI * 2);
        ctx.ellipse(x - size * .3, y - size * .3, size * .8, size * .75, 0, 0, Math.PI * 2);
        ctx.ellipse(x + size * .6, y - size * .17, size * .7, size * .56, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    face(vertices, color, bias = 0)
    {
        const points = vertices.map((p) => this.point(...p));
        this.faces.push({ points, color, depth: points.reduce((sum, p) => sum + p[2], 0) / points.length + bias });
    }

    disc(center, radius, color, count = 12, stretch = 1)
    {
        this.face(Array.from({ length: count }, (_, i) =>
        {
            const a = i * Math.PI * 2 / count;
            return [center[0] + Math.cos(a) * radius, center[1], center[2] + Math.sin(a) * radius * stretch];
        }), color);
    }

    rings(center, levels, color, segments = 14)
    {
        for (let level = 0; level < levels.length - 1; level++)
        {
            for (let i = 0; i < segments; i++)
            {
                const a = i * Math.PI * 2 / segments;
                const b = (i + 1) * Math.PI * 2 / segments;
                const [y, r] = levels[level];
                const [ny, nr] = levels[level + 1];
                const vertex = (angle, height, radius) => [center[0] + Math.cos(angle) * radius, center[1] + height, center[2] + Math.sin(angle) * radius];
                this.face([vertex(a, y, r), vertex(b, y, r), vertex(b, ny, nr), vertex(a, ny, nr)], tint(color, Math.sin(a - .8) * 12 + level * 2));
            }
        }
        const top = levels.at(-1);
        if (top[1])
        {
            this.disc([center[0], center[1] + top[0], center[2]], top[1], tint(color, 10), segments);
        }
    }

    ball(center, radius, color, segments = 12)
    {
        this.rings(center, [[-radius, 0], [-radius * .55, radius * .83], [0, radius], [radius * .65, radius * .76], [radius, 0]], color, segments);
    }

    object(object, index)
    {
        const { x, z, type, color, size: s, rotation } = object;
        const lift = this.active === index ? .26 : 0;
        const center = [x, lift, z];
        const point = (px, py, pz) =>
        {
            const angle = rotation || 0;
            return [x + (px * Math.cos(angle) - pz * Math.sin(angle)) * s, lift + py * s, z + (px * Math.sin(angle) + pz * Math.cos(angle)) * s];
        };
        this.disc([x, .02, z], .5 * s, "#829780", 12, .65);
        if (type === "house")
        {
            this.rings(center, [[0, .62 * s], [.92 * s, .62 * s]], "#f0d7b6");
            this.rings([x, lift + .9 * s, z], [[0, .93 * s], [.15 * s, 1.05 * s], [.46 * s, .88 * s], [.75 * s, .5 * s], [.88 * s, .08 * s]], color, 18);
            this.face([point(-.19, .02, .626), point(.19, .02, .626), point(.19, .48, .626), point(.12, .61, .626), point(-.12, .61, .626), point(-.19, .48, .626)], "#73617a", .3);
            this.face([point(.32, .41, .54), point(.49, .41, .42), point(.49, .65, .42), point(.32, .65, .54)], "#b9c9cc", .25);
            [[-.45, 1.48, .32], [.43, 1.42, .46], [.07, 1.66, -.12], [-.7, 1.2, -.36]].forEach((p) => this.ball(point(...p), .09 * s, "#f7dbc4", 8));
            this.rings(point(.3, 1.42, -.25), [[0, .12 * s], [.48 * s, .12 * s]], "#c08b84", 7);
        }
        else if (type === "tree")
        {
            this.rings(center, [[0, .075 * s], [.95 * s, .06 * s]], "#ae8c7d", 7);
            this.rings([x, lift + .5 * s, z], [[0, .62 * s], [.77 * s, 0]], color, 10);
            this.rings([x, lift + .91 * s, z], [[0, .49 * s], [.68 * s, 0]], tint(color, 8), 10);
            this.rings([x, lift + 1.25 * s, z], [[0, .35 * s], [.58 * s, 0]], tint(color, 16), 10);
            this.ball(point(.11, 1.77, .05), .055 * s, "#f0d7b6", 6);
        }
        else if (type === "friend")
        {
            this.rings(center, [[0, .18 * s], [.47 * s, .22 * s], [.58 * s, .13 * s]], color, 12);
            this.ball(point(0, .75, 0), .24 * s, "#f5d6b7", 12);
            this.rings(point(0, .8, 0), [[0, .28 * s], [.35 * s, 0]], tint(color, -15), 12);
            this.ball(point(-.08, .74, .22), .025 * s, "#43354c", 6);
            this.ball(point(.08, .74, .22), .025 * s, "#43354c", 6);
            this.ball(point(-.22, .39, .03), .085 * s, "#f5d6b7", 8);
            this.ball(point(.22, .39, .03), .085 * s, "#f5d6b7", 8);
        }
        else
        {
            const ring = Array.from({ length: 10 }, (_, i) =>
            {
                const a = -Math.PI / 2 + i * Math.PI / 5;
                const r = i % 2 ? .22 : .48;
                return point(Math.cos(a) * r, .9 + Math.sin(a) * r, 0);
            });
            this.face(ring, color);
            ring.forEach((p, i) => this.face([p, ring[(i + 1) % 10], point(0, .9, .18)], tint(color, i % 2 ? 10 : -15)));
            this.rings(center, [[0, .035 * s], [.6 * s, .035 * s]], "#b39b89", 6);
        }
    }
}

export { palette };
