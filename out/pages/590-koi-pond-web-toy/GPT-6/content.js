import { icons } from "./icons.js";

export const content = Object.freeze(
{
    brand: "Emberfin",
    tagline: "A small pond for long thoughts.",
    startSeason: "autumn",
    startNight: false,
    koiCount: 9,
    focusMinutes: 25,
    title: "Emberfin · Koi Pond",
    gestures:
    [
        { id: "tap", text: "Tap for ripples", icon: "droplets" },
        { id: "hold", text: "Hold to feed", icon: "hand" },
        { id: "drag", text: "Drag a current", icon: "waves" }
    ],
    seasons:
    [
        { id: "spring", name: "Spring", line: "Petals on the water", icon: "flower-2" },
        { id: "summer", name: "Summer", line: "Lotus and dragonflies", icon: "sun" },
        { id: "autumn", name: "Autumn", line: "Ginkgo gold", icon: "leaf" },
        { id: "winter", name: "Winter", line: "Thin ice, slow fish", icon: "snowflake" }
    ],
    labels:
    {
        night: "Night", rain: "Rain", snow: "Snow", sound: "Sound",
        focus: "Focus", pause: "Pause", resume: "Resume", exit: "Exit focus",
        complete: "Session complete", another: "Another round", back: "Back to the pond",
        sessionLine: "25 minutes by the water. The koi kept watch.",
        dock: "Pond controls", focusControls: "Focus controls"
    },
    credit: { text: "Template by VibeFather", href: "https://vibefather.ai/t/koi-pond-web-toy" },
    icons
});

export function icon(name)
{
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${content.icons[name] || content.icons.leaf}</svg>`;
}
