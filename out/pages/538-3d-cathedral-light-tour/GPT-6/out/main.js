import { content } from "./content.js";
import { mountDOM, syncStop, syncTime } from "./dom.js";
import { createTourRenderer } from "./rendering.js";

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const state =
{
    tourProgress: 0, activeStop: 0, timeMinutes: 990,
    lookOffset: { yaw: 0, pitch: 0 }, menuOpen: false,
    quality: "fallback", webglAvailable: false, renderEvidence: null
};
mountDOM(state);
const canvas = document.querySelector("#nave");
const renderer = createTourRenderer(canvas, state, reduced);
if (!renderer)
{
    canvas.hidden = true;
    document.querySelector(".fallback").hidden = false;
}
const controller = new AbortController();
const listen = (element, name, handler, options = {}) => element.addEventListener(name, handler, { ...options, signal: controller.signal });
let pendingFocus = null;
function refresh()
{
    renderer?.request();
}
function resetLook()
{
    state.lookOffset.yaw = 0;
    state.lookOffset.pitch = 0;
    refresh();
}
function setTime(minutes)
{
    state.timeMinutes = Math.max(360, Math.min(1200, Math.round(minutes / 15) * 15));
    syncTime(state);
    refresh();
}
function scrollProgress()
{
    const shell = document.querySelector("#tour");
    const distance = shell.offsetHeight - innerHeight;
    state.tourProgress = Math.max(0, Math.min(1, (scrollY - shell.offsetTop) / distance));
    const stop = Math.round(state.tourProgress * 5);
    if (state.activeStop !== stop)
    {
        state.activeStop = stop;
        syncStop(state);
    }
    if (pendingFocus !== null && Math.abs(state.tourProgress * 5 - pendingFocus) < .012)
    {
        document.querySelector(`#stop-heading-${pendingFocus}`).focus({ preventScroll: true });
        pendingFocus = null;
    }
    refresh();
}
function goStop(index)
{
    resetLook();
    pendingFocus = index;
    const shell = document.querySelector("#tour");
    window.scrollTo({ top: shell.offsetTop + index / 5 * (shell.offsetHeight - innerHeight), behavior: reduced ? "instant" : "smooth" });
    scrollProgress();
}
for (const button of document.querySelectorAll("[data-go]"))
{
    listen(button, "click", () => goStop(Number(button.dataset.go)));
}
for (const button of document.querySelectorAll("[data-reset]"))
{
    listen(button, "click", resetLook);
}
for (const range of document.querySelectorAll(".time-range"))
{
    listen(range, "input", () => setTime(Number(range.value)));
}
for (const preset of document.querySelectorAll("[data-time]"))
{
    listen(preset, "click", () => setTime(Number(preset.dataset.time)));
}
listen(document.querySelector("#restart"), "click", () =>
{
    setTime(990);
    goStop(0);
});
const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector("#mobile-menu");
function toggleMenu(open, returnFocus = false)
{
    state.menuOpen = open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? content.labels.close : content.labels.menu);
    mobileMenu.hidden = !open;
    if (open)
    {
        mobileMenu.querySelector("a").focus();
    }
    else if (returnFocus)
    {
        menuButton.focus();
    }
}
listen(menuButton, "click", () => toggleMenu(!state.menuOpen));
for (const link of mobileMenu.querySelectorAll("a"))
{
    listen(link, "click", () => toggleMenu(false));
}
listen(document, "keydown", event =>
{
    if (event.key === "Escape" && state.menuOpen)
    {
        toggleMenu(false, true);
    }
});
listen(window, "scroll", scrollProgress, { passive: true });
listen(window, "resize", scrollProgress);
const lookSurface = renderer ? canvas : document.querySelector(".fallback");
lookSurface.tabIndex = 0;
lookSurface.setAttribute("aria-label", content.labels.keys);
let drag = null;
listen(lookSurface, "pointerdown", event =>
{
    drag = { x: event.clientX, y: event.clientY, yaw: state.lookOffset.yaw, pitch: state.lookOffset.pitch };
    if (event.pointerType === "mouse")
    {
        lookSurface.setPointerCapture(event.pointerId);
    }
});
listen(lookSurface, "pointermove", event =>
{
    if (!drag)
    {
        return;
    }
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (event.pointerType !== "mouse" && Math.abs(dy) > Math.abs(dx))
    {
        return;
    }
    state.lookOffset.yaw = Math.max(-Math.PI / 6, Math.min(Math.PI / 6, drag.yaw - dx * .003));
    state.lookOffset.pitch = Math.max(-Math.PI / 10, Math.min(Math.PI / 10, drag.pitch + dy * .002));
    refresh();
});
listen(lookSurface, "pointerup", () => { drag = null; });
listen(lookSurface, "pointercancel", () => { drag = null; });
listen(lookSurface, "keydown", event =>
{
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "r", "R"];
    if (!keys.includes(event.key))
    {
        return;
    }
    event.preventDefault();
    if (event.key.toLowerCase() === "r")
    {
        resetLook();
        return;
    }
    const offset = .06;
    if (event.key === "ArrowLeft") state.lookOffset.yaw -= offset;
    if (event.key === "ArrowRight") state.lookOffset.yaw += offset;
    if (event.key === "ArrowUp") state.lookOffset.pitch -= offset;
    if (event.key === "ArrowDown") state.lookOffset.pitch += offset;
    state.lookOffset.yaw = Math.max(-Math.PI / 6, Math.min(Math.PI / 6, state.lookOffset.yaw));
    state.lookOffset.pitch = Math.max(-Math.PI / 10, Math.min(Math.PI / 10, state.lookOffset.pitch));
    refresh();
});
syncStop(state);
scrollProgress();
// Read-only state snapshots expose actual renderer evidence for private browser QA.
window.tourEvidence = () => structuredClone(state);
listen(window, "pagehide", () =>
{
    renderer?.dispose();
    controller.abort();
});
