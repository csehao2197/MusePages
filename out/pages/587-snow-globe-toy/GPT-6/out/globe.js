import * as THREE from "three";
import { RoomEnvironment } from "./vendor/RoomEnvironment.js";
import { makeKeepsake } from "./geometry.js";
import { createWorlds } from "./scenes.js";
import { createSnow } from "./snow.js";

export function createGlobe(canvas, options)
{
    const mobile = matchMedia("(max-width: 900px)").matches;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = preference.matches;
    const context = canvas.getContext("webgl2", { antialias: true, alpha: false, powerPreference: "high-performance" });
    if (!context) throw new Error("WebGL is unavailable.");
    const renderer = new THREE.WebGLRenderer({ canvas, context, antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.35 : 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.transmissionResolutionScale = .5;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = true;
    renderer.setClearColor("#0b1917");
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#0b1917", 17, 34);
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 80);
    camera.position.set(0, 2.8, 10.5);
    camera.lookAt(0, 2.6, 0);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture;
    room.dispose();
    pmrem.dispose();
    scene.add(new THREE.HemisphereLight("#d3e6ee", "#425345", 1.6));
    const key = new THREE.DirectionalLight("#ffe1a3", 2.4);
    key.position.set(-3, 7, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -5;
    key.shadow.camera.right = 5;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -4;
    key.shadow.normalBias = .025;
    key.shadow.bias = -.00015;
    scene.add(key);
    const rimLight = new THREE.DirectionalLight("#a2d4eb", 1.4);
    rimLight.position.set(4, 4, -4);
    scene.add(rimLight);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ color: "#000000", opacity: .3 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = .155;
    floor.receiveShadow = true;
    scene.add(floor);
    const contact = new THREE.Mesh(new THREE.PlaneGeometry(11, 11), new THREE.ShaderMaterial(
    {
        transparent: true,
        depthWrite: false,
        vertexShader: "varying vec2 v; void main(){v=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
        fragmentShader: "varying vec2 v; void main(){float d=length((v-.5)*2.); gl_FragColor=vec4(0.,0.,0.,exp(-d*d*9.)*.45);}"
    }));
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = .16;
    scene.add(contact);
    const pivot = new THREE.Group();
    pivot.position.y = 2.6;
    scene.add(pivot);
    const globe = new THREE.Group();
    globe.position.y = -2.6;
    pivot.add(globe);
    const keepsake = makeKeepsake(globe);
    const worlds = createWorlds(globe);
    const worldMaterials = worlds.map((world) =>
    {
        const clones = new Map();
        world.traverse((object) =>
        {
            if (!object.material) return;
            if (!clones.has(object.material))
            {
                clones.set(object.material, object.material.clone());
            }
            object.material = clones.get(object.material);
        });
        return [...clones.values()].map((mat) => ({ mat, opacity: mat.opacity, transparent: mat.transparent }));
    });
    const snow = createSnow(globe, mobile, reduced);
    let selected = 0;
    let previous = -1;
    let sceneStarted = -100;
    let frame = 0;
    let raf = 0;
    let last = 0;
    let accumulated = 0;
    let time = 0;
    let shakeStart = -100;
    let shaking = false;
    let shakeImpulse = 0;
    let targetX = 0;
    let targetZ = 0;
    let velocityX = 0;
    let velocityZ = 0;
    let dragging = false;
    let pointer = -1;
    let downX = 0;
    let downY = 0;
    let lastX = 0;
    let lastY = 0;
    let lastPointerTime = 0;
    let moved = false;
    let disposed = false;
    let sensorEnabled = false;
    let betaBase;
    let gammaBase;
    let sensorLast = 0;
    let lastMotionState;
    let message = "";
    let restrainedTimer;
    let averageFrame = 1 / 60;
    let lastShadowX = 0;
    let lastShadowZ = 0;
    let observer;
    function resize()
    {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        const distance = Math.max(mobile ? 11.5 : 12, 6.1 / (2 * Math.tan(THREE.MathUtils.degToRad(17.5)) * camera.aspect));
        camera.position.set(0, 2.8 + (distance - 10.5) * .025, distance);
        camera.lookAt(0, mobile ? 2.25 : 2.75, 0);
        camera.updateProjectionMatrix();
        renderer.shadowMap.needsUpdate = true;
        snow.points.material.uniforms.pixelRatio.value = renderer.getPixelRatio();
        snow.points.material.uniforms.viewportScale.value = Math.min(1.3, height / 560);
    }
    observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    function shake()
    {
        clearTimeout(restrainedTimer);
        shakeStart = time;
        shakeImpulse = 0;
        shaking = true;
        options.onShake(true);
        if (reduced)
        {
            restrainedTimer = setTimeout(() =>
            {
                shaking = false;
                targetX = targetZ = 0;
                snow.rest();
                options.onShake(false);
                options.onMotion(false);
            }, 600);
        }
    }
    function settle()
    {
        clearTimeout(restrainedTimer);
        shaking = false;
        options.onShake(false);
        targetX = targetZ = 0;
        snow.calm();
        if (reduced) snow.rest();
    }
    function setScene(index)
    {
        if (selected === index) return;
        if (previous >= 0)
        {
            worlds[previous].visible = false;
        }
        previous = selected;
        selected = index;
        sceneStarted = time;
        worlds[selected].visible = true;
        renderer.shadowMap.needsUpdate = true;
        if (reduced)
        {
            worlds[previous].visible = false;
            for (const entry of worldMaterials[selected])
            {
                entry.mat.opacity = entry.opacity;
                entry.mat.transparent = entry.transparent;
            }
            previous = -1;
            snow.rest();
        }
        else
        {
            snow.impulse(.72);
        }
    }
    function setMessage(value)
    {
        message = value.trim().slice(0, 28);
        keepsake.updateMessage(message);
    }
    function pointerDown(event)
    {
        if (event.isPrimary === false || event.button > 0) return;
        pointer = event.pointerId;
        canvas.setPointerCapture(pointer);
        canvas.focus({ preventScroll: true });
        dragging = true;
        moved = false;
        lastX = downX = event.clientX;
        lastY = downY = event.clientY;
        lastPointerTime = event.timeStamp;
    }
    function pointerMove(event)
    {
        if (!dragging || event.pointerId !== pointer) return;
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        const dt = Math.max(8, event.timeStamp - lastPointerTime);
        if (Math.hypot(event.clientX - downX, event.clientY - downY) > 5) moved = true;
        if (moved)
        {
            targetX = THREE.MathUtils.clamp((event.clientY - downY) * .002, -.16, .16);
            targetZ = THREE.MathUtils.clamp(-(event.clientX - downX) * .002, -.16, .16);
            pivot.rotation.x = targetX;
            pivot.rotation.z = targetZ;
            const power = Math.min(1, Math.hypot(dx, dy) / dt / 2);
            if (power > .045)
            {
                snow.impulse(power * (reduced ? .18 : .58), dx / dt * .12, -dy / dt * .12);
            }
        }
        lastX = event.clientX;
        lastY = event.clientY;
        lastPointerTime = event.timeStamp;
    }
    function pointerUp(event)
    {
        if (event.pointerId !== pointer) return;
        if (canvas.hasPointerCapture(pointer)) canvas.releasePointerCapture(pointer);
        dragging = false;
        pointer = -1;
        targetX = targetZ = 0;
        if (reduced) snow.rest();
    }
    function onKey(event)
    {
        if (event.target !== canvas) return;
        if (event.key.toLowerCase() === "s")
        {
            event.preventDefault();
            shake();
        }
        else if (event.key.toLowerCase() === "r")
        {
            event.preventDefault();
            settle();
        }
        else if (event.key === "ArrowRight" || event.key === "ArrowLeft")
        {
            event.preventDefault();
            options.onScene((selected + (event.key === "ArrowRight" ? 1 : 2)) % 3);
        }
    }
    function orientation(event)
    {
        if (!sensorEnabled || event.beta === null || event.gamma === null) return;
        if (betaBase === undefined)
        {
            betaBase = event.beta;
            gammaBase = event.gamma;
        }
        const nextX = THREE.MathUtils.clamp((event.beta - betaBase) * .004, -.12, .12);
        const nextZ = THREE.MathUtils.clamp(-(event.gamma - gammaBase) * .004, -.12, .12);
        const change = Math.hypot(nextX - targetX, nextZ - targetZ);
        if (event.timeStamp - sensorLast > 90 && change > .014)
        {
            snow.impulse(Math.min(.4, change * 3) * (reduced ? .3 : 1));
            sensorLast = event.timeStamp;
        }
        targetX = nextX;
        targetZ = nextZ;
    }
    function setSensor(enabled)
    {
        sensorEnabled = enabled;
        betaBase = gammaBase = undefined;
        if (enabled)
        {
            window.addEventListener("deviceorientation", orientation);
        }
        else
        {
            window.removeEventListener("deviceorientation", orientation);
            targetX = targetZ = 0;
        }
    }
    function changePreference()
    {
        reduced = preference.matches;
        if (reduced)
        {
            settle();
            snow.rest();
            pivot.rotation.set(0, 0, 0);
        }
    }
    function animate(timestamp)
    {
        if (disposed || document.hidden) return;
        raf = requestAnimationFrame(animate);
        const wallStep = (timestamp - (last || timestamp)) / 1000;
        const dt = Math.min(wallStep, 4 / 60);
        last = timestamp;
        time += wallStep;
        accumulated += dt;
        frame++;
        if (frame > 5)
        {
            averageFrame += (wallStep - averageFrame) * .1;
            const quality = frame > 36 && averageFrame > .07 ? .65 : frame > 12 && averageFrame > .045 ? .8 : null;
            if (quality && renderer.getPixelRatio() > quality)
            {
                renderer.setPixelRatio(quality);
                resize();
            }
        }
        if (shaking)
        {
            const age = time - shakeStart;
            const duration = reduced ? .6 : 1.1;
            while (shakeImpulse < (reduced ? 1 : 3) && age >= shakeImpulse * .32)
            {
                snow.impulse((reduced ? .35 : 1) * (1 - shakeImpulse * .22));
                shakeImpulse++;
            }
            if (!dragging)
            {
                targetZ = Math.sin(age * 24) * (reduced ? .025 : .13) * Math.max(0, 1 - age / duration);
                targetX = Math.cos(age * 19) * (reduced ? .015 : .07) * Math.max(0, 1 - age / duration);
            }
            if (age >= duration)
            {
                shaking = false;
                targetX = targetZ = 0;
                options.onShake(false);
                if (reduced) snow.rest();
            }
        }
        if (!dragging)
        {
            if (reduced)
            {
                pivot.rotation.x += (targetX - pivot.rotation.x) * Math.min(1, wallStep * 18);
                pivot.rotation.z += (targetZ - pivot.rotation.z) * Math.min(1, wallStep * 18);
            }
            else
            {
                const decay = Math.exp(-11 * wallStep);
                const errorX = pivot.rotation.x - targetX;
                const errorZ = pivot.rotation.z - targetZ;
                const temporaryX = (velocityX + 11 * errorX) * wallStep;
                const temporaryZ = (velocityZ + 11 * errorZ) * wallStep;
                pivot.rotation.x = THREE.MathUtils.clamp(targetX + (errorX + temporaryX) * decay, -.16, .16);
                pivot.rotation.z = THREE.MathUtils.clamp(targetZ + (errorZ + temporaryZ) * decay, -.16, .16);
                velocityX = (velocityX - 11 * temporaryX) * decay;
                velocityZ = (velocityZ - 11 * temporaryZ) * decay;
            }
        }
        let steps = 0;
        while (accumulated >= 1 / 60 && steps < 4)
        {
            snow.step(1 / 60, reduced);
            accumulated -= 1 / 60;
            steps++;
        }
        if (previous >= 0)
        {
            const fraction = Math.min(1, (time - sceneStarted) / .24);
            worlds[selected].scale.setScalar(.97 + .03 * fraction);
            for (const entry of worldMaterials[selected])
            {
                entry.mat.transparent = true;
                entry.mat.opacity = entry.opacity * fraction;
            }
            for (const entry of worldMaterials[previous])
            {
                entry.mat.transparent = true;
                entry.mat.opacity = entry.opacity * (1 - fraction);
            }
            if (fraction >= 1)
            {
                worlds[previous].visible = false;
                for (const index of [selected, previous])
                {
                    for (const entry of worldMaterials[index])
                    {
                        entry.mat.opacity = entry.opacity;
                        entry.mat.transparent = entry.transparent;
                    }
                }
                previous = -1;
            }
        }
        if (!reduced && selected === 1)
        {
            worlds[1].userData.beam.rotation.y = time * Math.PI * 2 / 9;
        }
        if (Math.abs(lastShadowX - pivot.rotation.x) + Math.abs(lastShadowZ - pivot.rotation.z) > .015)
        {
            renderer.shadowMap.needsUpdate = true;
            lastShadowX = pivot.rotation.x;
            lastShadowZ = pivot.rotation.z;
        }
        const motion = shaking || dragging && moved || snow.active > snow.count * .025;
        if (motion !== lastMotionState)
        {
            lastMotionState = motion;
            options.onMotion(motion);
        }
        renderer.render(scene, camera);
    }
    function visibility()
    {
        cancelAnimationFrame(raf);
        last = 0;
        accumulated = 0;
        if (!document.hidden && !disposed) raf = requestAnimationFrame(animate);
    }
    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerup", pointerUp);
    canvas.addEventListener("pointercancel", pointerUp);
    canvas.addEventListener("lostpointercapture", pointerUp);
    canvas.addEventListener("keydown", onKey);
    preference.addEventListener("change", changePreference);
    document.addEventListener("visibilitychange", visibility);
    raf = requestAnimationFrame(animate);
    function dispose()
    {
        disposed = true;
        clearTimeout(restrainedTimer);
        cancelAnimationFrame(raf);
        observer.disconnect();
        setSensor(false);
        canvas.removeEventListener("pointerdown", pointerDown);
        canvas.removeEventListener("pointermove", pointerMove);
        canvas.removeEventListener("pointerup", pointerUp);
        canvas.removeEventListener("pointercancel", pointerUp);
        canvas.removeEventListener("lostpointercapture", pointerUp);
        canvas.removeEventListener("keydown", onKey);
        preference.removeEventListener("change", changePreference);
        document.removeEventListener("visibilitychange", visibility);
        const disposedGeometry = new Set();
        const disposedMaterial = new Set();
        scene.traverse((object) =>
        {
            if (object.geometry && !disposedGeometry.has(object.geometry))
            {
                disposedGeometry.add(object.geometry);
                object.geometry.dispose();
            }
            if (object.material && !disposedMaterial.has(object.material))
            {
                disposedMaterial.add(object.material);
                object.material.map?.dispose();
                object.material.dispose();
            }
        });
        environment.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
    }
    return {
        shake, settle, setScene, setMessage, setSensor, dispose,
        stats: () => ({ ...snow.stats(), selected, message, shaking, reduced, frame, time, transitioning: previous >= 0, pixelRatio: renderer.getPixelRatio(), drawCalls: renderer.info.render.calls, tiltX: pivot.rotation.x, tiltZ: pivot.rotation.z, sensorEnabled, renderer: "WebGL" })
    };
}
