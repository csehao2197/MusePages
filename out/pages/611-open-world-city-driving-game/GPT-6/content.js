export const CONTENT =
{
    brand: "Amber Row Club",
    district: "Reed Wharf",
    errand: "bakery boxes",
    race: "Lantern Lap",
    tagline: "Walk the blocks before the lamps take over.",
    saveKey: "amber-row-club-evening",
    shops: ["Amber Row Club", "Kiln Bakery", "Moss & Thread", "Corner Records", "Reed Books", "Little Fern", "Wharf Supply", "Sunday Goods", "Bluebird Cafe", "Stillwater Studio", "Local Flowers", "The Reading Room", "Good Company", "Daylight Deli", "Row Hardware", "Lantern House"],
    poolNames: ["Kiln pool car", "Wharf pool car", "Fern pool car", "Row pool car"],
    porchNames: ["Moss & Thread", "Bluebird Cafe", "Lantern House"],
    messages:
    {
        welcome: "Welcome, neighbor. Your mint-striped car is just ahead.",
        borrowed: "Keys are in. Keep it neighborly.",
        leftCar: "Parked for the next neighbor.",
        collision: "Easy does it. The neighborhood is solid.",
        collected: "Three bakery boxes aboard. Find the first glowing porch.",
        needCar: "Borrow a mint-striped car to start your lap.",
        needFoot: "Hop out first. This doorstep is for feet.",
        raceStart: "Clock starts at the first gate. Follow the orange rings.",
        reset: "A fresh evening. Your local bests are safe.",
        storage: "Browser storage is unavailable. Bests last only this visit.",
        noCar: "Walk closer to a mint-striped pool car.",
        foot: "ON FOOT",
        drive: "POOL CAR",
        walking: "Take your time.",
        ready: "Make yourself at home.",
        idle: "Walk Reed Wharf. Borrow a mint-striped car whenever you like.",
        pickup: "Collect the bakery boxes.",
        pickupCopy: "Meet the glowing parcel stand beside the clubhouse. Collect on foot.",
        pausedRace: "Clock ready. Drive through gate one.",
        beforeNight: "A LITTLE BEFORE NIGHT",
        night: "THE LAMPS HAVE TAKEN OVER",
        deliver: "Deliver bakery boxes",
        collect: "Collect boxes",
        enter: "Borrow car",
        exit: "Leave car",
        noAction: "Find a pool car",
        carHint: "SPACE HANDBRAKE · E LEAVE CAR",
        footHint: "WASD / ARROWS TO WANDER"
    },
    labels:
    {
        porch: "PORCH RUN",
        gate: "GATE",
        left: "Leave activity",
        muted: "Unmute sound",
        unmuted: "Mute sound",
        done: "An evening well spent.",
        selectAgain: "Choose another activity, or take the long way home.",
        nearby: "Pool car nearby",
        yards: "m to next stop"
    }
};

export function deliveryCopy(index)
{
    return `Door ${index + 1} of 3 · ${CONTENT.porchNames[index]}`;
}

export function deliveredCopy(count)
{
    return `${count} of 3 delivered. A little kindness goes a long way.`;
}

export function porchComplete(score)
{
    return `All three doors visited. ${score} porch points.`;
}

export function lapComplete(seconds)
{
    return `${CONTENT.race} complete in ${seconds.toFixed(2)}s. One good loop.`;
}

export const MARKUP = `
    <canvas id="world" aria-label="Interactive three-dimensional Reed Wharf neighborhood"></canvas>
    <div class="vignette" aria-hidden="true"></div>
    <header>
        <a class="wordmark" href="./index.html" aria-label="Amber Row Club home">
            <span class="brand-mark"><i data-lucide="car"></i></span>
            <span>AMBER ROW<span class="brand-sub">NEIGHBORHOOD MOTOR CLUB</span></span>
        </a>
        <div class="header-tools">
            <span class="evening"><span class="live-dot"></span><span id="time-label">A LITTLE BEFORE NIGHT</span></span>
            <button id="sound" class="icon-button" aria-label="Unmute sound"><i data-lucide="volume-x"></i></button>
            <button id="help" class="icon-button" aria-label="Open help"><i data-lucide="circle-help"></i></button>
            <button id="pause" class="icon-button" aria-label="Pause game"><i data-lucide="pause"></i></button>
        </div>
    </header>
    <main>
        <section id="title-card" class="title-card" aria-labelledby="game-title">
            <div class="eyebrow"><span class="small-line"></span> AN EVENING IN REED WHARF</div>
            <h1 id="game-title">Amber<br>Row <em>Club.</em></h1>
            <p class="deck">Walk the blocks before<br>the lamps take over.</p>
            <button id="play" class="play-button"><span class="play-disc"><i data-lucide="play"></i></span><span>Take the slow road<small>YOUR EVENING STARTS HERE</small></span><span class="play-arrow">↗</span></button>
            <div class="title-facts"><span>16 little blocks</span><span>8 passing neighbors</span><span>No wrong turns</span></div>
        </section>
        <section id="mission-panel" class="mission-panel" hidden aria-label="Evening activities">
            <div class="eyebrow">YOUR LITTLE EVENING</div>
            <h2 id="objective-title">Make yourself at home.</h2>
            <p id="objective-copy">Walk Reed Wharf. Borrow a mint-striped car whenever you like.</p>
            <div class="mission-options">
                <button id="errand" class="activity"><i data-lucide="package"></i><span>Porch run<small>Three doors. Fresh bakery boxes.</small></span><span>↗</span></button>
                <button id="race" class="activity"><i data-lucide="flag"></i><span>Lantern Lap<small>Six gates. Your own best time.</small></span><span>↗</span></button>
            </div>
            <div id="mission-progress" class="mission-progress" hidden><span id="progress-label"></span><button id="cancel-mission">Leave activity</button></div>
            <div class="bests"><span>PORCH BEST <b id="porch-best">—</b></span><span>LAP BEST <b id="lap-best">—</b></span></div>
        </section>
        <div class="place-label" id="place-label"><span class="place-rule"></span><span>Reed Wharf<small>A SMALL PLACE TO GET A LITTLE LOST.</small></span></div>
        <section class="map-panel" aria-label="North-up neighborhood minimap">
            <div class="map-heading"><span>REED WHARF</span><span>N ↑</span></div>
            <canvas id="minimap" width="360" height="360" aria-label="Roads, your location, pool cars and mission target"></canvas>
            <div class="map-key"><span><b class="key-you"></b>You</span><span><b class="key-car"></b>Pool car</span><span><b class="key-target"></b>Next stop</span></div>
        </section>
        <div id="drive-hud" class="drive-hud" hidden>
            <div class="speed"><strong id="speed">0</strong><span>KM/H</span></div>
            <div class="drive-divider"></div>
            <div class="vehicle-status"><span id="travel-mode">ON FOOT</span><strong id="vehicle-name">Take your time.</strong><span id="drive-hint">WASD / ARROWS TO WANDER</span></div>
            <button id="action" class="action-button">Borrow car <kbd>E</kbd></button>
        </div>
        <div id="toast" class="toast" role="status" aria-live="polite"></div>
        <div id="mobile-controls" class="mobile-controls" hidden aria-label="Touch driving controls">
            <div class="steer-pad"><button data-control="left" aria-label="Steer left">←</button><button data-control="right" aria-label="Steer right">→</button></div>
            <div class="pedal-pad"><button data-control="brake" aria-label="Brake or reverse">BRAKE</button><button data-control="forward" aria-label="Accelerate or walk forward">GO ↑</button></div>
        </div>
    </main>
    <footer><span class="footer-left"><span class="live-dot"></span> ALL ROADS LEAD TO A GOOD EVENING.</span><span class="desktop-hint">WASD / ARROWS <span>MOVE</span> &nbsp; E <span>BORROW</span> &nbsp; SPACE <span>HANDBRAKE</span></span><a href="https://vibefather.ai/t/open-world-city-driving-game" target="_blank" rel="noopener noreferrer">Template by VibeFather ↗</a></footer>
    <dialog id="help-dialog">
        <button class="close-dialog icon-button" aria-label="Close help"><i data-lucide="x"></i></button>
        <div class="eyebrow">A FEW NEIGHBORLY POINTERS</div>
        <h2>The street is yours.</h2>
        <p>Wander on foot, then borrow any mint-striped pool car. Buildings, trees, and traffic are solid. Drive kindly.</p>
        <dl><div><dt>WASD / Arrow keys</dt><dd>Walk, accelerate, reverse &amp; steer</dd></div><div><dt>E / Action button</dt><dd>Borrow, leave, collect or deliver</dd></div><div><dt>Space</dt><dd>Handbrake</dd></div><div><dt>P / Escape</dt><dd>Pause or resume</dd></div><div><dt>R</dt><dd>Return to the clubhouse</dd></div></dl>
        <p>On a phone, use the arrows and GO / BRAKE pedals. Deliver bakery boxes on foot at each glowing porch. For Lantern Lap, cross all six gates in order while driving.</p>
        <p class="fine-print">One offline evening. Only your best porch score, lap time and sound preference stay in this browser. Original low-poly artwork; no accounts or online services.</p>
    </dialog>
    <dialog id="pause-dialog">
        <div class="eyebrow">PULL OVER FOR A MOMENT</div><h2>There’s no rush.</h2><p>The whole neighborhood can wait.</p>
        <button id="resume" class="primary-button">Back to the evening</button>
        <button id="reset" class="secondary-button">Start a fresh evening</button>
        <p class="fine-print">Reset returns you and the pool cars home, clears the current activity, and restarts dusk. Your local bests stay.</p>
    </dialog>
`;
