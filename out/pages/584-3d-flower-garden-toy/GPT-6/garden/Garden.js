import * as THREE from "three";
import { OrbitControls } from "../vendor/OrbitControls.js";
import { content } from "../content.js";
import { terrain, heightAt, inside, mulberry32 } from "./geometry.js";
import { FlowerPools, grassPool } from "./instances.js";
import { bindInteractions } from "./interactions.js";
import { saveSnapshot } from "./snapshot.js";

export class Garden
{
    constructor(element, state, ui)
    {
        this.state = state;
        this.ui = ui;
        this.element = element;
        this.mobile = matchMedia("(max-width: 700px)").matches;
        this.motion = matchMedia("(prefers-reduced-motion: reduce)");
        this.reduced = this.motion.matches;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(content.colors.sky);
        this.camera = new THREE.PerspectiveCamera(38, 1, .1, 120);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.05;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.shadowMap.autoUpdate = false;
        this.renderer.setClearColor(content.colors.sky);
        this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.mobile ? 1.35 : 1.75));
        const canvas = this.renderer.domElement;
        canvas.tabIndex = 0;
        canvas.setAttribute("aria-label", content.labels.stage);
        canvas.setAttribute("role", "application");
        canvas.textContent = content.labels.fallback;
        element.append(canvas);
        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.target.set(0, .7, 0);
        this.controls.enableDamping = !this.reduced;
        this.controls.dampingFactor = .08;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 25;
        this.controls.minPolarAngle = .45;
        this.controls.maxPolarAngle = 1.25;
        this.controls.enablePan = false;
        this.controls.autoRotate = false;
        this.uniforms =
        {
            uTime: { value: 0 },
            uWind: { value: state.wind / 100 },
            uReduced: { value: this.reduced ? 1 : 0 }
        };
        this.scene.add(new THREE.HemisphereLight("#fffdf4", "#78956b", 2.2));
        const sun = new THREE.DirectionalLight("#fff1cf", 2.3);
        sun.position.set(-5, 14, 8);
        sun.castShadow = true;
        sun.shadow.mapSize.setScalar(this.mobile ? 1024 : 2048);
        Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 10, bottom: -10, near: .5, far: 40 });
        sun.shadow.normalBias = .035;
        sun.shadow.bias = -.0002;
        sun.shadow.radius = 3;
        this.scene.add(sun);
        this.ground = terrain(this.scene);
        this.pools = new FlowerPools(this.scene, this.uniforms);
        this.grass = grassPool(this.scene, this.uniforms, this.mobile);
        this.ring = this.makeRing();
        this.scene.add(this.ring);
        this.cursor = { x: 0, z: 1.8 };
        this.cameraDirty = false;
        this.controls.addEventListener("change", () =>
        {
            this.cameraDirty = true;
            this.recordCamera();
        });
        this.onMotionChange = () =>
        {
            this.reduced = this.motion.matches;
            this.uniforms.uReduced.value = this.reduced ? 1 : 0;
            this.controls.enableDamping = !this.reduced;
            this.render();
        };
        this.motion.addEventListener("change", this.onMotionChange);
        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(element);
        this.reset();
        this.unbindInteractions = bindInteractions(this);
        this.frame = this.frame.bind(this);
        this.frames = 0;
        this.frameTotal = 0;
        this.lastFrame = 0;
        this.onVisibility = () =>
        {
            if (document.hidden)
            {
                cancelAnimationFrame(this.raf);
                this.raf = null;
                this.lastFrame = 0;
            }
            else if (!this.raf)
            {
                this.raf = requestAnimationFrame(this.frame);
            }
        };
        document.addEventListener("visibilitychange", this.onVisibility);
        this.render();
        this.raf = requestAnimationFrame(this.frame);
    }

    makeRing()
    {
        const group = new THREE.Group();
        for (const [radius, color] of [[.25, content.colors.ink], [.23, content.colors.cream]])
        {
            const ring = new THREE.Mesh(new THREE.RingGeometry(radius, radius + .018, 48), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, depthWrite: false }));
            ring.rotation.x = -Math.PI / 2;
            ring.position.y = .024;
            group.add(ring);
        }
        for (let i = 0; i < 6; i++)
        {
            const dot = new THREE.Mesh(new THREE.CircleGeometry(.025, 8), new THREE.MeshBasicMaterial({ color: content.colors.cream, side: THREE.DoubleSide }));
            dot.rotation.x = -Math.PI / 2;
            const a = i * Math.PI / 3;
            dot.position.set(Math.cos(a) * .14, .028, Math.sin(a) * .14);
            group.add(dot);
        }
        group.visible = false;
        return group;
    }

    valid(x, z)
    {
        const stones = [[-5.8, -2.4], [-5.4, -2.9], [5, 2.6], [5.3, 2.25], [2, -4.4]];
        return inside(x, z, .65) &&
            !stones.some(([sx, sz]) => Math.hypot(sx - x, sz - z) < .7) &&
            !this.state.clumps.some((clump) => Math.hypot(clump.x - x, clump.z - z) < .42);
    }

    createClump(x, z, type)
    {
        const flowers = [];
        for (let i = 0; i < 6; i++)
        {
            const angle = (i - 1) / 5 * Math.PI * 2 + (this.random() - .5) * .3;
            const radius = i === 0 ? 0 : .32 + this.random() * .16;
            let fx = x + Math.cos(angle) * radius;
            let fz = z + Math.sin(angle) * radius;
            if (!inside(fx, fz, .15))
            {
                fx = x;
                fz = z;
            }
            flowers.push({ x: fx, z: fz, height: .65 + this.random() * .55, rotation: this.random() * Math.PI * 2, phase: this.random() * Math.PI * 2 });
        }
        return { x, z, type, flowers };
    }

    plant(x, z)
    {
        if (!this.valid(x, z))
        {
            this.ui.toast(content.toasts.invalid);
            return false;
        }
        if (this.state.clumps.length >= 120)
        {
            this.ui.toast(content.toasts.full);
            return false;
        }
        const clump = this.createClump(x, z, this.state.selectedFlower);
        this.state.clumps.push(clump);
        this.pools.add(clump, this.reduced ? -100 : this.uniforms.uTime.value);
        this.renderer.shadowMap.needsUpdate = true;
        this.ui.updateCount();
        this.ui.toast(content.toasts.planted);
        this.showRing(x, z);
        this.render();
        return true;
    }

    reset()
    {
        this.random = mulberry32(1207);
        this.state.clumps = [];
        this.pools.reset();
        this.state.selectedFlower = 0;
        this.state.wind = 35;
        this.uniforms.uWind.value = .35;
        for (let i = 0; i < 18; i++)
        {
            let x, z;
            do
            {
                x = (this.random() - .5) * 11.6;
                z = (this.random() - .5) * 7.7;
            }
            while (!this.valid(x, z) || this.state.clumps.some((c) => Math.hypot(c.x - x, c.z - z) < 1.14));
            const clump = this.createClump(x, z, i % 4);
            this.state.clumps.push(clump);
            this.pools.add(clump, -100);
        }
        this.cursor = { x: 0, z: 1.8 };
        this.ring.visible = false;
        const damping = this.controls.enableDamping;
        this.controls.enableDamping = false;
        this.controls.update();
        this.controls.reset();
        this.camera.position.set(10, 8.5, 12);
        this.controls.target.set(0, .7, 0);
        this.resize(true);
        this.controls.update();
        this.controls.saveState();
        this.controls.enableDamping = damping;
        this.renderer.shadowMap.needsUpdate = true;
        this.ui.sync();
        this.render();
    }

    showRing(x, z)
    {
        this.cursor.x = x;
        this.cursor.z = z;
        this.ring.position.set(x, heightAt(x, z), z);
        this.ring.visible = inside(x, z, 0);
        const valid = this.valid(x, z);
        this.ring.scale.setScalar(valid ? 1 : .75);
        for (const child of this.ring.children)
        {
            child.material.transparent = true;
            child.material.opacity = valid ? 1 : .35;
        }
    }

    setWind(value)
    {
        this.state.wind = value;
        this.uniforms.uWind.value = value / 100;
        this.ui.syncWind();
        this.render();
    }

    recordCamera()
    {
        this.state.camera =
        {
            position: this.camera.position.toArray(),
            target: this.controls.target.toArray()
        };
    }

    resize(resetCamera = false)
    {
        const { width, height } = this.element.getBoundingClientRect();
        if (!width || !height) return;
        const oldAspect = this.camera.aspect;
        this.camera.aspect = width / height;
        this.renderer.setSize(width, height, false);
        const portrait = width < 701;
        if (resetCamera || Math.abs(oldAspect - this.camera.aspect) > .3)
        {
            const direction = new THREE.Vector3(10, 7.8, 12).normalize();
            const fitDistance = portrait ? Math.max(26, 19.8 / this.camera.aspect) : 23.5;
            this.controls.maxDistance = portrait ? Math.max(25, fitDistance * 1.3) : 25;
            this.controls.minDistance = portrait ? fitDistance * .62 : 10;
            this.camera.position.copy(this.controls.target).addScaledVector(direction, fitDistance);
        }
        this.camera.setViewOffset(width, height, portrait ? width * .02 : -width * .065, portrait ? height * .02 : -height * .025, width, height);
        this.camera.updateProjectionMatrix();
        this.controls.update();
        this.recordCamera();
        this.render();
    }

    render()
    {
        this.renderer.render(this.scene, this.camera);
    }

    frame(now)
    {
        this.raf = null;
        if (document.hidden) return;
        this.uniforms.uTime.value = now / 1000;
        this.controls.update();
        this.render();
        if (this.lastFrame)
        {
            this.frames++;
            this.frameTotal += Math.min(now - this.lastFrame, 250);
            if (this.frames === 120)
            {
                this.averageFps = 1000 / (this.frameTotal / this.frames);
                if (this.averageFps < 45)
                {
                    this.renderer.setPixelRatio(Math.max(1, this.renderer.getPixelRatio() - .25));
                    if (!this.qualityReduced)
                    {
                        this.grass.count = Math.floor(this.grass.count * 2 / 3);
                        this.qualityReduced = true;
                    }
                    this.resize();
                }
                this.frames = 0;
                this.frameTotal = 0;
            }
        }
        this.lastFrame = now;
        this.raf = requestAnimationFrame(this.frame);
    }

    async snapshot()
    {
        return saveSnapshot(this);
    }

    dispose()
    {
        cancelAnimationFrame(this.raf);
        this.unbindInteractions();
        this.controls.dispose();
        this.resizeObserver.disconnect();
        this.motion.removeEventListener("change", this.onMotionChange);
        document.removeEventListener("visibilitychange", this.onVisibility);
        this.scene.traverse((object) =>
        {
            object.geometry?.dispose();
            if (object.material)
            {
                const materials = Array.isArray(object.material) ? object.material : [object.material];
                materials.forEach((material) => material.dispose());
            }
        });
        this.renderer.dispose();
    }
}
