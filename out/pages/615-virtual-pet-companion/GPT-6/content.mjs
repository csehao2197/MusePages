export const C =
{
    brand: "Pocket Meadow",
    pet: "Bramble",
    kind: "moss bunny",
    habitat: "Sunpatch Burrow",
    coin: "acorns",
    key: "pocket-meadow:save:v1",
    intro: "Your little moss bunny, ready for a quiet break.",
    thought: "Is that a snack?",
    welcome: ["Bramble moved into Sunpatch Burrow.", "A tiny jar held 30 acorns."],
    moods: ["All needs steady", "Could use a little care", "Time for some care"],
    tiers: ["Needs care", "Low", "Okay", "Great"],
    meters:
    [
        { key: "hunger", label: "Hunger", color: "leaf", icon: "utensils", action: "feed", initial: 72, decay: .30 },
        { key: "mood", label: "Mood", color: "coral", icon: "heart", action: "play", initial: 80, decay: .18 },
        { key: "cleanliness", label: "Cleanliness", color: "sky", icon: "droplets", action: "clean", initial: 68, decay: .12 },
        { key: "energy", label: "Energy", color: "lavender", icon: "zap", action: "rest", initial: 86, decay: .10 }
    ],
    actions:
    {
        feed: { label: "Feed", shortcut: "F", icon: "utensils", color: "leaf", changes: [24, 3, -4, 0], message: "Bramble crunched a leafy snack.", thought: "Excellent crunch." },
        play: { label: "Play", shortcut: "P", icon: "gamepad-2", color: "coral", changes: [-4, 18, -6, -10], message: "Bramble bounced the little berry ball.", thought: "One more bounce!" },
        clean: { label: "Clean", shortcut: "C", icon: "shower-head", color: "sky", changes: [0, 4, 32, -3], message: "Bramble is fresh from a bubble wash.", thought: "Squeaky clean." },
        rest: { label: "Rest", shortcut: "R", icon: "moon", color: "lavender", changes: [-4, 0, 0, 30], message: "Bramble took a soft little rest.", thought: "A very good snooze." }
    },
    items:
    [
        { id: "leaf", name: "Leaf Cap", price: 0, description: "A two-leaf cap for sunny lounging." },
        { id: "scarf", name: "Berry Scarf", price: 20, description: "A coral neckerchief with a square knot." },
        { id: "hood", name: "Cloud Hood", price: 35, description: "A sky-blue hood with tiny cream tufts." },
        { id: "glasses", name: "Star Glasses", price: 55, description: "Honey pixel frames with four-point arms." },
        { id: "cape", name: "Cozy Cape", price: 80, description: "A lavender cape with a cream clasp." },
        { id: "crown", name: "Sun Crown", price: 120, description: "A five-point crown made for tiny celebrations." }
    ],
    games:
    {
        catch: { title: "Snack Catch", seconds: 30, subtitle: "30 seconds · Move & catch", instructions: "Guide Bramble under falling snacks. Each catch adds 1 to the round reward.", controls: "Arrow keys or A / D to move. Drag on the playfield, or hold Left and Right.", rule: "Catch +1 acorn. Misses cost nothing.", start: "Catch snacks for 30 seconds." },
        bubble: { title: "Bubble Pop", seconds: 25, subtitle: "25 seconds · Aim & pop", instructions: "Pop drifting bubbles. Large bubbles add 1 and small bubbles add 2.", controls: "Tap a bubble. Or move the square reticle with arrows / WASD and press Space.", rule: "Large +1, small +2. Misses cost nothing.", start: "Pop bubbles for 25 seconds." }
    },
    text:
    {
        needs: "Needs update with real time",
        cooldown: "A little moment… ready in a second.",
        lowEnergy: "A quick rest will help first.",
        petHappy: "Bramble leaned into a friendly pat.",
        petThought: "Hello, favorite visitor.",
        corrupt: "That save could not be read. Bramble has a fresh start.",
        storage: "Device saving is unavailable. You can still play; this visit may not be saved.",
        saved: "Saved on this device",
        allOwned: "Every look is unlocked. Time to mix and match.",
        away: "While you were away, needs changed with elapsed time.",
        reset: "A fresh little beginning for Bramble.",
        noScore: "No score yet",
        unknownAccessory: "Unknown accessory.",
        originalLook: "Bramble is wearing the original look.",
        ready: "A little care goes a long way.",
        free: "Free",
        equip: "Equip",
        equippedLabel: "Equipped",
        pause: "Pause",
        resume: "Resume",
        paused: "Paused",
        pauseDescription: "The clock is taking a break, too.",
        nice: "NICELY PLAYED",
        complete: "Round complete",
        score: "Score",
        playAgain: "Play again",
        back: "Back to pet",
        remaining: (score, seconds) => `Score ${score}. ${seconds} seconds remaining.`,
        documentTitle: (view) => `Pocket Meadow — ${view === "home" ? "Bramble's Home" : view === "games" ? "Pocket Arcade" : "Bramble's Wardrobe"}`,
        none: "No accessory",
        outOfRound: "No rewards banked: the round ended early.",
        recommend: (action) => `${action} will help the lowest need.`,
        unlocked: (item) => `${item} unlocked. Looking good, Bramble!`,
        equipped: (item) => `Bramble is wearing ${item}.`,
        need: (amount) => `Need ${amount} more acorns`,
        reward: (score, game) => `${game}: Bramble earned ${score} acorns.`,
        high: (score) => `Best ${score}`,
        unlock: (price) => `Unlock · ${price} acorns`
    }
};

export function homeContent(state, { heading, habitat, pet, icon })
{
    return `${heading(C.habitat, `Meet ${C.pet}.`, C.intro, "YOUR LITTLE PATCH OF PEACE")}
    <div class="workspace">
        <section class="scene" aria-label="Bramble's interactive habitat">
            ${habitat()}<div class="sunbeam"></div>
            <div class="thought" id="thought">${C.thought}</div>
            <button class="pet-button" id="pat" aria-label="Pet Bramble">${pet(state.equipped)}</button>
            <button class="prop bowl" data-care="feed" aria-label="Feed Bramble from the bowl"></button>
            <button class="prop ball" data-care="play" aria-label="Play with the ball"></button>
            <button class="prop wash" data-care="clean" aria-label="Clean Bramble in the washing nook"></button>
            <div class="particles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
            <div class="zzz" aria-hidden="true">z <span>Z</span></div>
            <div class="scene-caption"><span>${C.habitat}</span><span id="scene-condition"></span></div>
            <p class="sr-only" id="scene-summary"></p>
        </section>
        <section class="console panel"><div class="panel-title"><h2>Care for ${C.pet}</h2><span class="live-dot" aria-hidden="true"></span></div><p class="small muted">${C.text.needs}</p>
            <div class="meters">${C.meters.map((m) => `<div class="meter ${m.color}"><div class="meter-label">${icon(m.icon)}<span>${m.label}</span><strong id="${m.key}-value"></strong></div><div class="meter-bottom"><div class="track" role="progressbar" aria-label="${m.label}" aria-valuemin="0" aria-valuemax="100" id="${m.key}-bar"><i></i></div><span id="${m.key}-status"></span></div></div>`).join("")}</div>
            <p id="recommendation" class="recommendation"></p>
            <div class="care-actions">${Object.entries(C.actions).map(([key, a]) => `<button class="${a.color}" data-care="${key}">${icon(a.icon)}${a.label}<kbd>${a.shortcut}</kbd></button>`).join("")}</div>
            <p id="cooldown" class="small muted cooldown" aria-live="polite"></p>
        </section>
    </div>
    <div class="below-grid"><section class="panel moments"><div class="panel-title"><h2>Little moments</h2>${icon("heart")}</div><ul id="activity"></ul></section><section class="panel next"><p class="eyebrow">A LITTLE SOMETHING TO WORK TOWARD</p><h2>Next wardrobe treat</h2><div id="next-item"></div></section></div>
    <section class="how"><strong>How care works</strong><span>${icon("moon")}Needs change with elapsed time</span><span>${icon("gamepad-2")}Games earn acorns</span><span>${icon("check")}Progress saves on this device</span></section>
    <div class="save-row"><span id="save-state" class="small muted"></span><button class="text-button" id="reset-open">${icon("rotate-ccw")}Reset pet</button></div>`;
}
export function wardrobeContent(state, { heading, pet, icon })
{
    return `${heading("Wardrobe", `A new look for ${C.pet}.`, "Unlock once, wear whenever. Everything is saved on this device.")}
        <div class="dressing"><section class="dressing-preview panel"><div class="dressing-stage"><div class="checker"></div>${pet(state.equipped)}<span class="room-label">${C.habitat}</span></div><div class="nameplate"><h2>${C.pet}</h2><p id="equipped-name"></p></div><button id="remove-accessory">${icon("x")}Remove accessory</button><a href="#/games">Play to earn more ${icon("arrow-right")}</a></section>
        <section class="outfit-grid" aria-label="Six accessories">${C.items.map((item) => `<article class="outfit panel" data-item="${item.id}"><div class="outfit-image">${pet(item.id)}</div><div class="outfit-title"><h2>${item.name}</h2><span>${item.price === 0 ? C.text.free : `${item.price} acorns`}</span></div><p>${item.description}</p><button data-buy="${item.id}"></button></article>`).join("")}</section></div>
        <section class="panel closet"><h2>Tiny closet, simple rules</h2><p>Play either arcade game to earn acorns.</p><p>Unlocks are permanent on this device.</p><p>Choose Remove accessory for the original look.</p><a href="./index.html" data-home>Back to Bramble ${icon("arrow-right")}</a></section>`;
}
export function arcadeContent(selected, state, { heading, pet, icon })
{
    return `${heading("Pocket arcade", "Play for acorns.", "Two quick games. Real rewards. Your best scores stay on this device.")}
        <div class="game-selectors">${Object.entries(C.games).map(([id, g]) => `<button class="game-selector panel ${id === selected ? "selected" : ""}" data-game="${id}" aria-pressed="${id === selected}"><div class="game-thumb ${id}">${id === "catch" ? pet(state.equipped) + '<i class="snack-pixel"></i>' : '<i class="bubble-art"></i><i class="bubble-art small-bubble"></i>'}</div><span><strong>${g.title}</strong><span>${g.subtitle}</span><span data-best="${id}"></span></span>${icon("play")}</button>`).join("")}</div>
        <div class="game-workspace"><section class="panel game-panel"><div class="game-hud"><h2 id="game-title">${C.games[selected].title}</h2><div><span>Score <strong id="score">0</strong></span><span>Time <strong id="time">${C.games[selected].seconds}</strong></span><span id="best"></span></div><div class="game-hud-actions"><button id="pause" disabled aria-label="Pause game">${icon("pause")}<span>Pause</span></button><button id="restart" aria-label="Restart game">${icon("rotate-ccw")}</button></div></div>
        <div class="canvas-wrap"><canvas id="game" width="640" height="360" tabindex="0" role="application" aria-label="${C.games[selected].title}; use arrows or WASD, and Space for Bubble Pop"></canvas><div class="game-overlay" id="game-overlay"><div><p class="eyebrow">A SMALL ADVENTURE</p><h2>${C.games[selected].title}</h2><p>${C.games[selected].start}</p><button class="leaf" id="start">${icon("play")}Start</button></div></div></div>
        <div class="touch-controls"><button id="left">${icon("arrow-left")}Left</button><p>Take your time.<br>Misses cost nothing.</p><button id="right">Right${icon("arrow-right")}</button></div>
        <p id="game-live" class="sr-only" aria-live="polite"></p></section>
        <aside class="panel game-instructions"><p class="eyebrow">HOW TO PLAY</p><h2>${C.games[selected].title}</h2><p>${C.games[selected].instructions}</p><hr><h3>Make your move</h3><p>${C.games[selected].controls}</p><div class="reward-note">${icon("coins")}<p>${C.games[selected].rule}</p></div><p class="small muted">Rewards bank only when the round ends.</p></aside></div>
        <div class="game-notes"><span>${icon("coins")}Rewards bank when a round ends</span><span>${icon("pause")}Pausing freezes the clock</span><span>${icon("trophy")}High scores and acorns save on this device</span></div>
        <div class="wardrobe-callout"><div><h2>Ready for a new look?</h2><p>A little play, a little personal style.</p></div><a href="#/wardrobe">Spend acorns in the wardrobe ${icon("arrow-right")}</a></div>`;
}
export function nextContent(next, state, { pet, icon })
{
    return next ? `<div class="next-content"><div class="next-art">${pet(next.id)}</div><div><strong>${next.name}</strong><p>${next.price} acorns <span class="muted">· You have ${state.coins}</span></p><a href="#/wardrobe">Visit wardrobe ${icon("chevron-right")}</a></div></div>` : `<p>${C.text.allOwned}</p><a href="#/wardrobe">Visit wardrobe ${icon("chevron-right")}</a>`;
}
export const shellContent = `<a class="skip" href="#main">Skip to play</a>
    <header>
        <div class="shell header-inner">
            <a class="brand" href="./index.html"><img src="./sprout.svg" alt="" width="32" height="32"><span>Pocket<br class="brand-break"> Meadow</span></a>
            <nav aria-label="Main navigation">
                <a href="./index.html" data-nav="home"><svg><use href="./icons.svg#house"></use></svg>Pet</a>
                <a href="#/games" data-nav="games"><svg><use href="./icons.svg#gamepad-2"></use></svg>Arcade</a>
                <a href="#/wardrobe" data-nav="wardrobe"><svg><use href="./icons.svg#shirt"></use></svg>Wardrobe</a>
            </nav>
            <div class="wallet"><svg><use href="./icons.svg#coins"></use></svg><strong data-balance>30</strong><span>acorns</span></div>
        </div>
    </header>
    <div id="toast" class="shell" role="status" aria-live="polite"></div>
    <main id="main" class="shell" tabindex="-1"></main>
    <footer><div class="shell footer-inner"><div><strong>Pocket Meadow</strong><p>A small companion for quiet breaks.</p></div><div><p>Saved on this device · No account · Original pixel art</p><a href="https://vibefather.ai/t/virtual-pet-companion" target="_blank" rel="noopener noreferrer">Template by VibeFather <span aria-hidden="true">↗</span></a></div></div></footer>
    <dialog id="reset-dialog" aria-labelledby="reset-title"><h2 id="reset-title">Start over with Bramble?</h2><p>Care progress, acorns, outfits, activity, and high scores on this device will be cleared.</p><div class="dialog-actions"><button id="cancel-reset">Cancel</button><button id="confirm-reset" class="coral">Reset pet</button></div></dialog>
    <dialog id="exit-dialog" aria-labelledby="exit-title"><h2 id="exit-title">Leave this round?</h2><p>This round's rewards will not be banked. Finished rounds and your best scores stay saved.</p><div class="dialog-actions"><button id="cancel-exit">Keep playing</button><button id="confirm-exit" class="coral">Leave round</button></div></dialog>`;
