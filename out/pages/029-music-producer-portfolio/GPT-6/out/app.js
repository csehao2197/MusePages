import {tracks} from "./assets/tracks.js";

const $ = selector => document.querySelector(selector);
const icon = name => `<svg aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const formatTime = seconds => `${Math.floor((Number.isFinite(seconds) ? seconds : 0) / 60)}:${String(Math.floor((Number.isFinite(seconds) ? seconds : 0) % 60)).padStart(2, "0")}`;
const audio = $("#audio");
let active = null, audioContext, analyser, source, samples, frame = 0, heroVisible = true;
let returnFocus = null;
let mediaURL = null, mediaVersion = 0, mediaFailed = false, mediaReady = Promise.resolve(false);
audio.volume = .7;

$("#beat-grid").innerHTML = tracks.map(track => `
  <article class="beat-card" data-beat="${track.id}" data-active="false">
    <div class="beat-cover"><img src="assets/${track.id}.webp" alt="${track.title}: original geometric cover in ${track.colors[1]} and ${track.colors[2]}." width="900" height="900" loading="lazy">
      <span class="preview-duration">${formatTime(track.duration)} / ORIGINAL PREVIEW</span>
      <button class="play-beat" data-play="${track.id}" aria-label="Play ${track.title} preview">${icon("play")}</button>
    </div>
    <div class="beat-info"><div><h3>${track.title}</h3><span class="genre">${track.genre}</span></div>
      <p class="beat-meta">${track.bpm} BPM · ${track.key}</p>
      <button class="price-link" data-license="${track.id}">From $29.99 ${icon("arrow")}</button>
      <canvas class="wave" width="600" height="76" aria-label="Live audio waveform for ${track.title}"></canvas>
    </div>
  </article>`).join("");
$("#catalog-list").innerHTML = tracks.map(track => `
  <article class="catalog-item"><img src="assets/${track.id}.webp" alt="" width="60" height="60"><div><h3>${track.title}</h3><p>${track.bpm} BPM · ${track.key} · ${formatTime(track.duration)}</p></div><button class="icon-button" data-play="${track.id}" aria-label="Play ${track.title} preview">${icon("play")}</button><button class="button outline" data-license="${track.id}">License</button></article>`).join("");

function syncPlayback() {
  const playing = !audio.paused && !audio.ended;
  for (const button of document.querySelectorAll("[data-play]")) {
    const selected = active?.id === button.dataset.play, title = tracks.find(track => track.id === button.dataset.play).title;
    button.innerHTML = icon(selected && playing ? "pause" : "play");
    button.setAttribute("aria-label", `${selected && playing ? "Pause" : "Play"} ${title} preview`);
    button.setAttribute("aria-pressed", String(selected && playing));
  }
  for (const card of document.querySelectorAll("[data-beat]")) card.dataset.active = String(card.dataset.beat === active?.id);
  $("#player-play").innerHTML = icon(playing ? "pause" : "play");
  $("#player-play").setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${active?.title ?? "current beat"} preview`);
  $("#player-play").setAttribute("aria-pressed", String(playing));
  scheduleFrame();
}

function setTrack(track) {
  if (active?.id === track.id && !mediaFailed) return mediaReady;
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
  if (mediaURL) { URL.revokeObjectURL(mediaURL); mediaURL = null; }
  active = track;
  mediaFailed = false;
  const version = ++mediaVersion;
  // A local blob keeps seeking reliable on static hosts without byte-range support.
  mediaReady = fetch(`assets/${track.id}.wav`).then(async response => {
    if (!response.ok) throw Error("Preview unavailable");
    const data = await response.arrayBuffer();
    if (version !== mediaVersion) return false;
    mediaURL = URL.createObjectURL(new Blob([data], {type:"audio/wav"}));
    audio.src = mediaURL;
    audio.load();
    return true;
  }).catch(() => {
    if (version === mediaVersion) { mediaFailed = true; $("#audio-status").textContent = `The ${track.title} preview could not load. Select another beat or retry.`; }
    return false;
  });
  $("#player").hidden = false;
  document.body.classList.add("has-player");
  $("#player-art").src = `assets/${track.id}.webp`;
  $("#player-title").textContent = track.title;
  $("#player-license").setAttribute("aria-label", `License ${track.title}`);
  $("#progress").value = 0;
  $("#progress").disabled = true;
  $("#time").textContent = `0:00 / ${formatTime(track.duration)}`;
  syncPlayback();
  return mediaReady;
}

async function ensureAudio() {
  if (!audioContext) {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    samples = new Uint8Array(analyser.fftSize);
    source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
  }
  if (audioContext.state === "suspended") await audioContext.resume();
}

async function playTrack(id) {
  const track = tracks.find(item => item.id === id);
  if (!track) return;
  if (active?.id === id && !audio.paused) { audio.pause(); return; }
  const ready = setTrack(track);
  $("#audio-status").textContent = `Loading ${track.title} original preview…`;
  try {
    const [loaded] = await Promise.all([ready, ensureAudio()]);
    if (!loaded || active?.id !== id) return;
    await audio.play();
    $("#audio-status").textContent = `Playing ${track.title}. Original ${formatTime(track.duration)} synthesized preview.`;
  } catch {
    $("#audio-status").textContent = `Playback unavailable for ${track.title}. Your browser may require another press of Play.`;
    syncPlayback();
  }
}

document.addEventListener("click", event => {
  const play = event.target.closest("[data-play]");
  if (play) playTrack(play.dataset.play);
  const license = event.target.closest("[data-license]");
  if (license) openLicense(license.dataset.license, "Basic");
});
$("#player-play").addEventListener("click", () => { if (active) playTrack(active.id); });
function stepTrack(delta) {
  const index = Math.max(0, tracks.findIndex(track => track.id === active?.id));
  const track = tracks[(index + delta + tracks.length) % tracks.length], playing = !audio.paused;
  if (playing) playTrack(track.id); else setTrack(track);
}
$("#previous-track").addEventListener("click", () => stepTrack(-1));
$("#next-track").addEventListener("click", () => stepTrack(1));
audio.addEventListener("play", syncPlayback);
audio.addEventListener("pause", syncPlayback);
audio.addEventListener("ended", () => { syncPlayback(); $("#audio-status").textContent = `${active.title} preview ended. Choose another beat or play again.`; });
audio.addEventListener("error", () => { syncPlayback(); $("#audio-status").textContent = "The audio file could not load. The rest of the portfolio is still available."; });
function progress() {
  const duration = audio.duration, elapsed = audio.currentTime;
  if (Number.isFinite(duration) && duration > 0) {
    $("#progress").disabled = false;
    $("#progress").value = Math.round(elapsed / duration * 1000);
    $("#progress").setAttribute("aria-valuetext", `${formatTime(elapsed)} of ${formatTime(duration)}`);
    $("#time").textContent = `${formatTime(elapsed)} / ${formatTime(duration)}`;
  }
}
audio.addEventListener("loadedmetadata", progress);
audio.addEventListener("timeupdate", progress);
$("#progress").addEventListener("input", event => { if (Number.isFinite(audio.duration)) audio.currentTime = Number(event.target.value) / 1000 * audio.duration; });
$("#volume").addEventListener("input", event => { audio.volume = Number(event.target.value); audio.muted = false; updateMute(); });
function updateMute() {
  $("#mute").setAttribute("aria-pressed", String(audio.muted));
  $("#mute").setAttribute("aria-label", audio.muted ? "Unmute preview" : "Mute preview");
  $("#mute").innerHTML = icon(audio.muted ? "mute" : "volume");
}
$("#mute").addEventListener("click", () => { audio.muted = !audio.muted; updateMute(); });
addEventListener("pagehide", () => audio.pause());

const heroCanvas = $("#hero-wave"), heroContext = heroCanvas.getContext("2d");
function drawHero(time) {
  const width = heroCanvas.clientWidth, height = heroCanvas.clientHeight, ratio = devicePixelRatio || 1;
  if (heroCanvas.width !== Math.round(width * ratio) || heroCanvas.height !== Math.round(height * ratio)) { heroCanvas.width = Math.round(width * ratio); heroCanvas.height = Math.round(height * ratio); }
  heroContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  heroContext.clearRect(0, 0, width, height);
  const gradient = heroContext.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, "#8b5cf6"); gradient.addColorStop(.7, "#9670ef"); gradient.addColorStop(1, "#3abfce");
  heroContext.fillStyle = gradient;
  for (let i = 0; i < 80; i++) {
    const envelope = Math.sin(i / 79 * Math.PI) ** 2;
    const amount = .24 + Math.abs(Math.sin(i * 1.7 + (reduced.matches ? 0 : time / 1100))) * .66;
    const barHeight = 5 + height * envelope * amount * .75;
    heroContext.fillRect(i * width / 80, height - barHeight, Math.max(2, width / 80 - 5), barHeight);
  }
}
function drawAudio() {
  if (!analyser || !active) return;
  const canvas = $(`[data-beat="${active.id}"] .wave`), context = canvas.getContext("2d");
  analyser.getByteTimeDomainData(samples);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = 2; context.strokeStyle = "#b49aff"; context.beginPath();
  for (let i = 0; i < samples.length; i++) {
    const x = i / (samples.length - 1) * canvas.width, y = samples[i] / 255 * canvas.height;
    if (i === 0) context.moveTo(x, y); else context.lineTo(x, y);
  }
  context.stroke();
}
function animate(time) {
  frame = 0;
  if (document.hidden) return;
  if (heroVisible) drawHero(time);
  if (!audio.paused) drawAudio();
  if (!reduced.matches && (heroVisible || !audio.paused)) frame = requestAnimationFrame(animate);
}
function scheduleFrame() { if (!frame && !document.hidden) frame = requestAnimationFrame(animate); }
new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; scheduleFrame(); }).observe($(".hero"));
document.addEventListener("visibilitychange", () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else scheduleFrame(); });
reduced.addEventListener("change", scheduleFrame);
addEventListener("resize", () => { drawHero(0); if (innerWidth > 700) closeMenu(); });
drawHero(0); scheduleFrame();
const header = $("#header");
function updateHeader() { header.classList.toggle("solid", scrollY > 50); }
addEventListener("scroll", updateHeader, {passive:true}); updateHeader();

const nav = $("#navigation"), menu = $("#menu");
function setMenuBackground(inert) {
  for (const selector of ["main", "footer", "header .wordmark", "#player"]) $(selector).inert = inert;
}
function syncLocked() { document.body.classList.toggle("locked", menu.getAttribute("aria-expanded") === "true" || Boolean(document.querySelector("dialog[open]"))); }
function closeMenu(focus = false) {
  nav.dataset.open = "false";
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Open menu");
  menu.innerHTML = icon("menu");
  setMenuBackground(false); syncLocked();
  if (focus) menu.focus();
}
menu.addEventListener("click", () => {
  if (menu.getAttribute("aria-expanded") === "true") { closeMenu(true); return; }
  nav.dataset.open = "true"; menu.setAttribute("aria-expanded", "true"); menu.setAttribute("aria-label", "Close menu"); menu.innerHTML = icon("close");
  setMenuBackground(true); syncLocked(); nav.querySelector("a").focus();
});
nav.addEventListener("click", event => { if (event.target.closest("a")) closeMenu(); });
document.addEventListener("keydown", event => {
  if (menu.getAttribute("aria-expanded") !== "true") return;
  if (event.key === "Escape") closeMenu(true);
  if (event.key === "Tab") {
    const items = [...nav.querySelectorAll("a"), menu], index = items.indexOf(document.activeElement);
    if (event.shiftKey && index === 0) { event.preventDefault(); menu.focus(); }
    else if (!event.shiftKey && index === items.length - 1) { event.preventDefault(); items[0].focus(); }
  }
});
function openDialog(dialog) {
  const trigger = document.activeElement;
  returnFocus = trigger.closest("dialog") ? $("#open-catalog") : trigger;
  for (const open of document.querySelectorAll("dialog[open]")) if (open !== dialog) open.close();
  dialog.showModal(); syncLocked();
}
for (const dialog of document.querySelectorAll("dialog")) {
  dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => { syncLocked(); if (!document.querySelector("dialog[open]")) returnFocus?.focus({preventScroll:true}); });
}
$("#open-catalog").addEventListener("click", () => openDialog($("#catalog-dialog")));
const terms = {
  Basic: {price:"$29.99", description:"Proposed tagged MP3, 5,000 streams, one video, non-exclusive, credit required."},
  Premium: {price:"$79.99", description:"Proposed WAV + MP3, 100,000 streams, two videos, radio rights, non-exclusive, credit required."},
  Exclusive: {price:"$499+", description:"Proposed WAV, stems and MP3, unlimited streams/videos and exclusive sync rights. Final ownership, availability, removal and clearance require a written agreement."}
};
$("#license-beat").innerHTML = tracks.map(track => `<option value="${track.id}">${track.title}</option>`).join("");
function licenseSummary() {
  const track = tracks.find(item => item.id === $("#license-beat").value), tier = $("#license-tier").value;
  $("#license-summary").innerHTML = `<p class="eyebrow purple">${tier.toUpperCase()} / ${track.title.toUpperCase()}</p><strong>${terms[tier].price}</strong><p>${terms[tier].description}</p><p class="fine">Demo terms, not an offer or executed license. The preview is a short original synthesis study.</p>`;
}
function openLicense(id = active?.id ?? tracks[0].id, tier = "Basic") {
  $("#license-beat").value = id; $("#license-tier").value = tier; licenseSummary(); openDialog($("#license-dialog"));
}
$("#license-beat").addEventListener("change", licenseSummary);
$("#license-tier").addEventListener("change", licenseSummary);
document.querySelectorAll("[data-tier]").forEach(button => button.addEventListener("click", () => openLicense(undefined, button.dataset.tier)));
$("#player-license").addEventListener("click", () => openLicense());
const form = $("#contact-form");
function inquire(service, message) {
  returnFocus = null;
  for (const dialog of document.querySelectorAll("dialog[open]")) dialog.close();
  closeMenu();
  form.elements.service.value = service;
  if (message) form.elements.message.value = message;
  $("#receipt").hidden = true; $("#receipt-text").textContent = ""; $("#form-status").textContent = "";
  $("#contact").scrollIntoView({behavior:reduced.matches ? "instant" : "smooth"});
  form.elements.name.focus({preventScroll:true});
}
$("#request-license").addEventListener("click", () => {
  const track = tracks.find(item => item.id === $("#license-beat").value), tier = $("#license-tier").value;
  inquire("Beat License", `I'd like to discuss a ${tier} license for ${track.title} (${terms[tier].price} sample price). Please confirm the final terms, availability and full-length delivery.`);
});
document.querySelectorAll("[data-service]").forEach(button => button.addEventListener("click", () => inquire(button.dataset.service)));

const credits = [
  {artist:"Lil Baby",title:"Venom",streams:"24M",year:"2025"},
  {artist:"SZA",title:"Late Nights",streams:"18M",year:"2025"},
  {artist:"21 Savage",title:"Red Opps",streams:"12M",year:"2025"},
  {artist:"Summer Walker",title:"Session 33",streams:"9M",year:"2025"},
  {artist:"Gunna",title:"Top Floor",streams:"7M",year:"2025"},
  {artist:"6LACK",title:"Switch",streams:"6M",year:"2025"}
];
$("#credits").innerHTML = credits.map((credit,index) => {
  const search = encodeURIComponent(`${credit.artist} ${credit.title}`);
  return `<article class="credit-card"><div class="credit-art"><img src="assets/${tracks[index].id}.webp" alt="Original concept cover, not official ${credit.artist} artwork." width="900" height="900" loading="lazy"><div class="credit-overlay"><a href="https://open.spotify.com/search/${search}" target="_blank" rel="noopener noreferrer" aria-label="Search ${credit.artist} ${credit.title} on Spotify">${icon("spotify")}</a><a href="https://music.apple.com/us/search?term=${search}" target="_blank" rel="noopener noreferrer" aria-label="Search ${credit.artist} ${credit.title} on Apple Music">${icon("music")}</a></div></div><h3>${credit.artist}</h3><p>${credit.title}</p><small>${credit.year} / REFERENCE ENTRY</small><p class="stream-count">${credit.streams} streams* · Unverified sample</p></article>`;
}).join("");
$("#credits-list").innerHTML = credits.map(credit => `<div class="reference-item"><strong>${credit.artist} — ${credit.title}</strong><p>${credit.year} · ${credit.streams} streams / unverified sample figure</p></div>`).join("");
$("#open-credits").addEventListener("click", () => openDialog($("#credits-dialog")));
const policies = {
  terms: {title:"Terms of Service", paragraphs:["This is a fictional static portfolio, not a live production business. Playback is a preview of six original synthesized music studies. Real identity, credentials, placements, facilities and delivery capacity have not been verified.","No booking, purchase, reservation or legal relationship is created by any interaction. Confirm an operator, scope, rights and written terms before real use."]},
  license: {title:"License Agreement", paragraphs:["The Basic, Premium and Exclusive tiers are illustrative terms from a design brief, not an executed agreement. No rights transfer or store removal happens here. Short synthesized previews are not full production deliveries.","Before release, confirm composition and master ownership, credits, permitted media, stream limits, sync rights, exclusivity, sample clearance, available formats, payment and delivery in a written agreement with the actual rights holder."]},
  privacy: {title:"Privacy Policy", paragraphs:["This demo has no analytics, accounts, cookies, database or form/newsletter delivery service. Drafts remain in the current page; clearing or reloading removes them. Reference URLs are not fetched. Playback volume and selections are in memory only.","Images, fonts and audio are served locally. Platform links open third-party sites with their own policies. A real operator's privacy notice and verified contact channel are required before launch."]},
  refund: {title:"Refund Policy", paragraphs:["No checkout, payment or digital purchase takes place in this demo, so no refund request can be processed here.","For a real license or session, confirm the applicable cancellation, refund, revision and digital-delivery terms with the actual operator before payment."]}
};
document.querySelectorAll("[data-policy]").forEach(button => button.addEventListener("click", () => {
  const policy = policies[button.dataset.policy]; $("#policy-title").textContent = policy.title;
  $("#policy-content").replaceChildren(...policy.paragraphs.map(text => { const p = document.createElement("p"); p.textContent = text; return p; }));
  openDialog($("#policy-dialog"));
}));
form.addEventListener("submit", async event => {
  event.preventDefault(); $("#receipt").hidden = true;
  for (const name of ["name", "message"]) form.elements[name].setCustomValidity(form.elements[name].value.trim().length < (name === "message" ? 20 : 1) ? "Please add meaningful text." : "");
  const reference = form.elements.reference;
  reference.setCustomValidity(reference.value && !/^https?:\/\//i.test(reference.value) ? "Use a public http or https reference URL." : "");
  if (!form.reportValidity()) return;
  const button = form.querySelector("[type=submit]");
  button.disabled = true; button.setAttribute("aria-busy", "true"); $("#form-status").textContent = "Preparing your private project preview…";
  try {
    await new Promise(resolve => setTimeout(resolve,300));
    const data = new FormData(form);
    $("#receipt-text").textContent = ["name","email","service","budget","message","reference"].map(key => `${key.toUpperCase()}: ${String(data.get(key) ?? "").trim()}`).join("\n");
    $("#receipt").hidden = false;
    $("#form-status").textContent = "Preview ready. Nothing has been sent, booked or licensed.";
  } catch { $("#form-status").textContent = "The preview could not be prepared. Your draft is intact; please try again."; }
  finally { button.disabled = false; button.removeAttribute("aria-busy"); }
});
form.addEventListener("input", event => { event.target.setCustomValidity?.(""); $("#receipt").hidden = true; $("#receipt-text").textContent = ""; });
$("#clear-draft").addEventListener("click", () => { form.reset(); $("#receipt-text").textContent = ""; $("#receipt").hidden = true; $("#form-status").textContent = "Private draft cleared."; form.elements.name.focus(); });
$("#newsletter").addEventListener("submit", event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  $("#newsletter-status").textContent = "Email preview complete. No subscription was created and no address was saved.";
  event.currentTarget.reset();
});
