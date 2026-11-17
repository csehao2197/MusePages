const defaults =
{
    brand: "Lumen Dock",
    venue: "Glass Pier",
    city: "Harborline",
    attendant: "Nia Pell",
    deck: "Keep the spark and clear the pier.",
    attendantLine: "Nia Pell opens the cabinet after dusk.",
    hours: "Cabinet 4 on Glass Pier. Open 4 pm to midnight.",
    body: "Five rounds. Three sparks. Move the bar with the mouse, the arrow keys, or a finger drag. Click, tap, or press Space to send the ball. Catch Scatter, Needle, and Girder.",
    credit: "Template by VibeFather",
    creditUrl: "https://vibefather.ai/t/3d-neon-breakout-arcade",
    rounds: ["Pier Lights", "Kelp Gate", "Lantern Stack", "Tide Teeth", "Last Beacon"],
    canvas: "Three-dimensional breakout on a lit grid court.",
    play: "Play round one",
    controls: "Controls",
    controlsHeading: "How the bar moves.",
    controlsLines: ["Mouse: the bar follows your horizontal position.", "Arrow keys: move left or right.", "Finger: drag anywhere on the court.", "Click, tap, or Space: send the ball while it rests on the bar.", "Esc pauses. M mutes."],
    back: "Back",
    pause: "Pause",
    paused: "Paused.",
    resume: "Resume",
    restart: "Restart round",
    soundOn: "Sound on",
    soundOff: "Sound off",
    pts: "PTS",
    rnd: "RND",
    blocks: "BLOCKS",
    sparks: "SPARKS",
    rest: "REST",
    live: "LIVE",
    clear: "Round clear",
    final: "Glass Pier clear",
    five: "Five rounds.",
    next: "Next round",
    again: "Play again",
    fail: "Out of sparks.",
    retry: "Run it back",
    best: "Best",
    newBest: "New best",
    returned: "Spark returned",
    full: "Sparks full",
    lost: n => `Spark lost · ${n} left`,
    scatter: n => `Scatter · ${n === 2 ? "two more balls" : n === 1 ? "one more ball" : "court is full"}`,
    needle: "Needle · beam ready",
    girder: "Girder · bar stretched",
    needleChip: "NEEDLE",
    girderChip: "GIRDER",
    serveHint: "Click, tap, or Space to send the ball.",
    fallback: "This browser could not start the 3D view. Try a browser with WebGL enabled.",
    courtMark: "AFTER DUSK / CABINET 4",
    pad: "MOVE THE BAR. KEEP THE SPARK.",
    format: n => n.toLocaleString("en-US")
};
export function createContent(overrides = {})
{
    const copy = { ...defaults, ...overrides };
    const originalNames = ["brand", "venue", "city", "attendant"].every(key => copy[key] === defaults[key]);
    if (copy.venue === "Millhouse Rec")
    {
        copy.attendantLine = "Ellis Ward leaves the cabinet on after lab hours";
        copy.hours = "Room 12 at Millhouse Rec. Open 7 pm to 11 pm";
        copy.rounds = ["Lab Lights", "Coil Gate", "Shelf Stack", "Gear Teeth", "Last Bell"];
    }
    else if (!originalNames)
    {
        copy.attendantLine = `${copy.attendant} keeps the cabinet lit after dusk.`;
        copy.hours = `Cabinet 4 at ${copy.venue}. Open 4 pm to midnight.`;
        copy.rounds = [`${copy.venue} Lights`, "Near Gate", "Night Stack", "Quiet Teeth", `${copy.venue} Beacon`];
    }
    copy.final = `${copy.venue} clear`;
    return copy;
}
export const C = createContent();
export const saveKey = C.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-cabinet";
