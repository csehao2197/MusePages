import { palette as p } from "./scene/palette.js";

export function createInput(state, ripples, flora, audio, ui)
{
    const canvas = document.querySelector("#surface");
    const pointers = new Map();
    const keyboard = { x: state.w * 0.5, y: state.h * 0.54, down: false, carry: 0, current: null };
    function tap(x, y)
    {
        const cracked = flora.crack(x, y);
        if (!cracked) ripples.tap(x, y);
        audio.tap(x, cracked);
        ui.gesture("tap");
    }
    function release(event, canceled = false)
    {
        const pointer = pointers.get(event.pointerId);
        if (!pointer) return;
        clearTimeout(pointer.timer);
        if (!canceled && pointer.mode === "pending" && performance.now() - pointer.start < 250 && pointer.distance < 12) tap(pointer.x, pointer.y);
        pointers.delete(event.pointerId);
        if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    }
    canvas.addEventListener("pointerdown", (event) =>
    {
        if (event.button !== 0 || pointers.size >= 3) return;
        event.preventDefault();
        canvas.focus({ preventScroll: true });
        canvas.setPointerCapture(event.pointerId);
        const pointer = { x: event.clientX, y: event.clientY, ox: event.clientX, oy: event.clientY, start: performance.now(), distance: 0, mode: "pending", carry: 0, current: null };
        pointer.timer = setTimeout(() =>
        {
            if (pointer.mode !== "pending") return;
            pointer.mode = "feeding";
            ripples.pellet(pointer.x, pointer.y);
            audio.pellet();
            ui.gesture("hold");
        }, 350);
        pointers.set(event.pointerId, pointer);
    });
    canvas.addEventListener("pointermove", (event) =>
    {
        const pointer = pointers.get(event.pointerId);
        if (!pointer) return;
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.distance = Math.hypot(pointer.x - pointer.ox, pointer.y - pointer.oy);
        if (pointer.mode === "pending" && pointer.distance >= 12)
        {
            clearTimeout(pointer.timer);
            pointer.mode = "current";
            pointer.current = ripples.beginCurrent(pointer.ox, pointer.oy);
            ui.gesture("drag");
        }
        if (pointer.mode === "current") ripples.extend(pointer.current, pointer.x, pointer.y);
    });
    canvas.addEventListener("pointerup", (event) => release(event));
    canvas.addEventListener("pointercancel", (event) => release(event, true));
    canvas.addEventListener("lostpointercapture", (event) => release(event, true));
    canvas.addEventListener("contextmenu", (event) => event.preventDefault());
    canvas.addEventListener("keydown", (event) =>
    {
        if (event.ctrlKey || event.altKey || event.metaKey) return;
        if (event.key === "Enter")
        {
            event.preventDefault();
            if (!event.repeat) tap(keyboard.x, keyboard.y);
        }
        if (event.key === " " && !ui.focus.active && !ui.focus.completed)
        {
            event.preventDefault();
            if (!keyboard.down)
            {
                keyboard.down = true;
                keyboard.carry = 1;
                ui.gesture("hold");
            }
        }
        if (event.key.startsWith("Arrow"))
        {
            event.preventDefault();
            if (!keyboard.current || !keyboard.current.active) keyboard.current = ripples.beginCurrent(keyboard.x, keyboard.y);
            const amount = 70 * state.u;
            keyboard.x = Math.max(20, Math.min(state.w - 20, keyboard.x + (event.key === "ArrowRight" ? amount : event.key === "ArrowLeft" ? -amount : 0)));
            keyboard.y = Math.max(20, Math.min(state.h - 20, keyboard.y + (event.key === "ArrowDown" ? amount : event.key === "ArrowUp" ? -amount : 0)));
            ripples.extend(keyboard.current, keyboard.x, keyboard.y);
            ui.gesture("drag");
        }
    });
    canvas.addEventListener("keyup", (event) =>
    {
        if (event.key === " ") keyboard.down = false;
    });
    function cancel()
    {
        for (const pointer of pointers.values()) clearTimeout(pointer.timer);
        pointers.clear();
        keyboard.down = false;
    }
    canvas.addEventListener("blur", cancel);
    window.addEventListener("blur", cancel);
    document.addEventListener("visibilitychange", () => { if (document.hidden) cancel(); });
    return {
        pointers,
        update(dt)
        {
            for (const pointer of pointers.values())
            {
                if (pointer.mode !== "feeding") continue;
                pointer.carry += dt * 9;
                while (pointer.carry >= 1)
                {
                    pointer.carry--;
                    ripples.pellet(pointer.x, pointer.y);
                    audio.pellet();
                }
            }
            if (keyboard.down)
            {
                keyboard.carry += dt * 9;
                while (keyboard.carry >= 1)
                {
                    keyboard.carry--;
                    ripples.pellet(keyboard.x, keyboard.y);
                    audio.pellet();
                }
            }
        },
        draw(c)
        {
            c.save();
            for (const pointer of pointers.values())
            {
                if (pointer.mode !== "pending") continue;
                const t = Math.min(1, (performance.now() - pointer.start) / 350);
                c.strokeStyle = p.gold;
                c.lineWidth = 1.2;
                c.globalAlpha = 0.8;
                c.beginPath();
                c.arc(pointer.x, pointer.y, 15, -Math.PI / 2, -Math.PI / 2 + t * Math.PI * 2);
                c.stroke();
            }
            c.restore();
        },
        close: cancel
    };
}
