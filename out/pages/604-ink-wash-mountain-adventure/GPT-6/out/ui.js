import { CONTENT, STORAGE_KEY, trailX } from "./content.js";

export function formatTime(seconds)
{
    const whole = Math.floor(seconds);
    return `${String(Math.floor(whole / 60)).padStart(2, "0")}:${String(whole % 60).padStart(2, "0")}`;
}

export function createUI(actions)
{
    const $ = (id) => document.getElementById(id);
    const listeners = [];
    let lastMode = "ready";
    let lastObjective = "";
    let best;
    try { best = Number(localStorage.getItem(`${STORAGE_KEY}-best`)) || null; } catch {}
    function on(id, callback)
    {
        const element = $(id);
        element.addEventListener("click", callback);
        listeners.push(() => element.removeEventListener("click", callback));
    }
    function icons()
    {
        window.lucide?.createIcons();
    }
    function close(dialog)
    {
        dialog.close();
        actions.pause(false);
        $("world").focus({ preventScroll: true });
    }
    function open(dialog)
    {
        actions.pause(true);
        dialog.showModal();
    }
    on("begin", actions.start);
    on("retry", actions.retry);
    on("help", () => open($("help-dialog")));
    on("close-help", () => close($("help-dialog")));
    on("pause", () => open($("pause-dialog")));
    on("resume", () => close($("pause-dialog")));
    on("sound", async () =>
    {
        const enabled = await actions.sound();
        $("sound").setAttribute("aria-label", `Turn sound ${enabled ? "off" : "on"}`);
        $("sound").title = $("sound").getAttribute("aria-label");
        $("sound").innerHTML = `<i data-lucide="${enabled ? "volume-2" : "volume-x"}"></i>`;
        icons();
    });
    on("result-action", () =>
    {
        $("result-dialog").close();
        if (lastMode === "won") actions.restart();
        else actions.retry();
        $("world").focus({ preventScroll: true });
    });
    for (const id of ["help-dialog", "pause-dialog"])
    {
        const dialog = $(id);
        const cancel = (event) =>
        {
            event.preventDefault();
            close(dialog);
        };
        dialog.addEventListener("cancel", cancel);
        listeners.push(() => dialog.removeEventListener("cancel", cancel));
    }
    const resultCancel = (event) => event.preventDefault();
    $("result-dialog").addEventListener("cancel", resultCancel);
    listeners.push(() => $("result-dialog").removeEventListener("cancel", resultCancel));
    icons();
    return {
        setSound(enabled)
        {
            $("sound").setAttribute("aria-label", `Turn sound ${enabled ? "off" : "on"}`);
            $("sound").innerHTML = `<i data-lucide="${enabled ? "volume-2" : "volume-x"}"></i>`;
            icons();
        },
        update(state, target)
        {
            const p = state.player;
            $("breath").style.width = `${p.breath}%`;
            $("breath-value").textContent = Math.floor(p.breath);
            $("hearts").textContent = Array.from({ length: 3 }, (_, i) => i < p.hp ? "◆" : "◇").join(" ");
            $("hearts").setAttribute("aria-label", `Composure: ${p.hp} of 3`);
            $("clock").textContent = formatTime(state.elapsed);
            $("feedback").textContent = state.messageTime > 0 ? state.message : "";
            $("begin").hidden = state.mode !== "ready";
            $("retry").hidden = state.mode === "ready" || state.mode === "won";
            const index = state.guardians.findIndex((g) => !g.resolved);
            const g = state.guardians[index];
            const near = g && Math.hypot(p.x - trailX(g.z), p.z - g.z) < 6.5;
            const objectiveKey = `${state.mode}-${index}-${near}`;
            if (objectiveKey !== lastObjective)
            {
                lastObjective = objectiveKey;
                if (state.mode !== "ready")
                {
                    $("lesson-index").textContent = index < 0 ? "04" : `0${index + 1}`;
                    $("lesson-label").textContent = g?.lesson || "THE QUIET SUMMIT";
                    $("objective").innerHTML = index < 0 ? "The way is open.<br>Find your quiet summit." : near ? "Read the ring.<br>Answer with a form." : `Follow the rain.<br>Find the ${["Reed", "Stone", "Cloud"][index]} Sentinel.`;
                    $("instruction").textContent = index < 0 ? "All three forms learned. Follow the path into the summit circle." : near ? "Dodge the red sweep. Move close and strike three times. Step away to recover Breath." : `The ${g.name} waits further up the trail. Your earlier forms stay learned.`;
                }
                else
                {
                    $("lesson-index").textContent = "01";
                    $("lesson-label").textContent = CONTENT.guardians[0].lesson;
                    $("objective").innerHTML = "The mountain asks<br>only your attention.";
                    $("instruction").innerHTML = "Follow the path. Meet the Reed Sentinel.<br>There is no hurry in the Rainveil Pass.";
                }
            }
            document.querySelectorAll(".journey li").forEach((item, i) =>
            {
                item.classList.toggle("done", i < state.resolved);
                item.classList.toggle("current", i === state.resolved);
                if (i === state.resolved) item.setAttribute("aria-current", "step");
                else item.removeAttribute("aria-current");
            });
            $("target").hidden = !target?.visible || !g;
            if (target?.visible && g)
            {
                $("target").style.left = `${target.x}px`;
                $("target").style.top = `${Math.max(145, target.y)}px`;
                $("target").querySelector("strong").textContent = g.name;
                $("target").querySelector(".target-meter span").style.width = `${g.health / g.maxHealth * 100}%`;
                $("target").classList.toggle("warning", g.phase === "telegraph");
                $("phase").textContent = g.phase === "telegraph" ? "Sweep incoming · dodge" : g.phase === "recovery" ? "An opening · strike" : "Observe its rhythm";
            }
            if (state.mode !== lastMode && ["won", "fallen"].includes(state.mode))
            {
                const won = state.mode === "won";
                if (won && (!best || state.elapsed < best))
                {
                    best = state.elapsed;
                    try { localStorage.setItem(`${STORAGE_KEY}-best`, String(best)); } catch {}
                }
                $("result-kicker").textContent = won ? "THREE FORMS LEARNED" : "ANOTHER CHANCE TO LEARN";
                $("result-title").innerHTML = won ? "A quiet summit.<br>A clearer mind." : "Even the rain<br>begins again.";
                $("result-copy").textContent = won ? `You walked ${CONTENT.world}. ${CONTENT.tagline}` : "Take a fresh breath at this lesson’s checkpoint. Every guardian already calibrated stays learned.";
                $("result-stats").innerHTML = won ? `<span><strong>${formatTime(state.elapsed)}</strong>ACTIVE TIME</span><span><strong>${formatTime(best)}</strong>PERSONAL BEST</span><span><strong>${state.cleanDodges}</strong>CLEAN DODGES</span>` : `<span><strong>${state.resolved} / 3</strong>FORMS RETAINED</span><span><strong>${formatTime(state.elapsed)}</strong>ACTIVE TIME</span>`;
                $("result-action").textContent = won ? "Walk the trail again ↗" : "Retry this lesson ↗";
                if (!$("result-dialog").open) $("result-dialog").showModal();
            }
            lastMode = state.mode;
        },
        dispose()
        {
            listeners.forEach((remove) => remove());
        }
    };
}
