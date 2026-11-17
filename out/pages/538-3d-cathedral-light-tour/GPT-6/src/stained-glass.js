import * as THREE from "./vendor/three.module.js";

function polygon(points)
{
    const shape = new THREE.Shape();
    shape.moveTo(...points[0]);
    for (const point of points.slice(1))
    {
        shape.lineTo(...point);
    }
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
}

export function createGlass(materials, mobile)
{
    const windows = new THREE.Group();
    const designs = [];
    for (let bay = 0; bay < 6; bay++)
    {
        for (const side of [-1, 1])
        {
            const window = new THREE.Group();
            window.position.set(side * 7.9, 12, -bay * 8);
            window.rotation.y = side * Math.PI / 2;
            const design = [];
            for (let row = 0; row < 5; row++)
            {
                for (let column = 0; column < 3; column++)
                {
                    const cx = (column - 1) * .98;
                    const cy = row * 1.23 + .8;
                    const width = .43;
                    const height = .54;
                    const geometry = polygon([[cx, cy - height], [cx + width, cy], [cx, cy + height], [cx - width, cy]]);
                    const index = (row + column + bay) % 4;
                    window.add(new THREE.Mesh(geometry, materials.glass[index]));
                    design.push({ geometry, color: index });
                    const border = new THREE.EdgesGeometry(geometry);
                    window.add(new THREE.LineSegments(border, new THREE.LineBasicMaterial({ color: "#29251f" })));
                    if (column === 1 && row % 2 === 0)
                    {
                        const round = new THREE.Mesh(new THREE.CircleGeometry(.18, mobile ? 8 : 12), materials.glass[(index + 2) % 4]);
                        round.position.set(cx, cy, .025);
                        window.add(round);
                    }
                }
            }
            for (let facet = 0; facet < 8; facet++)
            {
                const angle = facet / 8 * Math.PI * 2;
                const center = [0, 6.9];
                const points = [center,
                    [Math.cos(angle) * .95, center[1] + Math.sin(angle) * .95],
                    [Math.cos(angle + Math.PI / 4) * .95, center[1] + Math.sin(angle + Math.PI / 4) * .95]];
                const geometry = polygon(points);
                window.add(new THREE.Mesh(geometry, materials.glass[(facet + bay) % 4]));
                window.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: "#29251f" })));
                design.push({ geometry, color: (facet + bay) % 4 });
            }
            const arch = new THREE.Shape();
            arch.moveTo(-1.7, 0);
            arch.lineTo(-1.7, 5.5);
            arch.quadraticCurveTo(-1.7, 7.6, 0, 8.1);
            arch.quadraticCurveTo(1.7, 7.6, 1.7, 5.5);
            arch.lineTo(1.7, 0);
            const outline = new THREE.EdgesGeometry(new THREE.ShapeGeometry(arch));
            window.add(new THREE.LineSegments(outline, new THREE.LineBasicMaterial({ color: "#d0bc99" })));
            windows.add(window);
            designs.push({ side, bay, design });
        }
    }
    const oculus = new THREE.Group();
    oculus.position.set(0, 14.6, -51.6);
    for (let facet = 0; facet < 16; facet++)
    {
        const a = facet * Math.PI / 8;
        const geometry = polygon([[0, 0], [Math.cos(a) * 3.65, Math.sin(a) * 3.65],
            [Math.cos(a + Math.PI / 8) * 3.65, Math.sin(a + Math.PI / 8) * 3.65]]);
        oculus.add(new THREE.Mesh(geometry, materials.glass[facet % 4]));
        oculus.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: "#29251f" })));
    }
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.7, .14, 8, 32), materials.ribs);
    oculus.add(ring);
    windows.add(oculus);
    windows.userData.lancets = 12;
    return { windows, designs };
}
