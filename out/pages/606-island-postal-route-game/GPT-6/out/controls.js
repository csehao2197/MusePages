export function createControls(interact)
{
    const pressed = new Set();
    const abort = new AbortController();
    const options = { signal: abort.signal };
    const keys = new Map([["w", "up"], ["arrowup", "up"], ["s", "down"], ["arrowdown", "down"], ["a", "left"], ["arrowleft", "left"], ["d", "right"], ["arrowright", "right"]]);
    window.addEventListener("keydown", event =>
    {
        if (document.querySelector("dialog[open]")) return;
        const key = event.key.toLowerCase();
        if (keys.has(key))
        {
            event.preventDefault();
            pressed.add(keys.get(key));
        }
        if (key === "e" && !event.repeat) interact();
    }, options);
    window.addEventListener("keyup", event => pressed.delete(keys.get(event.key.toLowerCase())), options);
    window.addEventListener("blur", () => pressed.clear(), options);
    document.addEventListener("visibilitychange", () => pressed.clear(), options);
    document.querySelectorAll("[data-dir]").forEach(button =>
    {
        button.addEventListener("pointerdown", event =>
        {
            event.preventDefault();
            button.setPointerCapture(event.pointerId);
            pressed.add(button.dataset.dir);
        }, options);
        for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
        {
            button.addEventListener(type, () => pressed.delete(button.dataset.dir), options);
        }
    });
    return {
        input()
        {
            if (document.querySelector("dialog[open]")) return { x: 0, z: 0 };
            return { x: Number(pressed.has("right")) - Number(pressed.has("left")), z: Number(pressed.has("down")) - Number(pressed.has("up")) };
        },
        dispose()
        {
            abort.abort();
            pressed.clear();
        }
    };
}
