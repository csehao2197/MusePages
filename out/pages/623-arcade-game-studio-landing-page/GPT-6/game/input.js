export function wireInput(game)
{
    const { canvas } = game;
    canvas.addEventListener("keydown", (event) =>
    {
        if (["Space", "ArrowUp", "ArrowDown", "KeyW", "KeyS", "KeyP", "Escape"].includes(event.code))
        {
            event.preventDefault();
            if (event.repeat) return;
            if (["Space", "ArrowUp", "KeyW"].includes(event.code)) game.jump();
            if (["ArrowDown", "KeyS"].includes(event.code)) game.setDuck(true);
            if (["KeyP", "Escape"].includes(event.code)) game.pause();
        }
    });
    canvas.addEventListener("keyup", (event) =>
    {
        if (["ArrowDown", "KeyS"].includes(event.code)) game.setDuck(false);
    });
    canvas.addEventListener("blur", () => game.setDuck(false));
    canvas.addEventListener("pointerdown", (event) =>
    {
        if (event.button === 0) game.jump();
    });
    document.querySelector("#jump").addEventListener("click", () =>
    {
        game.jump();
        canvas.focus({ preventScroll: true });
    });
    const duck = document.querySelector("#duck");
    duck.addEventListener("pointerdown", (event) =>
    {
        event.preventDefault();
        duck.setPointerCapture(event.pointerId);
        game.setDuck(true);
    });
    for (const name of ["pointerup", "pointercancel", "lostpointercapture"])
    {
        duck.addEventListener(name, () => game.setDuck(false));
    }
    duck.addEventListener("keydown", (event) =>
    {
        if (event.code === "Space" || event.code === "Enter")
        {
            event.preventDefault();
            game.setDuck(true);
        }
    });
    duck.addEventListener("keyup", () => game.setDuck(false));
    document.querySelector("#pause-game").addEventListener("click", game.pause);
    document.querySelector("#play-hero").addEventListener("click", () =>
    {
        document.querySelector("#arcade").scrollIntoView({ block: "center", behavior: "smooth" });
        game.start();
    });
}
