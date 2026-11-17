export const content =
{
    brand: "Meadowmint",
    garden: "Wanderlight Meadow",
    headline: "Plant a little joy.",
    intro: "Pick a flower, then click or tap the grass to grow your own little corner of Wanderlight Meadow.",
    flowers:
    [
        { name: "Daisy", color: "#FFFDF4" },
        { name: "Tulip", color: "#E78072" },
        { name: "Bluebell", color: "#9B8AC4" },
        { name: "Cosmos", color: "#82B6C9" }
    ],
    colors:
    {
        sky: "#DDEDE6", cream: "#FFFDF4", ink: "#1F342B", moss: "#526C59",
        meadow: "#84A96B", soil: "#8A6A4F", sun: "#F2C14E"
    },
    labels:
    {
        help: "How to play", reset: "Reset meadow", snapshot: "Snapshot", wind: "Wind",
        blooms: (count) => `${count} blooms`, windValue: (value) => `${value === 0 ? "Still" : value < 35 ? "Light" : value < 70 ? "Breezy" : "Gusty"} · ${value}%`,
        hint: "Click to plant", orbit: "Drag to explore", zoom: "Scroll to zoom",
        controls: "Garden controls", choice: "Flower choice",
        stage: "Interactive flower garden. Arrow keys move the planting ring. Enter plants. Keys 1 to 4 choose flowers.",
        fallback: "This garden needs WebGL. Try a current browser with hardware acceleration enabled."
    },
    help:
    {
        eyebrow: "A MOMENT OUTSIDE",
        title: "A field guide",
        items:
        [
            ["Choose a bloom", "Pick one of the four flowers in the garden dock."],
            ["Plant a clump", "Click or tap open grass. Drag to orbit; scroll or pinch to zoom."],
            ["Change the weather", "Move Wind from Still to Gusty. Your flowers lean together."],
            ["Keep a postcard", "Snapshot downloads only the garden, without the controls."]
        ],
        keyboard: "Keyboard: 1–4 choose flowers, arrow keys move the planting ring, Enter plants.",
        close: "Back to the meadow"
    },
    reset:
    {
        title: "Start this meadow over?",
        body: "Your planted clumps will be replaced by the original Wanderlight Meadow. Downloaded snapshots stay on your device.",
        cancel: "Keep gardening"
    },
    toasts:
    {
        planted: "Six new blooms, just for you.",
        invalid: "Plant on an open patch of grass.",
        full: "Your meadow is full. Reset to begin again.",
        saved: "Garden saved as a PNG.",
        failed: "The snapshot could not be saved. Try again.",
        reset: "A fresh meadow is ready."
    },
    credit: { label: "Template by VibeFather", url: "https://vibefather.ai/t/3d-flower-garden-toy" }
};

export function flowerGlyph(type)
{
    const fill = content.flowers[type].color;
    let petals = "";
    if (type === 1)
    {
        petals = `<path d="M7 10Q12 1 16 10Q22 1 25 10L23 19Q16 28 9 19Z" fill="${fill}"/>`;
    }
    else if (type === 2)
    {
        petals = `<path d="M16 28V7q8-5 10 5M16 14Q6 8 6 19" fill="none" stroke="#526C59" stroke-width="2"/><path d="M2 19q4-14 9 0l-4 3ZM20 15q5-14 10 0l-5 3Z" fill="${fill}"/>`;
    }
    else
    {
        const n = type === 0 ? 10 : 8;
        for (let i = 0; i < n; i++)
        {
            petals += `<ellipse cx="16" cy="9" rx="${type === 0 ? 2.7 : 3.2}" ry="7" transform="rotate(${i * 360 / n} 16 16)" fill="${fill}" stroke="#1f342b" stroke-opacity=".15" stroke-width=".6"/>`;
        }
        petals += `<circle cx="16" cy="16" r="4" fill="#F2C14E"/>`;
    }
    return `<svg viewBox="0 0 32 32" aria-hidden="true">${petals}</svg>`;
}
