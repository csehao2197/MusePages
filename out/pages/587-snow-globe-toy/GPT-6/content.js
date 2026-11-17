export const content =
{
    brand: "Flurryfield",
    collection: "The Pocket Winter Collection",
    headline: "Shake up a little wonder.",
    introduction: "Three tiny worlds are waiting inside. Drag the globe to stir a flurry, then watch every flake find its place.",
    message: "For your quiet moments",
    sceneSet: "Ember Cabin, Beacon Point, Lantern City",
    types: ["Cabin", "Lighthouse", "City"],
    descriptions: ["A warm light, deep in the pines.", "A small beacon at the edge of winter.", "Little windows. A quieter kind of city."],
    tagline: "A tiny interactive keepsake",
    help: "How to play",
    eyebrow: "A winter, held in your hands",
    cues:
    [
        ["Shake", "Drag in quick arcs, or use the shake button."],
        ["Choose", "Move among a cabin, a lighthouse, and a city."],
        ["Personalize", "Write a short message for the brass base."]
    ],
    mobileCues: "Drag · Choose · Write",
    choose: "Choose a world",
    messageLabel: "Message on the base",
    messageDescription: "Your message appears on the front plaque. Up to 28 characters.",
    emptyMessage: "Add a message when you are ready.",
    messageHelper: "A small thought, engraved in brass.",
    shake: "Shake globe",
    shaking: "Shaking…",
    settle: "Let it settle",
    motion: "Flurry in motion",
    rest: "Snow at rest",
    drag: "Drag to shake",
    touchDrag: "Drag or use Shake globe",
    keyboard: "S to shake · R to settle · Arrow keys to choose a world",
    enableTilt: "Enable tilt",
    disableTilt: "Disable tilt",
    tiltOn: "Tilt on",
    tiltOff: "Tilt off",
    tiltDenied: "Tilt permission was not granted. Dragging still works.",
    tiltUnavailable: "Tilt is unavailable. Dragging still works.",
    sensorHelp: "Motion data stays in this page.",
    fallback: "3D is unavailable. You can still choose a world and write a message.",
    footer: "Three miniature worlds. One message that is yours.",
    credit: "Template by VibeFather",
    creditUrl: "https://vibefather.ai/t/snow-globe-toy",
    helpTitle: "Make a little flurry",
    helpSteps:
    [
        ["Shake it", "Drag the globe in quick arcs, press Shake globe, or press S while the globe is focused."],
        ["Change the world", "Choose a cabin, lighthouse, or city. Use left and right arrows on the focused globe as an alternative."],
        ["Leave a message", "Type up to 28 characters and watch the brass plaque change."]
    ],
    helpSensor: "On a supported phone, Enable tilt asks for motion access. Motion data stays in this page and is never sent anywhere.",
    helpMotion: "Reduced motion keeps the same controls with shorter, gentler effects.",
    close: "Back to the globe",
    selected: "Selected",
    sceneAnnouncement: "World selected:",
    closeLabel: "Close help"
};
content.scenes = content.sceneSet.split(",").map((name) => name.trim());
if (content.scenes.length !== 3 || content.scenes.some((name) => !name || name.length > 22))
{
    throw new Error("The collection must have exactly three short world names.");
}
