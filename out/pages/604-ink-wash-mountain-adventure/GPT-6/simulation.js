import { makePlayer, movePlayer } from "./player.js";
import { makeGuardians } from "./guardians.js";
import { strike, dodge, updateCombat } from "./combat.js";

export function createSimulation(sound = () => {})
{
    const state =
    {
        mode: "ready",
        player: makePlayer(),
        guardians: makeGuardians(),
        resolved: 0,
        elapsed: 0,
        hits: 0,
        strikes: 0,
        dodges: 0,
        cleanDodges: 0,
        retries: 0,
        message: "",
        messageTime: 0,
        sound,
        notice(message)
        {
            this.message = message;
            this.messageTime = 2.4;
        }
    };
    return {
        state,
        start()
        {
            if (state.mode === "ready") state.mode = "playing";
        },
        action(action, input)
        {
            this.start();
            if (action === "strike") strike(state);
            if (action === "dodge") dodge(state, input.x, input.z);
        },
        retry()
        {
            const index = state.guardians.findIndex((g) => !g.resolved);
            if (index < 0) return;
            state.player = makePlayer(state.guardians[index].z + 6);
            const fresh = makeGuardians();
            state.guardians[index] = fresh[index];
            state.mode = "playing";
            state.retries++;
            state.notice("A fresh breath. Earlier forms stay learned.");
        },
        step(dt, input)
        {
            if (state.mode !== "playing") return;
            state.elapsed += dt;
            state.messageTime = Math.max(0, state.messageTime - dt);
            movePlayer(state, input, dt);
            updateCombat(state, dt);
            if (state.resolved === 3 && Math.hypot(state.player.x, state.player.z + 89) < 3)
            {
                state.mode = "won";
                state.sound("resolve");
            }
        }
    };
}
