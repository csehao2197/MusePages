import { CONTENT } from "./content.js";
import createElement from "./vendor/lucide/createElement.js";
import Play from "./vendor/lucide/icons/play.js";
import Pause from "./vendor/lucide/icons/pause.js";
import Volume2 from "./vendor/lucide/icons/volume-2.js";
import VolumeX from "./vendor/lucide/icons/volume-x.js";
import CircleHelp from "./vendor/lucide/icons/circle-help.js";
import Car from "./vendor/lucide/icons/car.js";
import Flag from "./vendor/lucide/icons/flag.js";
import Package from "./vendor/lucide/icons/package.js";
import X from "./vendor/lucide/icons/x.js";

export function makeUI(driver, missions, bests, sound, game)
{
    const $ = (id) => document.getElementById(id);
    let toastUntil = 0;
    function toast(message, duration = 3500)
    {
        $("toast").textContent = message;
        $("toast").classList.add("visible");
        toastUntil = performance.now() + duration;
    }
    function icons()
    {
        const available = { play: Play, pause: Pause, "volume-2": Volume2, "volume-x": VolumeX, "circle-help": CircleHelp, car: Car, flag: Flag, package: Package, x: X };
        document.querySelectorAll("[data-lucide]").forEach((placeholder) =>
        {
            const element = createElement(available[placeholder.dataset.lucide]);
            element.setAttribute("stroke-width", "1.6");
            element.setAttribute("aria-hidden", "true");
            placeholder.replaceWith(element);
        });
    }
    function soundButton()
    {
        $("sound").setAttribute("aria-label", bests.mute ? CONTENT.labels.muted : CONTENT.labels.unmuted);
        $("sound").innerHTML = `<i data-lucide="${bests.mute ? "volume-x" : "volume-2"}"></i>`;
        icons();
    }
    function start()
    {
        if (game.started) return;
        game.started = true;
        document.body.classList.add("playing");
        $("title-card").hidden = true;
        $("mission-panel").hidden = false;
        $("drive-hud").hidden = false;
        $("mobile-controls").hidden = false;
        $("place-label").hidden = true;
        sound.activate();
        toast(CONTENT.messages.welcome);
    }
    function paused()
    {
        return $("pause-dialog").open || $("help-dialog").open;
    }
    function togglePause()
    {
        driver.clearInput();
        if ($("help-dialog").open) $("help-dialog").close();
        else if ($("pause-dialog").open) $("pause-dialog").close();
        else $("pause-dialog").showModal();
    }
    function reset()
    {
        driver.reset();
        missions.cancel();
        game.reset();
        $("pause-dialog").close();
        toast(CONTENT.messages.reset);
    }
    function action()
    {
        if (!game.started || paused()) return;
        sound.activate();
        if (!missions.interact()) driver.toggleCar();
    }
    $("play").addEventListener("click", start);
    $("sound").addEventListener("click", () => { sound.toggle(); soundButton(); });
    $("help").addEventListener("click", () =>
    {
        driver.clearInput();
        $("help-dialog").showModal();
    });
    document.querySelectorAll(".close-dialog").forEach((button) => button.addEventListener("click", () => $("help-dialog").close()));
    $("pause").addEventListener("click", togglePause);
    $("resume").addEventListener("click", () => $("pause-dialog").close());
    $("reset").addEventListener("click", reset);
    $("action").addEventListener("click", action);
    $("errand").addEventListener("click", () => missions.start("porch"));
    $("race").addEventListener("click", () => missions.start("lap"));
    $("cancel-mission").addEventListener("click", () => missions.cancel());
    for (const dialog of document.querySelectorAll("dialog"))
    {
        dialog.addEventListener("cancel", () => driver.clearInput());
    }
    const keys = { KeyW: "forward", ArrowUp: "forward", KeyS: "brake", ArrowDown: "brake", KeyA: "left", ArrowLeft: "left", KeyD: "right", ArrowRight: "right", Space: "handbrake" };
    window.addEventListener("keydown", (event) =>
    {
        if (event.code in keys)
        {
            if (event.target instanceof HTMLButtonElement && event.code === "Space") return;
            event.preventDefault();
            if (game.started && !paused()) driver.input[keys[event.code]] = true;
        }
        if (event.repeat) return;
        if (event.code === "KeyE") action();
        if (event.code === "KeyP")
        {
            event.preventDefault();
            togglePause();
        }
        if (event.code === "Escape" && !paused())
        {
            event.preventDefault();
            togglePause();
        }
        if (event.code === "KeyR" && game.started && !paused()) reset();
    });
    window.addEventListener("keyup", (event) =>
    {
        if (event.code in keys) driver.input[keys[event.code]] = false;
    });
    window.addEventListener("blur", () => driver.clearInput());
    document.addEventListener("visibilitychange", () =>
    {
        if (document.hidden)
        {
            driver.clearInput();
            if (game.started && !paused()) $("pause-dialog").showModal();
        }
    });
    document.querySelectorAll("[data-control]").forEach((button) =>
    {
        const control = button.dataset.control;
        button.addEventListener("pointerdown", (event) =>
        {
            event.preventDefault();
            if (paused()) return;
            button.setPointerCapture(event.pointerId);
            button.classList.add("pressed");
            driver.input[control] = true;
            sound.activate();
        });
        const release = () =>
        {
            driver.input[control] = false;
            button.classList.remove("pressed");
        };
        button.addEventListener("pointerup", release);
        button.addEventListener("pointercancel", release);
        button.addEventListener("lostpointercapture", release);
    });

    function update()
    {
        const data = missions.copy();
        $("objective-title").textContent = data.title;
        const target = missions.target();
        const meters = target ? Math.round(Math.hypot(driver.state.x - target.x, driver.state.z - target.z)) : 0;
        $("objective-copy").textContent = `${data.body}${target ? ` · ${meters}${CONTENT.labels.yards}` : ""}`;
        $("mission-progress").hidden = !missions.state.type;
        $("progress-label").textContent = data.progress;
        document.querySelector(".mission-options").hidden = !!missions.state.type;
        $("porch-best").textContent = bests.porch ? `${bests.porch} pts` : "—";
        $("lap-best").textContent = bests.lap ? `${bests.lap.toFixed(2)}s` : "—";
        $("speed").textContent = Math.round(Math.abs(driver.state.speed) * 3.6);
        $("travel-mode").textContent = driver.state.car ? CONTENT.messages.drive : CONTENT.messages.foot;
        $("vehicle-name").textContent = driver.state.car ? driver.state.car.name : CONTENT.messages.walking;
        $("drive-hint").textContent = driver.state.car ? CONTENT.messages.carHint : CONTENT.messages.footHint;
        let label = CONTENT.messages.noAction;
        const deliver = missions.canInteract() && !driver.state.car;
        if (deliver) label = missions.state.stage === 0 ? CONTENT.messages.collect : CONTENT.messages.deliver;
        else if (driver.state.car) label = CONTENT.messages.exit;
        else if (driver.nearestCar()) label = CONTENT.messages.enter;
        $("action").disabled = !deliver && !driver.state.car && !driver.nearestCar();
        $("action").innerHTML = `${label} <kbd>E</kbd>`;
        if (performance.now() > toastUntil) $("toast").classList.remove("visible");
    }
    soundButton();
    return { toast, paused, update };
}
