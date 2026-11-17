import * as THREE from "three";
import { seeded, heightAt } from "./geometry.js";

export function createSnow(parent, mobile, reduced)
{
    const count = mobile ? 420 : 720;
    const position = new Float32Array(count * 3);
    const velocity = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const phase = new Float32Array(count);
    const settled = new Uint8Array(count);
    const random = seeded(587);
    let elapsed = 0;
    let sinceImpulse = 9;
    let remaining = 0;
    const geometry = new THREE.BufferGeometry();
    for (let i = 0; i < count; i++)
    {
        const k = i * 3;
        const angle = random() * Math.PI * 2;
        const radius = Math.sqrt(random()) * 1.42;
        position[k] = Math.cos(angle) * radius;
        position[k + 2] = Math.sin(angle) * radius;
        position[k + 1] = heightAt(position[k], position[k + 2]) + .025;
        size[i] = 2.1 + random() * 2.4;
        phase[i] = random() * Math.PI * 2;
        settled[i] = 1;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
    geometry.setAttribute("flakeSize", new THREE.BufferAttribute(size, 1));
    const snowMaterial = new THREE.ShaderMaterial(
    {
        transparent: true,
        depthWrite: false,
        uniforms: { pixelRatio: { value: 1 }, viewportScale: { value: 1 } },
        vertexShader: "attribute float flakeSize; uniform float pixelRatio; uniform float viewportScale; void main(){ vec4 p=modelViewMatrix*vec4(position,1.); gl_PointSize=clamp(flakeSize*pixelRatio*viewportScale*8./(-p.z),1.,7.); gl_Position=projectionMatrix*p; }",
        fragmentShader: "void main(){float d=length(gl_PointCoord-.5); float a=1.-smoothstep(.15,.5,d); if(a<.03) discard; gl_FragColor=vec4(.92,.97,.94,a*.9);}"
    });
    const points = new THREE.Points(geometry, snowMaterial);
    points.frustumCulled = false;
    points.renderOrder = 3;
    parent.add(points);
    function impulse(power = 1, dx = 0, dz = 0)
    {
        sinceImpulse = 0;
        for (let i = 0; i < count; i++)
        {
            const k = i * 3;
            settled[i] = 0;
            velocity[k] = Math.max(-1.6, Math.min(1.6, velocity[k] + (random() - .5) * power * 2 + dx));
            velocity[k + 2] = Math.max(-1.6, Math.min(1.6, velocity[k + 2] + (random() - .5) * power * 2 + dz));
            if (position[k + 1] < 2)
            {
                velocity[k + 1] = (.95 + random() * 1.3) * power;
            }
            else
            {
                velocity[k + 1] += .2 * power;
            }
        }
    }
    function rest()
    {
        for (let i = 0; i < count; i++)
        {
            const k = i * 3;
            const radius = Math.hypot(position[k], position[k + 2]);
            if (radius > 1.4)
            {
                position[k] *= 1.4 / radius;
                position[k + 2] *= 1.4 / radius;
            }
            position[k + 1] = heightAt(position[k], position[k + 2]) + .025;
            velocity[k] = velocity[k + 1] = velocity[k + 2] = 0;
            settled[i] = 1;
        }
        sinceImpulse = 9;
        remaining = 0;
        geometry.attributes.position.needsUpdate = true;
    }
    function calm()
    {
        sinceImpulse = Math.max(sinceImpulse, 4);
        for (let i = 0; i < count; i++)
        {
            velocity[i * 3] *= .2;
            velocity[i * 3 + 1] = Math.min(0, velocity[i * 3 + 1]);
            velocity[i * 3 + 2] *= .2;
        }
    }
    function step(dt, motionReduced)
    {
        elapsed += dt;
        sinceImpulse += dt;
        remaining = 0;
        for (let i = 0; i < count; i++)
        {
            if (settled[i]) continue;
            const k = i * 3;
            let x = position[k];
            let y = position[k + 1];
            let z = position[k + 2];
            const drift = motionReduced ? 0 : .055;
            velocity[k] = (velocity[k] + Math.sin(elapsed * 1.7 + phase[i] + z) * drift * dt) * .985;
            velocity[k + 2] = (velocity[k + 2] + Math.cos(elapsed + phase[i] + x) * drift * dt) * .985;
            velocity[k + 1] = (velocity[k + 1] - .34 * dt) * .985;
            // A finite flurry fades into terminal settling after its upward lift.
            if (sinceImpulse > 2.25)
            {
                velocity[k + 1] = Math.min(velocity[k + 1], -.35 - (sinceImpulse - 2.25) * .18);
            }
            x += velocity[k] * dt;
            y += velocity[k + 1] * dt;
            z += velocity[k + 2] * dt;
            const distance = Math.sqrt(x * x + (y - 3) ** 2 + z * z);
            if (distance > 2.1)
            {
                const nx = x / distance;
                const ny = (y - 3) / distance;
                const nz = z / distance;
                const dot = velocity[k] * nx + velocity[k + 1] * ny + velocity[k + 2] * nz;
                x = nx * 2.099;
                y = 3 + ny * 2.099;
                z = nz * 2.099;
                if (dot > 0)
                {
                    velocity[k] -= dot * nx * 1.35;
                    velocity[k + 1] -= dot * ny * 1.35;
                    velocity[k + 2] -= dot * nz * 1.35;
                }
            }
            const radius = Math.hypot(x, z);
            const floor = heightAt(x, z) + .025;
            if (y <= floor && radius <= 1.5)
            {
                y = floor;
                velocity[k + 1] = 0;
                velocity[k] *= .65;
                velocity[k + 2] *= .65;
                if (Math.abs(velocity[k]) + Math.abs(velocity[k + 2]) < .02)
                {
                    settled[i] = 1;
                }
            }
            else if (y < 1.85 && radius > 1.45)
            {
                velocity[k] -= x * 1.8 * dt;
                velocity[k + 2] -= z * 1.8 * dt;
            }
            position[k] = x;
            position[k + 1] = y;
            position[k + 2] = z;
            if (!settled[i]) remaining++;
        }
        geometry.attributes.position.needsUpdate = true;
    }
    if (!reduced)
    {
        for (let i = 0; i < count; i++)
        {
            const k = i * 3;
            const ceiling = 3 + Math.sqrt(Math.max(.1, 4.35 - position[k] ** 2 - position[k + 2] ** 2));
            position[k + 1] = 1.75 + random() * (ceiling - 1.8);
            settled[i] = 0;
            velocity[k + 1] = -.12;
        }
        sinceImpulse = 2;
    }
    function stats()
    {
        let outside = 0;
        let active = 0;
        let maxHeight = 0;
        for (let i = 0; i < count; i++)
        {
            const k = i * 3;
            if (Math.hypot(position[k], position[k + 1] - 3, position[k + 2]) > 2.102) outside++;
            if (!settled[i]) active++;
            maxHeight = Math.max(maxHeight, position[k + 1]);
        }
        return { count, active, outside, maxHeight, sinceImpulse };
    }
    return { count, points, step, impulse, calm, rest, stats, get active() { return remaining; } };
}
