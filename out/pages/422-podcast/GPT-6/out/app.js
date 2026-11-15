const heights = [8, 24, 16, 36, 12, 40, 20, 32, 10, 28, 14, 38, 22, 18, 34, 8, 30, 16, 26, 40];
heights.forEach((height, index) =>
{
    const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    ["x", "y", "width", "height", "fill"].forEach((attribute, n) => bar.setAttribute(attribute, [index * 10, 48 - height, 6, height, "#d48c1a"][n]));
    bar.style.animationDelay = `${index * .05}s`;
    document.querySelector("#wave").append(bar);
});
const episodes =
[
    ["124", "How Stripe Thinks About Growth", 47, "Where does growth come from when the obvious channels stop working? Consider the difference between distribution and product value."],
    ["123", "The Art of Saying No", 38, "What should a team stop doing? Explore a decision framework built around opportunity cost, focus and explicit trade-offs."],
    ["122", "Building Remote Teams That Actually Work", 52, "What needs a meeting, and what needs a clear document? Explore expectations, asynchronous work and deliberate connection."],
    ["121", "The $50M Brand with Zero Paid Marketing", 41, "A discussion prompt about earned attention, retention and referral loops. The title is supplied concept copy, not a verified case study."],
    ["120", "Why Your Best Hire Isn't on LinkedIn", 35, "Look beyond familiar networks. Consider role design, work samples and fair evaluation before selecting a sourcing channel."],
    ["119", "What Netflix Gets Right About Culture", 58, "How do stated values become everyday decisions? Consider autonomy, accountability and the cost of ambiguity."]
];
let selected = 0;
const saved = new Set();
const dialog = document.querySelector("#episode");
function render()
{
    const query = document.querySelector("#search").value.trim().toLowerCase();
    const grid = document.querySelector("#episode-grid");
    grid.replaceChildren();
    let count = 0;
    episodes.forEach(([number, title, minutes], index) =>
    {
        if (!`${number} ${title}`.toLowerCase().includes(query)) return;
        count++;
        const button = document.createElement("button");
        button.className = "episode-card";
        const cover = document.createElement("div");
        cover.className = "cover";
        const numeral = document.createElement("b");
        numeral.textContent = number;
        cover.append(numeral);
        const body = document.createElement("div");
        body.className = "card-body";
        const label = document.createElement("small");
        label.textContent = `EP ${number} / CONCEPT`;
        const heading = document.createElement("h3");
        heading.textContent = title;
        const duration = document.createElement("p");
        duration.textContent = `${minutes} min proposed runtime`;
        const link = document.createElement("span");
        link.textContent = "Notes & original sound ident ↗";
        body.append(label, heading, duration, link);
        button.append(cover, body);
        button.addEventListener("click", () =>
        {
            selected = index;
            document.querySelector("#episode-number").textContent = `EP ${number} / EPISODE CONCEPT`;
            document.querySelector("#episode-title").textContent = title;
            document.querySelector("#notes").textContent = episodes[index][3];
            updateSaved();
            dialog.showModal();
        });
        grid.append(button);
    });
    document.querySelector("#count").textContent = `${count} concept episodes`;
    document.querySelector("#empty").hidden = count !== 0;
}
document.querySelector("#search").addEventListener("input", render);
document.querySelector("#clear-search").addEventListener("click", () =>
{
    document.querySelector("#search").value = "";
    render();
});
render();
function updateSaved()
{
    document.querySelector("#save").textContent = saved.has(selected) ? "Remove from this visit's list −" : "Save to this visit's listening list +";
    document.querySelector("#saved-status").textContent = `${saved.size} episode concept${saved.size === 1 ? "" : "s"} saved for this visit only.`;
}
document.querySelector("#save").addEventListener("click", () =>
{
    if (saved.has(selected)) saved.delete(selected);
    else saved.add(selected);
    updateSaved();
});
document.querySelector("#close").addEventListener("click", () => dialog.close());
let audio;
let oscillator;
let timer;
let start;
function stopSound()
{
    clearInterval(timer);
    if (oscillator)
    {
        oscillator.stop();
        oscillator.disconnect();
        oscillator = null;
    }
    if (audio)
    {
        audio.close();
        audio = null;
    }
    document.querySelector("#sound").textContent = "Play original 8-second ident";
    document.querySelector("#sound-status").textContent = "Stopped. No full episode recording is supplied.";
}
document.querySelector("#sound").addEventListener("click", async () =>
{
    if (audio)
    {
        stopSound();
        return;
    }
    try
    {
        audio = new AudioContext();
        await audio.resume();
        oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(164.81, audio.currentTime);
        oscillator.frequency.setValueAtTime(220, audio.currentTime + 2);
        oscillator.frequency.setValueAtTime(261.63, audio.currentTime + 4);
        oscillator.frequency.setValueAtTime(329.63, audio.currentTime + 6);
        gain.gain.value = .025;
        oscillator.connect(gain).connect(audio.destination);
        oscillator.start();
        start = performance.now();
        document.querySelector("#sound").textContent = "Stop sound ident";
        document.querySelector("#sound-status").textContent = "Playing original synthetic ident. Not episode audio.";
        document.querySelector("#progress").value = 0;
        timer = setInterval(() =>
        {
            const elapsed = (performance.now() - start) / 1000;
            document.querySelector("#progress").value = Math.min(8, elapsed);
            if (elapsed >= 8) stopSound();
        }, 100);
    }
    catch
    {
        stopSound();
        document.querySelector("#sound-status").textContent = "Audio is unavailable in this browser. Original editorial notes remain accessible.";
    }
});
dialog.addEventListener("close", stopSound);
document.querySelectorAll("[data-platform]").forEach((button) =>
{
    button.addEventListener("click", () => document.querySelector("#platform-status").textContent = `${button.dataset.platform}: no verified Signal show URL was provided. This concept does not redirect to an unrelated show.`);
});
document.querySelector("#subscribe").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const result = document.querySelector("#result");
    const email = document.querySelector("#email");
    if (!email.value.trim() || !email.validity.valid)
    {
        result.textContent = "Enter a valid email address.";
        return;
    }
    if (!document.querySelector("#consent").checked)
    {
        result.textContent = "Acknowledge this is a local demo.";
        return;
    }
    result.textContent = "Subscription preview ready. Nothing sent or stored; you have not joined a mailing list.";
});
document.querySelector("#subscribe").addEventListener("reset", () => document.querySelector("#result").textContent = "");
