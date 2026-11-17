import * as THREE from "./vendor/three.module.js";
import { trailX, trailY } from "./content.js";
import { inkMaterial, seeded } from "./shader.js";

export function makeTerrain(scene, seed)
{
    const random = seeded(seed);
    const stone = inkMaterial("#768176");
    const darkStone = inkMaterial("#52655c");
    const trail = inkMaterial("#d0cbb4");
    const pineInk = inkMaterial("#344e47");
    const bark = inkMaterial("#566057");
    const materials = [stone, darkStone, trail, pineInk, bark];
    const rockGeometries = [];
    for (let i = 0; i < 7; i++)
    {
        const geometry = new THREE.IcosahedronGeometry(1, 1);
        const positions = geometry.attributes.position;
        for (let j = 0; j < positions.count; j++)
        {
            const factor = .78 + random() * .38;
            positions.setXYZ(j, positions.getX(j) * factor, positions.getY(j) * factor, positions.getZ(j) * factor);
        }
        geometry.computeVertexNormals();
        rockGeometries.push(geometry);
    }
    const landscape = new THREE.Group();
    scene.add(landscape);
    const strip = (widths, color, yOffset = 0) =>
    {
        const vertices = [];
        const indices = [];
        for (let zIndex = 0; zIndex <= 125; zIndex++)
        {
            const z = 14 - zIndex;
            for (let xIndex = 0; xIndex < widths.length; xIndex++)
            {
                const x = widths[xIndex];
                const edge = Math.abs(x) > 4.2;
                const offset = edge ? -(Math.abs(x) - 4.2) * 1.7 + random() * 1.7 : random() * .08;
                vertices.push(trailX(z) + x, trailY(z) + offset + yOffset, z);
                if (zIndex && xIndex)
                {
                    const a = zIndex * widths.length + xIndex;
                    indices.push(a, a - 1, a - widths.length, a - 1, a - widths.length - 1, a - widths.length);
                }
            }
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        landscape.add(new THREE.Mesh(geometry, color));
    };
    strip([-16, -10, -6.5, -4.1, -2, 0, 2, 4.1, 6.5, 10, 16], stone);
    strip([-2.2, -.8, .8, 2.2], trail, .08);
    for (let i = 0; i < 145; i++)
    {
        const z = 12 - random() * 122;
        const side = random() > .5 ? 1 : -1;
        const offset = side * (4 + random() * 6);
        const rock = new THREE.Mesh(rockGeometries[i % 7], i % 4 ? stone : darkStone);
        const size = .4 + random() * 2.5;
        rock.position.set(trailX(z) + offset, trailY(z) - Math.max(0, Math.abs(offset) - 5) * 1.3, z);
        rock.scale.set(size, size * (.6 + random() * 1.7), size);
        rock.rotation.set(random(), random() * Math.PI, random() * .4);
        landscape.add(rock);
    }
    const trunkGeometry = new THREE.CylinderGeometry(.065, .14, 1, 6);
    const foliageGeometry = new THREE.IcosahedronGeometry(1, 0);
    for (let i = 0; i < 63; i++)
    {
        const z = 7 - random() * 112;
        const side = i % 2 ? 1 : -1;
        const offset = side * (4.8 + random() * 2.4);
        const tree = new THREE.Group();
        tree.position.set(trailX(z) + offset, trailY(z) - (Math.abs(offset) - 4.8) * .8, z);
        const height = 2.7 + random() * 3.6;
        const trunk = new THREE.Mesh(trunkGeometry, bark);
        trunk.position.y = height / 2;
        trunk.scale.y = height;
        trunk.rotation.z = side * .11;
        tree.add(trunk);
        for (let j = 0; j < 5; j++)
        {
            const canopy = new THREE.Mesh(foliageGeometry, pineInk);
            const taper = 1 - j * .13;
            canopy.scale.set(1.7 * taper, .48, .9 * taper);
            canopy.position.set(Math.sin(j * 2.4) * .55 + side * j * .1, height * .42 + j * height * .13, Math.cos(j) * .3);
            canopy.rotation.y = random() * 2;
            tree.add(canopy);
        }
        landscape.add(tree);
    }
    const farColors = ["#6e847b", "#97a99b", "#b4c1b1", "#c5ccbe"];
    for (let layer = 0; layer < 4; layer++)
    {
        const material = inkMaterial(farColors[layer]);
        materials.push(material);
        for (let i = 0; i < 13; i++)
        {
            const mountain = new THREE.Mesh(rockGeometries[(i + layer) % 7], material);
            const side = i % 2 ? -1 : 1;
            mountain.position.set(side * (29 + layer * 16 + random() * 19), -11 + random() * 5, 6 - i * 14 - layer * 11);
            mountain.scale.set(7 + random() * 12, 11 + random() * (12 + layer * 3), 10 + random() * 14);
            mountain.rotation.z = side * (random() * .2);
            scene.add(mountain);
        }
    }
    const pebble = new THREE.BoxGeometry(1, .07, .35);
    for (let i = 0; i < 110; i++)
    {
        const z = 10 - i * 1.05;
        const mesh = new THREE.Mesh(pebble, i % 3 ? trail : stone);
        mesh.position.set(trailX(z) + (random() - .5) * 2.6, trailY(z) + .13, z);
        mesh.rotation.y = (random() - .5) * .5;
        mesh.scale.x = .5 + random() * 1.3;
        landscape.add(mesh);
    }
    scene.updateMatrixWorld(true);
    const batches = new Map();
    scene.traverse((object) =>
    {
        if (!object.isMesh) return;
        const key = `${object.geometry.uuid}:${object.material.uuid}`;
        if (!batches.has(key)) batches.set(key, []);
        batches.get(key).push(object);
    });
    for (const objects of batches.values())
    {
        if (objects.length < 2) continue;
        const first = objects[0];
        const instances = new THREE.InstancedMesh(first.geometry, first.material, objects.length);
        objects.forEach((object, index) =>
        {
            instances.setMatrixAt(index, object.matrixWorld);
            object.removeFromParent();
        });
        scene.add(instances);
    }
    return { materials };
}
