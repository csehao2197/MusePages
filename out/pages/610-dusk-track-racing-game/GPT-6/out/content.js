export const C =
{
    brand: "Pennyglass",
    place: "Wickpenny",
    track: "Barleycut",
    car: "Skiff 4",
    driver: "Nell Harp",
    rivals: "Nia Pell, Omar Voss, Bess Calder",
    credit: "Template by VibeFather",
    creditUrl: "https://vibefather.ai/t/dusk-track-racing-game",
    labels:
    {
        start: "Start race", controls: "Controls", back: "Back", resume: "Resume",
        restart: "Restart", again: "Run it again", home: "Back to start",
        clear: "Clear ghost", soundOff: "Sound off", soundOn: "Sound on",
        paused: "Paused", complete: "Heat complete", noBest: "No best lap yet",
        newBest: "New best lap", best: "Best lap", pause: "Pause",
        off: "Back on the asphalt", reset: "Reset", wrong: "Wrong way",
        fallback: "This browser could not start the 3D view. Try a browser with WebGL enabled.",
        scene: "Third-person race on a banked circuit at dusk",
        lap: "LAP", position: "POSITION", lapTime: "LAP TIME", speed: "km/h",
        boost: "BOOST", gas: "GAS", brake: "BRAKE", drift: "DRIFT",
        ahead: "Ahead:", behind: "Behind:", ready: "THE GOLDEN HOUR HEAT",
        circuit: "CLOSED CIRCUIT", laps: "3 LAPS", local: "BROWSER BEST",
        saved: "Your best lap is saved in this browser.", unavailable: "Browser storage is unavailable; this session still keeps your best lap.",
        unfinished: "Racing", standby: "READY WHEN YOU ARE", countdown: ["3", "2", "1", "GO"]
    },
    gates: ["North Gate", "Sweeper", "Hairpin"],
    keyboard:
    [
        ["W / ↑", "Gas"], ["S / ↓", "Brake / reverse"], ["A D / ← →", "Steer"],
        ["SPACE", "Drift"], ["SHIFT", "Boost when full"], ["R", "Last checkpoint"],
        ["P / ESC", "Pause"]
    ],
    touchHelp: "The left pad steers. Hold Gas, Brake, and Drift on the right. Drift through a turn to fill the boost.",
    intro()
    {
        return `3 laps of ${this.track} in the ${this.car}. Drift to fill the boost, stay on the asphalt, and beat ${this.names[0]}, ${this.names[1]}, and ${this.names[2]}.`;
    },
    fine()
    {
        return `A practice heat at ${this.place}. The best lap stays in this browser and comes back as a ghost.`;
    },
    result(place)
    {
        return place === 1 ? `${this.driver} took ${this.track}.` : `${this.driver} finished ${ordinal(place)} at ${this.track}.`;
    }
};
C.names = C.rivals.split(",").map((name) => name.trim());
C.key = `${C.brand.toLowerCase().replaceAll(" ", "-")}::${C.track.toLowerCase().replaceAll(" ", "-")}::best-lap`;
C.title = `${C.brand} — ${C.track}`;
C.line = `${C.track} line`;
export function ordinal(n)
{
    return `${n}${["th", "st", "nd", "rd"][n] || "th"}`;
}
export function time(t)
{
    return Number.isFinite(t) ? `${Math.floor(t / 60)}:${(t % 60).toFixed(2).padStart(5, "0")}` : "—";
}
