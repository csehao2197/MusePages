export const content = {
    brand: "Swapyard",
    title: "Swapyard Sorting Visualizer",
    audience: "computer science students and developers preparing for interviews",
    nav: [["Visualizer", "visualizer"], ["Algorithms", "algorithms"], ["Race", "race"], ["Patterns", "patterns"]],
    browser: "Runs in your browser",
    headline: "See every compare, swap, and write.",
    caption: (n) => `Sorting ${n} numbered cards by number`,
    seed: (seed) => `seed ${seed}`,
    hover: (i, n) => `position ${i + 1} · number ${n}`,
    labels: {
        reset: "Reset", back: "Step back", play: "Play", pause: "Pause", replay: "Replay", next: "Step forward",
        shuffle: "Shuffle", speed: "Speed", size: "Size", pattern: "Pattern", now: "Now", key: "Key",
        comparisons: "Comparisons", swaps: "Swaps", writes: "Writes", load: "Load on stage",
        start: "Start", step: "Step", newArray: "New array", laneA: "Lane A", laneB: "Lane B",
        best: "Best", average: "Average", worst: "Worst", space: "Space", stable: "Stable"
    },
    stepLabel: (k, n) => `Step ${k.toLocaleString("en-US")} / ${n.toLocaleString("en-US")}`,
    stepsPerSecond: (n) => `${n} steps/s`,
    ticksPerSecond: (n) => `${n} ticks/s`,
    ready: "Ready. Press play or step forward.",
    finished: (n) => `Sorted in ${n.toLocaleString("en-US")} steps.`,
    narrate: (s) =>
    {
        if (s.k === "compare") return `Comparing positions ${s.i + 1} and ${s.j + 1}: number ${s.a} against number ${s.b}.`;
        if (s.k === "swap") return `Trading places: positions ${s.i + 1} and ${s.j + 1}.`;
        if (s.k === "write") return `Writing ${s.value} into position ${s.i + 1} from the buffer.`;
        return s.indices.length === 1 ? `Position ${s.indices[0] + 1} is final.` : `Positions ${s.indices.map((i) => i + 1).join(", ")} are final.`;
    },
    legend: [["compare", "Comparing"], ["swap", "Swapping or writing"], ["pivot", "Pivot"], ["range", "Active range"], ["sorted", "Final position"]],
    hint: "Space play · Left and Right step · R reset · S shuffle",
    reduced: "Reduced motion is on, so playback starts paused. Step manually or press play.",
    stage: "Sorting stage. Bars show numbered cards. The current operation is described in the Now panel.",
    patterns: [
        { id: "random", name: "Random", short: "Random" },
        { id: "nearly", name: "Nearly sorted", short: "Nearly" },
        { id: "reversed", name: "Reversed", short: "Reversed" },
        { id: "few", name: "Few unique", short: "Few" }
    ],
    algorithms: [
        { id: "bubble", name: "Bubble", complexity: ["O(n)", "O(n²)", "O(n²)", "O(1)", "Yes"], explanation: "Walk along the cards, swapping any neighbors that are out of order, until a full pass changes nothing." },
        { id: "insertion", name: "Insertion", complexity: ["O(n)", "O(n²)", "O(n²)", "O(1)", "Yes"], explanation: "Take the next card and slide it left until it sits where it belongs among the cards already behind it." },
        { id: "merge", name: "Merge", complexity: ["O(n log n)", "O(n log n)", "O(n log n)", "O(n)", "Yes"], explanation: "Split the cards into smaller piles, then zip sorted piles together by always taking the lower top card." },
        { id: "quick", name: "Quick", complexity: ["O(n log n)", "O(n log n)", "O(n²)", "O(log n)", "No"], explanation: "Pick a pivot card, move every lower card to its left, then repeat on each side of it." },
        { id: "heap", name: "Heap", complexity: ["O(n log n)", "O(n log n)", "O(n log n)", "O(1)", "No"], explanation: "Arrange the cards as a tree with the highest on top, then keep moving the top card to the end." }
    ],
    sections: {
        algorithms: ["ALGORITHMS", "Five ways to put numbered cards in order", "Explained with a table of numbered cards. Counts on each card are measured on the array now on the stage."],
        race: ["RACE", "Race two on the same array", "One shared clock. Each lane takes one step per tick, and the lane with fewer steps takes the flag."],
        patterns: ["INPUT PATTERNS", "Where each one struggles", "Total steps at the current size and seed. Select a cell to load that run on the stage."],
        notes: ["NOTES", "Reading the numbers", ""]
    },
    measured: (c, s, w) => `${c.toLocaleString("en-US")} compares · ${s.toLocaleString("en-US")} swaps · ${w.toLocaleString("en-US")} writes`,
    total: (n) => `${n.toLocaleString("en-US")} steps on this array`,
    summary: (a) => `Average ${a.complexity[1]} · Space ${a.complexity[3]} · ${a.complexity[4] === "Yes" ? "Stable" : "Not stable"}`,
    race: {
        versus: "vs", tick: (n) => `Tick ${n.toLocaleString("en-US")}`, waiting: "Same array. Same clock. Ready when you are.",
        running: "One operation per tick. Both lanes keep their own count.",
        first: "Finished first", tie: (n) => `Dead heat at ${n.toLocaleString("en-US")} steps.`,
        winner: (name, n) => `${name} sort won by ${n.toLocaleString("en-US")} steps.`,
        behind: (n) => `+${n.toLocaleString("en-US")} steps`,
        counters: (m) => `C ${m[0].toLocaleString("en-US")} · S ${m[1].toLocaleString("en-US")} · W ${m[2].toLocaleString("en-US")}`,
        note: "Steps are not milliseconds. One step is one compare, swap, write or final mark."
    },
    patternNote: "Quick sort here always uses the last position as its pivot, so ordered input gives it the most lopsided splits it can get.",
    cellLabel: (a, p, n) => `${a} sort, ${p}, ${n} steps. Load on stage.`,
    notes: [
        ["What counts as a step?", "Every entry in the list does: a compare, a swap, a write, or marking a position final."],
        ["Does fewer steps mean faster in real code?", "Not always. A step count ignores memory access and overhead. Merge sort copies through a second buffer and heap sort jumps across the array, and neither cost shows up here."],
        ["Why does merge sort show no swaps?", "It never trades two positions. It copies values back from a temporary buffer, so that work appears under Writes."],
        ["Why does quick sort slow down on ordered input?", "Its pivot is always the last position. With numbered cards already in order, each split leaves one side almost empty."]
    ],
    footer: "Runs entirely in this tab. Nothing is saved or sent.",
    credit: ["Template by VibeFather", "https://vibefather.ai/t/sorting-algorithms-visualizer"],
    license: ["Non-commercial · CC BY-NC 4.0", "https://creativecommons.org/licenses/by-nc/4.0/"]
};
