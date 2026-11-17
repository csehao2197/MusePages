import { track, bend, course } from "./track.js";

export function createRun()
{
    return { phase: "ready", distance: 0, x: 0, speed: 0, frame: 100, surge: track.initialSurge, haul: 0, elapsed: 0, collected: 0, arches: 0, hits: 0, scrapes: 0, difficulty: 1, passed: new Set(), event: "", eventTime: 0, scraping: false };
}
export function step(run, input, dt)
{
    if (run.phase !== "running") return;
    run.elapsed += dt;
    run.difficulty = 1 + run.distance / track.length * 0.35;
    const boosting = input.boost && run.surge > 1;
    run.speed = (boosting ? track.boost : input.pace ? track.pace : track.cruise) * run.difficulty;
    run.surge = Math.min(100, Math.max(0, run.surge + (boosting ? -track.surgeDrain : track.surgeRegen) * dt));
    const previous = run.distance;
    run.distance = Math.min(track.length, run.distance + run.speed * dt);
    run.x += ((Number(input.right) - Number(input.left)) * track.steer * (input.pace ? 1.14 : 1)) * dt;
    run.x -= (bend(run.distance) - bend(previous)) * 0.46;
    const scraping = Math.abs(run.x) >= track.limit;
    run.frame -= track.frameDrain * dt;
    if (scraping)
    {
        run.frame -= track.wallDamage * dt;
        if (!run.scraping)
        {
            run.scrapes++;
            announce(run, "wall");
        }
        run.x = Math.max(-track.limit, Math.min(track.limit, run.x));
    }
    run.scraping = scraping;
    for (const item of course)
    {
        if (item.distance <= previous || item.distance > run.distance || run.passed.has(item.id)) continue;
        run.passed.add(item.id);
        const aligned = Math.abs(run.x - item.x) < (item.kind === "arch" ? track.roadWidth / 2 : track.hitWidth);
        if (!aligned) continue;
        if (item.kind === "crystal")
        {
            run.haul += track.pickupScore;
            run.collected++;
            announce(run, "pickup");
        }
        else if (item.kind === "arch")
        {
            run.haul += track.archScore;
            run.surge = Math.min(100, run.surge + track.archSurge);
            run.arches++;
            announce(run, "arch");
        }
        else
        {
            run.frame -= track.droneDamage;
            run.hits++;
            announce(run, "hit");
        }
    }
    run.frame = Math.max(0, run.frame);
    if (run.frame <= 0)
    {
        run.phase = "failed";
        run.speed = 0;
    }
    else if (run.distance >= track.length)
    {
        run.phase = "reached";
        run.haul += track.finishScore;
        run.speed = 0;
    }
}
function announce(run, event)
{
    run.event = event;
    run.eventTime = run.elapsed;
}
