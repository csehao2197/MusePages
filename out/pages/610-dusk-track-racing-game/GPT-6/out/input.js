export function createInput()
{
    const held = new Set();
    const touch = new Set();
    let analog = 0;
    const input = {
        gas: false, brake: false, drift: false, boost: false, reset: false, steer: 0,
        action: () => {}, onCount: () => {}, onBoost: () => {}
    };
    function update()
    {
        input.gas = held.has("KeyW") || held.has("ArrowUp") || touch.has("gas");
        input.brake = held.has("KeyS") || held.has("ArrowDown") || touch.has("brake");
        input.drift = held.has("Space") || touch.has("drift");
        input.boost = held.has("ShiftLeft") || held.has("ShiftRight");
        input.steer = analog || Number(held.has("KeyD") || held.has("ArrowRight")) - Number(held.has("KeyA") || held.has("ArrowLeft"));
    }
    input.clear = () =>
    {
        held.clear();
        touch.clear();
        analog = 0;
        input.reset = false;
        update();
        document.querySelectorAll(".held").forEach((el) => el.classList.remove("held"));
        const knob = document.querySelector("#knob");
        if (knob) knob.style.transform = "";
    };
    const codes = ["KeyW", "KeyS", "KeyA", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "ShiftLeft", "ShiftRight", "KeyR", "KeyP", "Escape", "Enter"];
    addEventListener("keydown", (e) =>
    {
        if (!codes.includes(e.code)) return;
        e.preventDefault();
        if (e.repeat) return;
        if (["KeyP", "Escape", "Enter"].includes(e.code)) input.action(e.code);
        else
        {
            held.add(e.code);
            if (e.code === "KeyR") input.reset = true;
            update();
        }
    });
    addEventListener("keyup", (e) =>
    {
        if (codes.includes(e.code)) e.preventDefault();
        held.delete(e.code);
        update();
    });
    addEventListener("blur", () => input.clear());
    input.bind = () =>
    {
        for (const name of ["gas", "brake", "drift"])
        {
            const button = document.getElementById(name);
            if (!button) continue;
            button.addEventListener("pointerdown", (e) =>
            {
                e.preventDefault();
                button.setPointerCapture(e.pointerId);
                touch.add(name);
                button.classList.add("held");
                update();
            });
            for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
            {
                button.addEventListener(event, () =>
                {
                    touch.delete(name);
                    button.classList.remove("held");
                    update();
                });
            }
        }
        const pad = document.getElementById("steer");
        let pointer = null;
        const move = (e) =>
        {
            if (e.pointerId !== pointer) return;
            const rect = pad.getBoundingClientRect();
            analog = Math.max(-1, Math.min(1, (e.clientX - rect.left - rect.width / 2) / 48));
            document.getElementById("knob").style.transform = `translateX(${analog * 38}px)`;
            update();
        };
        pad?.addEventListener("pointerdown", (e) =>
        {
            e.preventDefault();
            pointer = e.pointerId;
            pad.setPointerCapture(pointer);
            move(e);
        });
        pad?.addEventListener("pointermove", move);
        for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
        {
            pad?.addEventListener(event, () =>
            {
                pointer = null;
                analog = 0;
                document.getElementById("knob").style.transform = "";
                update();
            });
        }
    };
    return input;
}
