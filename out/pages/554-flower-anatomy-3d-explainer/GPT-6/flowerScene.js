import * as THREE from "./vendor/three.module.js";
import { OrbitControls } from "./vendor/OrbitControls.js";
import { content } from "./content.js";

const reducedQuery = matchMedia("(prefers-reduced-motion: reduce)");

export class FlowerScene
{
    constructor(host, onLabels)
    {
        this.host = host;
        this.onLabels = onLabels;
        this.parts = {};
        this.anchors = {};
        this.step = 0;
        this.amount = 0;
        this.route = "anatomy";
        this.time = 0;
        this.selected = "";
        this.visible = true;
        this.reduced = reducedQuery.matches;
        this.start = performance.now();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(39, 1, .1, 80);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 761 ? 1.5 : 1.75));
        this.renderer.setClearColor(0xe3ece2, 0);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        host.append(this.renderer.domElement);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = !this.reduced;
        this.controls.dampingFactor = .08;
        this.controls.enablePan = false;
        this.controls.minDistance = 5.3;
        this.controls.maxDistance = 16;
        this.controls.maxPolarAngle = Math.PI * .83;
        this.controls.minPolarAngle = .18;
        this.scene.add(new THREE.HemisphereLight(0xfffcf0, 0x56745a, 2.4));
        const sun = new THREE.DirectionalLight(0xfff0d7, 3.1);
        sun.position.set(-4, 8, 6);
        this.scene.add(sun);
        this.flower = new THREE.Group();
        this.flower.rotation.x = .12;
        this.scene.add(this.flower);
        this.makeFlower();
        this.reset();
        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(host);
        this.intersectionObserver = new IntersectionObserver(([entry]) =>
        {
            this.visible = entry.isIntersecting;
            if (this.visible) this.wake();
        });
        this.intersectionObserver.observe(host);
        this.visibilityHandler = () => this.wake();
        document.addEventListener("visibilitychange", this.visibilityHandler);
        reducedQuery.addEventListener("change", (event) =>
        {
            this.reduced = event.matches;
            this.controls.enableDamping = !this.reduced;
        });
        host.addEventListener("keydown", (event) => this.key(event));
        this.resize();
        this.wake();
    }

    material(color, roughness = .6)
    {
        return new THREE.MeshStandardMaterial({ color, roughness, side: THREE.DoubleSide });
    }

    mesh(geometry, material, parent = this.flower, part)
    {
        const mesh = new THREE.Mesh(geometry, material);
        parent.add(mesh);
        if (part)
        {
            (this.parts[part] ??= []).push(mesh);
        }
        return mesh;
    }

    tube(points, radius, material, parent, part)
    {
        const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
        return this.mesh(new THREE.TubeGeometry(curve, 36, radius, 8, false), material, parent, part);
    }

    tepalGeometry(length, width)
    {
        const rows = 32;
        const columns = 14;
        const positions = [];
        const colors = [];
        const indices = [];
        const base = new THREE.Color(content.model.tepalColor);
        const tip = new THREE.Color(content.model.tepalInner);
        for (let i = 0; i <= rows; i++)
        {
            const t = i / rows;
            for (let j = 0; j <= columns; j++)
            {
                const u = (j / columns - .5) * 2;
                const w = Math.pow(Math.sin(Math.PI * t), .85) * width;
                const x = u * w;
                const y = .17 + 1.75 * Math.sin(t * Math.PI * .9) - 1.3 * t + .26 * u * u;
                const z = .17 + length * t;
                positions.push(x, y, z);
                const color = base.clone().lerp(tip, .22 + .48 * Math.abs(u) + .18 * t);
                colors.push(color.r, color.g, color.b);
                if (i < rows && j < columns)
                {
                    const a = i * (columns + 1) + j;
                    indices.push(a, a + 1, a + columns + 1, a + 1, a + columns + 2, a + columns + 1);
                }
            }
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        return geometry;
    }

    makeFlower()
    {
        const green = this.material(content.model.leafColor);
        const paleGreen = this.material("#88a76a");
        const darkGreen = this.material("#49663d");
        const coral = this.material("#df8f82");
        const tepalMaterial = this.material("#ffffff", .79);
        tepalMaterial.vertexColors = true;
        tepalMaterial.transparent = true;
        const antherMaterial = this.material(content.model.antherColor, .83);
        this.tepals = [];
        this.stamens = [];
        this.tube([[.05, -3.2, -.1], [-.15, -1.7, -.1], [.02, -.7, 0], [0, .4, 0]], .1, green);
        for (let i = 0; i < 2; i++)
        {
            const leaf = this.mesh(this.tepalGeometry(1.7, .27), green);
            leaf.position.set(0, -1.8 + i * .65, 0);
            leaf.rotation.set(-.65, i * Math.PI + .9, .1);
        }
        for (let i = 0; i < 6; i++)
        {
            const group = new THREE.Group();
            const angle = i * Math.PI / 3;
            group.rotation.y = angle;
            group.position.y = i % 2 ? .05 : -.04;
            this.flower.add(group);
            const mesh = this.mesh(this.tepalGeometry(content.model.tepalLength * (i % 2 ? .95 : 1.05), content.model.tepalWidth * (i % 2 ? 1.04 : .85)), tepalMaterial.clone(), group, "tepals");
            this.tepals.push({ group, angle, y: group.position.y });
            for (let j = 0; j < content.model.speckles; j++)
            {
                const t = .19 + ((j * .618) % .52);
                const u = (((j * .381) % 1) - .5) * 1.25;
                const spot = this.mesh(new THREE.SphereGeometry(.017 + (j % 3) * .004, 5, 4), coral, group);
                spot.scale.set(1, .22, 1.5);
                spot.position.set(u * Math.sin(t * Math.PI) * content.model.tepalWidth, .185 + 1.75 * Math.sin(t * Math.PI * .9) - 1.3 * t + .26 * u * u, .17 + content.model.tepalLength * (i % 2 ? .95 : 1.05) * t);
            }
            const stamen = new THREE.Group();
            stamen.rotation.y = angle + .26;
            this.flower.add(stamen);
            const h = 2.0 + (i % 2) * .28;
            this.tube([[0, .25, .26], [0, 1, .45], [0, h - .3, .78], [0, h, 1]], .033, paleGreen, stamen, "stamen");
            const anther = this.mesh(new THREE.CapsuleGeometry(.095, .46, 5, 10), antherMaterial.clone(), stamen, "stamen");
            anther.position.set(0, h, 1);
            anther.rotation.z = Math.PI / 2 + .2;
            const groove = this.tube([[-.24, h, 1.085], [0, h + .015, 1.092], [.24, h + .06, 1.085]], .012, darkGreen, stamen);
            this.stamens.push({ group: stamen, angle, anther, groove });
        }
        this.ovaryMaterial = this.material("#759751");
        this.ovary = this.mesh(new THREE.SphereGeometry(.43, 40, 28), this.ovaryMaterial, this.flower, "ovary");
        this.ovary.position.y = .9;
        this.ovary.scale.y = 1.48;
        this.cutOvary = this.mesh(new THREE.SphereGeometry(.435, 40, 28, Math.PI, Math.PI * 1.5), this.ovaryMaterial.clone(), this.flower, "ovary");
        this.cutOvary.position.copy(this.ovary.position);
        this.cutOvary.scale.y = 1.48;
        this.cutOvary.visible = false;
        this.chambers = new THREE.Group();
        this.flower.add(this.chambers);
        const chamberMaterial = this.material("#b7c888");
        const ovuleMaterial = this.material("#e7d99b");
        for (let chamber = 0; chamber < 3; chamber++)
        {
            const angle = chamber * Math.PI * 2 / 3;
            const wall = this.mesh(new THREE.PlaneGeometry(.38, 1.05), chamberMaterial, this.chambers);
            wall.position.set(Math.sin(angle) * .18, .89, Math.cos(angle) * .18);
            wall.rotation.y = angle;
            for (let i = 0; i < 3; i++)
            {
                const ovule = this.mesh(new THREE.SphereGeometry(.075, 12, 8), ovuleMaterial.clone(), this.chambers, "ovule");
                ovule.scale.set(.85, 1.25, 1);
                ovule.position.set(Math.sin(angle + .45) * .26, .6 + i * .29, Math.cos(angle + .45) * .26);
            }
        }
        this.chambers.visible = false;
        this.tube([[0, 1.3, 0], [.025, 1.9, .025], [0, 2.68, 0]], .064, paleGreen.clone(), this.flower, "style");
        for (let i = 0; i < 3; i++)
        {
            const a = i * Math.PI * 2 / 3;
            const lobe = this.mesh(new THREE.SphereGeometry(.145, 16, 10), paleGreen.clone(), this.flower, "stigma");
            lobe.scale.set(1, .55, 1);
            lobe.position.set(Math.sin(a) * .095, 2.68, Math.cos(a) * .095);
        }
        this.pollen = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.034, 1), this.material(content.model.pollenColor), 24);
        this.flower.add(this.pollen);
        this.pollen.visible = false;
        this.pollenCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(.26, 2, .97), new THREE.Vector3(1.3, 3.35, 1), new THREE.Vector3(.45, 3.1, .4), new THREE.Vector3(0, 2.75, 0)]);
        this.pollenPath = new THREE.Line(new THREE.BufferGeometry().setFromPoints(this.pollenCurve.getPoints(60)), new THREE.LineDashedMaterial({ color: "#b78328", dashSize: .065, gapSize: .065, transparent: true, opacity: .7 }));
        this.pollenPath.computeLineDistances();
        this.flower.add(this.pollenPath);
        this.pollenPath.visible = false;
        this.pollenTube = this.tube([[0, 2.75, 0], [.02, 2.3, .06], [.035, 1.6, .05], [.12, 1.2, .15], [.12, .89, .23]], .026, this.material("#e3a32a"), this.flower);
        this.pollenTube.visible = false;
        this.ring = this.mesh(new THREE.TorusGeometry(.24, .012, 8, 48), this.material("#d99a2b"));
        this.ring.visible = false;
        const shadowMaterial = new THREE.MeshBasicMaterial({ color: "#456448", transparent: true, opacity: .022, depthWrite: false });
        for (let i = 0; i < 12; i++)
        {
            const disk = this.mesh(new THREE.CircleGeometry(.65 + i * .085, 48), shadowMaterial, this.scene);
            disk.rotation.x = -Math.PI / 2;
            disk.position.set(0, -3.24 - i * .001, 0);
            disk.scale.set(1.2, .65, 1);
        }
        this.anchorDefaults =
        {
            tepals: new THREE.Vector3(-1.3, .6, 1.4),
            stamen: new THREE.Vector3(.26, 2.1, .97),
            stigma: new THREE.Vector3(0, 2.73, 0),
            style: new THREE.Vector3(0, 1.7, 0),
            ovary: new THREE.Vector3(.37, .9, .12),
            ovule: new THREE.Vector3(.12, .89, .23)
        };
    }

    resize()
    {
        const { width, height } = this.host.getBoundingClientRect();
        if (!width || !height) return;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.wake();
    }

    reset()
    {
        const cut = this.step === 3 && this.route !== "quiz";
        const mobile = innerWidth < 761;
        this.camera.position.set(cut ? 5 : 5.8, cut ? 2.6 : 5.4, cut ? 7 : 8.6);
        if (this.route === "pollination") this.camera.position.set(6, 3.3, 8.5);
        if (this.host.clientWidth < 450) this.camera.position.multiplyScalar(mobile ? 1.13 : 1.16);
        this.controls.target.set(0, cut ? .8 : -.05, 0);
        this.controls.update();
        this.wake();
    }

    setState({ step, route, selected, time })
    {
        const before = this.step;
        this.step = step;
        this.route = route;
        this.time = time;
        this.selected = selected;
        if (step === 3 && before !== 3) this.reset();
        this.wake();
    }

    focus(part)
    {
        const point = this.anchorDefaults[part];
        if (!point) return;
        this.controls.target.copy(point);
        this.camera.position.copy(point).add(new THREE.Vector3(3.6, 1.8, 5.4));
        this.controls.update();
        this.wake();
    }

    key(event)
    {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "0"].includes(event.key)) return;
        event.preventDefault();
        const spherical = new THREE.Spherical().setFromVector3(this.camera.position.clone().sub(this.controls.target));
        if (event.key === "ArrowLeft") spherical.theta -= .13;
        if (event.key === "ArrowRight") spherical.theta += .13;
        if (event.key === "ArrowUp") spherical.phi = Math.max(.18, spherical.phi - .1);
        if (event.key === "ArrowDown") spherical.phi = Math.min(Math.PI * .83, spherical.phi + .1);
        if (["+", "="].includes(event.key)) spherical.radius = Math.max(5.3, spherical.radius * .9);
        if (event.key === "-") spherical.radius = Math.min(16, spherical.radius * 1.1);
        this.camera.position.copy(new THREE.Vector3().setFromSpherical(spherical).add(this.controls.target));
        if (event.key === "0") this.reset();
        this.controls.update();
        this.wake();
    }

    wake()
    {
        if (!this.raf && this.visible && !document.hidden)
        {
            this.raf = requestAnimationFrame((now) => this.frame(now));
        }
    }

    frame(now)
    {
        this.raf = null;
        if (!this.visible || document.hidden) return;
        const delta = Math.min((now - (this.last ?? now)) / 1000, .05);
        this.last = now;
        const pollStage = this.time < 2 ? 0 : this.time < 5 ? 1 : this.time < 9 ? 2 : 3;
        const target = this.route === "quiz" ? 0 : this.route === "pollination" ? (pollStage >= 2 ? 3 : 1) : this.step;
        this.amount = this.reduced ? target : THREE.MathUtils.damp(this.amount, target, 8, delta);
        this.tepals.forEach(({ group, angle, y }) =>
        {
            const lift = Math.min(1, this.amount);
            group.position.set(Math.sin(angle) * .9 * lift, y + .24 * lift, Math.cos(angle) * .9 * lift);
            group.rotation.x = -.61 * lift;
        });
        this.stamens.forEach(({ group }) =>
        {
            const part = THREE.MathUtils.clamp(this.amount - 1, 0, 1);
            group.position.z = Math.cos(group.rotation.y) * .35 * part;
            group.position.x = Math.sin(group.rotation.y) * .35 * part;
        });
        const cut = this.amount > 2.55;
        this.ovary.visible = !cut;
        this.cutOvary.visible = cut;
        this.chambers.visible = cut;
        this.parts.tepals.forEach((mesh) =>
        {
            mesh.material.opacity = this.route === "pollination" && pollStage >= 2 ? .19 : 1;
            mesh.material.depthWrite = mesh.material.opacity === 1;
        });
        this.parts.style.forEach((mesh) =>
        {
            const ghost = this.route === "pollination" && pollStage >= 2;
            mesh.material.transparent = ghost;
            mesh.material.opacity = ghost ? .2 : 1;
            mesh.material.depthWrite = !ghost;
        });
        Object.entries(this.parts).forEach(([part, meshes]) => meshes.forEach((mesh) =>
        {
            mesh.material.emissive.set(part === this.selected ? "#b7773b" : "#000000");
            mesh.material.emissiveIntensity = part === this.selected ? .19 : 0;
        }));
        this.pollen.visible = this.route === "pollination";
        this.pollenPath.visible = this.route === "pollination" && pollStage === 1;
        if (this.pollen.visible)
        {
            const dummy = new THREE.Object3D();
            for (let i = 0; i < 24; i++)
            {
                let position;
                if (pollStage === 0)
                {
                    position = this.pollenCurve.getPoint(0).add(new THREE.Vector3(Math.sin(i * 2.4) * .16, Math.cos(i * 3.1) * .13, Math.sin(i) * .1));
                }
                else
                {
                    const t = pollStage > 1 ? 1 : this.reduced ? 1 : THREE.MathUtils.clamp((this.time - 2) / 3 * 1.3 - i / 90, 0, 1);
                    position = this.pollenCurve.getPoint(t).add(new THREE.Vector3(Math.sin(i * 2.4) * .04, Math.cos(i) * .035, 0));
                }
                dummy.position.copy(position);
                dummy.updateMatrix();
                this.pollen.setMatrixAt(i, dummy.matrix);
            }
            this.pollen.instanceMatrix.needsUpdate = true;
        }
        this.pollenTube.visible = this.route === "pollination" && pollStage >= 2;
        if (this.pollenTube.visible)
        {
            const fraction = this.reduced || pollStage === 3 ? 1 : (this.time - 5) / 4;
            const count = this.pollenTube.geometry.index.count;
            this.pollenTube.geometry.setDrawRange(0, Math.floor(count * fraction / 6) * 6);
        }
        this.parts.ovule.forEach((mesh, i) =>
        {
            mesh.material.color.set(this.route === "pollination" && pollStage === 3 && i === 1 ? "#e9ab32" : "#e7d99b");
        });
        this.ring.visible = Boolean(this.selected) && this.route === "anatomy";
        if (this.ring.visible)
        {
            this.ring.position.copy(this.anchorDefaults[this.selected]);
            this.ring.lookAt(this.camera.position);
        }
        const entrance = this.reduced ? 1 : Math.min(1, (now - this.start) / 600);
        this.flower.scale.setScalar(.96 + .04 * entrance);
        this.renderer.domElement.style.opacity = String(entrance);
        this.controls.update();
        this.flower.updateMatrixWorld(true);
        const anchors = {};
        Object.entries(this.anchorDefaults).forEach(([name, value]) =>
        {
            const point = value.clone();
            if (name === "tepals") point.x -= Math.min(1, this.amount) * .6;
            point.applyMatrix4(this.flower.matrixWorld).project(this.camera);
            anchors[name] = { x: (point.x + 1) * this.host.clientWidth / 2, y: (1 - point.y) * this.host.clientHeight / 2 + this.host.offsetTop };
        });
        this.onLabels(anchors);
        this.renderer.render(this.scene, this.camera);
        this.wake();
    }
}

export class FlowerFallback
{
    constructor(host, onLabels)
    {
        this.host = host;
        this.onLabels = onLabels;
        this.state = {};
        host.innerHTML = `<svg class="fallback" viewBox="0 0 400 450" role="img" aria-label="Labeled flower cross-section; WebGL is unavailable.">
            <path d="M200 410 Q170 300 200 200" stroke="#3e6b50" stroke-width="9" fill="none"/>
            <g id="fallback-tepals" fill="#eea095" stroke="#be7669" stroke-width="1.5">
                <path d="M200 220 Q35 215 65 100 Q180 110 200 220"/><path d="M200 220 Q365 215 335 100 Q220 110 200 220"/>
                <path d="M200 220 Q100 140 130 60 Q200 80 200 220"/><path d="M200 220 Q300 140 270 60 Q200 80 200 220"/>
                <path d="M200 220 Q55 310 25 230 Q115 180 200 220"/><path d="M200 220 Q345 310 375 230 Q285 180 200 220"/>
            </g>
            <g id="fallback-stamens" stroke="#759751" stroke-width="4" fill="#b87828">
                <path d="M200 220 110 120 M200 220 290 120 M200 220 140 150 M200 220 260 150 M200 220 170 100 M200 220 230 100"/>
                <ellipse cx="110" cy="120" rx="17" ry="5"/><ellipse cx="290" cy="120" rx="17" ry="5"/>
                <ellipse cx="140" cy="150" rx="17" ry="5"/><ellipse cx="260" cy="150" rx="17" ry="5"/>
                <ellipse cx="170" cy="100" rx="17" ry="5"/><ellipse cx="230" cy="100" rx="17" ry="5"/>
            </g>
            <path d="M200 190 200 75" stroke="#88a76a" stroke-width="9"/>
            <g fill="#88a76a"><ellipse cx="192" cy="73" rx="10" ry="6"/><ellipse cx="208" cy="73" rx="10" ry="6"/><ellipse cx="200" cy="67" rx="8" ry="6"/></g>
            <ellipse cx="200" cy="205" rx="25" ry="40" fill="#759751" stroke="#49663d"/>
            <g id="fallback-cut" fill="#e7d99b" stroke="#49663d">
                <path d="M200 170 200 240 M178 191 221 220 M178 220 221 191" fill="none"/>
                <ellipse cx="191" cy="190" rx="5" ry="7"/><ellipse cx="210" cy="205" rx="5" ry="7"/><ellipse cx="192" cy="225" rx="5" ry="7"/>
            </g>
            <path id="fallback-tube" d="M200 72 201 170 Q216 185 210 205" stroke="#d99a2b" stroke-width="4" fill="none"/>
            <text x="20" y="426" font-size="12" fill="#18342b">Stem</text><text x="238" y="72" font-size="12" fill="#18342b">Stigma</text>
        </svg><div class="fallback-note">WebGL unavailable · interactive cross-section</div>`;
        this.setState({ step: 0, route: "anatomy", time: 0 });
    }
    setState(state)
    {
        this.state = { ...this.state, ...state };
        const cut = this.state.step === 3 || (this.state.route === "pollination" && this.state.time >= 5);
        this.host.querySelector("#fallback-cut").style.display = cut ? "" : "none";
        this.host.querySelector("#fallback-tube").style.display = this.state.route === "pollination" && this.state.time >= 5 ? "" : "none";
        this.host.querySelector("#fallback-tepals").style.opacity = this.state.step >= 1 ? ".3" : "1";
        this.host.querySelector("#fallback-stamens").style.opacity = this.state.step >= 2 ? ".45" : "1";
        const w = this.host.clientWidth;
        const h = this.host.clientHeight;
        this.onLabels(Object.fromEntries(["tepals", "stamen", "stigma", "style", "ovary", "ovule"].map((id, i) => [id, { x: w / 2, y: h * (.19 + i * .07) + this.host.offsetTop }])));
    }
    reset() {}
    focus() {}
}
