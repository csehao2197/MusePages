import * as THREE from "three";

const materials = new Map();
const geometries = new Map();
export function material(color, roughness = .85, metalness = 0, glow = false)
{
    const key = `${color}:${roughness}:${metalness}:${glow}`;
    if (!materials.has(key))
    {
        materials.set(key, new THREE.MeshStandardMaterial(
        {
            color, roughness, metalness,
            emissive: glow ? color : 0x000000,
            emissiveIntensity: glow ? 1.1 : 0
        }));
    }
    return materials.get(key);
}
export function mesh(parent, geometry, mat, x = 0, y = 0, z = 0)
{
    const object = new THREE.Mesh(geometry, mat);
    object.position.set(x, y, z);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
}
export function box(parent, width, height, depth, color, x, y, z, glow = false)
{
    const key = `b:${width}:${height}:${depth}`;
    if (!geometries.has(key))
    {
        geometries.set(key, new THREE.BoxGeometry(width, height, depth));
    }
    return mesh(parent, geometries.get(key), material(color, .85, 0, glow), x, y, z);
}
export function cylinder(parent, top, bottom, height, color, x, y, z, sides = 24)
{
    const key = `c:${top}:${bottom}:${height}:${sides}`;
    if (!geometries.has(key))
    {
        geometries.set(key, new THREE.CylinderGeometry(top, bottom, height, sides));
    }
    return mesh(parent, geometries.get(key), material(color), x, y, z);
}
export function seeded(seed = 202612)
{
    return () =>
    {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
export function heightAt(x, z)
{
    return 1.42 + .17 * Math.max(0, 1 - (x * x + z * z) / 2.45);
}
export function makeMound(group)
{
    const geometry = new THREE.SphereGeometry(1, 48, 24);
    const mound = mesh(group, geometry, material("#dfe9df"), 0, 1.38, 0);
    mound.scale.set(1.58, .24, 1.58);
    const random = seeded(911);
    for (let i = 0; i < 32; i++)
    {
        const x = (random() - .5) * 2.8;
        const z = (random() - .5) * 2.8;
        if (x * x + z * z > 1.95) continue;
        const sparkle = mesh(group, new THREE.OctahedronGeometry(.012), material("#f3efe3", .2), x, heightAt(x, z) + .015, z);
        sparkle.rotation.y = random() * Math.PI;
    }
}
export function makeKeepsake(group)
{
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    const random = seeded(15);
    ctx.fillStyle = "#5c3828";
    ctx.fillRect(0, 0, 512, 128);
    for (let i = 0; i < 180; i++)
    {
        const y = random() * 128;
        ctx.strokeStyle = `rgba(${random() > .5 ? "183,122,73" : "29,16,10"},${.06 + random() * .15})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(160, y + random() * 7, 320, y - random() * 7, 512, y + 2);
        ctx.stroke();
    }
    const wood = new THREE.CanvasTexture(canvas);
    wood.colorSpace = THREE.SRGBColorSpace;
    const baseMat = new THREE.MeshStandardMaterial({ color: "#b38b70", map: wood, roughness: .48 });
    mesh(group, new THREE.CylinderGeometry(2.42, 2.5, .72, 96), baseMat, 0, .56, 0);
    cylinder(group, 2.28, 2.42, .12, "#35251e", 0, .97, 0, 96);
    const brass = material("#d2a85f", .32, .72);
    for (const y of [.23, .86])
    {
        const ring = mesh(group, new THREE.TorusGeometry(2.45, .035, 8, 96), brass, 0, y, 0);
        ring.rotation.x = Math.PI / 2;
    }
    const plaque = mesh(group, new THREE.PlaneGeometry(2.65, .48), new THREE.MeshStandardMaterial({ metalness: .45, roughness: .48 }), 0, .57, 2.491);
    for (const x of [-1.22, 1.22])
    {
        mesh(group, new THREE.SphereGeometry(.027, 8, 6), brass, x, .57, 2.507);
    }
    const glassGeometry = new THREE.SphereGeometry(2.25, 64, 40);
    const glass = mesh(group, glassGeometry, new THREE.MeshPhysicalMaterial(
    {
        color: "#dcefed", transmission: .9, thickness: .12, roughness: .08,
        ior: 1.45, transparent: true, opacity: .32, depthWrite: false,
        envMapIntensity: .24, metalness: 0
    }), 0, 3, 0);
    glass.castShadow = false;
    glass.receiveShadow = false;
    glass.renderOrder = 5;
    const rim = mesh(group, glassGeometry, new THREE.ShaderMaterial(
    {
        transparent: true,
        depthWrite: false,
        uniforms: {},
        vertexShader: "varying vec3 n; varying vec3 v; void main(){ vec4 p=modelViewMatrix*vec4(position,1.); n=normalize(normalMatrix*normal); v=normalize(-p.xyz); gl_Position=projectionMatrix*p; }",
        fragmentShader: "varying vec3 n; varying vec3 v; void main(){ float f=pow(1.-abs(dot(normalize(n),normalize(v))),3.5); gl_FragColor=vec4(.64,.85,.84,f*.29); }"
    }), 0, 3, 0);
    rim.renderOrder = 6;
    for (let side = 0; side < 2; side++)
    {
        const points = [];
        for (let i = 0; i <= 30; i++)
        {
            const angle = -.58 + i / 30 * .96;
            const x = (side === 0 ? -1 : 1) * (1.72 + .13 * Math.cos(angle));
            const y = 3.2 + Math.sin(angle) * 1.6;
            const z = Math.sqrt(Math.max(.01, 5.075 - x * x - (y - 3) ** 2));
            points.push(new THREE.Vector3(x, y, z));
        }
        const highlight = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: "#d7f0e9", transparent: true, opacity: side ? .22 : .4 }));
        highlight.renderOrder = 7;
        group.add(highlight);
    }
    let previousTexture;
    function updateMessage(message)
    {
        const label = document.createElement("canvas");
        label.width = 1024;
        label.height = 192;
        const context = label.getContext("2d");
        const gradient = context.createLinearGradient(0, 0, 0, 192);
        gradient.addColorStop(0, "#e1bc77");
        gradient.addColorStop(.5, "#c8a05a");
        gradient.addColorStop(1, "#b58b47");
        context.fillStyle = gradient;
        context.fillRect(0, 0, 1024, 192);
        const grain = seeded(412);
        for (let i = 0; i < 150; i++)
        {
            context.fillStyle = `rgba(255,244,204,${grain() * .1})`;
            context.fillRect(0, grain() * 192, 1024, 1);
        }
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "600 51px Fraunces";
        const clean = message.trim().slice(0, 28);
        const size = Math.min(51, 51 * 885 / Math.max(885, context.measureText(clean).width));
        context.font = `600 ${size}px Fraunces`;
        context.fillStyle = "#f4d293";
        context.fillText(clean, 512, 100);
        context.fillStyle = "#472c20";
        context.fillText(clean, 512, 97);
        const texture = new THREE.CanvasTexture(label);
        texture.colorSpace = THREE.SRGBColorSpace;
        plaque.material.map = texture;
        plaque.material.needsUpdate = true;
        previousTexture?.dispose();
        previousTexture = texture;
        plaque.userData.message = clean;
    }
    return { updateMessage };
}
