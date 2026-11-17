export const CONTENT =
{
    brand: "Rainveil",
    world: "the Rainveil Pass",
    setting: "storm-washed mountain retreat",
    tagline: "Three guardians. One quiet summit.",
    guardians:
    [
        { name: "Reed Sentinel", lesson: "THE REED LESSON", form: "Find your rhythm", z: -8, health: 8, windup: 1.25, rest: 2.25 },
        { name: "Stone Sentinel", lesson: "THE STONE LESSON", form: "Hold your ground", z: -37, health: 10, windup: 1.05, rest: 1.95 },
        { name: "Cloud Sentinel", lesson: "THE CLOUD LESSON", form: "Move with the rain", z: -66, health: 12, windup: .9, rest: 1.8 }
    ],
    feedback:
    {
        range: "A little closer. Let the form reach.",
        breath: "Make room for a breath.",
        dodge: "Like rain off a leaf.",
        hit: "Soften. Read the red ring.",
        combo: "Three strokes. One flowing form.",
        resolved: "Form learned. The way opens.",
        gate: "Learn this form to open the practice gate."
    },
    help: "Calibrate three guardians, open the practice gates, and enter the summit circle.",
    credit: "Template by VibeFather",
    creditUrl: "https://vibefather.ai/t/ink-wash-mountain-adventure"
};
export const trailX = (z) => Math.sin(z * .065) * 2.7;
export const trailY = (z) => -z * .075 + .16 * Math.sin(z * .15);
export const STORAGE_KEY = `rainveil-${[...CONTENT.brand + CONTENT.world].reduce((a, c) => (Math.imul(a, 31) + c.charCodeAt(0)) >>> 0, 7).toString(36)}`;
