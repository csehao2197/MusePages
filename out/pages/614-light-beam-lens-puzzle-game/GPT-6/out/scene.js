import * as THREE from "./vendor/three.module.js";
import { content } from "./content.js";
import { steps } from "./trace.js";

const colors = { mint: 0x9afde0, blue: 0x82c9ff, edge: 0x2a4850, tile: 0x173038 };
const material = (color, options = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0.2, ...options });

function release(group)
{
    const geometries = new Set();
    const materials = new Set();
    group.traverse((object) =>
    {
        if (object.geometry) geometries.add(object.geometry);
        for (const item of Array.isArray(object.material) ? object.material : [object.material])
        {
            if (item) materials.add(item);
        }
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((item) => item.dispose());
    group.clear();
}

function mesh(group, geometry, surface, x = 0, y = 0, z = 0)
{
    const object = new THREE.Mesh(geometry, surface);
    object.position.set(x, y, z);
    group.add(object);
    return object;
}

function ring(group, radius, color, height, opacity = 1)
{
    const object = mesh(group, new THREE.TorusGeometry(radius, 0.012, 5, 48),
        new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity }), 0, height, 0);
    object.rotation.x = Math.PI / 2;
    return object;
}

function cylinderBetween(group, from, to, radius, surface)
{
    const vector = to.clone().sub(from);
    const object = mesh(group, new THREE.CylinderGeometry(radius, radius, vector.length(), 8), surface);
    object.position.copy(from.clone().add(to).multiplyScalar(0.5));
    object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vector.normalize());
    return object;
}

function arrow(group, direction, height, color, offset = 0)
{
    const [dx, dz] = steps[direction];
    const center = new THREE.Vector3(dx * offset, height, dz * offset);
    const tip = center.clone().add(new THREE.Vector3(dx * 0.2, 0, dz * 0.2));
    const base = center.clone().add(new THREE.Vector3(-dx * 0.09, 0, -dz * 0.09));
    const surface = new THREE.MeshBasicMaterial({ color });
    cylinderBetween(group, base, tip, 0.012, surface);
    for (const sign of [-1, 1])
    {
        const tail = tip.clone().add(new THREE.Vector3(-dx * 0.1 + dz * sign * 0.08, 0, -dz * 0.1 - dx * sign * 0.08));
        cylinderBetween(group, tip, tail, 0.012, surface);
    }
}

export class CrystalScene
{
    constructor(element, onRotate, onHover)
    {
        this.element = element;
        this.onRotate = onRotate;
        this.onHover = onHover;
        this.reduced = matchMedia("(prefers-reduced-motion: reduce)");
        this.mobile = matchMedia("(max-width: 700px)");
        this.rotatables = [];
        this.hitAreas = [];
        this.animations = [];
        this.frame = 0;
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x09191c, 0.027);
        this.camera = new THREE.OrthographicCamera(-4, 4, 4, -4, 0.1, 100);
        this.camera.position.set(8, 10, 8);
        this.camera.lookAt(0, 0, 0);
        this.camera.updateMatrixWorld();
        this.world = new THREE.Group();
        this.beams = new THREE.Group();
        this.selection = new THREE.Group();
        this.scene.add(this.world, this.beams, this.selection);
        this.scene.add(new THREE.HemisphereLight(0xbdeae3, 0x0b191e, 2.4));
        const light = new THREE.DirectionalLight(0xadd9e1, 3.2);
        light.position.set(-4, 9, 3);
        this.scene.add(light);
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        const context = document.createElement("canvas");
        const gl = context.getContext("webgl2", { antialias: true, alpha: true });
        if (!gl)
        {
            element.innerHTML = `<p class="fallback">${content.unavailable}</p>`;
            return;
        }
        try
        {
            this.renderer = new THREE.WebGLRenderer({ canvas: context, context: gl, antialias: true, alpha: true });
        }
        catch
        {
            element.innerHTML = `<p class="fallback">${content.unavailable}</p>`;
            return;
        }
        this.renderer.setClearColor(0x071114, 0);
        this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.mobile.matches ? 1.5 : 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.25;
        this.renderer.domElement.setAttribute("aria-label", content.sceneSummary);
        this.renderer.domElement.setAttribute("role", "img");
        element.append(this.renderer.domElement);
        this.pointerEvent = (event) =>
        {
            const hit = this.pick(event);
            if (event.type === "click")
            {
                if (hit !== null)
                {
                    element.focus({ preventScroll: true });
                    this.onRotate(hit);
                }
            }
            else
            {
                element.style.cursor = hit !== null ? "pointer" : "";
                this.showSelection(hit ?? this.selected);
            }
        };
        this.leaveEvent = () => this.showSelection(this.selected);
        element.addEventListener("click", this.pointerEvent);
        element.addEventListener("pointermove", this.pointerEvent);
        element.addEventListener("pointerleave", this.leaveEvent);
        this.observer = new ResizeObserver(() => this.resize());
        this.observer.observe(element);
        this.visibilityEvent = () =>
        {
            cancelAnimationFrame(this.frame);
            if (!document.hidden) this.tick();
        };
        document.addEventListener("visibilitychange", this.visibilityEvent);
        this.motionEvent = () =>
        {
            if (this.reduced.matches) this.animations.forEach((entry) => { entry.object.rotation.y = entry.target; });
        };
        this.reduced.addEventListener("change", this.motionEvent);
        this.tick();
    }

    pick(event)
    {
        const rect = this.element.getBoundingClientRect();
        this.pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
        this.raycaster.setFromCamera(this.pointer, this.camera);
        return this.raycaster.intersectObjects(this.hitAreas)[0]?.object.userData.id ?? null;
    }

    position(x, y, height = 0)
    {
        return new THREE.Vector3(x - (this.level.size - 1) / 2, height, y - (this.level.size - 1) / 2);
    }

    resize()
    {
        if (!this.renderer || !this.level) return;
        const width = this.element.clientWidth;
        const height = this.element.clientHeight;
        this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.mobile.matches ? 1.5 : 2));
        const aspect = width / Math.max(height, 1);
        const horizontal = this.level.size * 1.78;
        const vertical = this.level.size * 1.53;
        const viewHeight = Math.max(vertical, horizontal / aspect);
        this.camera.left = -viewHeight * aspect / 2;
        this.camera.right = viewHeight * aspect / 2;
        this.camera.top = viewHeight / 2;
        this.camera.bottom = -viewHeight / 2;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    build(level)
    {
        this.level = level;
        if (!this.renderer) return;
        release(this.world);
        this.rotatables = [];
        this.hitAreas = [];
        this.receivers = [];
        this.animations = [];
        const n = level.size;
        const bed = mesh(this.world, new THREE.BoxGeometry(n + 0.12, 0.46, n + 0.12), material(0x10272c), 0, -0.3, 0);
        const bedEdges = new THREE.LineSegments(new THREE.EdgesGeometry(bed.geometry),
            new THREE.LineBasicMaterial({ color: 0x31534f, transparent: true, opacity: 0.45 }));
        bedEdges.position.copy(bed.position);
        this.world.add(bedEdges);
        const shape = new THREE.Shape();
        shape.moveTo(-0.43, -0.43);
        shape.lineTo(0.43, -0.43);
        shape.lineTo(0.43, 0.43);
        shape.lineTo(-0.43, 0.43);
        shape.closePath();
        const tileGeometry = new THREE.ExtrudeGeometry(shape, { depth: 0.10, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025, bevelSegments: 1, steps: 1 });
        tileGeometry.rotateX(-Math.PI / 2);
        const tileSurface = material(colors.tile);
        for (let y = 0; y < n; y++)
        {
            for (let x = 0; x < n; x++)
            {
                const tile = mesh(this.world, tileGeometry, tileSurface);
                tile.position.copy(this.position(x, y, -0.04));
                const edges = new THREE.LineSegments(new THREE.EdgesGeometry(tileGeometry, 30),
                    new THREE.LineBasicMaterial({ color: 0x385c60, transparent: true, opacity: 0.5 }));
                edges.position.copy(tile.position);
                this.world.add(edges);
            }
        }
        const source = new THREE.Group();
        source.position.copy(this.position(level.emitter.x, level.emitter.y));
        this.world.add(source);
        mesh(source, new THREE.CylinderGeometry(0.21, 0.28, 0.15, 8), material(0x31554f), 0, 0.16);
        const crystal = mesh(source, new THREE.OctahedronGeometry(0.33, 0),
            material(0xc9ffec, { emissive: colors.mint, emissiveIntensity: 1.2 }), 0, 0.52);
        crystal.scale.set(0.7, 1.35, 0.7);
        ring(source, 0.32, colors.mint, 0.13, 0.65);
        arrow(source, level.emitter.d, 0.18, colors.mint, 0.42);
        const emitterLight = new THREE.PointLight(colors.mint, 2, 3.5);
        emitterLight.position.set(0, 0.8, 0);
        source.add(emitterLight);
        for (const [index, receiver] of level.receivers.entries())
        {
            const group = new THREE.Group();
            group.position.copy(this.position(receiver.x, receiver.y));
            this.world.add(group);
            mesh(group, new THREE.CylinderGeometry(0.26, 0.29, 0.12, 10), material(0x294345), 0, 0.16);
            const body = mesh(group, new THREE.OctahedronGeometry(0.27),
                material(0x35615f, { emissive: colors.mint, emissiveIntensity: 0.03 }), 0, 0.46);
            body.scale.y = 1.4;
            const halo = ring(group, 0.36, colors.edge, 0.25);
            const pulse = ring(group, 0.37, colors.mint, 0.17, 0);
            arrow(group, receiver.d, 0.18, 0x95b5ab, -0.48);
            const glow = new THREE.PointLight(colors.mint, 0, 2.8);
            glow.position.y = 0.7;
            group.add(glow);
            this.receivers.push({ index, body, halo, pulse, glow });
        }
        for (const piece of level.pieces)
        {
            const group = new THREE.Group();
            group.position.copy(this.position(piece.x, piece.y));
            this.world.add(group);
            mesh(group, new THREE.CylinderGeometry(0.25, 0.3, 0.12, 12), material(0x24434b), 0, 0.15);
            const rotor = new THREE.Group();
            group.add(rotor);
            if (piece.type === "L")
            {
                const lens = mesh(rotor, new THREE.SphereGeometry(0.36, 24, 16),
                    material(colors.blue, { transparent: true, opacity: 0.52, roughness: 0.08, metalness: 0.5, emissive: 0x286888, emissiveIntensity: 0.4 }), 0, 0.48);
                lens.scale.set(0.23, 1.0, 0.82);
                const rim = mesh(rotor, new THREE.TorusGeometry(0.32, 0.018, 6, 40), material(0x88cff2), 0, 0.48);
                rim.rotation.y = Math.PI / 2;
                cylinderBetween(rotor, new THREE.Vector3(-0.4, 0.15, 0), new THREE.Vector3(0.4, 0.15, 0),
                    0.015, new THREE.MeshBasicMaterial({ color: colors.blue }));
            }
            else if (piece.type === "M")
            {
                const bar = mesh(rotor, new THREE.BoxGeometry(0.86, 0.38, 0.055),
                    material(0xb0d5da, { metalness: 0.85, roughness: 0.13 }), 0, 0.4);
                bar.rotation.y = Math.PI / 4;
                const support = mesh(rotor, new THREE.BoxGeometry(0.88, 0.06, 0.12), material(0x618b92), 0, 0.2);
                support.rotation.y = Math.PI / 4;
            }
            else
            {
                const prism = mesh(rotor, new THREE.ConeGeometry(0.31, 0.48, 3),
                    material(0xa6e5d6, { transparent: true, opacity: 0.6, emissive: 0x176457, emissiveIntensity: 0.45 }), 0, 0.43);
                prism.rotation.y = Math.PI / 6;
                arrow(rotor, 0, 0.72, colors.mint);
            }
            const hit = mesh(group, new THREE.BoxGeometry(0.96, 0.8, 0.96), new THREE.MeshBasicMaterial({ visible: false }), 0, 0.4);
            hit.userData.id = piece.id;
            this.hitAreas.push(hit);
            this.rotatables[piece.id] = rotor;
        }
        for (const blocker of level.blockers)
        {
            const object = mesh(this.world, new THREE.DodecahedronGeometry(0.4, 0), material(0x26464e));
            object.position.copy(this.position(blocker.x, blocker.y, 0.34));
            object.scale.y = 1.3;
        }
        this.decorate(n);
        this.resize();
        this.scene.updateMatrixWorld(true);
    }

    decorate(n)
    {
        let seed = 41;
        const random = () =>
        {
            seed = (seed * 1664525 + 1013904223) >>> 0;
            return seed / 4294967296;
        };
        const count = this.mobile.matches ? 28 : 64;
        const geometry = new THREE.ConeGeometry(0.15, 0.65, 5, 1);
        const surface = material(0x9dcac7, { roughness: 0.5, metalness: 0.2 });
        const crystals = new THREE.InstancedMesh(geometry, surface, count);
        const dummy = new THREE.Object3D();
        for (let index = 0; index < count; index++)
        {
            const angle = random() * Math.PI * 2;
            const radius = n * 0.77 + random() * n * 0.45;
            const scale = 0.5 + random() * 1.1;
            dummy.position.set(Math.sin(angle) * radius, -0.1 + scale * 0.2, Math.cos(angle) * radius);
            dummy.rotation.set(random() * 0.3, random() * Math.PI, random() * 0.3 - 0.15);
            dummy.scale.set(scale * (0.5 + random()), scale * (0.6 + random()), scale);
            dummy.updateMatrix();
            crystals.setMatrixAt(index, dummy.matrix);
            crystals.setColorAt(index, new THREE.Color().setHSL(0.47 + random() * 0.06, 0.28, 0.14 + random() * 0.13));
        }
        this.world.add(crystals);
        const positions = [];
        for (let index = 0; index < (this.mobile.matches ? 30 : 100); index++)
        {
            positions.push((random() - 0.5) * n * 3, random() * 3 - 1, (random() - 0.5) * n * 3);
        }
        const dustGeometry = new THREE.BufferGeometry();
        dustGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        this.dust = new THREE.Points(dustGeometry,
            new THREE.PointsMaterial({ size: 0.018, color: 0xa2dccb, transparent: true, opacity: 0.3, depthWrite: false }));
        this.world.add(this.dust);
    }

    showSelection(id)
    {
        if (!this.renderer || !this.level) return;
        release(this.selection);
        if (id === null || id === undefined) return;
        const piece = this.level.pieces[id];
        ring(this.selection, 0.45, colors.blue, 0.11, 0.8);
        this.selection.position.copy(this.position(piece.x, piece.y));
    }

    update(state, trace, animate = true)
    {
        if (!this.renderer) return;
        const now = performance.now();
        for (const piece of this.level.pieces)
        {
            const object = this.rotatables[piece.id];
            const rotation = state.rotations[piece.id];
            if (object.userData.rotation === rotation) continue;
            const start = object.rotation.y;
            let target = -rotation * Math.PI / 2;
            while (target - start > Math.PI) target -= Math.PI * 2;
            while (target - start < -Math.PI) target += Math.PI * 2;
            object.userData.rotation = rotation;
            this.animations = this.animations.filter((entry) => entry.object !== object);
            if (animate && !this.reduced.matches) this.animations.push({ object, start, target, time: now });
            else object.rotation.y = target;
        }
        this.selected = state.selected;
        this.showSelection(this.selected);
        release(this.beams);
        for (const segment of trace.segments)
        {
            const from = this.position(segment.from.x, segment.from.y, 0.48);
            const to = this.position(segment.to.x, segment.to.y, 0.48);
            cylinderBetween(this.beams, from, to, 0.037,
                new THREE.MeshBasicMaterial({ color: colors.mint, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false }));
            cylinderBetween(this.beams, from, to, 0.014,
                new THREE.MeshBasicMaterial({ color: 0xf2fff9, transparent: true, opacity: 0.95 }));
        }
        this.beamTime = now;
        for (const receiver of this.receivers)
        {
            const active = trace.lit.includes(receiver.index);
            receiver.body.material.color.setHex(active ? 0xb9ffe4 : 0x35615f);
            receiver.body.material.emissiveIntensity = active ? 0.9 : 0.03;
            receiver.halo.material.color.setHex(active ? colors.mint : colors.edge);
            receiver.glow.intensity = active ? 1.3 : 0;
            receiver.pulse.material.opacity = 0;
        }
        if (trace.solved && !this.wasSolved) this.completedAt = now;
        this.wasSolved = trace.solved;
        this.scene.updateMatrixWorld(true);
        this.renderer.render(this.scene, this.camera);
    }

    tick()
    {
        if (!this.renderer || document.hidden) return;
        const now = performance.now();
        this.animations = this.animations.filter((entry) =>
        {
            const progress = this.reduced.matches ? 1 : Math.min((now - entry.time) / 180, 1);
            entry.object.rotation.y = entry.start + (entry.target - entry.start) * (1 - (1 - progress) ** 3);
            return progress < 1;
        });
        if (!this.reduced.matches)
        {
            const beamFade = Math.min((now - (this.beamTime ?? now)) / 140, 1);
            this.beams.children.forEach((beam, index) =>
            {
                beam.material.opacity = (index % 2 === 0 ? 0.12 : 0.95) * (0.4 + beamFade * 0.6);
            });
            if (this.dust) this.dust.rotation.y = Math.sin(now / 60000) * 0.025;
            const pulse = (now - (this.completedAt ?? -10000)) / 900;
            for (const receiver of this.receivers ?? [])
            {
                if (pulse < 1 && this.wasSolved)
                {
                    receiver.pulse.scale.setScalar(1 + pulse * 1.1);
                    receiver.pulse.material.opacity = (1 - pulse) * 0.65;
                }
                else receiver.pulse.material.opacity = 0;
            }
        }
        this.renderer.render(this.scene, this.camera);
        this.frame = requestAnimationFrame(() => this.tick());
    }

    screenPosition(id)
    {
        const piece = this.level.pieces[id];
        const projected = this.position(piece.x, piece.y, 0.4).project(this.camera);
        return { x: (projected.x + 1) / 2 * this.element.clientWidth, y: (1 - projected.y) / 2 * this.element.clientHeight };
    }

    dispose()
    {
        cancelAnimationFrame(this.frame);
        this.observer?.disconnect();
        this.element.removeEventListener("click", this.pointerEvent);
        this.element.removeEventListener("pointermove", this.pointerEvent);
        this.element.removeEventListener("pointerleave", this.leaveEvent);
        document.removeEventListener("visibilitychange", this.visibilityEvent);
        this.reduced.removeEventListener("change", this.motionEvent);
        release(this.scene);
        this.renderer?.dispose();
        this.renderer?.domElement.remove();
    }
}
