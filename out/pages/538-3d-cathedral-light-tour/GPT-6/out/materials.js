import * as THREE from "./vendor/three.module.js";

export function createMaterials()
{
    return {
        stone: new THREE.MeshStandardMaterial({ color: "#b8aa93", roughness: .88 }),
        ribs: new THREE.MeshStandardMaterial({ color: "#c9bba3", roughness: .82 }),
        dark: new THREE.MeshStandardMaterial({ color: "#554d40", roughness: 1 }),
        floor: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .93 }),
        lead: new THREE.MeshStandardMaterial({ color: "#29251f", roughness: .8 }),
        glass: ["#a83b4b", "#3d628e", "#4c8078", "#d9a44a"].map(color => new THREE.MeshPhysicalMaterial(
        {
            color, emissive: color, emissiveIntensity: .8, roughness: .25, metalness: 0,
            transmission: .16, transparent: true, opacity: .82, side: THREE.DoubleSide
        }))
    };
}
