export function createControls(canvas, scene, action, start)
{
    const held = new Set();
    const listeners = [];
    const input = { x: 0, z: 0, destination: null };
    function on(element, name, handler, options)
    {
        element.addEventListener(name, handler, options);
        listeners.push(() => element.removeEventListener(name, handler, options));
    }
    function update()
    {
        input.x = Number(held.has("right")) - Number(held.has("left"));
        input.z = Number(held.has("down")) - Number(held.has("up"));
    }
    function clear()
    {
        held.clear();
        input.destination = null;
        update();
        document.querySelectorAll(".held").forEach((el) => el.classList.remove("held"));
    }
    const keys = { w: "up", arrowup: "up", s: "down", arrowdown: "down", a: "left", arrowleft: "left", d: "right", arrowright: "right" };
    on(window, "keydown", (event) =>
    {
        if (document.querySelector("dialog[open]")) return;
        const key = event.key.toLowerCase();
        if (keys[key])
        {
            event.preventDefault();
            input.destination = null;
            held.add(keys[key]);
            update();
            start();
        }
        if (event.repeat) return;
        if (key === "j" || key === " ")
        {
            event.preventDefault();
            action(key === "j" ? "strike" : "dodge", input);
        }
    });
    on(window, "keyup", (event) =>
    {
        held.delete(keys[event.key.toLowerCase()]);
        update();
    });
    on(window, "blur", clear);
    on(document, "visibilitychange", clear);
    on(canvas, "pointerdown", (event) =>
    {
        const point = scene.clickPoint(event.clientX, event.clientY);
        if (!point) return;
        if (Math.abs(point.x - input.playerX) < 8 && Math.abs(point.z - input.guardianZ) < 2)
        {
            action("strike", input);
        }
        else input.destination = point;
        start();
    });
    document.querySelectorAll("[data-move]").forEach((button) =>
    {
        const direction = button.dataset.move;
        on(button, "pointerdown", (event) =>
        {
            event.preventDefault();
            button.setPointerCapture(event.pointerId);
            held.add(direction);
            button.classList.add("held");
            input.destination = null;
            update();
            start();
        });
        const release = () =>
        {
            held.delete(direction);
            button.classList.remove("held");
            update();
        };
        on(button, "pointerup", release);
        on(button, "pointercancel", release);
        on(button, "lostpointercapture", release);
    });
    for (const name of ["strike", "dodge"])
    {
        on(document.getElementById(`mouse-${name}`), "click", () => action(name, input));
        on(document.getElementById(`touch-${name}`), "pointerdown", (event) =>
        {
            event.preventDefault();
            action(name, input);
        });
    }
    return { input, clear, dispose: () => listeners.forEach((remove) => remove()) };
}
