import * as THREE from "./vendor/three.module.js";

export function createProjections(designs, materials)
{
    const group = new THREE.Group();
    const panels = [];
    for (const window of designs)
    {
        const panel = new THREE.Group();
        panel.position.set(window.side * 7.7, .015, -window.bay * 8);
        for (const piece of window.design)
        {
            const geometry = piece.geometry.clone();
            // Local glass height becomes the distance travelled across the floor.
            geometry.rotateX(-Math.PI / 2);
            geometry.rotateY(window.side * Math.PI / 2);
            const material = new THREE.MeshBasicMaterial(
            {
                color: materials.glass[piece.color].color, transparent: true, opacity: .45,
                blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
            });
            panel.add(new THREE.Mesh(geometry, material));
        }
        panels.push({ panel, side: window.side, bay: window.bay });
        group.add(panel);
    }
    return {
        group,
        update(model)
        {
            const east = model.u < .5;
            for (const { panel, side, bay } of panels)
            {
                const facing = side === (east ? -1 : 1);
                panel.position.z = -bay * 8 + (model.u - .5) * 9;
                panel.rotation.y = (model.u - .5) * .8 * side;
                panel.scale.set(model.length / 8.5, 1, .85 + .6 * model.u);
                for (const mesh of panel.children)
                {
                    mesh.material.opacity = model.projectionOpacity * (facing ? 1 : .18);
                }
            }
        }
    };
}
