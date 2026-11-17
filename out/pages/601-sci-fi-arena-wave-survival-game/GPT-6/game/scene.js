import * as T from "../vendor/three.module.min.js";

export { T };

export class Yard
{
    constructor(canvas)
    {
        this.canvas = canvas;
        this.world = new T.Scene();
        this.world.background = new T.Color("#100F0C");
        this.world.fog = new T.Fog("#100F0C", 16, 40);
        this.camera = new T.PerspectiveCamera(72, 1, 0.08, 70);
        this.camera.rotation.order = "YXZ";
        this.world.add(this.camera);
        this.solids = [];
        this.colliders = [];
        this.effects = [];
        this.ray = new T.Raycaster();
        this.renderer = new T.WebGLRenderer({ canvas, antialias: true });
        this.renderer.toneMapping = T.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.renderer.setClearColor("#100F0C");
        this.renderer.shadowMap.type = T.PCFSoftShadowMap;
        this.materials = {};
        for (const [name, color, roughness, metalness] of [
            ["floor", "#1A1915", 0.94, 0],
            ["panel", "#14130F", 0.94, 0],
            ["crate", "#3A342C", 0.82, 0],
            ["dark", "#2E2B26", 0.82, 0],
            ["steel", "#4A463E", 0.48, 0.45],
            ["black", "#100F0C", 0.9, 0]])
        {
            this.materials[name] = new T.MeshStandardMaterial({ color, roughness, metalness });
        }
        this.construct();
        this.resize();
        window.addEventListener("resize", () => this.resize());
    }

    box(position, size, material, collision = true, solid = true, parent = this.world)
    {
        const mesh = new T.Mesh(new T.BoxGeometry(...size), typeof material === "string" ? this.materials[material] : material);
        mesh.position.set(...position);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        parent.add(mesh);
        if (solid) this.solids.push(mesh);
        if (collision) this.colliders.push(new T.Box3().setFromObject(mesh));
        return mesh;
    }

    construct()
    {
        this.box([0, -0.125, 0], [28, 0.25, 22], "floor", false).castShadow = false;
        for (const z of [-11.35, 11.35]) this.box([0, 2.2, z], [29.4, 4.4, 0.7], "crate");
        for (const x of [-14.35, 14.35])
        {
            for (const z of [-6.15, 6.15]) this.box([x, 2.2, z], [0.7, 4.4, 9.7], "crate");
            this.box([x, 3.65, 0], [0.7, 1.5, 2.6], "crate");
            this.box([x < 0 ? -14.8 : 14.8, 1.45, 0], [0.12, 2.9, 2.6], "black");
        }
        for (let index = 0; index < 8; index++)
        {
            this.box([index % 2 ? 7 : -7, 0.01, -8.3 + Math.floor(index / 2) * 5.2], [12.4, 0.02, 4.5], "panel", false, false).castShadow = false;
        }
        const crates = [
            [[-6.2, 0.65, -2.2], [1.5, 1.3, 1.5]],
            [[-6.2, 1.75, -2.2], [1.05, 0.9, 1.05]],
            [[5.6, 0.85, -5.2], [2.3, 1.7, 1.25]],
            [[1.8, 0.45, 1.6], [1.25, 0.9, 1.25]],
            [[-2.4, 0.6, -6.4], [1.9, 1.2, 1]],
            [[7.2, 1.05, 2.6], [1.35, 2.1, 1.35]],
            [[-8.4, 0.5, 3.8], [1.7, 1, 1.7]]
        ];
        crates.forEach(([position, size], index) => this.box(position, size, index % 2 ? "dark" : "crate"));
        for (const [position, size] of [
            [[0.2, 0.52, -0.6], [3.4, 1.05, 0.45]],
            [[-4.2, 0.52, 4.6], [0.45, 1.05, 2.8]],
            [[6.4, 0.48, -1.2], [2.6, 0.95, 0.4]]])
        {
            this.box(position, size, "dark");
        }
        this.box([0, 3.15, -9.7], [18, 0.22, 1.5], "steel", false);
        this.box([0, 3.8, -8.95], [18, 0.09, 0.09], "steel", false);
        for (const x of [-8, -2.5, 3.5, 8])
        {
            this.box([x, 1.52, -9.7], [0.28, 3.04, 0.28], "steel");
            this.box([x, 3.45, -8.95], [0.07, 0.65, 0.07], "steel", false);
        }
        const lampMaterial = new T.MeshStandardMaterial(
        {
            color: "#FFC27A", emissive: "#FFC27A", emissiveIntensity: 1.6
        });
        const lighting = 4.8;
        for (const x of [-10.5, 10.5])
        {
            for (const z of [-8.2, 7.4])
            {
                this.box([x, 1.85, z], [0.14, 3.7, 0.14], "dark");
                this.box([x, 3.7, z], [0.55, 0.22, 0.34], lampMaterial, false);
                const light = new T.PointLight("#E8A15A", 25 * lighting, 18, 2);
                light.position.set(x, 3.65, z);
                this.world.add(light);
            }
        }
        this.world.add(new T.HemisphereLight("#3A342C", "#0C0B09", 0.55 * lighting));
        const sunlight = new T.DirectionalLight("#F3D7B0", 0.85 * lighting);
        sunlight.position.set(12, 18, 8);
        sunlight.castShadow = true;
        sunlight.shadow.mapSize.set(1024, 1024);
        sunlight.shadow.bias = -0.0003;
        sunlight.shadow.normalBias = 0.035;
        Object.assign(sunlight.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 0.5, far: 60 });
        this.world.add(sunlight);
    }

    blocked(x, z, radius = 0.36, height = 0)
    {
        if (Math.abs(x) > 14 - radius || Math.abs(z) > 11 - radius) return true;
        return this.colliders.some((box) => box.max.y > height &&
            x > box.min.x - radius && x < box.max.x + radius &&
            z > box.min.z - radius && z < box.max.z + radius);
    }

    segment(start, end)
    {
        const direction = end.clone().sub(start);
        this.ray.set(start, direction.clone().normalize());
        this.ray.near = 0;
        this.ray.far = direction.length();
        this.world.updateMatrixWorld(true);
        return this.ray.intersectObjects(this.solids, false)[0];
    }

    burst(position, count, distance, duration, colors)
    {
        const positions = new Float32Array(count * 3);
        const shades = new Float32Array(count * 3);
        const velocities = [];
        for (let index = 0; index < count; index++)
        {
            position.toArray(positions, index * 3);
            new T.Color(colors[index % colors.length]).toArray(shades, index * 3);
            velocities.push(new T.Vector3(Math.random() - 0.5, Math.random() - 0.25, Math.random() - 0.5).normalize().multiplyScalar(distance / duration));
        }
        const geometry = new T.BufferGeometry();
        geometry.setAttribute("position", new T.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new T.BufferAttribute(shades, 3));
        const material = new T.PointsMaterial({ size: 0.055, vertexColors: true, transparent: true, depthWrite: false });
        const points = new T.Points(geometry, material);
        this.world.add(points);
        this.effects.push({ mesh: points, remaining: duration, duration, velocities });
    }

    tracer(start, end)
    {
        const length = start.distanceTo(end);
        const mesh = new T.Mesh(new T.BoxGeometry(0.018, 0.018, length), new T.MeshBasicMaterial({ color: "#3EE0D2", transparent: true, opacity: 0.9 }));
        mesh.position.copy(start).add(end).multiplyScalar(0.5);
        mesh.lookAt(end);
        this.world.add(mesh);
        this.effects.push({ mesh, remaining: 0.06, duration: 0.06 });
    }

    clearEffects()
    {
        for (const effect of this.effects) this.disposeEffect(effect);
        this.effects = [];
    }

    disposeEffect(effect)
    {
        this.world.remove(effect.mesh);
        effect.mesh.geometry.dispose();
        effect.mesh.material.dispose();
    }

    updateEffects(delta)
    {
        for (let index = this.effects.length - 1; index >= 0; index--)
        {
            const effect = this.effects[index];
            effect.remaining -= delta;
            if (effect.remaining <= 0)
            {
                this.disposeEffect(effect);
                this.effects.splice(index, 1);
                continue;
            }
            effect.mesh.material.opacity = effect.remaining / effect.duration;
            if (effect.velocities)
            {
                const attribute = effect.mesh.geometry.attributes.position;
                effect.velocities.forEach((velocity, slot) =>
                {
                    attribute.setXYZ(slot,
                        attribute.getX(slot) + velocity.x * delta,
                        attribute.getY(slot) + velocity.y * delta,
                        attribute.getZ(slot) + velocity.z * delta);
                });
                attribute.needsUpdate = true;
            }
        }
    }

    resize()
    {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1.25 : 1.5));
        this.renderer.setSize(width, height, false);
        this.renderer.shadowMap.enabled = innerWidth >= 768;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    render()
    {
        this.renderer.render(this.world, this.camera);
    }
}
