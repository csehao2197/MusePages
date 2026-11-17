import { CONTENT, deliveryCopy, deliveredCopy, porchComplete, lapComplete } from "./content.js";
import { PICKUP, PORCHES, GATES } from "./world.js";

export function makeMissions(world, driver, bests, save, toast, sound)
{
    const state = { type: null, stage: 0, elapsed: 0, started: false, delivered: 0, completed: 0, lastScore: 0, lastLap: 0 };
    let gateInside = false;

    function cancel()
    {
        Object.assign(state, { type: null, stage: 0, elapsed: 0, started: false, delivered: 0 });
        gateInside = false;
        world.target.visible = false;
        world.gateMeshes.forEach((mesh) => { mesh.visible = false; });
    }

    function target()
    {
        if (state.type === "porch") return state.stage === 0 ? PICKUP : PORCHES[state.stage - 1];
        if (state.type === "lap") return GATES[state.stage % 6];
        return null;
    }

    function start(type)
    {
        if (type === "lap" && !driver.state.car)
        {
            toast(CONTENT.messages.needCar);
            return false;
        }
        cancel();
        state.type = type;
        state.started = type === "porch";
        if (type === "lap") toast(CONTENT.messages.raceStart);
        sound.chime();
        return true;
    }

    function canInteract()
    {
        const point = target();
        return state.type === "porch" && point && Math.hypot(driver.state.x - point.x, driver.state.z - point.z) < 6;
    }

    function interact()
    {
        if (!canInteract()) return false;
        if (driver.state.car)
        {
            return false;
        }
        sound.chime();
        if (state.stage === 0)
        {
            state.stage = 1;
            toast(CONTENT.messages.collected);
        }
        else
        {
            state.delivered++;
            state.stage++;
            if (state.delivered === 3)
            {
                const score = Math.max(100, 1200 - Math.round(state.elapsed * 2) - driver.state.collisions * 15);
                state.lastScore = score;
                state.completed++;
                bests.porch = Math.max(bests.porch || 0, score);
                save();
                toast(porchComplete(score), 6000);
                cancel();
            }
            else toast(deliveredCopy(state.delivered));
        }
        return true;
    }

    function update(dt, elapsed)
    {
        if (state.started) state.elapsed += dt;
        world.target.visible = state.type === "porch";
        if (world.target.visible)
        {
            const point = target();
            world.target.position.set(point.x, 0, point.z);
            world.parcel.rotation.y += dt * .4;
            world.beacon.position.y = 5 + Math.sin(elapsed * 2) * .35;
        }
        world.gateMeshes.forEach((mesh, index) => { mesh.visible = state.type === "lap" && index === state.stage % 6; });
        if (state.type !== "lap") return;
        const gate = target();
        const inside = Math.hypot(driver.state.x - gate.x, driver.state.z - gate.z) < 5.7;
        if (inside && !gateInside && driver.state.car && Math.abs(driver.state.speed) > 1)
        {
            sound.chime();
            if (!state.started)
            {
                state.started = true;
                state.elapsed = 0;
                state.stage = 1;
            }
            else if (state.stage === 6)
            {
                state.lastLap = state.elapsed;
                state.completed++;
                bests.lap = !bests.lap ? state.elapsed : Math.min(bests.lap, state.elapsed);
                save();
                toast(lapComplete(state.elapsed), 7000);
                cancel();
            }
            else
            {
                state.stage++;
            }
        }
        gateInside = inside;
    }

    function copy()
    {
        if (state.type === "porch")
        {
            return { title: state.stage === 0 ? CONTENT.messages.pickup : deliveryCopy(state.stage - 1), body: state.stage === 0 ? CONTENT.messages.pickupCopy : CONTENT.messages.needFoot, progress: `${state.delivered} / 3 · ${Math.floor(state.elapsed)}s` };
        }
        if (state.type === "lap")
        {
            return { title: CONTENT.race, body: state.started ? `${CONTENT.labels.gate} ${state.stage % 6 + 1} / 6${state.stage === 6 ? " · Finish" : ""}` : CONTENT.messages.pausedRace, progress: `${state.elapsed.toFixed(2)}s` };
        }
        return { title: state.completed ? CONTENT.labels.done : CONTENT.messages.ready, body: state.completed ? CONTENT.labels.selectAgain : CONTENT.messages.idle, progress: "" };
    }
    return { state, start, cancel, target, canInteract, interact, update, copy };
}
