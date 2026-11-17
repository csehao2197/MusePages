import * as THREE from "three";
import { content } from "../content.js";

export function bindInteractions(garden)
{
    const canvas = garden.renderer.domElement;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const active = new Map();
    let gesture = null;
    let pinched = false;
    const listeners = [];
    function on(target, event, callback, options)
    {
        target.addEventListener(event, callback, options);
        listeners.push(() => target.removeEventListener(event, callback, options));
    }
    function hit(clientX, clientY)
    {
        const bounds = canvas.getBoundingClientRect();
        pointer.set((clientX - bounds.left) / bounds.width * 2 - 1, -(clientY - bounds.top) / bounds.height * 2 + 1);
        garden.camera.updateMatrixWorld();
        raycaster.setFromCamera(pointer, garden.camera);
        return raycaster.intersectObject(garden.ground, false)[0]?.point;
    }
    on(canvas, "pointerdown", (event) =>
    {
        active.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (active.size === 1)
        {
            pinched = false;
            gesture = { x: event.clientX, y: event.clientY, time: performance.now(), moved: false };
        }
        else
        {
            pinched = true;
        }
    });
    on(canvas, "pointermove", (event) =>
    {
        if (gesture && active.has(event.pointerId) && Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) >= 6)
        {
            gesture.moved = true;
        }
        if (active.size > 1 || (gesture?.moved && active.size)) return;
        const point = hit(event.clientX, event.clientY);
        if (point) garden.showRing(point.x, point.z);
        else garden.ring.visible = false;
    });
    on(canvas, "pointerup", (event) =>
    {
        const shouldPlant = active.has(event.pointerId) && active.size === 1 && gesture && !gesture.moved && !pinched &&
            performance.now() - gesture.time < 350 && Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) < 6 &&
            event.button === 0;
        active.delete(event.pointerId);
        if (shouldPlant)
        {
            const point = hit(event.clientX, event.clientY);
            if (point) garden.plant(point.x, point.z);
            else garden.ui.toast(content.toasts.invalid);
        }
        if (!active.size) gesture = null;
    });
    on(canvas, "pointercancel", (event) =>
    {
        active.delete(event.pointerId);
        pinched = true;
        gesture = null;
    });
    on(canvas, "pointerleave", () =>
    {
        if (document.activeElement !== canvas) garden.ring.visible = false;
    });
    on(canvas, "focus", () => garden.showRing(garden.cursor.x, garden.cursor.z));
    on(canvas, "blur", () => { garden.ring.visible = false; });
    on(canvas, "keydown", (event) =>
    {
        if (document.activeElement !== canvas || garden.state.helpOpen || garden.state.resetOpen) return;
        if (/^[1-4]$/.test(event.key))
        {
            event.preventDefault();
            garden.ui.select(Number(event.key) - 1);
        }
        const deltas = { ArrowLeft: [-.32, 0], ArrowRight: [.32, 0], ArrowUp: [0, -.32], ArrowDown: [0, .32] };
        if (deltas[event.key])
        {
            event.preventDefault();
            const [dx, dz] = deltas[event.key];
            let x = garden.cursor.x + dx;
            let z = garden.cursor.z + dz;
            let attempts = 0;
            while (!garden.valid(x, z) && attempts++ < 10)
            {
                x += dx;
                z += dz;
            }
            if (garden.valid(x, z)) garden.showRing(x, z);
        }
        if (event.key === "Enter" || event.key === " ")
        {
            event.preventDefault();
            garden.plant(garden.cursor.x, garden.cursor.z);
        }
    });
    return () => listeners.forEach((remove) => remove());
}
