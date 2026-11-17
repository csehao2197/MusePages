export const content =
{
    brand: "Amberwick Post",
    island: "Amberwick Isle",
    setting: "autumn woodland island",
    tagline: "Three stamps. One open gate.",
    shrines:
    [
        { id: "wind", name: "Wind Shrine", note: "Where the leaves find their way.", icon: "wind", x: -15, z: 3, color: 0xb5c786 },
        { id: "river", name: "River Shrine", note: "A quiet bend, a steady current.", icon: "waves", x: 16, z: 7, color: 0x8dbfbd },
        { id: "mountain", name: "Mountain Shrine", note: "Above the trees, beneath the sky.", icon: "mountain", x: -9, z: -13, color: 0xd49b72 }
    ],
    post: { x: 0, z: 16 },
    temple: { x: 1, z: -23 },
    messages:
    {
        pickup: "One letter, three stamps, and a whole island ahead.",
        noLetter: "Your letter is waiting at the Post House. Pick it up first.",
        gateLocked: "The gate is listening for three shrine stamps.",
        open: "Three stamps collected. The north gate is open!",
        saved: "A familiar path. Your shrine stamps are still here.",
        complete: "Special delivery! The North Temple sends its thanks.",
        reset: "A fresh letter. A new afternoon.",
        blocked: "Take the path around, or cross at the wooden bridge."
    },
    action:
    {
        pickup: "Pick up the letter",
        walk: "Follow a trail to a shrine",
        stamp: "Collect the stamp",
        collected: "Stamp already collected",
        gate: "Three stamps needed",
        deliver: "Cross the open gate",
        done: "Letter delivered"
    }
};
export const storageKey = `${content.brand}-${content.island}`.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-journey-v1";
