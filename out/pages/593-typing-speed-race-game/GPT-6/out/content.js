export const content =
{
    brand: "Keyway Circuit",
    tagline: "Outtype the echo.",
    pack: "Night Drive",
    ghost: "Echo",
    storageKey: "keyway-circuit:runs:v1",
    levels:
    {
        Easy: { pace: 30 },
        Medium: { pace: 45 },
        Hard: { pace: 60 }
    },
    passages:
    {
        Easy:
        [
            "The street is quiet before the signal turns green. Cool air moves through the open window. Your hands settle over the keys as the first lane lights appear ahead. Keep your eyes on the words, find a steady rhythm, and let every clean sentence carry you toward the finish.",
            "A silver moon hangs above the empty avenue. The road curves past dark windows and sleeping gardens. There is no need to hurry at the beginning. Relax your shoulders, breathe evenly, and trust the small movements of your fingers. Smooth typing will always take you farther than a rushed start."
        ],
        Medium:
        [
            "At the edge of the city, the circuit glows with reflected color. Every correct word sends a pulse through the console, while a small mistake asks for patience rather than panic. Release the wrong key, step back, and repair the line. The best drivers know that control is not the opposite of speed; it is the reason speed can last.",
            "Your rival holds a measured pace through the electric night. You can see the gap change with each phrase, but the track never decides the result for you. Read one word ahead, keep your movements light, and give every comma the same attention as a letter. A clean run is built from hundreds of ordinary choices made well."
        ],
        Hard:
        [
            "By 02:17, the rain had polished the circuit into a mirror of cyan, coral, and gold. The telemetry read 96.8% accuracy; one careless keystroke could still undo a flawless sector. Hold the rhythm through brackets, numbers, and punctuation: (breathe) → read → respond. Precision is a sequence, not a mood, and the finish line rewards the driver who protects it.",
            "Sector 3 begins where the old tramway crosses the floodlit docks. At 58 WPM, hesitation costs more than a corrected error, yet frantic typing costs both time and control. Watch the next 3 words, keep 2 light fingers near the home row, and do not chase the ghost's signal. Your own clean output is the only engine in this race."
        ]
    },
    labels:
    {
        start: "Start race",
        pause: "Pause race",
        resume: "Resume race",
        again: "Race again",
        restart: "Restart race",
        confirmRestart: "Confirm restart",
        next: "Next passage",
        tap: "Tap to type",
        idle: "Ready on the grid",
        countdown: "Lights out in",
        ready: "GO — type to start the clock",
        racing: "Race in progress",
        paused: "Race paused — timing is frozen",
        finished: "Full passage. Clean finish.",
        error: "Wrong character — Backspace to repair",
        blocked: "Paste and drop are disabled. Type each character.",
        level: "Level pace",
        youLead: "You lead",
        ghostLead: "Ghost leads",
        equal: "Photo finish",
        ghostFinished: "Ghost reached the line — keep typing",
        youWin: "You reached the line first",
        ghostWins: "Echo reached the line first",
        tie: "You and Echo reached the line together",
        newBest: "New personal best",
        bestUnchanged: "Personal best unchanged",
        bestGap: "WPM to your personal best",
        first: "Your first finish on this pace",
        copySuccess: "Result copied. Nothing was posted.",
        copyManual: "Clipboard unavailable — select and copy the result below.",
        downloaded: "PNG downloaded.",
        clear: "Clear history",
        confirmClear: "Confirm clear",
        storageUnavailable: "Storage is unavailable; these records will last only for this visit.",
        saved: "Saved on this device",
        empty: "No finishes yet. Your first completed race sets the record.",
        noRecent: "Your next finish belongs here.",
        run: "Run",
        passage: "Passage",
        pb: "Personal best",
        wpm: "WPM",
        accuracy: "ACCURACY",
        time: "TIME",
        you: "YOU",
        target: "ECHO · TARGET PACE",
        circuit: "NIGHT DRIVE",
        track: "STRAIGHT CIRCUIT / 01",
        startLine: "START",
        finishLine: "FINISH",
        activeTime: "ACTIVE TIME",
        targetPace: "FIXED TARGET",
        personal: "PERSONAL BEST",
        complete: "OFFICIAL RUN COMPLETE",
        shareAlt: "Your downloadable race result card",
        units: "WPM",
        separator: " · ",
        progress: "correct",
        completeWord: "COMPLETE",
        ghostWord: "Ghost",
        recordsNote: "Completed runs are stored only in this browser.",
        blank: "—"
    },
    shell: `
        <header class="header">
            <a class="brand" href="./index.html#race" aria-label="Keyway Circuit home"><span class="brand-mark" aria-hidden="true"></span><span>KEYWAY<span class="brand-second"> CIRCUIT</span><small>Outtype the echo.</small></span></a>
            <nav aria-label="Main navigation"><a href="./index.html#race" class="nav-race">Race</a><a href="./index.html#records" class="nav-records">Records</a><a href="./index.html#how-to-race">How to race <span aria-hidden="true">↗</span></a></nav>
            <span class="local-status"><i></i> LOCAL PLAY <small>Saved on this device</small></span>
        </header>
        <main>
            <section id="race" aria-labelledby="race-title">
                <div class="intro"><div><p class="eyebrow"><span class="live-dot"></span> NIGHT DRIVE / TYPING CIRCUIT</p><h1 id="race-title">Outtype <em>the echo.</em></h1></div><p class="intro-note">Type the passage. Correct characters move your car.<br>Backspace fixes an error. <span>No shortcuts to the finish.</span></p></div>
                <div class="race-toolbar"><div id="difficulties" role="group" aria-label="Difficulty"></div><button id="next" class="quiet" data-icon="ArrowRight">Next passage</button></div>
                <div class="cockpit">
                    <section class="track-panel clipped" aria-label="Race track">
                        <div class="panel-top"><span><span class="live-dot"></span> LIVE CIRCUIT</span><span id="track-difficulty">MEDIUM / 45 WPM</span></div>
                        <div class="canvas-wrap"><canvas id="track" role="img" aria-label="Top-down circuit with a cyan player car and gold fixed target car"></canvas><div id="countdown" aria-live="assertive"></div></div>
                        <div class="position"><span id="position">Level pace</span><span id="percent">0% <small>COMPLETE</small></span></div>
                        <div class="track-bottom"><span><b class="cyan-line"></b> YOU</span><span><b class="gold-line"></b> ECHO · TARGET PACE</span><span class="target-tag">NOT A LIVE PLAYER</span></div>
                    </section>
                    <section class="console-panel clipped" aria-label="Typing console">
                        <div class="stats"><div><span>WPM</span><strong id="wpm">0</strong><small>YOUR PACE</small></div><div><span>ACCURACY</span><strong id="accuracy">100.0<span>%</span></strong><small>EVERY KEY COUNTS</small></div><div><span>TIME</span><strong id="time">0:00.0</strong><small>ACTIVE TIME</small></div></div>
                        <div class="passage-heading"><span id="passage-label">NIGHT DRIVE / PASSAGE 01</span><span id="character-count">0 / 0</span></div>
                        <div id="passage" tabindex="0" role="button" aria-label="Focus typing input. Start the race before typing."></div>
                        <input id="typing" class="native-input" type="text" aria-label="Type the race passage" aria-describedby="race-status" autocapitalize="none" autocomplete="off" autocorrect="off" spellcheck="false" disabled>
                        <div id="race-status" class="race-status" role="status">Ready on the grid</div>
                        <div class="controls"><button id="primary" class="primary" data-icon="Play">Start race</button><button id="restart" class="secondary" data-icon="RotateCcw" disabled>Restart race</button><button id="tap" class="tap quiet" data-icon="Keyboard">Tap to type</button></div>
                    </section>
                </div>
                <p class="honesty"><span aria-hidden="true">◇</span> No sign-in. No online opponents. Your records stay in this browser.<span class="keyboard-note">A LITTLE FOCUS. A CLEANER FINISH.</span></p>
            </section>
            <section id="results" class="results clipped" hidden aria-labelledby="result-title">
                <div class="result-summary"><p class="eyebrow">OFFICIAL RUN COMPLETE</p><h2 id="result-title" tabindex="-1">Race complete.</h2><p id="result-values"></p><p id="winner"></p><p id="personal-best" class="gold"></p><div class="result-actions"><button id="again" class="primary" data-icon="Play">Race again</button><button id="result-next" class="secondary" data-icon="ArrowRight">Next passage</button><button id="download" class="secondary" data-icon="Download">Download PNG</button><button id="copy" class="secondary" data-icon="Copy">Copy result</button></div><p id="share-status" class="feedback" role="status"></p><textarea id="copy-fallback" aria-label="Result for manual copying" readonly hidden></textarea></div>
                <canvas id="share-card" width="1200" height="630" role="img" aria-label="Your downloadable race result card"></canvas>
            </section>
            <section id="records" class="lower" aria-labelledby="records-title">
                <div class="section-heading"><div><p class="eyebrow">LOCAL RECORDS</p><h2 id="records-title">Your personal pace<span>.</span></h2></div><p id="storage-note">Completed runs are stored only in this browser.</p></div>
                <div class="record-grid"><div><div class="subheading">PERSONAL BESTS <span>THREE PACES. YOUR PROGRESS.</span></div><div class="table-wrap"><table><thead><tr><th>Pace</th><th>Best WPM</th><th>Best accuracy</th><th>Last time</th></tr></thead><tbody id="best-rows"></tbody></table></div><p id="empty" class="empty"></p></div><div><div class="subheading">RECENT RUNS <span>LAST 10 FINISHES</span></div><ol id="recent"></ol><button id="clear" class="danger" data-icon="Trash2">Clear history</button></div></div>
            </section>
            <section id="how-to-race" class="lower" aria-labelledby="how-title">
                <div class="section-heading"><div><p class="eyebrow">THE DRIVER'S BRIEFING</p><h2 id="how-title">Three steps to the finish<span>.</span></h2></div><span class="briefing-label">PRECISION BEFORE SPEED ↗</span></div>
                <div class="steps"><article><b>01</b><div><h3>Pick your pace</h3><p>Choose Easy, Medium, or Hard.<br>The ghost speed is shown before you start.</p></div></article><article><b>02</b><div><h3>Type clean</h3><p>Follow the caret. Backspace on a coral error.<br>Keep your eyes on the next word.</p></div></article><article><b>03</b><div><h3>Beat your record</h3><p>Finish the full passage. Save your result locally.<br>Download a card to take your progress with you.</p></div></article></div>
                <div class="scoring"><span>SCORING NOTES</span><p>WPM counts every five correct characters in the matching prefix as one word. Accuracy includes printable mistakes even after you correct them. Paused time never counts.<br><strong>Echo is a fixed target pace, not a live player.</strong></p></div>
            </section>
        </main>
        <footer><div><strong>KEYWAY CIRCUIT</strong><span>Outtype the echo.</span></div><div><span>Built for local play · No account · No remote leaderboard</span><a href="https://vibefather.ai/t/typing-speed-race-game" target="_blank" rel="noopener noreferrer">Template by VibeFather ↗</a></div></footer>
    `
};
