import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { mulberry32 } from "./levels.js";

const colors = { c: 0x1EC8B8, s: 0x7DFFB2, i: 0x9AD7FF, l: 0xE4F27A };
export class Arena
{
    constructor(canvas, sim)
    {
        this.sim = sim;
        this.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
        this.renderer.setClearColor(0x07110F);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.02;
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x07110F, 28, 70);
        this.world = new THREE.Group();
        this.world.scale.x = -1;
        this.scene.add(this.world);
        this.camera = new THREE.PerspectiveCamera(44, 1, .1, 200);
        this.scene.add(new THREE.HemisphereLight(0xB7E6DC, 0x0C1714, .55));
        const key = new THREE.DirectionalLight(0xF2FFF8, 1.35);
        key.position.set(2.5, 9, -4);
        this.scene.add(key);
        const fill = new THREE.DirectionalLight(0x1EC8B8, .35);
        fill.position.set(-6, 3, 8);
        this.scene.add(fill);
        const sky = new THREE.Mesh(new THREE.SphereGeometry(80, 32, 24), new THREE.ShaderMaterial(
        {
            side: THREE.BackSide,
            uniforms: { top: { value: new THREE.Color(0x07110F) }, rim: { value: new THREE.Color(0x1C6B62) } },
            vertexShader: "varying vec3 vWorld; void main(){vWorld=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
            fragmentShader: "uniform vec3 top;uniform vec3 rim;varying vec3 vWorld;void main(){float h=normalize(vWorld-vec3(0.,-8.,10.)).y;gl_FragColor=vec4(mix(rim,top,smoothstep(-.10,.32,h)),1.);}"
        }));
        sky.position.set(0, -8, 10);
        this.scene.add(sky);
        const random = mulberry32(5704843);
        const positions = [];
        for (let i = 0; i < 70; i++)
        {
            const theta = random() * Math.PI * 2;
            const y = 3 + random() * 45;
            const r = Math.sqrt(55 ** 2 - y ** 2);
            positions.push(Math.cos(theta) * r, y, 10 + Math.sin(theta) * r);
        }
        const stars = new THREE.BufferGeometry();
        stars.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        this.scene.add(new THREE.Points(stars, new THREE.PointsMaterial({ color: 0xD7EFE8, size: .09, sizeAttenuation: true })));
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 28), new THREE.MeshStandardMaterial({ color: 0x0C1714, roughness: .8 }));
        floor.rotation.x = -Math.PI / 2;
        floor.position.z = 10;
        this.world.add(floor);
        const grid = [];
        for (let x = -8; x <= 8; x++) grid.push(x, .015, 0, x, .015, 20);
        for (let z = 0; z <= 20; z++) grid.push(-8, .015, z, 8, .015, z);
        const gridGeometry = new THREE.BufferGeometry();
        gridGeometry.setAttribute("position", new THREE.Float32BufferAttribute(grid, 3));
        this.world.add(new THREE.LineSegments(gridGeometry, new THREE.LineBasicMaterial({ color: 0x24584F, transparent: true, opacity: .8 })));
        this.box(.14, .18, 20.2, -7.72, .1, 10.1, 0x12312C, 0x1EC8B8, .45);
        this.box(.14, .18, 20.2, 7.72, .1, 10.1, 0x12312C, 0x1EC8B8, .45);
        this.box(15.4, 2.6, .06, 0, 1.3, 19.7, 0x12312C);
        this.box(15.4, .12, .16, 0, 1.15, 19.55, 0xE4F27A, 0xE4F27A, .35);
        this.bar = this.box(2.56, .18, .46, 0, .36, 1.35, 0xE7F3EE, 0x1EC8B8, .25);
        this.tick = this.box(.14, .22, .5, 0, .36, 1.35, 0xFF4D1C, 0xFF4D1C, .7);
        this.box(.42, .78, .28, 8.55, .56, 6.4, 0xC5D2CB);
        this.box(.12, .3, .13, 8.43, .15, 6.4, 0xC5D2CB);
        this.box(.12, .3, .13, 8.67, .15, 6.4, 0xC5D2CB);
        const head = new THREE.Mesh(new THREE.SphereGeometry(.16, 16, 12), new THREE.MeshStandardMaterial({ color: 0xE6C4A4 }));
        head.position.set(8.55, 1.12, 6.4);
        this.world.add(head);
        this.box(.28, .08, .28, 8.55, 1.28, 6.4, 0x1EC8B8);
        this.brickGeometry = new THREE.BoxGeometry(1.28, .42, .58);
        this.materials = Object.fromEntries(Object.entries(colors).map(([k, color]) => [k, new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: .35, roughness: .4, metalness: .08 })]));
        this.ballGeometry = new THREE.SphereGeometry(.2, 16, 12);
        this.ballMaterial = new THREE.MeshStandardMaterial({ color: 0xFF4D1C, emissive: 0xFF4D1C, emissiveIntensity: .85, roughness: .32, metalness: .04 });
        this.ballMeshes = [];
        this.pickupMeshes = new Map();
        this.particles = [];
        this.shatterGeometry = new THREE.BoxGeometry(1, 1, 1);
        this.trailGeometry = new THREE.SphereGeometry(.06, 6, 4);
        this.trails = [];
        for (let i = 0; i < 50; i++)
        {
            const mesh = new THREE.Mesh(this.trailGeometry, new THREE.MeshBasicMaterial({ color: 0xFF4D1C, transparent: true, opacity: .35 * (1 - (i % 10) / 10) }));
            mesh.visible = false;
            this.world.add(mesh);
            this.trails.push(mesh);
        }
        this.beamMesh = this.box(.06, .06, 1, 0, .52, 5, 0xFF4D1C, 0xFF4D1C, 1);
        this.beamMesh.visible = false;
        this.composer = null;
        this.follow = 0;
        this.shake = 0;
        this.frameTimes = [];
        this.cut = false;
        this.rebuild();
        this.resize();
    }

    box(w, h, d, x, y, z, color, emissive = color, emissiveIntensity = 0)
    {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity }));
        mesh.position.set(x, y, z);
        this.world.add(mesh);
        return mesh;
    }

    rebuild()
    {
        for (const mesh of this.brickMeshes || []) this.world.remove(mesh);
        this.brickMeshes = this.sim.bricks.map(b =>
        {
            const mesh = new THREE.Mesh(this.brickGeometry, this.materials[b.type]);
            mesh.position.set(b.x, .52, b.z);
            this.world.add(mesh);
            return mesh;
        });
        for (const p of this.particles) this.world.remove(p.mesh);
        this.particles = [];
        for (const mesh of this.pickupMeshes.values()) this.removePickup(mesh);
        this.pickupMeshes.clear();
    }

    break(brick)
    {
        if (this.reduced) return;
        this.shake = .1;
        const rand = mulberry32(this.sim.round * 1000 + brick.row * 10 + brick.col);
        for (let i = 0; i < 14 && this.particles.length < 160; i++)
        {
            const mesh = new THREE.Mesh(this.shatterGeometry, this.materials[brick.lime ? "i" : brick.type]);
            mesh.scale.setScalar(.05 + rand() * .08);
            mesh.position.set(brick.x, .52, brick.z);
            const angle = rand() * Math.PI * 2;
            const speed = 1.4 + rand() * 2;
            this.particles.push({ mesh, vx: Math.cos(angle) * speed, vy: 1.2 + rand() * 1.8, vz: Math.sin(angle) * speed, life: .5 });
            this.world.add(mesh);
        }
    }

    removePickup(group)
    {
        this.world.remove(group);
        group.traverse(object =>
        {
            if (object.geometry) object.geometry.dispose();
            if (object.material) object.material.dispose();
        });
    }

    resize()
    {
        this.mobile = innerWidth < 800;
        this.renderer.setPixelRatio(this.cut ? 1 : Math.min(devicePixelRatio, this.mobile ? 1.25 : 1.75));
        this.renderer.setSize(innerWidth, innerHeight);
        if (!this.mobile && !this.cut && !this.composer)
        {
            this.composer = new EffectComposer(this.renderer);
            this.composer.addPass(new RenderPass(this.scene, this.camera));
            this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), .25, .32, .82));
            this.composer.addPass(new OutputPass());
        }
        if ((this.mobile || this.cut) && this.composer)
        {
            this.composer.dispose();
            this.composer = null;
        }
        this.composer?.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
    }

    render(dt, time)
    {
        const s = this.sim;
        const start = ["start", "controls"].includes(s.state) && !s.started;
        const mobileStart = this.mobile && start;
        this.camera.fov = this.mobile ? 60 : 44;
        this.camera.position.set(0, this.mobile ? 32 : 8, this.mobile ? -6 : -11);
        this.follow += ((this.reduced ? 0 : start ? Math.sin(time * Math.PI / 4) * .04 : -Math.max(-1.1, Math.min(1.1, s.bar * .18))) - this.follow) * (1 - Math.exp(-4 * dt));
        this.camera.position.x = this.follow;
        if (this.shake > 0 && !this.reduced)
        {
            this.camera.position.x += .045 * (this.shake / .1) * Math.sin(time * 180);
            this.shake = Math.max(0, this.shake - dt);
        }
        this.camera.lookAt(0, .7, this.mobile ? 9 : 12.5);
        if (mobileStart) this.camera.setViewOffset(innerWidth, innerHeight, 0, innerHeight * .20, innerWidth, innerHeight);
        else this.camera.clearViewOffset();
        this.camera.updateProjectionMatrix();
        this.bar.position.x = this.tick.position.x = s.bar;
        this.bar.scale.x = s.halfWidth / 1.28;
        this.brickMeshes.forEach((mesh, i) =>
        {
            const brick = s.bricks[i];
            mesh.visible = brick.hp > 0;
            mesh.material = this.materials[brick.lime && brick.hp === 1 ? "i" : brick.type];
        });
        while (this.ballMeshes.length < s.balls.length)
        {
            const mesh = new THREE.Mesh(this.ballGeometry, this.ballMaterial);
            mesh.add(new THREE.PointLight(0xFF4D1C, 1.5, 6, 2));
            this.world.add(mesh);
            this.ballMeshes.push(mesh);
        }
        this.ballMeshes.forEach((mesh, i) =>
        {
            const b = s.balls[i];
            mesh.visible = !!b;
            if (b) mesh.position.set(b.x, .52, b.z);
        });
        this.trails.forEach((mesh, i) =>
        {
            const b = s.balls[Math.floor(i / 10)];
            const p = b?.trail[i % 10];
            mesh.visible = !!p && !this.reduced && !b.held;
            if (p) mesh.position.set(p.x, .52, p.z);
        });
        for (const [p, mesh] of this.pickupMeshes)
        {
            if (!s.pickups.includes(p))
            {
                this.removePickup(mesh);
                this.pickupMeshes.delete(p);
            }
        }
        for (const p of s.pickups)
        {
            if (!this.pickupMeshes.has(p))
            {
                const group = new THREE.Group();
                if (p.type === "scatter")
                {
                    for (let j = -1; j <= 1; j++)
                    {
                        const mesh = new THREE.Mesh(new THREE.SphereGeometry(.08, 10, 8), this.ballMaterial.clone());
                        mesh.position.x = j * .18;
                        group.add(mesh);
                    }
                }
                else group.add(new THREE.Mesh(new THREE.BoxGeometry(p.type === "girder" ? .65 : .08, p.type === "girder" ? .12 : .36, .36), new THREE.MeshStandardMaterial({ color: p.type === "girder" ? 0xE4F27A : 0xFFD2C2, emissive: p.type === "girder" ? 0xE4F27A : 0xFFD2C2, emissiveIntensity: .5 })));
                this.world.add(group);
                this.pickupMeshes.set(p, group);
            }
            this.pickupMeshes.get(p).position.set(p.x, .52 + (this.reduced ? 0 : Math.sin(s.clock * 1.8 * Math.PI * 2) * .05), p.z);
        }
        const effectStep = ["start", "controls", "paused", "fail", "win"].includes(s.state) ? 0 : dt;
        for (const p of [...this.particles])
        {
            p.life -= effectStep;
            p.vy -= 6.5 * effectStep;
            p.mesh.position.x += p.vx * effectStep;
            p.mesh.position.y += p.vy * effectStep;
            p.mesh.position.z += p.vz * effectStep;
            p.mesh.rotation.x += effectStep * 4;
            if (p.life <= 0)
            {
                this.world.remove(p.mesh);
                this.particles.splice(this.particles.indexOf(p), 1);
            }
        }
        this.beamMesh.visible = !!s.beam;
        if (s.beam)
        {
            this.beamMesh.position.set(s.beam.x, .52, (1.75 + s.beam.z) / 2);
            this.beamMesh.scale.z = s.beam.z - 1.75;
        }
        if (!this.cut && this.frameTimes.length < 180)
        {
            this.frameTimes.push(dt * 1000);
            if (this.frameTimes.length === 180 && this.frameTimes.reduce((a, b) => a + b) / 180 > 22)
            {
                this.cut = true;
                this.resize();
            }
        }
        if (!this.mobile && !this.cut) this.composer.render();
        else this.renderer.render(this.scene, this.camera);
    }
}
