import * as THREE from "three";
import { GRID_SIZE } from "./game.js";

export const CELL_EDGE = 1.2;
export const LIP = 9.6;
export const WRAP_PERIOD = 19.2;
export const COLORS =
{
    void: "#07080A", floor: "#07100F", grid: "#1E4A42", hot: "#8CFFE0",
    body: "#2EE6A6", head: "#E9FFF8", copper: "#FF8A3D", cream: "#FFE6D0", rail: "#FF5D73"
};
const world = (value) => (value - 7.5) * CELL_EDGE;
const shortDelta = (value) => value > GRID_SIZE / 2 ? value - GRID_SIZE : value < -GRID_SIZE / 2 ? value + GRID_SIZE : value;
const lipWrap = (value) => value > LIP ? value - WRAP_PERIOD : value < -LIP ? value + WRAP_PERIOD : value;
const vertexShader = `
    varying vec3 vWorld;
    void main()
    {
        vec4 p = modelMatrix * vec4(position, 1.0);
        vWorld = p.xyz;
        gl_Position = projectionMatrix * viewMatrix * p;
    }
`;
const fragmentShader = `
    varying vec3 vWorld;
    uniform vec2 head;
    uniform vec2 bead;
    uniform float clock;
    uniform float breathe;
    uniform float hasBead;
    uniform vec3 floorColor;
    uniform vec3 gridColor;
    uniform vec3 hotColor;
    uniform vec3 copperColor;
    void main()
    {
        vec2 pos = vWorld.xz;
        vec2 nearest = abs(mod(pos + 9.6 + 0.6, 1.2) - 0.6);
        vec2 mask = 1.0 - smoothstep(vec2(0.0), max(fwidth(pos) * 1.6, vec2(0.002)), nearest);
        float inside = 1.0 - smoothstep(9.58, 9.64, max(abs(pos.x), abs(pos.y)));
        float hot = 1.0 - smoothstep(0.6, 5.2, distance(pos, head));
        float strength = mix(1.0, 0.94 + 0.06 * sin(clock * 1.3), breathe);
        vec3 color = floorColor + mix(gridColor, hotColor, hot) * max(mask.x, mask.y) * inside * strength;
        float pool = (1.0 - smoothstep(0.2, 2.0, distance(pos, bead))) * hasBead;
        color += copperColor * pool * 0.35;
        float fog = 1.0 - exp(-0.045 * 0.045 * pow(length(cameraPosition - vWorld), 2.0));
        gl_FragColor = vec4(mix(color, vec3(0.0021, 0.0024, 0.0030), fog), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
    }
`;

export class FloorScene
{
    constructor(canvas, reduced)
    {
        this.canvas = canvas;
        this.reduced = reduced;
        this.mobile = innerWidth < 800;
        const context = canvas.getContext("webgl2", { antialias: true, alpha: false });
        if (!context) throw Error("WebGL is unavailable");
        this.renderer = new THREE.WebGLRenderer({ canvas, context, antialias: true, alpha: false });
        this.renderer.setClearColor(COLORS.void);
        this.renderer.shadowMap.enabled = false;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.05;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(COLORS.void, 0.045);
        this.camera = new THREE.PerspectiveCamera(44, innerWidth / innerHeight, 0.1, 80);
        this.camera.up.set(0, 1, 0);
        this.look = new THREE.Vector3();
        this.scene.add(new THREE.AmbientLight("#10211C", 0.25));
        this.light = new THREE.PointLight("#D7FFF3", 4, 8, 2);
        this.scene.add(this.light);
        this.uniforms =
        {
            head: { value: new THREE.Vector2() },
            bead: { value: new THREE.Vector2() },
            clock: { value: 0 },
            breathe: { value: 1 },
            hasBead: { value: 1 },
            floorColor: { value: new THREE.Color(COLORS.floor) },
            gridColor: { value: new THREE.Color(COLORS.grid) },
            hotColor: { value: new THREE.Color(COLORS.hot) },
            copperColor: { value: new THREE.Color(COLORS.copper) }
        };
        this.floor = new THREE.Mesh(new THREE.PlaneGeometry(36, 36),
            new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms: this.uniforms }));
        this.floor.rotation.x = -Math.PI / 2;
        this.scene.add(this.floor);
        this.headGeometry = new THREE.CapsuleGeometry(0.38, 0.28, 8, 16);
        this.bodyGeometry = new THREE.CapsuleGeometry(0.32, 0.36, 8, 16);
        this.headMaterial = new THREE.MeshStandardMaterial(
        {
            color: "#D9FFF4", emissive: COLORS.head, emissiveIntensity: 2, roughness: 0.4, metalness: 0.08
        });
        this.bodyMaterial = new THREE.MeshStandardMaterial(
        {
            color: COLORS.body, emissive: COLORS.body, emissiveIntensity: 1.5, roughness: 0.4
        });
        this.meshes = [];
        this.born = [];
        this.food = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 16), new THREE.MeshStandardMaterial(
        {
            color: COLORS.cream, emissive: COLORS.copper, emissiveIntensity: 1.6, roughness: 0.25
        }));
        this.halo = new THREE.Mesh(new THREE.SphereGeometry(0.58, 24, 16), new THREE.MeshBasicMaterial(
        {
            color: COLORS.copper, transparent: true, opacity: 0.30, depthWrite: false, blending: THREE.AdditiveBlending
        }));
        this.scene.add(this.food, this.halo);
        this.rails = new THREE.Group();
        const railMaterial = new THREE.MeshStandardMaterial(
        {
            color: "#3A2428", emissive: COLORS.rail, emissiveIntensity: 0.55, roughness: 0.6
        });
        for (const sign of [-1, 1])
        {
            const horizontal = new THREE.Mesh(new THREE.BoxGeometry(19.2, 0.16, 0.12), railMaterial);
            horizontal.position.set(0, 0.08, sign * 9.66);
            const vertical = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 19.44), railMaterial);
            vertical.position.set(sign * 9.66, 0.08, 0);
            this.rails.add(horizontal, vertical);
        }
        this.scene.add(this.rails);
        this.lastFood = "";
        this.foodBorn = 0;
        this.deathAt = -10;
        this.qualityCut = false;
        this.slowDuration = 0;
        this.playDuration = 0;
        this.averageFrame = 0.016;
        this.resize();
        this.poseTitle(0);
    }

    resize()
    {
        this.mobile = innerWidth < 800;
        this.cap = Math.max(1, (this.mobile ? 1.25 : 1.75) - (this.qualityCut ? 0.25 : 0));
        this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.cap));
        this.renderer.setSize(innerWidth, innerHeight, false);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.fov = this.mobile ? 56 : 44;
        this.camera.updateProjectionMatrix();
    }

    poseTitle(time)
    {
        const phoneSheet = innerWidth < 900;
        const base = phoneSheet ? new THREE.Vector3(4.2, 12.4, 10.5) : new THREE.Vector3(6.2, 8.2, 10.8);
        const target = phoneSheet ? new THREE.Vector3(4.2, 0, 3.6) :
            new THREE.Vector3(innerWidth < 1300 ? 2 : 0.2, 0.25, 0.5);
        if (innerWidth <= 480) base.sub(target).multiplyScalar(1.25).add(target);
        const angle = this.reduced ? 0 : Math.sin(time * 0.22) * 0.08;
        base.sub(target).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle).add(target);
        this.camera.position.copy(base);
        this.look.copy(target);
        this.camera.lookAt(this.look);
    }

    draw(game, delta, time, phase, rawDelta)
    {
        this.rails.visible = game.rule === "walls";
        while (this.meshes.length > game.body.length)
        {
            this.scene.remove(this.meshes.pop());
            this.born.pop();
        }
        while (this.meshes.length < game.body.length)
        {
            const head = this.meshes.length === 0;
            const mesh = new THREE.Mesh(head ? this.headGeometry : this.bodyGeometry, head ? this.headMaterial : this.bodyMaterial);
            this.scene.add(mesh);
            this.meshes.push(mesh);
            this.born.push(game.state === "title" ? -1 : time);
        }
        const offset = game.state === "title" ? 0 : game.offset;
        const turn = game.queued || game.direction;
        game.body.forEach((cell, index) =>
        {
            const target = index ? game.body[index - 1] : cell.map((value, axis) => value + turn[axis]);
            const dx = shortDelta(target[0] - cell[0]);
            const dz = shortDelta(target[1] - cell[1]);
            let x = world(cell[0]) + dx * CELL_EDGE * offset;
            let z = world(cell[1]) + dz * CELL_EDGE * offset;
            if (game.rule === "wrap")
            {
                x = lipWrap(x);
                z = lipWrap(z);
            }
            const mesh = this.meshes[index];
            mesh.position.set(x, 0.4, z);
            mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dx, 0, dz).normalize());
            const age = Math.max(0, time - this.born[index]);
            mesh.scale.setScalar(this.reduced || index < 4 ? 1 : Math.min(1, 0.2 + age / 0.18 * 0.8));
        });
        const head = this.meshes[0].position;
        this.light.position.copy(head).y += 1.2;
        this.uniforms.head.value.set(head.x, head.z);
        this.uniforms.clock.value = time;
        this.uniforms.breathe.value = this.reduced ? 0 : 1;
        this.uniforms.hasBead.value = game.food ? 1 : 0;
        this.food.visible = this.halo.visible = Boolean(game.food);
        if (game.food)
        {
            const key = game.food.join(",");
            if (key !== this.lastFood)
            {
                this.lastFood = key;
                this.foodBorn = time;
            }
            const x = world(game.food[0]);
            const z = world(game.food[1]);
            this.food.position.set(x, 0.48, z);
            this.halo.position.copy(this.food.position);
            this.uniforms.bead.value.set(x, z);
            const pulse = phase < 0.09 ? phase / 0.09 : phase < 0.32 ? 1 - (phase - 0.09) / 0.23 : 0;
            const birth = Math.min(1, 0.6 + Math.max(0, time - this.foodBorn) / 0.09 * 0.4);
            this.food.scale.setScalar(this.reduced ? 1 : (1 + 0.2 * pulse) * birth);
            this.halo.scale.copy(this.food.scale);
            this.halo.material.opacity = this.reduced ? 0.32 : 0.28 + 0.28 * pulse;
        }
        if (game.state === "title") this.poseTitle(time);
        else if (game.state !== "paused")
        {
            const extra = game.state === "over" && !this.reduced ? 1.2 : 0;
            const desired = head.clone().add(this.mobile ? new THREE.Vector3(0, 10.2 + extra, 10.4) : new THREE.Vector3(0, 7.4 + extra, 8.2));
            const target = head.clone().add(this.mobile ? new THREE.Vector3(0, 0.3, -2.2) : new THREE.Vector3(0, 0.4, -1.6));
            this.camera.position.lerp(desired, 1 - Math.exp(-delta / (this.reduced ? 0.62 : 0.28)));
            this.look.lerp(target, 1 - Math.exp(-delta / (this.reduced ? 0.45 : 0.16)));
            this.camera.lookAt(this.look);
        }
        const flash = this.reduced ? 0 : Math.max(0, 1 - Math.abs(time - this.deathAt - 0.32) / 0.32);
        this.headMaterial.emissive.set(COLORS.head).lerp(new THREE.Color(COLORS.rail), flash);
        if (game.state === "playing" && !this.qualityCut)
        {
            this.playDuration += rawDelta;
            this.averageFrame = this.averageFrame * 0.95 + rawDelta * 0.05;
            this.slowDuration = this.playDuration > 2 && this.averageFrame > 0.028 ? this.slowDuration + rawDelta : 0;
            if (this.slowDuration >= 3)
            {
                this.qualityCut = true;
                this.resize();
            }
        }
        this.renderer.render(this.scene, this.camera);
    }

    dispose()
    {
        const geometries = new Set([this.headGeometry, this.bodyGeometry]);
        const materials = new Set([this.headMaterial, this.bodyMaterial]);
        this.scene.traverse((object) =>
        {
            if (object.geometry) geometries.add(object.geometry);
            if (object.material) materials.add(object.material);
        });
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());
        this.renderer.dispose();
    }
}
