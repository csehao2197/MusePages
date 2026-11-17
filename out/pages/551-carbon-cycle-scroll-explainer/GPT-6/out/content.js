export const content =
{
    brand: "Lowtide Lab",
    title: "Lowtide Lab · The carbon cycle, explained",
    nav: [["Story", "#story"], ["Ledger", "#ledger"], ["Scenarios", "#scenarios"], ["Sources", "#sources"]],
    illustrative: "Illustrative",
    figureChip: "Illustrative figures",
    hero:
    {
        eyebrow: "An illustrated story · 4 min",
        heading: "Where the<br>carbon goes.",
        body: "Follow one atom of carbon through sky, sea, soil and stone, then choose the century it lands in.",
        start: "Start the story",
        jump: "Jump to the scenarios",
        chips: ["4 reservoirs", "4 flows", "3 futures"],
        scroll: "Scroll to follow the flow",
        legend: ["Living carbon", "Ocean exchange", "Fossil burning"],
        sceneTitle: "Carbon moves between atmosphere, land, ocean and fossil reserves",
        sceneDescription: "An original layered cross-section. Lime paths carry carbon between air and forest, cyan paths exchange carbon with the ocean, and an orange path leads from an oil pocket through a factory into the air.",
        pause: "Pause motion",
        resume: "Resume motion"
    },
    reservoirs:
    [
        {name: "Atmosphere", stock: 900, display: "~900 Gt C", icon: "wind", box: [300, 0, 1000, 490]},
        {name: "Land", stock: 2000, display: "~2,000 Gt C", icon: "trees", box: [120, 240, 720, 440]},
        {name: "Ocean", stock: 40000, display: "~40,000 Gt C", icon: "waves", box: [840, 520, 740, 245]},
        {name: "Fossil reserves", stock: 5000, display: "~5,000 Gt C", icon: "layers", box: [120, 785, 1300, 195]}
    ],
    flows:
    [
        {id: "photosynthesis", name: "Photosynthesis", direction: "Air → land", value: 120, color: "lime", path: "M500 160 C750 190 780 350 600 440"},
        {id: "respiration", name: "Respiration and decay", direction: "Land → air", value: 120, color: "lime", opacity: 0.6, path: "M560 520 C300 460 270 270 420 180"},
        {id: "ocean-in", name: "Ocean uptake", direction: "Air → ocean", value: 90, color: "cyan", path: "M1150 200 C1470 180 1530 410 1250 560"},
        {id: "ocean-out", name: "Ocean release", direction: "Ocean → air", value: 90, color: "cyan", path: "M1210 555 C1420 410 1400 270 1110 205"},
        {id: "fossil", name: "Fossil fuel burning", direction: "Rock → air", value: 1, color: "orange", path: "M420 900 C600 850 665 640 665 430 C665 300 910 260 760 140"}
    ],
    steps:
    [
        {tag: "Atmosphere · ~900 Gt C", icon: "wind", title: "The smallest vault.", body: "Of the four places that hold carbon, the air holds the least. That is exactly why it is sensitive: add a little, and its share changes fast.", reservoir: 0},
        {tag: "Land · ~2,000 Gt C in plants and soil", icon: "trees", title: "The forest breathes.", body: "Leaves pull about 120 billion tonnes of carbon out of the air each year. Roots, microbes and fires send about the same back. In, out, in, out, like a slow tide.", reservoir: 1},
        {tag: "Ocean · ~40,000 Gt C", icon: "waves", title: "The quiet giant.", body: "The ocean holds more carbon than the other three stores combined. Its surface trades about 90 billion tonnes with the air each year. Slow currents carry some down to water that will not see the sky for centuries.", reservoir: 2},
        {tag: "Fossil reserves · ~5,000 Gt C", icon: "layers", title: "The sealed basement.", body: "Coal, oil and gas are ancient plants and plankton, pressed for millions of years. Left alone, this vault releases very little on human timescales. The wider rock cycle moves carbon slowly through weathering and volcanoes.", reservoir: 3},
        {tag: "Fossil fuel burning · 1 → 10 Gt C / yr", icon: "flame", title: "Then we opened it.", body: "Burning fuel now moves about 10 billion tonnes a year from rock to air. That is small next to the forest and ocean trades. The difference is that it only flows one way.", reservoir: 3, counter: "Year", from: 1850, to: 2025},
        {tag: "Atmosphere · 600 → 900 Gt C", icon: "thermometer", title: "Half stays up.", body: "Land and ocean soak up about half of what we add. The rest stays in the air, and the air is the vault that sets the temperature.", reservoir: 0, counter: "Gt C in the air", from: 600, to: 900, button: "See where it leads"}
    ],
    cameras: [[0, 0, 1600, 1000], [300, 0, 1000, 625], [120, 220, 900, 563], [760, 300, 840, 525], [120, 375, 1000, 625], [200, 60, 1300, 813], [0, 0, 1600, 1000]],
    hud: "The four carbon stores",
    ledger:
    {
        eyebrow: "The yearly ledger",
        heading: "Big trades,<br>one leak.",
        intro: "Each year carbon moves in four main streams. Three of them nearly balance. The fourth does not.",
        unit: "Gt C = a billion tonnes of carbon, not carbon dioxide.",
        note: "A simplified budget: the +5 is the airborne remainder of the fossil flow after land and ocean take up about half. Gross natural exchanges are rounded; land-use emissions and other smaller flows are omitted.",
        rows:
        [
            {name: "Photosynthesis", icon: "trees", direction: "Air → land", value: "120 Gt C / yr", width: 100, color: "lime"},
            {name: "Respiration and decay", icon: "wind", direction: "Land → air", value: "120 Gt C / yr", width: 100, color: "lime", dim: true},
            {name: "Ocean exchange", icon: "waves", direction: "Air ⇄ ocean", value: "90 in · 90 out", width: 75, color: "cyan", double: true},
            {name: "Fossil fuel burning", icon: "flame", direction: "Rock → air", value: "10 Gt C / yr · one way", width: 8.333, color: "orange"},
            {name: "Net change in the air", icon: "plus", direction: "After extra land and ocean uptake", value: "+5 Gt C every year", width: 4.167, color: "pink", net: true}
        ]
    },
    lab:
    {
        eyebrow: "Scenario lab",
        heading: "Pick the century.",
        intro: "Drag the slider to choose how fast emissions fall. Every curve starts from the same place: today.",
        baseline: "“Today” is our illustrative 2025 baseline, not a live measurement.",
        caption: "Warming by 2100 compared with the late 1800s · illustrative",
        sliderLabel: "Choose an illustrative emissions future",
        keyboardHint: "Arrow keys explore · Page Up / Down jump between futures",
        chartTitle: "Illustrative warming from 1850 to 2100",
        chartDescription: "One shared historical line reaches 1.3 degrees in 2025. Three hand-drawn projections end at 1.5, 2.5 or 4.0 degrees in 2100. These are not climate model results.",
        axis: "Warming (°C) · illustrative",
        today: "Today",
        historical: "Shared history",
        projected: "Your chosen future",
        printLegend: "Rapid cuts: +1.5 °C · Current path: +2.5 °C · High emissions: +4.0 °C — illustrative",
        unit: "°C",
        aria: "degrees of warming by 2100",
        horizon: "Illustrative horizon; tint changes with the selected future",
        stops:
        [
            {name: "Rapid cuts", description: "Emissions halve by 2040 and reach near zero by 2060.", end: 1.5, heat: 0, color: "#C6FF3D", points: [1.3, 1.38, 1.45, 1.5, 1.53, 1.55, 1.56, 1.56, 1.56, 1.55, 1.55, 1.54, 1.53, 1.52, 1.51, 1.5]},
            {name: "Current path", description: "Emissions plateau, then drift down slowly after 2050.", end: 2.5, heat: 0.45, color: "#5CE1E6", points: [1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.25, 2.3, 2.35, 2.4, 2.45, 2.5]},
            {name: "High emissions", description: "Emissions keep rising until late in the century.", end: 4.0, heat: 1, color: "#FF6A1A", points: [1.3, 1.42, 1.55, 1.7, 1.85, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.2, 3.4, 3.6, 3.8, 4.0]}
        ],
        history: [[1850, 0], [1875, 0], [1900, 0.1], [1925, 0.2], [1950, 0.3], [1975, 0.4], [2000, 0.8], [2025, 1.3]],
        ticks: [1850, 1900, 1950, 2000, 2050, 2100],
        yTicks: [0, 1, 2, 3, 4, 5]
    },
    faq:
    {
        title: "Quick questions.",
        items:
        [
            ["If plants absorb carbon, can we just plant trees?", "Trees help, but the forest trade is a loop: what grows also decays or burns. Planting adds a one-time store; it cannot keep up with a one-way flow from rock that runs every year."],
            ["Will the ocean fill up?", "Not fill, but slow down. Warmer water holds less gas, and the extra carbon makes seawater more acidic, which is hard on shells and reefs."],
            ["How long does added carbon stay in the air?", "A large share moves into land and ocean within decades. A smaller share stays for centuries, and some for many thousands of years."],
            ["Why are all the numbers rounded?", "So the story stays readable. The sizes and directions are right; the exact values change from year to year and between studies. See the sources note below."]
        ]
    },
    teachers:
    {
        eyebrow: "For teachers",
        title: "Use it in class.",
        walkthrough: "15-minute walkthrough",
        minutes: ["Scroll steps 1–4 together (5 min)", "Pause on step 5 and ask what changed (3 min)", "Let pairs try each scenario and note the readout (5 min)", "Close with one question from the list (2 min)"],
        discussion: "Three discussion prompts",
        questions: ["Which flow surprised you most, and why?", "Why does a small one-way flow matter more than a big two-way one?", "What would have to change to move the slider left?"],
        printTitle: "Print-friendly version",
        printBody: "A clean, one-column version with all steps, the ledger and all three curves.",
        printButton: "Print the story"
    },
    sources:
    {
        eyebrow: "Illustrative figures",
        title: "Where the numbers come from.",
        body: "Every figure on this page is illustrative and rounded so the story stays readable. The values sit in the range reported by recent global carbon budget syntheses and international physical-science assessments, but none is copied from a single chart, and the curves are hand-drawn shapes, not model output. Check the latest published assessments before you cite a number.",
        notes: ["Reservoir sizes: rounded to the nearest 100 or 1,000 Gt C.", "Yearly flows: rounded to the nearest 10 Gt C, except the fossil flow.", "Temperature curves: drawn to show direction and spread between futures.", "Scenario names: plain labels written for this page, not official pathway names."],
        links: [["Global Carbon Budget", "https://globalcarbonbudget.org/"], ["IPCC physical-science assessment", "https://www.ipcc.ch/report/ar6/wg1/"]],
        credits: "Story by Mara Okafor · Illustration and code by Teo Lindqvist · Science review by Dr. Inés Carvalho · Version 1.3",
        disclosure: "These are fictional template credits, not a claim of external science review. Lowtide Lab is an illustrative studio. This page is an educational sketch, not a forecast.",
        corrections: "Spotted an error? Tell us at corrections@lowtidelab.example",
        correctionNote: "Example address only; no submission or email service is connected."
    },
    footer:
    {
        tagline: "Small studio, big systems. Illustrated explainers for classrooms and curious people.",
        copyright: "© Lowtide Lab · Figures are illustrative",
        credit: "Template by VibeFather",
        creditUrl: "https://vibefather.ai/t/carbon-cycle-scroll-explainer"
    }
};
