import { writePage as writeBase, nav, dialog } from "../../../270-invitation-based-vpn-account-portal-test-plan/GPT-6/.checks/ui.mjs";
function writePage(...args)
{
    args[3] += ".wave {min-width:0;overflow:hidden;}.wave i {flex-shrink:0;}";
    return writeBase(...args);
}
const sounds = [["Rain on a tent", 45], ["Slow ocean", 60], ["Night forest", 45], ["Distant thunder", 30], ["Cabin fire", 60], ["Snowfall", 45], ["Old fan", 90], ["Train at night", 60]];
await writePage("275-app-landing-page", "Hush: Sleep, without the scrolling",
nav("◔ hush", "SLEEP, WITHOUT THE SCROLLING", [["Features", "features"], ["Sounds", "sounds"], ["Pricing", "pricing"]], "Get Hush") +
`<main><section class="hero"><div class="aurora"></div><div class="stars" aria-hidden="true">${Array.from({ length: 32 }, (_, i) => `<i style="left:${(i * 73 + 11) % 100}%;top:${(i * 37 + 9) % 100}%;--delay:${i % 5}s"></i>`).join("")}</div><div class="wrap split hero-inner"><div><p class="eyebrow">SLEEP & WIND-DOWN</p><h1>Put the phone<br>down. We'll<br><em>take it from here.</em></h1><p class="lead">A dark screen. A slow voice. Sounds that fade out on their own. A little less to think about at the end of the day.</p><div class="actions"><button class="store" data-book><small>EXPLORE ON</small>App Store ↗</button><button class="store" data-book><small>EXPLORE ON</small>Google Play ↗</button></div><p class="fine">App concept · no verified store listing or download</p></div><div class="phone-scene"><div class="phone"><div class="camera"></div><div class="screen-top"><span>22:30</span><span>◔</span></div><p class="phone-label">YOUR DAY CAN END HERE.</p><div class="moon"></div><div class="hills"></div><div class="player"><span>TONIGHT'S SOUND</span><h3 id="now-playing">Rain on a tent</h3><div id="clock">30:00</div><div class="player-actions"><button id="restart" aria-label="Reset preview timer">↺</button><button id="play" aria-pressed="false">Start</button></div><p id="player-state">Silent interface preview</p><label>Fade timer<select id="timer"><option value="15">15 minutes</option><option value="30" selected>30 minutes</option><option value="60">60 minutes</option></select></label></div></div><span class="phone-caption">A QUIETER KIND OF SCREEN</span></div></div></section>
<div class="quiet-strip"><div class="wrap">NO FEEDS <span>NO STREAKS</span> NO REASON TO KEEP SCROLLING</div></div>
<section class="wrap section" id="features"><p class="eyebrow">A LITTLE LESS. ON PURPOSE.</p><h2>Built for the moment<br>you stop doing.</h2><div class="grid">${[["Nothing to scroll", "One screen, one button. No feed, no streaks, no evening reminders to relax."], ["Fades out by itself", "The product concept uses a gentle fade timer to end each session."], ["Your own quiet corner", "A simple library of stories, breathing sessions and familiar sounds."]].map(([n, d], i) => `<article class="card"><span class="pillar">0${i + 1}</span><h3>${n}</h3><p>${d}</p></article>`).join("")}</div><div class="feature-row"><div class="wave" aria-hidden="true">${Array.from({ length: 40 }, (_, i) => `<i style="height:${20 + (i * 31) % 75}%"></i>`).join("")}</div><div><p class="eyebrow">SLEEP STORIES, READ SLOWLY</p><h2>Some stories are better<br>without an ending.</h2><p class="lead">Unhurried voices, a deliberate pace and room for your mind to wander. This frontend shows the idea; no recordings play here.</p></div></div></section>
<section class="sounds" id="sounds"><div class="wrap section"><p class="eyebrow">FIND YOUR FAMILIAR</p><h2>Eight sounds.<br>That's all we need.</h2><p class="muted">Choose a sound to change the silent phone preview. No audio plays.</p><div class="sound-grid">${sounds.map(([n, t], i) => `<button class="sound" data-sound="${i}" aria-pressed="${i === 0}"><span class="sound-art art-${i}"><i></i><i></i><i></i></span><b>${n}</b><small>${t} MIN</small></button>`).join("")}</div></div></section>
<section class="wrap section routine"><div><p class="eyebrow">YOUR LAST TWO HOURS</p><h2>A gentler way<br>to call it a day.</h2></div><div>${[["21:00", "Dim everything", "Let the day get a little softer."], ["21:45", "Wind down", "Take a few slow breaths. No perfect routine required."], ["22:30", "Story or sound", "Choose something familiar and set a fade."], ["23:00", "Nothing", "Put the phone down. The rest can wait."]].map(([t, n, d]) => `<article><time>${t}</time><div><h3>${n}</h3><p>${d}</p></div></article>`).join("")}</div></section>
<section class="wrap section" id="pricing"><p class="eyebrow">ENOUGH FOR TONIGHT</p><h2>Free covers most nights.</h2><div class="billing"><button data-billing="monthly" aria-pressed="true">Monthly</button><button data-billing="yearly" aria-pressed="false">Yearly</button></div><div class="plans"><article><span>HUSH FREE</span><h3>$0</h3><p>Four sounds · five stories<br>Timers up to 30 minutes</p><button data-book>Explore free</button></article><article class="premium"><span>HUSH PREMIUM</span><h3 id="price">$4.99<small> / month</small></h3><p>All sounds and stories<br>Offline library · unlimited timers</p><button data-book class="primary">Explore Premium</button><p class="fine">Illustrative pricing. No subscription or trial starts here.</p></article></div></section>
<section class="wrap section final"><div class="moon small"></div><p class="eyebrow">TOMORROW CAN WAIT</p><h2>Tonight, put it down<br>at 22:30.</h2><button data-book class="primary">Find your quiet →</button><p class="muted">A sleep app concept, not a medical treatment.</p></section></main><footer><div class="wrap">◔ hush · © 2026 Hush Labs concept<br>No verified ratings, press endorsements or download statistics. No audio, app install or subscription on this page.</div></footer>` + dialog("A quieter night, soon.", "Platform", ["iPhone / iPad", "Android"]),
`:root {--paper:#0b0f21;--ink:#eeedf6;--accent:#b9a1f2;--muted:#a9adc3;--line:#2b304b;} h1,h2 {font-weight:500;}.primary {background:var(--accent);border-color:var(--accent);color:#141126;border-radius:30px;} .logo {font-size:30px;}.logo small {font-size:7px;letter-spacing:1.2px;} .hero {position:relative;overflow:hidden;padding:70px 0 60px;}.hero-inner {position:relative;z-index:1;grid-template-columns:1.2fr 1fr;}.hero h1 {font-size:clamp(46px,5.1vw,72px);line-height:1.08;}h1 em {font-style:normal;color:var(--accent);}.hero .lead {font-size:17px;} .aurora {position:absolute;width:800px;height:700px;border-radius:50%;background:radial-gradient(ellipse,#785ab73b,transparent 65%);right:-60px;top:-160px;animation:drift 22s infinite ease-in-out;}.aurora::after {content:"";position:absolute;inset:150px -40px -100px 220px;background:radial-gradient(ellipse,#4b9d9630,transparent 65%);} @keyframes drift {50% {transform:translate(-80px,50px);}} .stars {position:absolute;inset:0;pointer-events:none;}.stars i {position:absolute;width:2px;height:2px;background:#d9d4f1;opacity:.3;} .store {border-radius:8px;font-size:17px;text-align:left;background:#12172e;border-color:#494861;padding:10px 24px;} .store small {display:block;font-size:8px;letter-spacing:1px;color:#b9b7cb;} .fine {font-size:10px;color:var(--muted);} .phone-scene {text-align:center;perspective:1500px;}.phone {width:282px;max-width:100%;margin:auto;border:7px solid #373b52;border-radius:42px;padding:20px 15px 15px;background:#151a32;position:relative;overflow:hidden;transform:rotate(4deg);box-shadow:0 40px 70px #0005;}.camera {position:absolute;top:8px;left:105px;width:65px;height:15px;background:#080b17;border-radius:10px;}.screen-top {display:flex;justify-content:space-between;font-size:10px;padding:2px 6px;}.phone-label {font-size:8px;letter-spacing:2px;margin-top:35px;color:#b6b1cd;}.moon {width:75px;height:75px;background:#c8b7ed;border-radius:50%;margin:30px auto;position:relative;box-shadow:0 0 70px #a38bdb26;}.moon::after {content:"";position:absolute;inset:-4px -14px 14px 18px;background:#151a32;border-radius:50%;}.hills {position:absolute;top:215px;left:-30px;width:350px;height:110px;border-radius:50%;background:#272c4b;transform:rotate(-15deg);}.hills::after {content:"";position:absolute;inset:30px -20px -20px 30px;background:#1a203a;border-radius:50%;transform:rotate(25deg);}.player {position:relative;padding-top:55px;}.player>span {font-size:8px;letter-spacing:1.5px;}.player h3 {font-size:21px;font-weight:400;margin:8px 0;}.player #clock {font-size:35px;font-weight:300;font-variant-numeric:tabular-nums;}.player-actions {display:flex;justify-content:center;gap:14px;margin:18px 0;}.player-actions button {border-radius:30px;font-size:12px;padding:8px 18px;border-color:#7b6e9a;}#play {background:#baa3ed;color:#16122b;min-width:80px;} #player-state {font-size:9px;color:var(--muted);}.player label {font-size:9px;color:var(--muted);}.player select {font-size:11px;padding:8px;border-radius:15px;}.phone-caption {display:block;font-size:8px;letter-spacing:3px;margin-top:35px;color:#a8a6bf;} .quiet-strip {background:#11162a;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:25px;text-align:center;font-size:9px;letter-spacing:2px;}.quiet-strip span {margin:0 80px;}.card {border:0;background:#13182e;border-radius:16px;}.card h3 {font-size:22px;font-weight:400;}.pillar {font-size:12px;color:var(--accent);} .feature-row {display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:70px;margin-top:100px;}.wave {height:270px;display:flex;align-items:center;gap:5px;padding:30px;background:#161c36;border-radius:40px 40px 120px 40px;}.wave i {width:5px;background:#9c85d1;border-radius:10px;opacity:.6;}.sounds {background:#101529;}.sound-grid {display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}.sound {padding:0 0 20px;border:1px solid var(--line);border-radius:12px;text-align:left;overflow:hidden;background:#151a31;}.sound[aria-pressed=true] {border-color:var(--accent);}.sound b,.sound small {display:block;margin:10px 18px 0;font-weight:400;}.sound small {font-size:9px;color:var(--muted);letter-spacing:2px;}.sound-art {height:110px;display:flex;align-items:center;justify-content:center;gap:15px;background:#202641;}.sound-art i {height:55px;width:2px;background:#a797c7;transform:rotate(15deg);}.art-1 i,.art-6 i {height:3px;width:40px;transform:rotate(-12deg);}.art-2 i,.art-5 i {border-radius:50%;width:35px;height:35px;background:transparent;border:1px solid #a797c7;}.art-3 i,.art-7 i {transform:skew(-20deg);height:45px;width:12px;}.art-4 i {border-radius:80% 0;width:20px;background:#917ea4;}.routine {display:grid;grid-template-columns:1fr 1fr;gap:70px;}.routine article {display:flex;gap:25px;padding:20px 0;border-bottom:1px solid var(--line);}.routine time {font:14px Consolas,monospace;color:var(--accent);padding-top:5px;}.routine h3 {margin:0;font-size:22px;font-weight:400;}.routine p {color:var(--muted);font-size:13px;}.billing {display:flex;gap:10px;margin-bottom:25px;}.billing button {border-color:var(--line);border-radius:30px;font-size:12px;}.billing [aria-pressed=true] {color:var(--accent);border-color:var(--accent);}.plans {display:grid;grid-template-columns:1fr 1fr;gap:30px;}.plans article {padding:35px;border:1px solid var(--line);border-radius:20px;background:#13182e;}.plans span {font-size:10px;letter-spacing:2px;color:var(--accent);}.plans h3 {font-size:43px;font-weight:400;margin:20px 0;}.plans h3 small {font-size:16px;color:var(--muted);}.plans .premium {border-color:var(--accent);}.final {text-align:center;}.final h2 {font-size:55px;}.final .moon.small {width:45px;height:45px;}.final .moon::after {background:var(--paper);} @media(prefers-reduced-motion:reduce) {.aurora {animation:none;}} @media(max-width:760px) {.hero {padding-top:30px;}.hero-inner {grid-template-columns:1fr;}.phone-scene {grid-row:1;}.phone {width:255px;transform:none;}.hero h1 {font-size:48px;}.quiet-strip span {display:block;margin:10px;}.sound-grid {grid-template-columns:1fr 1fr;}.sound b {font-size:12px;margin-left:12px;}.sound small {margin-left:12px;}.sound-art {gap:8px;}.feature-row,.routine,.plans {grid-template-columns:1fr;gap:30px;}.feature-row {margin-top:50px;}.final h2 {font-size:40px;}}`,
`
const sounds = ${JSON.stringify(sounds)};
let remaining = 1800;
let interval;
function clock()
{
    $("#clock").textContent = String(Math.floor(remaining / 60)).padStart(2, "0") + ":" + String(remaining % 60).padStart(2, "0");
}
function pause()
{
    clearInterval(interval);
    interval = undefined;
    $("#play").textContent = "Start";
    $("#play").setAttribute("aria-pressed", "false");
}
$("#play").onclick = () =>
{
    if (interval)
    {
        pause();
        $("#player-state").textContent = "Preview paused · no audio";
        return;
    }
    if (!remaining) remaining = Number($("#timer").value) * 60;
    $("#play").textContent = "Pause";
    $("#play").setAttribute("aria-pressed", "true");
    $("#player-state").textContent = "Silent timer running · no audio";
    interval = setInterval(() =>
    {
        remaining--;
        clock();
        if (remaining <= 0)
        {
            pause();
            $("#player-state").textContent = "Preview complete";
        }
    }, 1000);
};
function reset()
{
    pause();
    remaining = Number($("#timer").value) * 60;
    clock();
    $("#player-state").textContent = "Silent interface preview";
}
$("#restart").onclick = reset;
$("#timer").onchange = reset;
document.querySelectorAll("[data-sound]").forEach((b) => b.onclick = () =>
{
    document.querySelectorAll("[data-sound]").forEach((a) => a.setAttribute("aria-pressed", String(a === b)));
    $("#now-playing").textContent = sounds[Number(b.dataset.sound)][0];
});
document.querySelectorAll("[data-billing]").forEach((b) => b.onclick = () =>
{
    document.querySelectorAll("[data-billing]").forEach((a) => a.setAttribute("aria-pressed", String(a === b)));
    $("#price").innerHTML = b.dataset.billing === "yearly" ? "$29<small> / year</small>" : "$4.99<small> / month</small>";
});
`,
`
    assert(await page.locator(".sound").count() === 8, "Eight sounds");
    await page.locator('[data-sound="6"]').click();
    assert(await page.locator("#now-playing").textContent() === "Old fan", "Sound selection updates player");
    assert(await page.locator('[data-sound="0"]').getAttribute("aria-pressed") === "false", "Previous sound cleared");
    await page.locator("#timer").selectOption("15");
    assert(await page.locator("#clock").textContent() === "15:00", "Timer choice");
    await page.locator("#play").click();
    await page.waitForTimeout(1150);
    assert(await page.locator("#clock").textContent() !== "15:00", "Timer actually counts");
    await page.locator("#play").click();
    assert(await page.locator("#play").getAttribute("aria-pressed") === "false", "Timer pauses");
    await page.locator("#restart").click();
    assert(await page.locator("#clock").textContent() === "15:00", "Reset restores duration");
    await page.locator('[data-billing="yearly"]').click();
    assert((await page.locator("#price").textContent()).includes("$29"), "Annual price");
    await page.locator('[data-billing="monthly"]').click();
    assert((await page.locator("#price").textContent()).includes("$4.99"), "Monthly price");
`, { tags: ["Sleep App", "Interactive Timer", "Midnight Lavender"], features: "Original interactive phone UI, working silent timer with pause/reset, eight selectable sound previews, monthly/yearly pricing and validated platform-interest form. CSS aurora, moon and sound artwork.", limits: "No actual audio, stories, app installation, store integration, subscriptions or clinical sleep claims. Download/rating/press claims are not fabricated; store actions open labeled concept enquiries. Static system-font adaptation." });
