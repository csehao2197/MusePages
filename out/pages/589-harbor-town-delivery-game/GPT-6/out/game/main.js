import { content, BRAND, TOWN_NAME } from "./content.js";
import { createUI } from "./ui.js";
import { createScene } from "./scene.js";
import { createDriving } from "./driving.js";
import { createMissions } from "./missions.js";
import { createMinimap } from "./minimap.js";
import { createAudio } from "./audio.js";

const ui = createUI(document.getElementById("app"));
document.title = `${BRAND} — ${TOWN_NAME}`;
const missions = createMissions();
let help = false;
let helpResume = false;
await document.fonts.ready;
try
{
    const world = createScene(ui.get("world"));
    const driving = createDriving(world.colliders);
    const mini = createMinimap(ui.get("minimap"));
    const audio = createAudio();
    let last = performance.now();
    let animation;
    function clearInput()
    {
        driving.keys.clear();
        document.querySelectorAll(".held").forEach(button => button.classList.remove("held"));
    }
    function start()
    {
        help = false;
        clearInput();
        driving.reset();
        missions.start();
        last = performance.now();
    }
    function pause()
    {
        if (help) return;
        if (missions.state.phase === "playing") missions.state.phase = "paused";
        else if (missions.state.phase === "paused") missions.state.phase = "playing";
        clearInput();
        last = performance.now();
    }
    function interact()
    {
        if (help) return;
        if (missions.interact(driving.van)) audio.chime(missions.state.phase === "won");
    }
    function recover()
    {
        if (missions.state.phase !== "playing" || help) return;
        driving.recover();
        clearInput();
        missions.state.message = content.recoverNote;
    }
    function showHelp()
    {
        helpResume = missions.state.phase === "playing";
        if (helpResume) missions.state.phase = "paused";
        help = true;
        clearInput();
    }
    function primary()
    {
        if (help)
        {
            help = false;
            if (helpResume) missions.state.phase = "playing";
            last = performance.now();
        }
        else if (missions.state.phase === "paused") pause();
        else start();
    }
    function reset()
    {
        if (missions.state.phase === "ready") return;
        const wasPlaying = missions.state.phase === "playing";
        if (wasPlaying) missions.state.phase = "paused";
        clearInput();
        if (window.confirm(content.resetConfirm)) start();
        else
        {
            if (wasPlaying) missions.state.phase = "playing";
            last = performance.now();
        }
    }
    ui.get("primary").addEventListener("click", primary);
    ui.get("pause").addEventListener("click", pause);
    ui.get("help").addEventListener("click", showHelp);
    ui.get("reset").addEventListener("click", reset);
    ui.get("recover").addEventListener("click", recover);
    ui.get("interact").addEventListener("click", interact);
    ui.get("sound").addEventListener("click", () =>
    {
        const enabled = audio.toggle();
        if (enabled === null) missions.state.message = content.soundStatus;
        else
        {
            ui.sound(enabled);
            if (enabled) audio.chime();
        }
    });
    const controls = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD", "Space"]);
    document.addEventListener("keydown", event =>
    {
        if (event.code === "Tab" && ui.modalKind)
        {
            event.preventDefault();
            ui.get("primary").focus();
            return;
        }
        if (controls.has(event.code))
        {
            if (event.target instanceof HTMLButtonElement && event.code === "Space") return;
            event.preventDefault();
            if (missions.state.phase === "playing" && !help) driving.keys.add(event.code);
        }
        if (event.repeat) return;
        if (event.code === "KeyE") interact();
        if (event.code === "KeyP" || event.code === "Escape")
        {
            if (help) primary();
            else pause();
        }
        if (event.code === "KeyR") recover();
    });
    document.addEventListener("keyup", event => driving.keys.delete(event.code));
    document.querySelectorAll("[data-key]").forEach(button =>
    {
        button.addEventListener("pointerdown", event =>
        {
            event.preventDefault();
            if (missions.state.phase !== "playing" || help) return;
            button.setPointerCapture(event.pointerId);
            driving.keys.add(button.dataset.key);
            button.classList.add("held");
        });
        ["pointerup", "pointercancel", "lostpointercapture"].forEach(type => button.addEventListener(type, () =>
        {
            driving.keys.delete(button.dataset.key);
            button.classList.remove("held");
        }));
    });
    window.addEventListener("blur", () =>
    {
        if (missions.state.phase === "playing") pause();
        clearInput();
    });
    document.addEventListener("visibilitychange", () =>
    {
        if (document.hidden && missions.state.phase === "playing") pause();
    });
    Object.defineProperty(window, "harborGame",
    {
        value: Object.freeze({ getState: () => structuredClone({ ...missions.state, van: driving.van, target: missions.target(), help, webgl: world.renderer.getContext() instanceof WebGL2RenderingContext }) }),
        writable: false
    });
    function frame(now)
    {
        const elapsed = Math.max(0, (now - last) / 1000);
        last = now;
        const phase = missions.state.phase;
        missions.tick(elapsed);
        if (missions.state.phase === "playing" && !help)
        {
            const dt = Math.min(0.05, elapsed);
            const steps = Math.max(1, Math.ceil(dt / 0.016));
            for (let index = 0; index < steps; index++) driving.tick(dt / steps);
        }
        if (phase === "playing" && missions.state.phase !== "playing") clearInput();
        ui.update(missions, driving.van, help);
        mini.render(driving.van, missions);
        world.render(driving.van, missions, now / 1000);
        const marker = ui.get("target-marker");
        marker.hidden = missions.state.cargo === 0;
        if (!marker.hidden)
        {
            const point = world.projectTarget(missions.target());
            marker.style.left = `${point.x}%`;
            marker.style.top = `${point.y}%`;
            marker.textContent = String(missions.state.delivered + 1).padStart(2, "0");
        }
        animation = requestAnimationFrame(frame);
    }
    ui.get("load-status").remove();
    ui.update(missions, driving.van, help);
    animation = requestAnimationFrame(frame);
    window.addEventListener("pagehide", () =>
    {
        cancelAnimationFrame(animation);
        clearInput();
        world.dispose();
    }, { once: true });
}
catch (error)
{
    ui.get("load-status").textContent = content.webglError;
    ui.get("primary").disabled = true;
    console.error(error);
}
