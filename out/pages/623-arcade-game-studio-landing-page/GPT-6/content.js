export const content =
{
    brand: "Lanternbyte Games",
    game: "Lantern Dash",
    home: "Tallinn, Estonia",
    newsletter: "The Save Point",
    storageKey: "lanternbyte-games:lantern-dash:v1",
    ticker: ["LANTERN DASH", "TINY TIDE", "MIDNIGHT POST", "SMALL GAMES. BIG FEELINGS."],
    games:
    [
        {
            id: "dash", name: "LANTERN DASH", category: "ENDLESS RUNNER", status: "PLAY NOW", theme: "night",
            description: "Carry a little light across Tallinn’s midnight rooftops. Jump over chimney pots, duck under low-flying lanterns, and keep your glow alive as the city gets faster.",
            note: "A real, original browser game. Free, silent, and saved only on your device."
        },
        {
            id: "tide", name: "TINY TIDE", category: "COZY EXPLORATION", status: "IN THE SKETCHBOOK", theme: "ocean",
            description: "One tiny boat. An archipelago of ordinary wonders. A cozy exploration concept about finding your own pace, one little island at a time.",
            note: "Fictional concept cartridge. No playable build, store page, purchase, or release date."
        },
        {
            id: "post", name: "MIDNIGHT POST", category: "A LITTLE MYSTERY", status: "IN THE SKETCHBOOK", theme: "post",
            description: "The last train has gone. The letters haven’t. A story-game concept about a night-shift postie and the wonderfully odd people still awake.",
            note: "Fictional concept cartridge. No playable build, store page, purchase, or release date."
        }
    ],
    gameCopy:
    {
        attract: "LANTERN DASH",
        ready: "PLAYER 1",
        paused: "TAKE A BREATHER.",
        pausedNote: "Your little light will wait.",
        over: "ONE MORE GO?",
        overNote: "Every little run counts.",
        start: "▶ INSERT COIN",
        resume: "▶ KEEP GOING",
        retry: "▶ TRY AGAIN",
        save: "SAVE SCORE",
        hudScore: "SCORE",
        hudSpeed: "SPEED",
        scoreUnit: "POINTS",
        best: "NEW LOCAL LEGEND"
    },
    messages:
    {
        local: "YOUR BROWSER. YOUR BRAGGING RIGHTS.",
        memory: "STORAGE UNAVAILABLE. SCORES LAST THIS VISIT.",
        subscribed: "Spot saved for this visit! This is a local demo — no subscription or email was sent.",
        newScore: "A new little legend.",
        emptyPlayer: "---",
        emptyScore: "-----",
        finalScore: "POINTS. A little run worth remembering.",
        playCartridge: "PLAY IN THE CABINET ↑",
        pause: "PAUSE GAME",
        resume: "RESUME GAME",
        explore: "Explore",
        scoreLabel: "Top five local scores"
    }
};

export const pageMarkup = `
    <a class="skip" href="#arcade">Skip to playable game</a>
    <header class="header wrap">
        <a class="brand" href="#home" aria-label="Lanternbyte Games home">
            <svg viewBox="0 0 24 28" aria-hidden="true" shape-rendering="crispEdges"><path fill="#ffb627" d="M8 0h8v4h4v4h4v16h-4v4H4v-4H0V8h4V4h4z"/><path fill="#101119" d="M8 8h8v4h4v8h-4v4H8v-4H4v-8h4z"/><path fill="#ff2e88" d="M10 10h4v10h-4z"/></svg>
            <span>LANTERNBYTE<small>GAMES, WITH A LITTLE GLOW.</small></span>
        </a>
        <nav aria-label="Main navigation"><a href="#games">Our games</a><a href="#studio">The studio</a><a class="nav-cta" href="#newsletter">The Save Point <span>↗</span></a></nav>
    </header>
    <main id="home">
        <section class="hero wrap" aria-labelledby="hero-title">
            <div class="hero-copy">
                <p class="eyebrow"><span class="status-dot"></span> SMALL STUDIO. PLAYER-ONE ENERGY.</p>
                <h1 id="hero-title">SMALL GAMES.<br>BIG <span>FEELINGS.</span><i aria-hidden="true">✦</i></h1>
                <p class="lead">Pocket-sized worlds. Proper little adventures.<br>Made with heart, a few pixels, and just enough<br class="desktop-break"> “okay, one more go.”</p>
                <div class="hero-actions"><button class="button amber" id="play-hero">PLAY LANTERN DASH <span>↗</span></button><span class="free-note">No coins needed.<br>Just a little courage.</span></div>
                <aside class="scoreboard" aria-labelledby="scores-title">
                    <div class="score-head"><h2 id="scores-title">LOCAL LEGENDS</h2><span>TOP 05</span></div>
                    <div class="score-columns"><span>RANK / PLAYER</span><span>HI-SCORE</span></div>
                    <ol id="scores" aria-label="Top five local scores"></ol>
                    <div class="score-foot"><span id="storage-note">YOUR BROWSER. YOUR BRAGGING RIGHTS.</span><button id="reset-scores">RESET</button></div>
                    <div id="reset-confirm" hidden><p>Clear this browser’s high scores?</p><button id="confirm-reset">Yes, clear scores</button><button id="cancel-reset">Keep them</button></div>
                </aside>
            </div>
            <div class="arcade-area" id="arcade">
                <span class="side-label" aria-hidden="true">BUILT FOR THE JOY OF IT. / EST. 2024</span>
                <span class="spark spark-one" aria-hidden="true">✦</span><span class="spark spark-two" aria-hidden="true">+</span>
                <div class="cabinet">
                    <div class="cabinet-top"><span class="screw"></span><span>LANTERN <b>DASH</b></span><span class="screw"></span></div>
                    <div class="marquee-sub"><span>★ AN ORIGINAL LANTERNBYTE GAME ★</span></div>
                    <div class="bezel">
                        <div class="screen" id="screen">
                            <canvas id="game" width="320" height="180" tabindex="0" aria-label="Lantern Dash playable runner. Space or Up to jump, Down to duck, P to pause."></canvas>
                            <div class="crt" aria-hidden="true"></div>
                            <div class="screen-overlay" id="game-overlay">
                                <span class="pixel-small">PLAYER 1 · READY WHEN YOU ARE</span>
                                <h2>LANTERN<br><span>DASH</span></h2>
                                <p>A little light. A long way home.</p>
                                <button id="start-game">▶ INSERT COIN</button>
                                <small>FREE TO PLAY · SOUND OFF, ALWAYS</small>
                            </div>
                        </div>
                        <div class="screen-instructions"><span>↑ / SPACE <b>JUMP</b></span><span>↓ <b>DUCK</b></span><span>P <b>PAUSE</b></span></div>
                    </div>
                    <div class="control-deck">
                        <div class="joystick" aria-hidden="true"><i></i><b></b></div>
                        <div class="deck-label">LANTERNBYTE<br><span>PLAYER 01</span></div>
                        <div class="arcade-buttons"><button id="duck" data-label="HOLD: DUCK" aria-label="Duck (hold)">B</button><button id="jump" data-label="JUMP" aria-label="Jump">A</button></div>
                    </div>
                    <div class="cabinet-bottom"><div class="speaker" aria-hidden="true"></div><div class="coin-slot"><span>100%<br>GOOD TIMES</span><i></i></div><div class="cabinet-seal">LB</div></div>
                    <div class="cabinet-feet" aria-hidden="true"></div>
                </div>
                <div class="below-cabinet"><span class="status-dot"></span> LIVE IN YOUR BROWSER <button id="pause-game" disabled>PAUSE GAME</button></div>
            </div>
        </section>
        <div class="ticker" aria-label="Games from Lanternbyte"><div id="ticker"></div></div>
        <section class="games-section wrap" id="games" aria-labelledby="games-title">
            <div class="section-top"><div><p class="eyebrow">01 / THE CARTRIDGE SHELF</p><h2 id="games-title">Little worlds. <span>Pick one.</span></h2></div><p>Short on time. Never on adventure.<br>A few small things we’re making.</p></div>
            <div class="games-grid" id="game-cards"></div>
            <p class="shelf-note">A fictional indie studio, brought to life in your browser. Lantern Dash is playable here; the other cartridges are original concepts, not store releases.</p>
        </section>
        <section class="studio-section" id="studio" aria-labelledby="studio-title">
            <div class="studio-inner wrap"><div class="studio-art" id="studio-art" aria-label="Original pixel illustration of a cozy game studio"></div><div class="studio-copy"><p class="eyebrow">02 / MEET YOUR LOCAL PIXEL PEOPLE</p><h2 id="studio-title">Three humans.<br>One shared save file.</h2><p>We’re Lanternbyte Games, a three-person studio making pocket-sized pixel games you can finish on a lunch break.</p><p>From our imaginary little corner of Tallinn, Estonia, we build the kind of worlds we want to get lost in: a little strange, a little cozy, and always worth another try.</p><div class="studio-stats"><span><b>03</b>HUMANS</span><span><b>∞</b>LITTLE IDEAS</span><span><b>00</b>CRUNCH CULTURE</span></div></div></div>
        </section>
        <section class="newsletter wrap" id="newsletter" aria-labelledby="newsletter-title">
            <div><p class="eyebrow">03 / A LETTER FROM THE OTHER SIDE OF THE SCREEN</p><h2 id="newsletter-title">You found a save point.</h2><p>Dev notes, fresh pixels, and things worth pausing for.<br>Join <strong>The Save Point</strong>. A small letter, once in a while.</p></div>
            <form id="newsletter-form"><label for="email">YOUR EMAIL ADDRESS</label><div class="email-row"><input id="email" type="email" placeholder="player.one@example.com" autocomplete="email" required><button class="button amber" type="submit">SAVE MY SPOT ↗</button></div><p id="newsletter-status" role="status">Local demo only. No email is sent or collected by a server.</p></form>
        </section>
    </main>
    <footer class="wrap"><a class="footer-brand" href="#home">LANTERNBYTE <span>GAMES</span></a><p>© 2026 Lanternbyte Games · Fictional studio, real pixels.<br>Made slowly. Played happily. No audio, ever.</p><a href="https://vibefather.ai/t/arcade-game-studio-landing-page" target="_blank" rel="noopener noreferrer">Template by VibeFather ↗</a></footer>
    <dialog id="game-detail"><button class="close-dialog" aria-label="Close game details">×</button><div id="detail-content"></div></dialog>
    <dialog id="score-dialog"><h2>A NEW LITTLE LEGEND.</h2><p id="final-score"></p><form id="score-form"><label for="initials">YOUR 3-LETTER INITIALS</label><input id="initials" maxlength="3" minlength="3" pattern="[A-Za-z]{3}" autocomplete="off" required placeholder="YOU"><button class="button amber" type="submit">SAVE SCORE</button><button type="button" id="skip-score">Skip for now</button></form><p>Saved on this browser only.</p></dialog>
`;
