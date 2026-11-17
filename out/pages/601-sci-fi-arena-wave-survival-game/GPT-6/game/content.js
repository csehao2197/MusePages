export const names = Object.freeze(
{
    brand: "Lampwright",
    operator: "Hale Relay Works",
    arena: "Sodium Court",
    weapon: "Ash Spool",
    drone: "Wick"
});
const plural = names.drone.endsWith("s") ? names.drone : `${names.drone}s`;
export const content = Object.freeze(
{
    title: `${names.brand} — ${names.arena}`,
    eyebrow: names.operator.toUpperCase(),
    premise: `${names.operator} shut the bay doors on ${names.arena}. The ${plural} are already inside.`,
    enter: "Enter the yard",
    desktopLegend: "WASD move · Mouse look · Click fire · R reload · Esc pause",
    fallbackLegend: "If the lock is blocked: drag the view, arrow keys look, F or the Fire button shoots.",
    touchLegend: "Left stick move · Right stick look · Fire · Reload",
    cells: "Warm floor cells restore health. Cool floor cells restore shield. Neither bar refills on its own.",
    soundOn: "Sound on",
    soundOff: "Sound off",
    credit: "Template by VibeFather",
    creditUrl: "https://vibefather.ai/t/sci-fi-arena-wave-survival-game",
    failure: "This browser could not start the yard view.",
    lockHint: "Pointer lock was blocked. Drag the view to look, or use the arrow keys.",
    wave: "WAVE",
    waveStat: "Wave",
    reached: "Reached wave",
    clear: "Wave clear",
    dropped: "DROPPED",
    droppedStat: `${plural} dropped`,
    shield: "SHIELD",
    health: "HEALTH",
    reloading: "RELOADING",
    paused: "Paused",
    lost: "Yard lost",
    resume: "Resume",
    retry: "Retry",
    fire: "Fire",
    reload: "Reload",
    pause: "Pause",
    move: "Move stick",
    look: "Look stick",
    canvas: `${names.arena}, a first-person drone survival game`
});
