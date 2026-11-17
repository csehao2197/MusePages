export const C =
{
    brand: "Clovermere",
    farm: "Willowbend Farm",
    setting: "a sheltered valley beside a slow river",
    currency: "sun coins",
    key: "clovermere-farm-v1",
    version: 1,
    initial:
    {
        day: 1,
        coins: 30,
        inventory: [2, 1, 0],
        tool: 0,
        seed: 0,
        emptySoil: 20,
        crops: [[1, 1, 0, 2, false], [1, 2, 0, 1, true], [2, 1, 1, 1, false], [2, 2, 2, 2, true]]
    },
    crops:
    [
        { name: "Carrot", days: 2, buy: 4, sell: 9, color: "#de8954" },
        { name: "Turnip", days: 3, buy: 6, sell: 14, color: "#bb85a9" },
        { name: "Strawberry", days: 4, buy: 9, sell: 22, color: "#ce6259" }
    ],
    tools:
    [
        { name: "Till", icon: "Shovel", hint: "Turn grass into soft soil." },
        { name: "Plant", icon: "Sprout", hint: "Choose a seed, then plant in tilled soil." },
        { name: "Water", icon: "Droplets", hint: "Water crops so they grow overnight." },
        { name: "Harvest", icon: "Hand", hint: "Gather ripe crops for sun coins." }
    ],
    copy:
    {
        morning: "Morning", day: "Day", saved: "Saved on this device", saving: "Saving…",
        unsaved: "Saving unavailable · keep this tab open", help: "How to play", reset: "New game",
        field: "YOUR FIELD", instruction: "Choose a tool, then choose a tile.",
        today: "Today on the farm", intro: "A fresh morning in a sheltered valley beside a slow river.",
        steps: ["Till open grass.", "Plant from your seed pouch.", "Water before ending the day."],
        end: "End day", overnight: "Watered crops grow overnight.", notes: "Field notes",
        plots: "6 × 6 plots", tools: "4 tools", local: "Progress saved locally",
        pouch: "Seed pouch", shop: "Seed shop", shopIntro: "A little stock for tomorrow.",
        mobileShop: "Seed pouch & shop", buy: "Buy 1", selected: "Selected", stock: "seeds",
        close: "Close", routine: "A little routine", grow: "Let's grow",
        helpSteps: ["Till a grass tile.", "Pick a seed and plant it in soil.", "Water it, then end the day.", "Harvest ripe crops and reinvest in seeds."],
        keyboard: "Mouse or touch: choose a tool and tap a tile. Keyboard: Tab to a tile and press Enter or Space. Arrow keys move around the field.",
        resetTitle: "Start a new farm?", resetBody: "This clears this farm's crops, coins, and day count on this device.",
        keep: "Keep farming", start: "Start over", welcome: "Welcome back to Day 1.",
        fresh: "A fresh farm is ready.", footer: "A quiet little farming game", privacy: "Progress stays in this browser.",
        credit: "Template by VibeFather", creditUrl: "https://vibefather.ai/t/cozy-isometric-farm-game",
        onlyGrass: "Only grass can be tilled.", tillFirst: "Till this tile before planting.",
        occupied: "There is already a crop here.", noStock: "Choose a seed with stock.",
        noCrop: "Plant a crop here first.", watered: "This crop is already watered.",
        growing: "This crop is still growing.", readyWater: "This crop is ready to harvest.",
        poor: "Not enough sun coins yet.", tilled: "Soft soil, ready for a seed.",
        planted: "Planted. A little water comes next.", waterDone: "Watered and ready for the night.",
        grass: "Grass", soil: "Tilled soil", ripe: "Ready to harvest", wet: "Watered", dry: "Needs water",
        row: "Row", column: "column", days: "days", buyLabel: "Buy", sellLabel: "Sell",
        harvest: "Harvested", purchased: "Seed added", begins: "begins.", grew: "crops grew.",
        dusk: "Dusk", night: "Night", tag: "A little care. A little growth.", choose: "Choose a seed",
        nextTill: "Next: till this plot", nextPlant: "Next: plant a seed", nextWater: "Next: water before night",
        nextDay: "Next: end the day", nextHarvest: "Next: harvest your crop"
    }
};
