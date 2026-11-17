import * as THREE from "three";
import { mergeGeometries } from "./vendor/BufferGeometryUtils.js";
import { box, cylinder, material, mesh, makeMound, heightAt, seeded } from "./geometry.js";

function fir(parent, x, z, scale = 1, lean = 0)
{
    const tree = new THREE.Group();
    parent.add(tree);
    tree.position.set(x, heightAt(x, z), z);
    tree.rotation.z = lean;
    cylinder(tree, .035 * scale, .06 * scale, 1.2 * scale, "#5c3828", 0, .48 * scale, 0, 7);
    for (let i = 0; i < 3; i++)
    {
        const radius = (.39 - i * .085) * scale;
        const y = (.5 + i * .29) * scale;
        const cone = mesh(tree, new THREE.ConeGeometry(radius, .8 * scale, 7), material(i % 2 ? "#284b3d" : "#1d3d31"), 0, y, 0);
        cone.rotation.y = i * .4;
        const snow = mesh(tree, new THREE.ConeGeometry(radius * .86, .59 * scale, 7), material("#e4ede3"), -.017, y + .14 * scale, .005);
        snow.rotation.y = i * .4;
    }
}
function roof(parent, width, rise, depth, x, y, z)
{
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0);
    shape.lineTo(0, rise);
    shape.lineTo(width / 2, 0);
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
    return mesh(parent, geometry, material("#f0eee3"), x, y, z - depth / 2);
}
function cabin()
{
    const group = new THREE.Group();
    makeMound(group);
    const house = new THREE.Group();
    house.rotation.y = -.25;
    house.position.set(.03, 1.56, .12);
    group.add(house);
    box(house, 1.3, .92, 1.06, "#77503a", 0, .46, 0);
    for (let i = 0; i < 8; i++)
    {
        box(house, 1.35, .038, .035, "#a07850", 0, .09 + i * .105, .55);
        box(house, .035, .038, 1.1, "#9a704a", .66, .09 + i * .105, 0);
    }
    roof(house, 1.65, .82, 1.43, 0, .9, 0);
    roof(house, 1.43, .69, .024, 0, .91, .73).material = material("#5c3828");
    box(house, .24, .45, .05, "#8d4c43", .05, .23, .56);
    for (const x of [-.4, .42])
    {
        box(house, .31, .29, .042, "#35291f", x, .58, .564);
        box(house, .235, .22, .046, "#f2c477", x, .58, .591, true);
        box(house, .024, .24, .02, "#5c3828", x, .58, .62);
        box(house, .24, .022, .02, "#5c3828", x, .58, .62);
        box(house, .36, .05, .1, "#eef0e4", x, .43, .62);
    }
    box(house, .23, .67, .24, "#746b62", -.39, 1.35, -.24);
    box(house, .28, .06, .29, "#e2e8de", -.39, 1.7, -.24);
    fir(group, -1.02, .38, 1.08);
    fir(group, .92, .4, .96);
    fir(group, -.77, -.75, 1.25);
    fir(group, .58, -.83, 1.18);
    fir(group, 1.12, -.15, .66);
    for (let i = 0; i < 6; i++)
    {
        const x = -.94 + i * .17;
        cylinder(group, .022, .022, .3, "#9e7851", x, heightAt(x, .92) + .15, .92, 6);
    }
    box(group, .94, .035, .035, "#9e7851", -.52, 1.77, .92);
    box(group, .94, .035, .035, "#9e7851", -.52, 1.65, .92);
    for (let i = 0; i < 9; i++)
    {
        const z = .8 + i * .065;
        const x = .15 + Math.sin(i * .3) * .27;
        const steppingStone = cylinder(group, .095, .095, .012, "#9dada3", x, heightAt(x, z) + .015, z, 7);
        steppingStone.scale.z = .6;
    }
    return group;
}
function lighthouse()
{
    const group = new THREE.Group();
    makeMound(group);
    const random = seeded(22);
    for (let i = 0; i < 13; i++)
    {
        const angle = i * 2.4;
        const r = .3 + random() * .65;
        const rock = mesh(group, new THREE.DodecahedronGeometry(.3 + random() * .18, 0), material(i % 2 ? "#667577" : "#4c5c60"), Math.cos(angle) * r, 1.59, Math.sin(angle) * r);
        rock.scale.set(1.1, .6 + random() * .8, 1);
        rock.rotation.set(random(), random(), random());
    }
    for (let i = 0; i < 3; i++)
    {
        const angle = i * 2 + .5;
        const pool = cylinder(group, .21, .21, .02, "#7caeb2", Math.sin(angle) * 1.13, 1.51, Math.cos(angle) * 1.13, 24);
        pool.scale.z = .65;
    }
    const tower = new THREE.Group();
    tower.position.set(.13, 1.82, -.02);
    group.add(tower);
    cylinder(tower, .24, .42, 1.85, "#ece5d5", 0, .925, 0, 24);
    cylinder(tower, .299, .328, .28, "#9a4a44", 0, 1.12, 0, 24);
    cylinder(tower, .255, .275, .24, "#9a4a44", 0, 1.62, 0, 24);
    cylinder(tower, .41, .4, .08, "#c4ccbe", 0, 1.89, 0, 32);
    cylinder(tower, .27, .27, .32, "#f2c477", 0, 2.1, 0, 16).material = material("#f2c477", .4, 0, true);
    for (let i = 0; i < 8; i++)
    {
        const angle = i * Math.PI / 4;
        cylinder(tower, .018, .018, .4, "#3b4e47", Math.cos(angle) * .29, 2.1, Math.sin(angle) * .29, 5);
        cylinder(tower, .01, .01, .2, "#5a685f", Math.cos(angle) * .39, 2.02, Math.sin(angle) * .39, 5);
    }
    const railing = mesh(tower, new THREE.TorusGeometry(.39, .012, 5, 32), material("#6d7970"), 0, 2.12, 0);
    railing.rotation.x = Math.PI / 2;
    mesh(tower, new THREE.ConeGeometry(.43, .3, 16), material("#576b60"), 0, 2.44, 0);
    mesh(tower, new THREE.ConeGeometry(.37, .25, 16), material("#e3e8de"), 0, 2.48, 0);
    box(tower, .16, .26, .04, "#455c5b", 0, .38, .39);
    box(tower, .1, .16, .04, "#f2c477", 0, 1.32, .3, true);
    fir(group, -.96, .3, .75, .16);
    fir(group, .93, -.34, .65, .2);
    const beam = new THREE.Group();
    beam.position.set(0, 2.1, 0);
    tower.add(beam);
    const cone = mesh(beam, new THREE.ConeGeometry(.35, 1.55, 24, 1, true), new THREE.MeshBasicMaterial({ color: "#f2c477", transparent: true, opacity: .035, depthWrite: false, side: THREE.DoubleSide }), .8, 0, 0);
    cone.rotation.z = Math.PI / 2;
    group.userData.beam = beam;
    return group;
}
function bareTree(parent, x, z, scale = 1)
{
    const tree = new THREE.Group();
    parent.add(tree);
    tree.position.set(x, heightAt(x, z), z);
    cylinder(tree, .018, .04, .66 * scale, "#6f6653", 0, .33 * scale, 0, 6);
    for (let i = 0; i < 4; i++)
    {
        const branch = cylinder(tree, .007, .019, .3 * scale, "#6f6653", (i % 2 ? -1 : 1) * .08, (.39 + i * .065) * scale, 0, 5);
        branch.rotation.z = i % 2 ? -.65 : .7;
    }
}
function city()
{
    const group = new THREE.Group();
    makeMound(group);
    const random = seeded(65);
    const towers =
    [
        [-.86, -.34, .43, 1.18, "#7c8984"],
        [-.27, -.66, .44, 1.75, "#b3b3a0"],
        [.36, -.55, .46, 2.05, "#667a75"],
        [.91, -.26, .38, 1.45, "#9b8775"],
        [-.6, .35, .45, .93, "#9c6f5a"],
        [.55, .33, .45, 1.15, "#9aa697"]
    ];
    for (const [x, z, width, height, color] of towers)
    {
        const y = heightAt(x, z);
        box(group, width, height, width * .9, color, x, y + height / 2, z);
        box(group, width + .045, .05, width * .9 + .04, "#e9eee2", x, y + height, z);
        box(group, width * .65, .21, width * .65, color, x, y + height + .1, z);
        box(group, width * .72, .045, width * .7, "#edf0e3", x, y + height + .21, z);
        if (height < 1.8)
        {
            cylinder(group, .08, .08, .2, "#665a47", x, y + height + .34, z, 10);
            mesh(group, new THREE.ConeGeometry(.11, .09, 10), material("#dfe7dd"), x, y + height + .48, z);
        }
        for (let row = 0; row < Math.floor(height / .2) - 1; row++)
        {
            for (let col = 0; col < 2; col++)
            {
                if (random() > .67) continue;
                const wy = y + .17 + row * .2;
                box(group, .065, .085, .012, "#f2c477", x + (col - .5) * .17, wy, z + width * .45 + .009, true);
                if (random() > .4)
                {
                    box(group, .012, .085, .065, "#f2c477", x + width / 2 + .009, wy, z + (col - .5) * .15, true);
                }
            }
        }
    }
    box(group, .6, .025, .48, "#9caaa0", 0, 1.6, .67);
    cylinder(group, .12, .17, .08, "#697d70", 0, 1.68, .68, 16);
    cylinder(group, .13, .13, .02, "#c4e7e9", 0, 1.73, .68, 16);
    bareTree(group, -.99, .63, .85);
    bareTree(group, .92, .63, .9);
    bareTree(group, .14, 1.16, .75);
    for (const x of [-.45, .45])
    {
        box(group, .25, .035, .09, "#776148", x, 1.68, .91);
        box(group, .025, .14, .06, "#4c5f54", x - .07, 1.62, .91);
        box(group, .025, .14, .06, "#4c5f54", x + .07, 1.62, .91);
    }
    return group;
}
export function createWorlds(parent)
{
    const worlds = [cabin(), lighthouse(), city()];
    for (const world of worlds)
    {
        world.updateMatrixWorld(true);
        const batches = new Map();
        const originals = [];
        world.traverse((object) =>
        {
            if (!object.isMesh || object.material.transparent) return;
            const geometry = object.geometry.index ? object.geometry.toNonIndexed() : object.geometry.clone();
            geometry.applyMatrix4(object.matrixWorld);
            if (!batches.has(object.material)) batches.set(object.material, []);
            batches.get(object.material).push(geometry);
            originals.push(object);
        });
        for (const object of originals)
        {
            object.removeFromParent();
            object.geometry.dispose();
        }
        for (const [mat, pieces] of batches)
        {
            mesh(world, mergeGeometries(pieces), mat);
            for (const piece of pieces) piece.dispose();
        }
        world.rotation.y = -.12;
        parent.add(world);
        world.visible = false;
    }
    worlds[0].visible = true;
    return worlds;
}
