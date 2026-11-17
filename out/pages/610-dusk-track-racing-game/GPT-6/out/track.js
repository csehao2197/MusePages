import * as T from "./vendor/three.module.js";
import { C } from "./content.js";

const controls = [[0, 0], [72, 6], [136, 32], [168, 96], [128, 152], [56, 168], [-8, 136], [-56, 88], [-72, 32], [-32, -16]];
export const curve = new T.CatmullRomCurve3(controls.map(([x, z]) => new T.Vector3(x, 2, z)), true, "catmullrom", .5);
curve.arcLengthDivisions = 3000;
const scale = 1000 / curve.getLength();
curve.points.forEach((p) =>
{
    p.x *= scale;
    p.z *= scale;
});
curve.updateArcLengths();
const up = new T.Vector3(0, 1, 0);
const smooth = (x) => (x = T.MathUtils.clamp(x, 0, 1)) * x * (3 - 2 * x);
export function bank(s)
{
    s = (s % 1000 + 1000) % 1000;
    return T.MathUtils.degToRad(16 * smooth((s - 200) / 30) * smooth((500 - s) / 30) +
        8 * smooth((s - 720) / 30) * smooth((850 - s) / 30));
}
export function at(s, lateral = 0)
{
    s = (s % 1000 + 1000) % 1000;
    const p = curve.getPointAt(s / 1000);
    const t = curve.getTangentAt(s / 1000).normalize();
    const r = new T.Vector3().crossVectors(t, up).normalize();
    p.addScaledVector(r, lateral);
    p.y += Math.tan(bank(s)) * lateral;
    return { p, t, r, yaw: Math.atan2(t.z, t.x), bank: bank(s) };
}
export const samples = Array.from({ length: 250 }, (_, i) => at(i * 4));
export function project(x, z, last = 5)
{
    let best = Infinity;
    let hit = last;
    for (let d = -40; d <= 40; d++)
    {
        const i = (last + d + 250) % 250;
        const p = samples[i].p;
        const distance = (x - p.x) ** 2 + (z - p.z) ** 2;
        if (distance < best)
        {
            best = distance;
            hit = i;
        }
    }
    const f = samples[hit];
    const dx = x - f.p.x;
    const dz = z - f.p.z;
    const along = T.MathUtils.clamp(dx * f.t.x + dz * f.t.z, -2, 2);
    const s = ((hit * 4 + along) % 1000 + 1000) % 1000;
    const frame = at(s);
    return { hit, s, lateral: (x - frame.p.x) * frame.r.x + (z - frame.p.z) * frame.r.z, ...frame };
}
export const obstacles = [
    ...[780, 805, 830].map((s) => ({ s, lateral: -6.6, type: "bale" })),
    ...[460, 478].map((s) => ({ s, lateral: 7.2, type: "tire" })),
    ...[560, 578, 596, 614].map((s, i) => ({ s, lateral: i % 2 ? -6.6 : 6.6, type: "cone" }))
];
export const lamps = [];
export function mat(color, extra = {})
{
    return new T.MeshStandardMaterial({ color, roughness: .8, ...extra });
}
export function box(parent, size, pos, color, shadow = false)
{
    const mesh = new T.Mesh(new T.BoxGeometry(...size), typeof color === "object" ? color : mat(color));
    mesh.position.set(...pos);
    mesh.castShadow = shadow;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
}
function ribbon(scene, from, to, left, right, color, lift = 0, bankScale = 1)
{
    const vertices = [];
    const count = Math.max(1, Math.ceil((to - from) / 4));
    const point = (s, l) =>
    {
        const f = at(s, l);
        f.p.y = 2 + Math.tan(f.bank * bankScale) * l + lift;
        return f.p;
    };
    for (let i = 0; i < count; i++)
    {
        const s0 = from + (to - from) * i / count;
        const s1 = from + (to - from) * (i + 1) / count;
        const a = point(s0, left);
        const b = point(s0, right);
        const c = point(s1, left);
        const d = point(s1, right);
        for (const p of [a, c, b, b, c, d]) vertices.push(p.x, p.y, p.z);
    }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute("position", new T.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    const mesh = new T.Mesh(geometry, mat(color, { side: T.DoubleSide }));
    mesh.receiveShadow = true;
    scene.add(mesh);
}
function groupAt(scene, s, lateral)
{
    const f = at(s, lateral);
    const g = new T.Group();
    g.position.copy(f.p);
    g.rotation.y = Math.PI / 2 - f.yaw;
    scene.add(g);
    return g;
}
export function makeTrack(scene)
{
    const ground = new T.Mesh(new T.PlaneGeometry(2500, 2500), mat("#6d7a45"));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    ribbon(scene, 0, 1000, -18, 18, "#6b5344", -.08, .35);
    ribbon(scene, 0, 1000, -8, 8, "#3a342e");
    for (const l of [-7.65, 7.45]) ribbon(scene, 0, 1000, l, l + .2, "#f6f1e7", .025);
    for (let s = 0; s < 1000; s += 10) ribbon(scene, s, s + 4, -.08, .08, "#e7c27a", .03);
    for (const [a, b] of [[200, 500], [720, 850]])
    {
        for (let s = a; s < b; s += 2)
        {
            for (const l of [-8.6, 8]) ribbon(scene, s, s + 2, l, l + .6, Math.floor(s / 2) % 2 ? "#c4512c" : "#f6f1e7", .04);
        }
    }
    for (let l = -8; l < 8; l += .8)
    {
        for (let s = 0; s < 1.6; s += .8) ribbon(scene, s, s + .8, l, l + .8, (Math.round(l / .8) + Math.round(s / .8)) % 2 ? "#1c1612" : "#f6f1e7", .05);
    }
    for (const s of [0, 250, 500, 750])
    {
        const g = groupAt(scene, s, 0);
        for (const x of [-9.2, 9.2])
        {
            const pylon = new T.Mesh(new T.CylinderGeometry(.2, .35, 5.2, 4), mat("#c4653a"));
            pylon.position.set(x, 2.6, 0);
            pylon.castShadow = true;
            g.add(pylon);
        }
        box(g, [19, .45, .45], [0, 4.2, 0], "#f6f1e7", true);
        if (s === 0)
        {
            for (let x = -9; x < 9; x += 1.2) box(g, [.6, .46, .46], [x, 4.2, 0], "#1c1612");
        }
        const veil = new T.Mesh(new T.PlaneGeometry(16, 4), new T.MeshBasicMaterial({ color: "#ffb067", opacity: .22, transparent: true, depthWrite: false, side: T.DoubleSide }));
        veil.position.y = 2;
        g.add(veil);
    }
    for (const o of obstacles)
    {
        const g = groupAt(scene, o.s, o.lateral);
        if (o.type === "bale")
        {
            for (let i = 0; i < 3; i++) box(g, [1.1, .7, .8], [(i % 2) * 1.1 - .5, .35 + (i === 2 ? .7 : 0), 0], "#c4a15a", true);
        }
        else if (o.type === "tire")
        {
            for (let i = 0; i < 4; i++)
            {
                const ring = new T.Mesh(new T.TorusGeometry(.48, .17, 4, 8), mat(i === 2 ? "#d4722a" : "#2c2a28"));
                ring.rotation.x = Math.PI / 2;
                ring.position.y = .2 + i * .3;
                g.add(ring);
            }
        }
        else
        {
            const cone = new T.Mesh(new T.ConeGeometry(.27, .7, 8), mat("#e07a2f"));
            cone.position.y = .35;
            g.add(cone);
            const band = new T.Mesh(new T.CylinderGeometry(.1, .15, .12, 8), mat("#f6f1e7"));
            band.position.y = .42;
            g.add(band);
        }
    }
    const stand = groupAt(scene, 45, 22);
    for (let i = 0; i < 3; i++) box(stand, [3, .7 * (i + 1), 18], [i * 2, .35 * (i + 1), 0], "#8a6244", true);
    const colors = ["#c4512c", "#2f6f62", "#d7a441", "#3d4c7a", "#f6f1e7", "#1c1612"];
    const spectators = new T.InstancedMesh(new T.BoxGeometry(.65, 1.2, .65), mat("#ffffff"), 18);
    const matrix = new T.Matrix4();
    for (let i = 0; i < 18; i++)
    {
        matrix.makeTranslation(Math.floor(i / 6) * 2, .7 * (Math.floor(i / 6) + 1) + .6, (i % 6) * 2.6 - 6.5);
        spectators.setMatrixAt(i, matrix);
        spectators.setColorAt(i, new T.Color(colors[i % 6]));
    }
    stand.add(spectators);
    const hut = groupAt(scene, 45, -22);
    box(hut, [6, 3, 5], [0, 1.5, 0], "#1c1612", true);
    const roof = box(hut, [7, .4, 6], [0, 3.2, 0], "#c4512c", true);
    roof.rotation.z = .1;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f6f1e7";
    ctx.fillRect(0, 0, 512, 128);
    ctx.fillStyle = "#1c1612";
    ctx.font = "800 82px Shoulders";
    ctx.textAlign = "center";
    ctx.fillText(C.brand, 256, 94);
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    const sign = new T.Mesh(new T.PlaneGeometry(4.5, 1.1), new T.MeshBasicMaterial({ map: texture, side: T.DoubleSide }));
    sign.position.set(0, 2, 2.52);
    hut.add(sign);
    const gantry = groupAt(scene, 70, 0);
    for (const x of [-10, 10]) box(gantry, [.4, 7, .4], [x, 3.5, 0], "#1c1612");
    box(gantry, [21, .5, .5], [0, 6.7, 0], "#1c1612");
    for (let i = 0; i < 5; i++)
    {
        const light = box(gantry, [.8, .8, .35], [(i - 2) * 1.2, 6, 0], mat("#1c1612", { emissive: "#000000" }));
        lamps.push(light.material);
    }
    let seed = 2166136261;
    for (const c of C.key) seed = Math.imul(seed ^ c.charCodeAt(0), 16777619);
    const random = () =>
    {
        seed += 0x6d2b79f5;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    for (let i = 0; i < 19; i++)
    {
        const s = i / 19 * 1000;
        const side = i % 2 ? -1 : 1;
        let lateral = side * (34 + random() * 45);
        let p = at(s, lateral).p;
        while (Math.min(...samples.map((f) => Math.hypot(p.x - f.p.x, p.z - f.p.z))) < 22)
        {
            lateral += side * 16;
            p = at(s, lateral).p;
        }
        p.y = 0;
        if (i < 14)
        {
            const h = 7 + random() * 7;
            const trunk = new T.Mesh(new T.CylinderGeometry(.5, .65, 3, 5), mat("#6b5344"));
            trunk.position.copy(p).y = 1.5;
            scene.add(trunk);
            const pine = new T.Mesh(new T.ConeGeometry(h * .33, h, 6), mat("#3e5340", { flatShading: true }));
            pine.position.copy(p).y = h / 2 + 2;
            scene.add(pine);
        }
        else
        {
            const hill = new T.Mesh(new T.SphereGeometry(28 + random() * 20, 10, 5), mat("#63734c", { flatShading: true }));
            hill.scale.y = .5;
            hill.position.copy(p);
            hill.position.y = -4;
            scene.add(hill);
        }
    }
    const grass = new T.InstancedMesh(new T.ConeGeometry(.35, 1.1, 3), mat("#7d8650"), 40);
    for (let i = 0; i < 40; i++)
    {
        const p = at(random() * 1000, (i % 2 ? -1 : 1) * (10 + random() * 7)).p;
        matrix.makeTranslation(p.x, p.y + .2, p.z);
        grass.setMatrixAt(i, matrix);
    }
    scene.add(grass);
}
