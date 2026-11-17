import * as THREE from "three";
import { mergeGeometries } from "../vendor/BufferGeometryUtils.js";
import { content } from "../content.js";

export function mulberry32(seed)
{
    return function ()
    {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

export function boundary(angle)
{
    const r = 1 + .105 * Math.cos(3 * angle + .6) + .065 * Math.sin(2 * angle - .9) + .024 * Math.cos(9 * angle);
    return new THREE.Vector2(Math.cos(angle) * 6.7 * r, Math.sin(angle) * 4.7 * r);
}

export function heightAt(x, z)
{
    return .13 * Math.sin(x * .52) * Math.cos(z * .6) + .055 * Math.cos(x * .9 + z * .7);
}

export function inside(x, z, margin = .6)
{
    const a = Math.atan2(z / 4.7, x / 6.7);
    const p = boundary(a);
    const radius = Math.hypot(x, z);
    return radius < Math.hypot(p.x, p.y) - margin;
}

function material(color, roughness = 1)
{
    return new THREE.MeshStandardMaterial({ color, roughness, flatShading: true });
}

export function terrain(scene)
{
    const segments = 112;
    const rings = 20;
    const positions = [0, heightAt(0, 0), 0];
    const colors = [];
    const color = new THREE.Color();
    const indices = [];
    const random = mulberry32(311);
    color.set(content.colors.meadow);
    colors.push(color.r, color.g, color.b);
    for (let ring = 1; ring <= rings; ring++)
    {
        for (let i = 0; i < segments; i++)
        {
            const edge = boundary(i / segments * Math.PI * 2);
            const x = edge.x * ring / rings;
            const z = edge.y * ring / rings;
            positions.push(x, heightAt(x, z), z);
            color.set(content.colors.meadow).multiplyScalar(.92 + random() * .15);
            colors.push(color.r, color.g, color.b);
            const current = 1 + (ring - 1) * segments + i;
            const next = 1 + (ring - 1) * segments + (i + 1) % segments;
            if (ring === 1)
            {
                indices.push(0, next, current);
            }
            else
            {
                const prev = current - segments;
                const prevNext = next - segments;
                indices.push(prev, next, current, prev, prevNext, next);
            }
        }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const top = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
    top.receiveShadow = true;
    scene.add(top);
    const bands = [0, -.24, -.43, -.75];
    for (let band = 0; band < 3; band++)
    {
        const vertices = [];
        for (let i = 0; i < segments; i++)
        {
            const a = boundary(i / segments * Math.PI * 2);
            const b = boundary((i + 1) / segments * Math.PI * 2);
            const ya = heightAt(a.x, a.y);
            const yb = heightAt(b.x, b.y);
            const upperA = [a.x, ya + bands[band], a.y];
            const upperB = [b.x, yb + bands[band], b.y];
            const lowerA = [a.x, ya + bands[band + 1], a.y];
            const lowerB = [b.x, yb + bands[band + 1], b.y];
            vertices.push(...upperA, ...upperB, ...lowerA, ...upperB, ...lowerB, ...lowerA);
        }
        const side = new THREE.BufferGeometry();
        side.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        side.computeVertexNormals();
        const mesh = new THREE.Mesh(side, material(["#8A6A4F", "#70533e", "#795b43"][band]));
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
    }
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshBasicMaterial({ color: content.colors.sky, toneMapped: false }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -.88;
    scene.add(floor);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: .14 }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -.875;
    shadow.receiveShadow = true;
    scene.add(shadow);
    const stoneGeometry = new THREE.DodecahedronGeometry(1, 0);
    const stoneMaterial = material("#a5ad9b");
    for (const [x, z, scale] of [[-5.8, -2.4, .36], [-5.4, -2.9, .23], [5.0, 2.6, .38], [5.3, 2.25, .22], [2, -4.4, .25]])
    {
        const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
        stone.position.set(x, heightAt(x, z) + scale * .25, z);
        stone.scale.set(scale * 1.4, scale * .7, scale);
        stone.rotation.set(.2, x, .3);
        stone.castShadow = true;
        stone.receiveShadow = true;
        scene.add(stone);
    }
    return top;
}

function ellipsoid(x, y, z, sx, sy, sz, rotation = 0)
{
    const geometry = new THREE.SphereGeometry(1, 7, 5);
    geometry.scale(sx, sy, sz);
    geometry.rotateX(rotation);
    geometry.translate(x, y, z);
    return geometry;
}

function combine(parts)
{
    const result = mergeGeometries(parts, false);
    parts.forEach((part) => part.dispose());
    return result;
}

export function flowerGeometry(type)
{
    const stem = new THREE.CylinderGeometry(.018, .027, .98, 5, 5);
    stem.translate(0, .49, 0);
    const leafA = ellipsoid(.115, .36, 0, .17, .035, .066);
    leafA.rotateZ(.40);
    const leafB = ellipsoid(-.105, .61, .025, .16, .035, .064);
    leafB.rotateZ(-.32);
    const leaves = combine([leafA, leafB]);
    const petals = [];
    const centers = [];
    if (type === 0 || type === 3)
    {
        const count = type === 0 ? 10 : 8;
        for (let i = 0; i < count; i++)
        {
            let petal;
            if (type === 0)
            {
                petal = ellipsoid(0, 1.005, .205, .071, .032, .185, -.08);
            }
            else
            {
                petal = new THREE.BufferGeometry();
                petal.setAttribute("position", new THREE.Float32BufferAttribute([
                    0, .99, .06, -.115, 1.025, .24, 0, 1.075, .43,
                    0, .99, .06, 0, 1.075, .43, .115, 1.025, .24
                ], 3));
                petal.computeVertexNormals();
                petal.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0], 2));
            }
            petal.rotateY(i / count * Math.PI * 2);
            petals.push(petal);
        }
        centers.push(ellipsoid(0, 1.04, 0, .115, .067, .115));
    }
    else if (type === 1)
    {
        for (let i = 0; i < 6; i++)
        {
            const petal = new THREE.BufferGeometry();
            const positions = [];
            const uv = [];
            const indices = [];
            for (let row = 0; row <= 5; row++)
            {
                const t = row / 5;
                for (let col = 0; col <= 4; col++)
                {
                    const u = col / 2 - 1;
                    const a = u * .58;
                    const radius = .045 + .245 * Math.pow(t, .8);
                    positions.push(Math.sin(a) * radius, .96 + .32 * t - .055 * u * u * t, Math.cos(a) * radius);
                    uv.push(col / 4, t);
                    if (row < 5 && col < 4)
                    {
                        const n = row * 5 + col;
                        indices.push(n, n + 5, n + 1, n + 1, n + 5, n + 6);
                    }
                }
            }
            petal.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
            petal.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
            petal.setIndex(indices);
            petal.computeVertexNormals();
            petal.rotateY(i * Math.PI / 3);
            petals.push(petal);
        }
        centers.push(ellipsoid(0, 1.05, 0, .075, .07, .075));
    }
    else
    {
        const branches = [stem];
        for (let i = 0; i < 5; i++)
        {
            const a = i * 2.4;
            const y = .76 + i * .084;
            const x = Math.cos(a) * .18;
            const z = Math.sin(a) * .18;
            const profile = [new THREE.Vector2(.023, .16), new THREE.Vector2(.072, .12), new THREE.Vector2(.085, .035), new THREE.Vector2(.126, 0)];
            const bell = new THREE.LatheGeometry(profile, 8);
            bell.translate(x, y - .08, z);
            petals.push(bell);
            centers.push(ellipsoid(x, y - .095, z, .055, .028, .055));
            const branch = new THREE.CylinderGeometry(.011, .015, .24, 4);
            branch.rotateZ(-Math.PI / 3);
            branch.rotateY(-a);
            branch.translate(x * .5, y + .09, z * .5);
            branches.push(branch);
        }
        return { stem: combine(branches), leaves, petals: combine(petals), center: combine(centers) };
    }
    return { stem, leaves, petals: combine(petals), center: combine(centers) };
}
