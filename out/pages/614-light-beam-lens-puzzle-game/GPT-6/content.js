export const content =
{
    brand: "Lumenwild",
    world: "the Glassroot Caverns",
    audience: "players who enjoy calm logic puzzles",
    tagline: "Turn the light. Wake the quiet.",
    names: ["First Light", "Corner Song", "Return Path", "Three Turns", "Lantern Loop", "Narrow Glass", "Crosscurrent", "Two Lights", "Forked Current", "Quiet Divide", "Threefold", "Full Constellation"],
    instructions:
    [
        "Align the lens and carry the beam to the listening crystal.",
        "A single reflection can open a different path.",
        "Let the light find its way back to the beginning.",
        "Follow the long way around. Every turn matters.",
        "Trace a quiet loop through the waiting glass.",
        "The narrow path asks for careful alignment.",
        "Carry the current across the chamber, one turn at a time.",
        "Divide the light. Wake both listening crystals.",
        "One current, two paths. Find room for both.",
        "A quiet divide brings two distant crystals to life.",
        "Let two prisms carry one light to three places.",
        "Bring every quiet corner into the constellation."
    ],
    levels: "Choose a chamber",
    levelsIntro: "Twelve quiet paths through the Glassroot Caverns.",
    help: "Rotate the optics. Follow the light.",
    helpIntro: "A quiet place for players who enjoy calm logic puzzles. Guide one light through the Glassroot Caverns.",
    steps: ["Select a lens, mirror, or splitter.", "Click or tap to turn it 90 degrees.", "Light every receiver to finish the chamber."],
    keyboard: "Arrow keys select an optic · Enter rotates · U undo · R restart · L levels · Esc closes",
    rules: "Mirrors bend light. Lenses only pass light along their marked axis. Splitters continue straight and add a branch in the arrow direction. Receivers only accept light from their marked direction.",
    complete: "The path is whole.",
    next: "Next chamber",
    back: "Back to levels",
    replay: "Replay",
    soundOn: "Sound on",
    soundOff: "Sound off",
    sceneSummary: "Isometric crystal puzzle. Use the equivalent Optic controls to rotate each piece.",
    unavailable: "3D rendering is unavailable on this device. You can still play using Optic controls below; the live receiver count follows the same optical rules.",
    storageUnavailable: "Device storage is unavailable. Progress lasts for this visit.",
    completeStats: (moves, target) => `Solved in ${moves} moves · Target ${target}`,
    receiverStatus: (lit, total) => `${lit} of ${total} receivers lit`,
    chamber: (id) => `CHAMBER ${String(id).padStart(2, "0")}`,
    levelNumber: (id) => `LEVEL ${String(id).padStart(2, "0")} / 12`,
    best: (count) => `best ${count}`,
    piece: (piece, rotation) =>
    {
        const type = { L: "Lens", M: "Mirror", P: "Splitter" }[piece.type];
        const axis = piece.type === "L" ? (rotation % 2 === 0 ? "horizontal" : "vertical") :
            piece.type === "M" ? (rotation % 2 === 0 ? "rising" : "falling") : ["north", "east", "south", "west"][rotation];
        return `${type} at column ${piece.x + 1}, row ${piece.y + 1}, ${axis}`;
    }
};

export const shell = `
    <a class="skip" href="#controls">Skip to game controls</a>
    <header>
        <a class="brand" href="./index.html" aria-label="Lumenwild home">
            <img src="./facet.svg" alt="" width="34" height="42">
            <span>Lumenwild<small>Turn the light. Wake the quiet.</small></span>
        </a>
        <nav aria-label="Game menu">
            <button data-action="levels" data-icon="Grid3X3" aria-label="Levels"><span>Levels</span></button>
            <button data-action="help" data-icon="CircleHelp" aria-label="How to play"><span>How to play</span></button>
            <button class="header-sound" data-action="sound" data-icon="VolumeX"><span>Sound off</span></button>
        </nav>
    </header>
    <main>
        <section class="scene-card" aria-label="Interactive crystal chamber">
            <div class="scene-top">
                <div class="chamber-label"><span class="tiny-square"></span><span id="chamber">CHAMBER 01</span></div>
                <span class="scene-world">THE GLASSROOT CAVERNS</span>
            </div>
            <div id="board" tabindex="0" role="group" aria-label="Light puzzle. Arrow keys select an optic; Enter rotates."></div>
            <div class="scene-bottom">
                <span class="live-label"><i></i> LIVE LIGHT PATH</span>
                <span class="board-hint">Click an optic to rotate <b>·</b> <kbd>U</kbd> undo <b>·</b> <kbd>R</kbd> restart</span>
            </div>
            <div class="scene-corner" aria-hidden="true">N<span>╱</span>E</div>
        </section>
        <aside class="rail" id="controls" tabindex="-1" aria-label="Game controls">
            <div class="level-intro">
                <p class="eyebrow" id="level-number"></p>
                <h1 id="level-name"></h1>
                <p class="instruction" id="instruction"></p>
            </div>
            <div class="counters">
                <div><span>MOVES</span><strong id="moves">0</strong><small id="best"></small></div>
                <div><span>TARGET</span><strong id="target">1</strong><small>authored path</small></div>
            </div>
            <div class="receiver-status" role="status" aria-live="polite">
                <span class="receiver-dot"></span><span id="receiver-status">0 of 1 receivers lit</span>
            </div>
            <span class="sr-only" id="completion-status" role="status" aria-live="polite"></span>
            <button id="continue" class="primary" data-action="complete" hidden>The path is whole <span>→</span></button>
            <div class="desktop-actions">
                <button data-action="undo" data-icon="Undo2" disabled>Undo</button>
                <button data-action="restart" data-icon="RotateCcw">Restart</button>
            </div>
            <section class="legend" aria-labelledby="legend-title">
                <p class="eyebrow" id="legend-title">THE OPTICS</p>
                <div><span class="optic-icon lens-icon"></span><span><b>Lens</b><small>Align its axis</small></span></div>
                <div><span class="optic-icon mirror-icon"></span><span><b>Mirror</b><small>Turn the beam</small></span></div>
                <div id="splitter-legend" hidden><span class="optic-icon splitter-icon"></span><span><b>Splitter</b><small>Light two paths</small></span></div>
            </section>
            <details class="piece-panel">
                <summary>Optic controls <span id="piece-count"></span></summary>
                <p>Select with arrow keys. Press Enter to rotate.</p>
                <div id="piece-list"></div>
            </details>
            <div class="rail-footer">
                <p>A quiet puzzle in the Glassroot Caverns.</p>
                <p><span class="device-dot"></span>Progress stays on this device.</p>
                <a href="https://vibefather.ai/t/light-beam-lens-puzzle-game" target="_blank" rel="noopener noreferrer">Template by VibeFather <span>↗</span></a>
            </div>
        </aside>
    </main>
    <div class="mobile-controls" aria-label="Touch controls">
        <button data-action="undo" data-icon="Undo2" disabled>Undo</button>
        <button data-action="rotate" class="rotate-button">Rotate selected</button>
        <button data-action="restart" data-icon="RotateCcw">Restart</button>
    </div>
    <dialog id="dialog" aria-labelledby="dialog-title">
        <button id="close-dialog" class="icon-button close-dialog" data-icon="X" aria-label="Close dialog"></button>
        <div id="dialog-content"></div>
    </dialog>
`;
