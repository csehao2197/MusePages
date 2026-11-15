const titles = ["Dead Reckoning", "Signal Loss", "Null Space", 'Fault Line (12")', "Everything Goes Dark", "Interior / Exterior", "Pressure Wave EP", "Corridor", "Room Tone", "Inner Groove", "Empty Room"];
document.querySelector("#tracks").innerHTML = titles.slice(0, 8).map((title, index) => `<button class="track" data-play="${index}" aria-pressed="false" aria-label="Play original sound sketch for ${title.replace(/"/g, "&quot;")}"><span>${String(index + 1).padStart(2, "0")}</span><b>${title}</b><small>CONCEPT RELEASE</small><small>${2025 - Math.floor(index / 2)}</small><small>SKETCH</small><span>▶</span></button>`).join("");
document.querySelector("#waveform").innerHTML = Array.from({ length: 80 }, (_, i) => `<i style="--height:${18 + (i * 37 % 80)}%;--duration:${.6 + (i * 13 % 16) / 10}s;animation-delay:-${i % 15 / 10}s"></i>`).join("");
let audio;
let oscillator;
let gain;
let timer;
let active = -1;
let started = 0;
function stopAudio()
{
    clearInterval(timer);
    if (oscillator)
    {
        oscillator.stop();
        oscillator.disconnect();
        oscillator = null;
    }
    gain?.disconnect();
    document.querySelectorAll("[data-play]").forEach((button) => button.setAttribute("aria-pressed", "false"));
    document.querySelector("#stop").disabled = true;
    document.querySelector("#now-playing").textContent = "NO SIGNAL SELECTED";
    document.querySelector("#progress").value = 0;
    active = -1;
}
async function play(index)
{
    if (active === index)
    {
        stopAudio();
        return;
    }
    stopAudio();
    try
    {
        audio ||= new AudioContext();
        await audio.resume();
        oscillator = audio.createOscillator();
        gain = audio.createGain();
        oscillator.type = index > 8 ? "sine" : "triangle";
        const now = audio.currentTime;
        const base = 65.4 * 2 ** ((index % 7) / 12);
        for (let n = 0; n < 16; n++)
        {
            oscillator.frequency.setValueAtTime(base * [1, 1, 1.5, 2][n % 4], now + n * .5);
        }
        gain.gain.value = Number(document.querySelector("#volume").value);
        oscillator.connect(gain).connect(audio.destination);
        oscillator.start();
        active = index;
        started = performance.now();
        document.querySelectorAll(`[data-play="${index}"]`).forEach((button) => button.setAttribute("aria-pressed", "true"));
        document.querySelector("#now-playing").textContent = `PLAYING ORIGINAL SKETCH / ${titles[index].toUpperCase()}`;
        document.querySelector("#stop").disabled = false;
        timer = setInterval(() =>
        {
            const elapsed = (performance.now() - started) / 1000;
            document.querySelector("#progress").value = Math.min(8, elapsed);
            if (elapsed >= 8) stopAudio();
        }, 80);
    }
    catch
    {
        stopAudio();
        document.querySelector("#now-playing").textContent = "AUDIO UNAVAILABLE IN THIS BROWSER. TRY A MODERN BROWSER.";
    }
}
document.querySelectorAll("[data-play]").forEach((button) => button.addEventListener("click", () => play(Number(button.dataset.play))));
document.querySelector("#stop").addEventListener("click", stopAudio);
document.querySelector("#volume").addEventListener("input", (event) =>
{
    if (gain) gain.gain.setTargetAtTime(Number(event.target.value), audio.currentTime, .02);
});
document.addEventListener("visibilitychange", () =>
{
    if (document.hidden) stopAudio();
});
window.addEventListener("pagehide", stopAudio);
document.querySelector("#motion").addEventListener("click", (event) =>
{
    const paused = document.body.classList.toggle("paused");
    event.target.setAttribute("aria-pressed", String(paused));
    event.target.textContent = paused ? "Resume motion" : "Pause motion";
});
const shows = [
    ["09 MAY", "Fabric Room 1", "London", "HEADLINE"], ["16 MAY", "Tresor", "Berlin", "B2B"],
    ["23 MAY", "Shelter", "Amsterdam", "HEADLINE"], ["31 MAY", "Corsica Studios", "London", "SUPPORT"],
    ["07 JUN", "Panorama Bar", "Berlin", "HEADLINE"], ["14 JUN", "Output", "New York", "HEADLINE"],
    ["21 JUN", "Concrete", "Paris", "B2B"], ["28 JUN", "Robert Johnson", "Offenbach", "HEADLINE"],
    ["12 JUL", "De School", "Amsterdam", "RESIDENCY"]
];
let selectedShow;
function renderShows()
{
    const query = document.querySelector("#city").value.trim().toLowerCase();
    const shown = shows.filter((show) => show[2].toLowerCase().includes(query));
    document.querySelector("#shows").innerHTML = shown.map((show) => `<article class="show"><span>${show[0]}</span><div><h3>${show[1]}</h3><small>${show[2]} / CONCEPT DATE</small></div><span class="show-type">${show[3]}</span><button class="outline" data-show="${shows.indexOf(show)}">DETAILS ↗</button></article>`).join("");
    document.querySelector("#no-shows").hidden = shown.length > 0;
}
renderShows();
document.querySelector("#city").addEventListener("input", renderShows);
document.querySelector("#clear").addEventListener("click", () =>
{
    document.querySelector("#city").value = "";
    renderShows();
});
const dialog = document.querySelector("#show-dialog");
document.querySelector("#shows").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-show]");
    if (!button) return;
    selectedShow = shows[Number(button.dataset.show)];
    document.querySelector("#show-title").textContent = selectedShow[1];
    document.querySelector("#show-copy").textContent = `${selectedShow[0]} / ${selectedShow[2]} / ${selectedShow[3]}. Year unconfirmed.`;
    dialog.showModal();
});
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelector("#event-enquiry").addEventListener("click", () =>
{
    document.querySelector("#event").value = `Inspired by ${selectedShow[1]}`;
    document.querySelector("#venue").value = selectedShow[2];
    document.querySelector("#date").value = "";
    dialog.close();
    document.querySelector("#booking").scrollIntoView();
});
document.querySelector("#booking-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const status = document.querySelector("#status");
    const email = document.querySelector("#email");
    const eventName = document.querySelector("#event").value.trim();
    const date = document.querySelector("#date").value;
    const attendance = Number(document.querySelector("#attendance").value);
    if (!eventName || !email.value || !email.validity.valid)
    {
        status.textContent = "Add an event name and valid contact email.";
        return;
    }
    if (!date || date <= new Date().toLocaleDateString("en-CA"))
    {
        status.textContent = "Choose a future event date.";
        return;
    }
    if (!document.querySelector("#venue").value.trim() || !Number.isInteger(attendance) || attendance < 1 || attendance > 100000)
    {
        status.textContent = "Add a venue/city and whole-number attendance from 1 to 100000.";
        return;
    }
    if (document.querySelector("#message").value.trim().length < 20)
    {
        status.textContent = "Describe the room and crowd in at least 20 characters.";
        return;
    }
    status.textContent = `${eventName} / ${date} / ${attendance} people / ${document.querySelector("#type").value}. Local preview only. Nothing sent or reserved.`;
});
document.querySelectorAll("#booking-form input, #booking-form select, #booking-form textarea").forEach((field) => field.addEventListener("input", () => document.querySelector("#status").textContent = ""));
document.querySelector("#press").addEventListener("click", () =>
{
    const url = URL.createObjectURL(new Blob(["VØID — Fictional artist concept\nBerlin / Techno, Industrial, Ambient\nOriginal generated sound sketches and vector artwork.\nNo venue, label, agency affiliation or actual performance history claimed.\nBooking form is a browser-only prototype."], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "void-concept-press-sheet.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    document.querySelector("#press-status").textContent = "Concept press sheet downloaded.";
});
document.querySelector("#menu").addEventListener("click", () =>
{
    const open = document.querySelector("#nav").classList.toggle("open");
    document.querySelector("#menu").setAttribute("aria-expanded", String(open));
});
document.querySelectorAll("#nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
}));
