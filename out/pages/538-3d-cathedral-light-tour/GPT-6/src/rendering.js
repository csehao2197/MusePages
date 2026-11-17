import * as THREE from "./vendor/three.module.js";
import { createMaterials } from "./materials.js";
import { createArchitecture } from "./architecture.js";
import { createGlass } from "./stained-glass.js";
import { createLighting, timeModel } from "./lighting.js";
import { createProjections } from "./projections.js";
import { updateCamera } from "./camera-route.js";

export function createTourRenderer(canvas, state, reduced)
{
    const mobile = matchMedia("(max-width: 700px)").matches;
    const context = canvas.getContext("webgl2", { alpha: false, antialias: true, powerPreference: "low-power" });
    if (!context)
    {
        state.webglAvailable = false;
        return null;
    }
    const renderer = new THREE.WebGLRenderer({ canvas, context, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = !mobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#12110f");
    scene.fog = new THREE.FogExp2("#847664", .007);
    const materials = createMaterials();
    const architecture = createArchitecture(materials, mobile);
    const { windows, designs } = createGlass(materials, mobile);
    const projections = createProjections(designs, materials);
    scene.add(architecture, windows, projections.group);
    const lighting = createLighting(scene, materials, mobile);
    const camera = new THREE.PerspectiveCamera(mobile ? 72 : 62, 1, .1, 110);
    const dustPositions = [];
    const count = mobile ? 60 : 180;
    for (let i = 0; i < count; i++)
    {
        dustPositions.push(Math.sin(i * 37.7) * 7, 2 + (i % 19) * .65, -Math.abs(Math.cos(i * 9.1)) * 48);
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.Float32BufferAttribute(dustPositions, 3));
    const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: "#eee1c7", size: .025, transparent: true, opacity: .3, depthWrite: false }));
    dust.visible = !reduced;
    scene.add(dust);
    let frame = 0;
    let visible = true;
    let disposed = false;
    let renderedMinutes = state.timeMinutes;
    let last = performance.now();
    const started = last;
    let entranceDone = reduced;
    function resize()
    {
        const rect = canvas.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
    }
    function render(now)
    {
        frame = 0;
        if (disposed || !visible || document.hidden)
        {
            return;
        }
        const dt = Math.min(100, now - last);
        last = now;
        renderedMinutes = reduced ? state.timeMinutes : renderedMinutes + (state.timeMinutes - renderedMinutes) * Math.min(1, dt / 70);
        const model = timeModel(renderedMinutes);
        lighting.update(model);
        projections.update(model);
        if (state.tourProgress > 0 || now - started >= 900)
        {
            entranceDone = true;
        }
        updateCamera(camera, state, reduced, entranceDone ? 0 : 2 * (1 - Math.min(1, (now - started) / 900)));
        if (!reduced)
        {
            dust.position.y = Math.sin(now / 14000) * .16;
        }
        renderer.render(scene, camera);
        state.renderEvidence = {
            camera: camera.position.toArray(), target: contentTarget(),
            time: renderedMinutes, elevation: model.elevation, length: model.length,
            meshes: renderer.info.render.calls, triangles: renderer.info.render.triangles,
            counts: architecture.userData, lancets: windows.userData.lancets
        };
        if (!reduced || Math.abs(renderedMinutes - state.timeMinutes) > .05)
        {
            frame = requestAnimationFrame(render);
        }
    }
    function contentTarget()
    {
        return state.activeStop;
    }
    function request()
    {
        if (!visible || document.hidden)
        {
            const model = timeModel(state.timeMinutes);
            lighting.update(model);
            projections.update(model);
            renderedMinutes = state.timeMinutes;
        }
        if (!frame && visible && !document.hidden && !disposed)
        {
            frame = requestAnimationFrame(render);
        }
    }
    const observer = new IntersectionObserver(entries =>
    {
        visible = entries[0].isIntersecting;
        if (!visible && frame)
        {
            cancelAnimationFrame(frame);
            frame = 0;
        }
        request();
    });
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", request);
    resize();
    request();
    state.webglAvailable = true;
    state.quality = mobile ? "mobile" : "desktop";
    return {
        request,
        dispose()
        {
            disposed = true;
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener("resize", resize);
            document.removeEventListener("visibilitychange", request);
            const geometries = new Set();
            const allMaterials = new Set();
            scene.traverse(node =>
            {
                if (node.geometry)
                {
                    geometries.add(node.geometry);
                }
                for (const material of (Array.isArray(node.material) ? node.material : [node.material]))
                {
                    if (material)
                    {
                        allMaterials.add(material);
                    }
                }
            });
            for (const geometry of geometries)
            {
                geometry.dispose();
            }
            for (const material of allMaterials)
            {
                material.dispose();
            }
            lighting.sun.shadow.dispose();
            renderer.dispose();
        }
    };
}
