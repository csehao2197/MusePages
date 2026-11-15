const studies = [
    { name: "Night Transit", genre: "Hip-Hop", bpm: 142, root: 110, colour: "#716b56" },
    { name: "Blue Hour", genre: "R&B", bpm: 82, root: 146.83, colour: "#4e667e" },
    { name: "Afterimage", genre: "Electronic", bpm: 124, root: 130.81, colour: "#746080" },
    { name: "Low Ceiling", genre: "Hip-Hop", bpm: 90, root: 98, colour: "#875f48" },
    { name: "Soft Signal", genre: "R&B", bpm: 76, root: 164.81, colour: "#657960" },
    { name: "Open Circuit", genre: "Electronic", bpm: 128, root: 123.47, colour: "#506f71" }
];
let filter = "All";
let context;
let master;
let nodes = [];
let timer;
let muted = false;
let playing = -1;
const player = document.querySelector("#player");
window.studioAudio = { state: "stopped", scheduledNotes: 0, context: null };
function stop()
{
    clearTimeout(timer);
    nodes.forEach((node) =>
    {
        try { node.stop(); } catch {}
    });
    nodes = [];
    playing = -1;
    player.dataset.state = "stopped";
    window.studioAudio.state = "stopped";
    document.querySelector("#now-playing").textContent = "NO STUDY PLAYING";
    document.querySelectorAll("[data-play]").forEach((button) => button.setAttribute("aria-pressed", "false"));
}
async function play(index)
{
    if (playing === index)
    {
        stop();
        return;
    }
    stop();
    try
    {
        if (!context)
        {
            context = new AudioContext();
            master = context.createGain();
            master.connect(context.destination);
            window.studioAudio.context = context;
        }
        await context.resume();
        master.gain.value = muted ? 0 : Number(document.querySelector("#volume").value);
        const study = studies[index];
        const start = context.currentTime + .03;
        const interval = 60 / study.bpm / 2;
        const notes = [0, 7, 12, 3, 7, 10, 5, 12];
        let count = 0;
        for (let time = 0; time < 3.8; time += interval)
        {
            const oscillator = context.createOscillator();
            const envelope = context.createGain();
            oscillator.type = index % 2 ? "sine" : "triangle";
            oscillator.frequency.value = study.root * 2 ** (notes[count % notes.length] / 12);
            envelope.gain.setValueAtTime(0, start + time);
            envelope.gain.linearRampToValueAtTime(.32, start + time + .015);
            envelope.gain.exponentialRampToValueAtTime(.001, start + time + .2);
            oscillator.connect(envelope);
            envelope.connect(master);
            oscillator.start(start + time);
            oscillator.stop(start + time + .22);
            nodes.push(oscillator);
            count++;
        }
        playing = index;
        player.dataset.state = "playing";
        window.studioAudio.state = "playing";
        window.studioAudio.scheduledNotes = count;
        document.querySelector("#now-playing").textContent = `${study.name.toUpperCase()} / ORIGINAL SYNTH STUDY / 4 SEC`;
        document.querySelector(`[data-play="${index}"]`)?.setAttribute("aria-pressed", "true");
        timer = setTimeout(stop, 4100);
    }
    catch
    {
        stop();
        document.querySelector("#now-playing").textContent = "AUDIO UNAVAILABLE IN THIS BROWSER. TRY A SUPPORTED BROWSER.";
    }
}
function render()
{
    document.querySelector("#tracks").innerHTML = studies.map((study, index) => ({ study, index })).filter(({ study }) => filter === "All" || study.genre === filter).map(({ study, index }) => `<article class="track"><div class="cover" style="--cover:${study.colour}"><button data-play="${index}" aria-label="Play ${study.name} synth study" aria-pressed="false"><span>PLAY</span></button></div><h3>${study.name}</h3><div class="track-meta"><span>${study.genre.toUpperCase()}</span><span>${study.bpm} BPM / SYNTH STUDY</span></div><button class="reference" data-reference="${index}">USE AS BRIEF REFERENCE ↗</button></article>`).join("");
    document.querySelectorAll("[data-play]").forEach((button) => button.addEventListener("click", () => play(Number(button.dataset.play))));
    document.querySelectorAll("[data-reference]").forEach((button) => button.addEventListener("click", () =>
    {
        document.querySelector("#reference").value = studies[Number(button.dataset.reference)].name;
        document.querySelector("#contact").scrollIntoView();
    }));
}
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    stop();
    filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    render();
}));
document.querySelector("#stop").addEventListener("click", stop);
document.querySelector("#mute").addEventListener("click", () =>
{
    muted = !muted;
    document.querySelector("#mute").setAttribute("aria-pressed", String(muted));
    document.querySelector("#mute").textContent = muted ? "UNMUTE" : "MUTE";
    if (master) master.gain.value = muted ? 0 : Number(document.querySelector("#volume").value);
});
document.querySelector("#volume").addEventListener("input", (event) =>
{
    if (master) master.gain.value = muted ? 0 : Number(event.target.value);
});
document.addEventListener("visibilitychange", () =>
{
    if (document.hidden) stop();
});
window.addEventListener("pagehide", stop);
document.querySelectorAll("[data-service]").forEach((button) => button.addEventListener("click", () =>
{
    document.querySelector("#service").value = button.dataset.service;
    document.querySelector("#contact").scrollIntoView();
}));
const form = document.querySelector("#brief");
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = new FormData(form);
    let text;
    if (!data.get("artist").trim()) text = "Add an example artist or project name.";
    else if (data.get("direction").trim().length < 15) text = "Add at least 15 characters describing the project direction.";
    else if (!data.get("ack")) text = "Confirm the local-only acknowledgement.";
    else text = `Local brief: ${data.get("artist").trim()} / ${document.querySelector("#service").value} / reference: ${document.querySelector("#reference").value}. Direction: ${data.get("direction").trim()}. No enquiry sent, licence granted or session booked.`;
    document.querySelector("#result").textContent = text;
});
form.addEventListener("reset", () => { document.querySelector("#result").textContent = ""; });
const menu = document.querySelector("#menu");
const nav = document.querySelector("#nav");
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
});
nav.addEventListener("click", () =>
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
});
for (let index = 0; index < 40; index++)
{
    const bar = document.createElement("i");
    bar.style.height = `${10 + (index * 23 % 58)}px`;
    bar.style.animationDelay = `${index * .04}s`;
    document.querySelector(".waveform").append(bar);
}
render();
