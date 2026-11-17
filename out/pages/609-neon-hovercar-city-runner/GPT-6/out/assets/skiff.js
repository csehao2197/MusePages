import * as THREE from "three";
import { content } from "./content.js";
import { track } from "./track.js";

export function createSkiff()
{
    const car = new THREE.Group();
    const geometry = new THREE.BufferGeometry();
    const vertices = [
        -1.08, 0, 1.6, 1.08, 0, 1.6, 0.74, 0.38, -1.8, -0.74, 0.38, -1.8,
        -0.85, 0.58, 1.4, 0.85, 0.58, 1.4, 0.55, 0.52, -1.35, -0.55, 0.52, -1.35
    ];
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex([0, 2, 1, 0, 3, 2, 4, 5, 6, 4, 6, 7, 0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7]);
    geometry.computeVertexNormals();
    const body = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x166a80, metalness: 0.8, roughness: 0.24 }));
    car.add(body);
    car.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: 0x5be8f6 })));
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.27, 1.25), new THREE.MeshStandardMaterial({ color: 0x11182b, metalness: 0.9, roughness: 0.05, emissive: 0x063340 }));
    canopy.position.set(0, 0.65, 0.1);
    canopy.rotation.x = -0.12;
    car.add(canopy);
    const engines = [];
    for (const side of [-1, 1])
    {
        const pod = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.4, 2.3), new THREE.MeshStandardMaterial({ color: 0x243450, metalness: 0.7, roughness: 0.25 }));
        pod.position.set(side * 1.1, 0.2, 0.25);
        car.add(pod);
        const glow = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.06), new THREE.MeshBasicMaterial({ color: 0xff478f }));
        glow.position.set(side * 1.1, 0.27, 1.43);
        car.add(glow);
        const trail = new THREE.Mesh(new THREE.ConeGeometry(0.15, 2, 6), new THREE.MeshBasicMaterial({ color: 0x23dbef, transparent: true, opacity: 0.5 }));
        trail.rotation.x = Math.PI / 2;
        trail.position.set(side * 1.1, 0.22, 2.35);
        car.add(trail);
        engines.push(trail);
    }
    const decalCanvas = document.createElement("canvas");
    decalCanvas.width = 512;
    decalCanvas.height = 64;
    const context = decalCanvas.getContext("2d");
    context.font = "600 38px Rajdhani";
    context.fillStyle = "#d2faff";
    context.fillText(content.vehicle.toUpperCase(), 12, 45);
    const decal = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.18), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(decalCanvas), transparent: true }));
    decal.rotation.x = -Math.PI / 2;
    decal.position.set(0, 0.59, 0.94);
    car.add(decal);
    const underglow = new THREE.PointLight(0x24d7f0, 17, 7);
    underglow.position.y = -0.3;
    car.add(underglow);
    car.position.y = track.hover;
    return { car, engines };
}
