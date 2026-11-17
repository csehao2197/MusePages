export const VARS = {
    BRAND: "Scrawlhouse",
    TOPIC: "Photosynthesis",
    AUDIENCE: "Curious kids aged 9–13 and the grown-ups who get asked “but how?”",
    KEY_PARTS: ["Sunlight", "Leaf", "Water", "Carbon dioxide", "Glucose", "Oxygen"],
    NARRATOR_NAME: "Pip"
};

export const copy = {
    skip: "Skip to the lesson",
    brandNote: "Small drawings. Big understanding.",
    headerNote: "A notebook for curious minds",
    recapLink: "The big picture",
    lesson: "FIELD NOTES / No. 01",
    reading: "6 little steps · about 3 minutes",
    title: ["A little leaf.", "A big idea."],
    intro: "Plants make their own food. No grocery store. No tiny chef. Just sunlight, a little water, and something in the air.",
    introEnd: "Let’s draw how photosynthesis works.",
    start: "Follow the sunlight",
    scroll: "Scroll to turn a little light into a little understanding.",
    heroCard: "THE WORLD’S QUIETEST KITCHEN",
    heroLeaf: "one ordinary leaf",
    heroSun: "a little sunshine",
    heroFood: "food, made here!",
    heroBubble: "Hi, I’m Pip.\nLet’s get to the root of it.",
    heroFoot: "No lab coat required.",
    diagramLabel: "An original hand-drawn leaf catches sunlight, takes up water, and releases oxygen.",
    trail: "Your paper trail",
    chapter: "THE SIX LITTLE STEPS",
    next: "Keep the pencil moving",
    recapEyebrow: "THE BIG PICTURE",
    recapTitle: "Six doodles. One brilliant trick.",
    recapNote: "Light powers the process. Leaves turn water and carbon dioxide into sugar, releasing oxygen along the way.",
    formulaIn: "THE INGREDIENTS",
    formulaOut: "THE GOOD STUFF",
    formulaPower: "with light, inside a leaf",
    formula: "Water + carbon dioxide → glucose + oxygen",
    experimentLabel: "YOUR TURN / A TINY LEAF LAB",
    experimentTitle: "What happens if we take something away?",
    experimentNote: "Tap an ingredient to switch its supply on or off. This is a simplified model of photosynthesis, not a measurement of a real plant.",
    supplies: ["Sunlight", "Water", "Carbon dioxide"],
    readyTitle: "The kitchen is open!",
    ready: "With all three inputs, the leaf can make glucose and release oxygen. Glucose stores some of the captured light energy.",
    blockedTitle: "The kitchen is on pause.",
    blocked: {
        Sunlight: "No sunlight: there is no new light energy to power photosynthesis.",
        Water: "No water: the leaf is missing a raw material. The oxygen released normally comes from water.",
        "Carbon dioxide": "No carbon dioxide: the leaf has no fresh carbon to build glucose."
    },
    supplyOn: "on",
    supplyOff: "off",
    outputActive: "Glucose + oxygen can be made",
    outputPaused: "New photosynthesis is paused",
    restore: "Restore all ingredients",
    sheetTitle: "Pocket-sized science",
    sheet: [
        ["The power", "Sunlight provides energy. It is not the plant’s food."],
        ["The place", "Chlorophyll in chloroplasts helps capture light."],
        ["The recipe", "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂"],
        ["The point", "Sugar stores energy; oxygen is released into the air."]
    ],
    replay: "Let’s draw it again",
    print: "Print the recap",
    printNote: "Just the big picture + your pocket notes. Ink-friendly.",
    footer: "Made for the wonderfully curious.",
    credit: "Template by VibeFather",
    creditHref: "https://vibefather.ai/t/hand-drawn-scroll-explainer",
    license: "Prompt adapted under CC BY-NC 4.0",
    licenseHref: "https://creativecommons.org/licenses/by-nc/4.0/",
    narratorLabel: "Pip, your stick-figure science guide",
    jump: "Jump to",
    heroSupplies: ["light", "water", "CO₂", "O₂"],
    recapInputs: ["Water", "Carbon dioxide"],
    recapOutputs: ["Glucose", "Oxygen"],
    direction: "Scroll down",
    end: "You’ve reached the big picture."
};

export const scenes = [
    {
        id: 1, part: "Sunlight", glyph: "sun", accent: "#f6cf52",
        title: "First, catch a little sunshine.",
        note: "The Sun sends light to Earth. A leaf catches some of that light and uses its energy to start making food.",
        bubble: "Solar powered. Before it was cool.",
        labels: [{ text: "energy, not food", corner: "tl" }, { text: "straight from the Sun", corner: "br" }],
        pose: "point"
    },
    {
        id: 2, part: "Leaf", glyph: "leaf", accent: "#b7cba0",
        title: "A tiny kitchen in every leaf.",
        note: "Inside a leaf are tiny structures called chloroplasts. Their green pigment, chlorophyll, helps capture light energy.",
        bubble: "Chloro-what? Let’s call them tiny solar panels.",
        labels: [{ text: "chloroplasts live inside", corner: "tl" }, { text: "green = chlorophyll", corner: "br" }],
        pose: "wave"
    },
    {
        id: 3, part: "Water", glyph: "water", accent: "#aacdd4",
        title: "A drink, delivered from below.",
        note: "Roots take in water from the soil. Thin tubes carry it up the stem to the leaves, where it becomes an ingredient.",
        bubble: "The roots handle the plumbing. No wrench needed.",
        labels: [{ text: "up through the stem", corner: "tl" }, { text: "roots sip from the soil", corner: "br" }],
        pose: "point"
    },
    {
        id: 4, part: "Carbon dioxide", glyph: "cloud", accent: "#cdc0db",
        title: "Add a little something from the air.",
        note: "Carbon dioxide, or CO₂, enters through tiny pores called stomata. Its carbon atoms help build the plant’s sugar.",
        bubble: "A leaf has tiny doors. Please wipe your molecules.",
        labels: [{ text: "CO₂ from the air", corner: "tl" }, { text: "stomata = tiny pores", corner: "br" }],
        pose: "wave"
    },
    {
        id: 5, part: "Glucose", glyph: "sugar", accent: "#edbea1",
        title: "And now… homemade food!",
        note: "Using light energy, the leaf turns water and carbon dioxide into glucose, a simple sugar. The plant uses it to grow or stores it for later.",
        bubble: "No sprinkles. Still a very sweet invention.",
        labels: [{ text: "glucose stores energy", corner: "tl" }, { text: "fuel for growing", corner: "br" }],
        pose: "celebrate"
    },
    {
        id: 6, part: "Oxygen", glyph: "oxygen", accent: "#b2ccc0",
        title: "A little extra. A lot of life.",
        note: "As water is split during photosynthesis, oxygen is released. It leaves through the stomata and joins the air we breathe.",
        bubble: "Thanks for the oxygen, leaf. Big fan.",
        labels: [{ text: "O₂ heads into the air", corner: "tl" }, { text: "a useful extra", corner: "br" }],
        pose: "celebrate"
    }
];
