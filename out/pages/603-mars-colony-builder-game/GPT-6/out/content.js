export const C =
{
    brand: "Hearthline", crater: "Tallow Crater", expedition: "the Amberline Survey",
    eyebrow: "AMBERLINE SURVEY", tagline: "Fifty beds against the dust.",
    title: "Hearthline — Tallow Crater",
    body: "Place one structure a sol. Keep oxygen, power, water, and morale above empty until 50 colonists have beds.",
    audience: "Built for players who like short planning puzzles.",
    roster: "Nia Calder leads the survey, Omar Voss runs the drills, and Priya Sen keeps the greenhouse bench.",
    credit: "Template by VibeFather", creditUrl: "https://vibefather.ai/t/mars-colony-builder-game",
    open: "Open the basin", resume: "Resume survey", keep: "Keep it", replace: "Replace",
    sol: "SOL", goal: "goal 50", stockUnit: "/ 100", low: "LOW",
    operations: "BASIN OPERATIONS", buildHeading: "Plan the next sol.",
    buildSub: "One structure. One considered change.",
    tools:
    [
        { kind: "habitat", label: "Habitat", short: "Habitat", key: "1", detail: "Sleeps 8 · power −2 · water −1" },
        { kind: "solar", label: "Solar array", short: "Solar", key: "2", detail: "10 power · 5 in dust · shade cuts both" },
        { kind: "greenhouse", label: "Greenhouse", short: "Greenhouse", key: "3", detail: "8 oxygen · 16 beside a habitat" },
        { kind: "drill", label: "Ice drill", short: "Drill", key: "4", detail: "20 water · quieter away from beds" },
        { kind: "remove", label: "Remove", short: "Remove", key: "X", detail: "Clear one structure this sol" }
    ],
    stocks: { oxygen: "Oxygen", power: "Power", water: "Water", morale: "Morale" },
    abbreviations: { oxygen: "O2", power: "PWR", water: "H2O", morale: "MOR", population: "CREW" },
    help: "Field guide", soundOff: "Sound off", soundOn: "Sound on", undo: "Undo change",
    advance: "Advance sol", anyway: "Advance anyway", next: "NEXT SOL · PREVIEW",
    powered: "Grid powered", idle: "Brownout · equipment idle", hintFirst: "Place a solar on open ground, then advance.",
    hint: "One change per sol, or none.", pending: "Change queued. Undo it or advance.",
    keyHint: "1–4 build · X remove · arrows · Enter place · N advance",
    mapLabel: "SURVEY GRID 12 × 12", mapHint: "Choose a tool, then a basin cell.",
    mapTouch: "Tap a tool, then tap open ground.",
    ready: "Survey ready. Six people, one small dome.",
    helpTitle: "One sol, one change.", close: "Close field guide",
    helpSections:
    [
        ["Build a working loop", "Habitats sleep 8 and use 2 power and 1 water. A greenhouse uses 4 power and 2 water, makes 8 oxygen (16 beside a habitat), and adds 2 morale. A powered drill makes 20 water, uses 3 power, and costs 1 morale plus 2 for each neighboring habitat. Every colonist uses 1 oxygen and 1 water each sol."],
        ["Leave arrays in the open", "An array makes 10 power clear / 5 in dust. Each orthogonal habitat or greenhouse shades it: one neighbor gives 7 / 3, two give 4 / 1, and three or four give 2 / 1. Diagonals do not count. Drills do not shade."],
        ["Read the weather", "Storms run for four sols: 8–11, 18–21, 30–33, 44–47, 60–63, 78–81, then 96–99 and every 18 sols after. Dust costs 8 morale each sol. The preview uses the weather of the sol being planned."],
        ["Keep a reserve", "With enough power, all four stocks at 35 or more, and spare beds, up to 2 people arrive per sol, to a goal of 50. Habitats give 1 morale. At least 8 spare beds add 2 morale; full beds cost 4. Stocks cap at 100. There is no money or separate construction cost: a building uses the one change and its operating resources."],
        ["When power runs short", "If stored power plus array yield cannot meet the full demand, drills and greenhouses idle. Habitats still use power and water; people still use oxygen and water. Morale changes by habitats minus 6, plus housing and storm effects."],
        ["A failed sol can be retried", "Any stock at zero fails the tick. The failed outcome is not saved. Retry restores the start of that sol and clears the change. Remove cannot take away occupied beds. Undo is free before advancing."],
        ["A check for your first sol", "Pass sol 1: oxygen 68, power 44, water 57, morale 69, population 8. An open-ground solar changes power to 54; an array beside the starting habitat changes it to 51. The other results stay the same."],
        ["Keys and touch", "1 habitat · 2 solar · 3 greenhouse · 4 drill · X remove. Arrow keys move the cell cursor; Enter places. U or Backspace undoes; Escape clears the tool. N advances, H opens help, M toggles sound. Shortcuts pause on focused buttons and in dialogs. On a phone, use the five tools and tap the crater. Tap a queued change again to undo it. Right-click clears the tool."],
        ["Stored on this browser", "Only completed sols are saved locally. Resume returns to that snapshot; queued changes are never saved. Sound starts off. No account, network service, or automatic sols."]
    ],
    failTitle: "The expedition folds.",
    fail:
    {
        oxygen: "Oxygen hit zero. The domes go quiet.",
        power: "Power hit zero and the batteries are flat.",
        water: "The cistern hit zero.",
        morale: "Morale hit zero. The crew will not work another sol."
    },
    retry: "Retry this sol", leave: "Leave the crater",
    winTitle: "The basin holds.", winBody: "Hearthline houses 50 colonists. Tallow Crater still has air, current, water, and a crew that will stay.",
    keepSurveying: "Keep surveying", foundAgain: "Found again", reset: "Start a new survey?",
    resetBody: "This replaces the completed survey with six people and one habitat.",
    resetConfirm: "Found again", resetCancel: "Keep surveying",
    replaceTitle: "Replace the saved survey of Hearthline?",
    replaceBody: "The saved grid and stocks will be replaced. Keep it to return without changes.",
    fallback: "This browser could not start the crater view.",
    storageError: "Browser storage is unavailable. This survey can continue, but it will not survive a reload.",
    errors:
    {
        oneChange: "One change per sol. Undo it or advance.",
        wall: "Crater wall. Build on the basin floor.",
        boulder: "A boulder sits on this cell.",
        occupied: "That cell is already built. Remove it on its own sol.",
        beds: "People still need those beds.",
        nothing: "Nothing to remove.",
        choose: "Choose a tool, then a basin cell."
    },
    logLabel: "LATEST FIELD NOTE", selectLabel: "CRATER READOUT", noChange: "Change cleared. The sol is still yours.",
    selected: (label) => `${label} selected. Choose a floor cell.`,
    queued: (label, c, r) => `${label} queued at column ${c}, row ${r}.`,
    removed: (c, r) => `Removal queued at column ${c}, row ${r}.`,
    population: (p, beds) => `${p} colonists · ${beds} beds · goal 50`,
    weather: (active, n) => active ? `Dust storm · ${n} ${n === 1 ? "sol" : "sols"} left` : `Storm in ${n} ${n === 1 ? "sol" : "sols"}`,
    location: (c, r, name) => `Column ${c}, row ${r} · ${name}`,
    floor: (a, b) => `Open floor · Solar yield ${a} clear / ${b} dust`,
    cellNames: { rim: "Crater wall", boulder: "Boulder", void: "Beyond the basin" },
    failedSol: (n) => `Sol ${n} is the last one logged for Hearthline.`,
    wonSol: (n) => `Sol ${n} from the Amberline Survey`,
    toast(result)
    {
        if (!result.powered) return "Power ran short. Drills and greenhouses sat this sol out.";
        if (result.stormStart) return "Dust fills Tallow Crater. Arrays are on their storm yield.";
        if (result.stormEnd) return "The dust thins over Tallow Crater. Arrays return to clear yield.";
        if (result.growth) return `Hearthline adds ${result.growth}. Population ${result.state.population}.`;
        const beds = result.state.buildings.filter((b) => b.kind === "habitat").length * 8;
        if (result.state.population === beds && result.state.population < 50) return "Beds are full. Place a habitat before the next arrivals.";
        const lowest = ["oxygen", "power", "water", "morale"].filter((k) => result.state[k] < 35)
            .sort((a, b) => result.state[a] - result.state[b])[0];
        if (lowest) return `${this.stocks[lowest]} is under 35. Growth waits.`;
        return `Sol ${result.attemptedSol} closes quiet.`;
    }
};
export const glyphs =
{
    habitat: '<ellipse cx="16" cy="21" rx="13" ry="5" fill="#A86B38"/><ellipse cx="16" cy="16" rx="12" ry="9" fill="#E39B54"/><path d="M14 19h4v7h-4z" fill="#3F241C"/><path d="M12 12h8" stroke="#F3E6D4" stroke-width="2"/>',
    solar: '<path d="M16 25V10" stroke="#B7A394" stroke-width="2"/><path d="M4 7h19l6 10H10z" fill="#3E4C55" stroke="#E39B54"/><path d="m10 7 6 10M17 7l6 10M7 12h19" stroke="#B7A394" stroke-width=".5"/>',
    greenhouse: '<ellipse cx="16" cy="23" rx="13" ry="4" fill="#3F241C"/><ellipse cx="16" cy="17" rx="12" ry="9" fill="#8FB573" fill-opacity=".85" stroke="#3E4C55"/><path d="M12 9v16M20 9v16M5 18h22" stroke="#3E4C55"/>',
    drill: '<ellipse cx="16" cy="25" rx="11" ry="4" fill="#5C3428"/><path d="M13 6h6v20h-6z" fill="#B7A394"/><path d="M11 14h10v4H11z" fill="#E39B54"/><ellipse cx="16" cy="6" rx="4" ry="3" fill="#B7D0D6"/>',
    remove: '<path d="m7 25 18-18M8 9l15 15" stroke="#B7A394" stroke-width="2" stroke-linecap="round"/>'
};
