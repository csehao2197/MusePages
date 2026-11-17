import * as THREE from "three";
import { content } from "../content.js";
import { flowerGeometry, heightAt, inside, mulberry32 } from "./geometry.js";

function windMaterial(color, uniforms, petals = false)
{
    const material = new THREE.MeshStandardMaterial({ color, roughness: .88, side: THREE.DoubleSide });
    material.onBeforeCompile = (shader) =>
    {
        Object.assign(shader.uniforms, uniforms);
        shader.vertexShader = `
            attribute float aBirth;
            attribute float aPhase;
            attribute float aHeight;
            attribute float aGrowth;
            uniform float uTime;
            uniform float uWind;
            uniform float uReduced;
            varying float vVariation;
            ${shader.vertexShader}`;
        shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", `
            #include <begin_vertex>
            float age = max(0.0, uTime - aBirth);
            float stemT = uReduced > 0.5 ? 1.0 : clamp(age / 0.480, 0.0, 1.0);
            float grown = 1.0 - pow(1.0 - stemT, 3.0);
            float petalT = uReduced > 0.5 ? 1.0 : clamp((age - 0.480) / 0.360, 0.0, 1.0);
            float back = petalT - 1.0;
            float opened = clamp(1.0 + 2.70158 * back * back * back + 1.70158 * back * back, 0.0, 1.0);
            ${petals ? `
                transformed -= vec3(0.0, 0.98, 0.0);
                float angle = (1.0 - opened) * 0.65;
                transformed.xz = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * transformed.xz;
                transformed *= opened;
                transformed += vec3(0.0, 0.98, 0.0);
            ` : ""}
            transformed *= grown;
            vVariation = 0.94 + 0.06 * sin(aPhase);
        `);
        shader.vertexShader = shader.vertexShader.replace("#include <project_vertex>", `
            vec4 mvPosition = vec4(transformed, 1.0);
            #ifdef USE_INSTANCING
                mvPosition = instanceMatrix * mvPosition;
                float localHeight = max(0.0, mvPosition.y - instanceMatrix[3].y);
                float field = uReduced > 0.5
                    ? 0.20
                    : sin(uTime * 1.25 + instanceMatrix[3].x * 0.55 + instanceMatrix[3].z * 0.34 + aPhase * 0.25)
                    + 0.35 * sin(uTime * 2.17 + aPhase);
                float bend = field * uWind * 0.25 * pow(localHeight / max(aHeight, 0.2), 1.6) * aGrowth;
                mvPosition.x += bend;
                mvPosition.z += bend * 0.38;
            #endif
            mvPosition = modelViewMatrix * mvPosition;
            gl_Position = projectionMatrix * mvPosition;
        `);
        shader.fragmentShader = `varying float vVariation;\n${shader.fragmentShader}`;
        shader.fragmentShader = shader.fragmentShader.replace("#include <color_fragment>", "#include <color_fragment>\ndiffuseColor.rgb *= vVariation;");
    };
    material.customProgramCacheKey = () => `meadow-wind-${petals}`;
    return material;
}

function attributes(geometry, capacity)
{
    for (const key of ["aBirth", "aPhase", "aHeight", "aGrowth"])
    {
        geometry.setAttribute(key, new THREE.InstancedBufferAttribute(new Float32Array(capacity), 1).setUsage(THREE.DynamicDrawUsage));
    }
}

export class FlowerPools
{
    constructor(scene, uniforms)
    {
        this.types = [];
        this.dummy = new THREE.Object3D();
        const zero = new THREE.Matrix4().makeScale(0, 0, 0);
        for (let type = 0; type < 4; type++)
        {
            const geometry = flowerGeometry(type);
            const pool = { count: 0, parts: [] };
            for (const [part, shape] of Object.entries(geometry))
            {
                attributes(shape, 720);
                const color = part === "stem" ? "#526C59" : part === "leaves" ? "#62814e" : part === "center" ? content.colors.sun : content.flowers[type].color;
                const mesh = new THREE.InstancedMesh(shape, windMaterial(color, uniforms, part === "petals" || part === "center"), 720);
                mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
                mesh.frustumCulled = false;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                for (let i = 0; i < 720; i++) mesh.setMatrixAt(i, zero);
                mesh.count = 0;
                scene.add(mesh);
                pool.parts.push(mesh);
            }
            this.types.push(pool);
        }
    }

    reset()
    {
        for (const pool of this.types)
        {
            pool.count = 0;
            for (const mesh of pool.parts) mesh.count = 0;
        }
    }

    add(clump, birth)
    {
        const pool = this.types[clump.type];
        for (let i = 0; i < clump.flowers.length; i++)
        {
            const flower = clump.flowers[i];
            const index = pool.count++;
            this.dummy.position.set(flower.x, heightAt(flower.x, flower.z), flower.z);
            this.dummy.rotation.set(0, flower.rotation, 0);
            this.dummy.scale.setScalar(flower.height);
            this.dummy.updateMatrix();
            for (const mesh of pool.parts)
            {
                mesh.setMatrixAt(index, this.dummy.matrix);
                mesh.instanceMatrix.needsUpdate = true;
                const values = { aBirth: birth + i * .055, aPhase: flower.phase, aHeight: flower.height, aGrowth: 1 };
                for (const [key, value] of Object.entries(values))
                {
                    mesh.geometry.attributes[key].setX(index, value);
                    mesh.geometry.attributes[key].needsUpdate = true;
                }
                mesh.count = pool.count;
            }
        }
    }
}

export function grassPool(scene, uniforms, mobile)
{
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute([-.018, 0, 0, .018, 0, 0, -.011, .16, 0, .009, .16, 0, .03, .32, 0], 3));
    geometry.setIndex([0, 1, 2, 1, 3, 2, 2, 3, 4]);
    geometry.computeVertexNormals();
    const count = mobile ? 900 : 1800;
    attributes(geometry, count);
    const mesh = new THREE.InstancedMesh(geometry, windMaterial("#75975e", uniforms), count);
    mesh.frustumCulled = false;
    const random = mulberry32(7824);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++)
    {
        let x, z;
        do
        {
            x = (random() - .5) * 14;
            z = (random() - .5) * 11;
        }
        while (!inside(x, z, .14));
        dummy.position.set(x, heightAt(x, z) - .01, z);
        dummy.rotation.set(0, random() * Math.PI * 2, 0);
        const h = .6 + random() * .7;
        dummy.scale.set(1, h, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        geometry.attributes.aBirth.setX(i, -100);
        geometry.attributes.aPhase.setX(i, random() * Math.PI * 2);
        geometry.attributes.aHeight.setX(i, .32 * h);
        geometry.attributes.aGrowth.setX(i, .22);
    }
    scene.add(mesh);
    return mesh;
}
