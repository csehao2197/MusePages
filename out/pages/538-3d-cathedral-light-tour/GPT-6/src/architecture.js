import * as THREE from "./vendor/three.module.js";

function place(group, geometry, material, position)
{
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
}

function curve(group, start, control, end, radius, material, detail)
{
    const path = new THREE.QuadraticBezierCurve3(new THREE.Vector3(...start), new THREE.Vector3(...control), new THREE.Vector3(...end));
    return place(group, new THREE.TubeGeometry(path, detail, radius, 6, false), material, [0, 0, 0]);
}

function pointed(group, first, second, height, material, detail, radius = .19)
{
    const top = [(first[0] + second[0]) / 2, height, (first[2] + second[2]) / 2];
    curve(group, first, [first[0], height - 1.3, first[2]], top, radius, material, detail);
    curve(group, second, [second[0], height - 1.3, second[2]], top, radius, material, detail);
}

function vaultWeb(center, material, detail)
{
    const positions = [];
    const normals = [];
    const indices = [];
    const nx = detail ? 16 : 8;
    const nz = detail ? 12 : 6;
    for (let z = 0; z <= nz; z++)
    {
        for (let x = 0; x <= nx; x++)
        {
            const px = -4.8 + x / nx * 9.6;
            const pz = -4 + z / nz * 8;
            const y = 14 + 8 * (1 - Math.pow(Math.abs(px / 4.8), 1.5)) * (1 - .17 * Math.pow(Math.abs(pz / 4), 1.4));
            positions.push(px, y, center + pz);
            normals.push(0, -1, 0);
        }
    }
    for (let z = 0; z < nz; z++)
    {
        for (let x = 0; x < nx; x++)
        {
            const a = z * (nx + 1) + x;
            indices.push(a, a + nx + 1, a + 1, a + 1, a + nx + 1, a + nx + 2);
        }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh;
}

export function createArchitecture(materials, mobile)
{
    const group = new THREE.Group();
    group.name = "Original Gothic nave";
    const detail = mobile ? 14 : 26;
    const wallWeb = materials.stone.clone();
    wallWeb.side = THREE.DoubleSide;
    for (let p = 0; p < 7; p++)
    {
        const z = 4 - p * 8;
        for (const side of [-1, 1])
        {
            const x = side * 4.8;
            place(group, new THREE.CylinderGeometry(.59, .7, 13.7, 12), materials.stone, [x, 6.85, z]);
            for (let shaft = 0; shaft < 12; shaft++)
            {
                const angle = shaft / 12 * Math.PI * 2;
                place(group, new THREE.CylinderGeometry(.13, .17, 14.2, mobile ? 6 : 8), materials.ribs,
                    [x + Math.cos(angle) * .64, 7.1, z + Math.sin(angle) * .64]);
            }
            place(group, new THREE.CylinderGeometry(.94, 1.06, .33, 12), materials.ribs, [x, .165, z]);
            place(group, new THREE.CylinderGeometry(.93, .78, .42, 12), materials.ribs, [x, 10.4, z]);
            place(group, new THREE.CylinderGeometry(.79, .88, .27, 12), materials.ribs, [x, 14.1, z]);
            place(group, new THREE.BoxGeometry(.7, 20.8, .9), materials.stone, [side * 8, 10.4, z]);
        }
        pointed(group, [-4.8, 14, z], [4.8, 14, z], 22, materials.ribs, detail, .23);
    }
    for (let bay = 0; bay < 6; bay++)
    {
        const z = -bay * 8;
        for (const side of [-1, 1])
        {
            pointed(group, [side * 4.8, 10.5, z + 4], [side * 4.8, 10.5, z - 4], 14.6, materials.ribs, detail, .23);
            place(group, new THREE.BoxGeometry(.48, 12, 7.2), materials.stone, [side * 8.15, 6, z]);
            place(group, new THREE.BoxGeometry(.5, 2.9, 7.2), materials.stone, [side * 8.15, 21.55, z]);
            for (const edge of [-1, 1])
            {
                place(group, new THREE.BoxGeometry(.5, 8.2, 1.72), materials.stone, [side * 8.15, 16, z + edge * 2.74]);
            }
            place(group, new THREE.BoxGeometry(.57, .22, 8), materials.ribs, [side * 7.95, 11.8, z]);
        }
        for (const x of [-4.8, 4.8])
        {
            for (const dz of [-4, 4])
            {
                curve(group, [x, 14, z + dz], [x * .7, 21.8, z + dz * .7], [0, 22, z], .16, materials.ribs, detail);
            }
        }
        place(group, new THREE.SphereGeometry(.34, 10, 8), materials.ribs, [0, 21.95, z]);
        group.add(vaultWeb(z, wallWeb, !mobile));
    }
    const floorGeometry = new THREE.PlaneGeometry(16, 65, 32, 130);
    floorGeometry.rotateX(-Math.PI / 2);
    floorGeometry.translate(0, -.02, -23.5);
    const colors = [];
    const color = new THREE.Color();
    for (let i = 0; i < floorGeometry.attributes.position.count; i++)
    {
        const tone = .34 + .075 * (Math.sin(i * 73.13) * .5 + .5);
        color.setRGB(tone * 1.17, tone * 1.04, tone * .85);
        colors.push(color.r, color.g, color.b);
    }
    floorGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    place(group, floorGeometry, materials.floor, [0, 0, 0]);
    const lineMaterial = new THREE.LineBasicMaterial({ color: "#716654", transparent: true, opacity: .28 });
    const lines = [];
    for (let z = 9; z > -56; z -= 1.5)
    {
        lines.push(-8, .001, z, 8, .001, z);
    }
    for (let x = -8; x <= 8; x += 1.6)
    {
        lines.push(x, .001, 9, x, .001, -56);
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(lines, 3));
    group.add(new THREE.LineSegments(lineGeometry, lineMaterial));
    place(group, new THREE.BoxGeometry(16, 10, .6), materials.stone, [0, 5, -52]);
    place(group, new THREE.BoxGeometry(16, 6, .6), materials.stone, [0, 21, -52]);
    for (const x of [-6, 6])
    {
        place(group, new THREE.BoxGeometry(4, 8, .6), materials.stone, [x, 14, -52]);
    }
    pointed(group, [-4.8, 10, -51.5], [4.8, 10, -51.5], 21.5, materials.ribs, detail, .28);
    place(group, new THREE.BoxGeometry(9.2, .16, 6), materials.ribs, [0, .06, -49]);
    group.userData = { piers: 14, engagedShafts: 168, bays: 6, ribSegments: 24, vaultCrown: 22, width: 16 };
    return group;
}
