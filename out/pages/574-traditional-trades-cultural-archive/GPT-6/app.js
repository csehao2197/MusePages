const trades = [
    { id: "xiugangbi", name: "Pen repairer", roman: "Xiu gangbi", city: "Beijing", kind: "Repair", subtitle: "A second life for a familiar line.", desc: "The patient work of coaxing ink back onto paper.", tool: "nib, loupe and pliers", scene: "A pen has arrived wrapped in a handkerchief. Its owner says it skips on the downstroke. At the bench, the repairer turns the nib toward the light. The fault is almost too small to see: a pair of metal tips no longer meeting quite as they should. A gentle adjustment, a rinse, and a line drawn slowly across scrap paper begin the conversation again.", lesson: "The value here is not simply in making an object work. A familiar pen carries the pressure and angle of a particular hand. Keeping it in use can preserve that small relationship.", old: "A refillable pen returns to a repair bench for cleaning and adjustment.", now: "Disposable writing tools coexist with enthusiasts who restore and use fountain pens.", tone: 1350, wave: "sine", noise: "highpass" },
    { id: "modaodao", name: "Blade sharpener", roman: "Mo jiandao", city: "Tianjin", kind: "Repair", subtitle: "An edge renewed, a rhythm remembered.", desc: "Steel, water and a practiced angle.", tool: "whetstone, scissors and water bowl", scene: "Water darkens a narrow stone. The sharpener opens a pair of scissors and studies each blade separately. A measured stroke moves away from the body, then another follows at the same angle. The sound is quieter than the street around it. There is no flourish, only the changing feel of steel meeting stone. A scrap of cloth waits to test whether the blades can cut cleanly once more.", lesson: "Sharpening asks for attention to a surface most of us barely notice. The work is a reminder that maintenance is a kind of making: it gives an existing thing a new chance to do its job.", old: "A traveling workbench makes sharpening part of a neighborhood routine.", now: "Replaceable blades and specialist sharpening services offer different ways to maintain an edge.", tone: 480, wave: "triangle", noise: "bandpass" },
    { id: "tanmianhua", name: "Cotton fluffer", roman: "Tan mianhua", city: "Hangzhou", kind: "Making", subtitle: "Warmth, carried on a vibrating string.", desc: "A cotton bow loosens fibers for a quilt.", tool: "cotton bow, string and wooden mallet", scene: "A loose cloud of cotton lies across the work surface. The craftsperson brings the bow string close and strikes it, setting the fibers trembling. Small clumps separate. The uneven pile begins to spread into something lighter and more consistent. From the doorway it might look like a single repeated gesture, but up close the hands keep checking what the eye alone cannot judge.", lesson: "A quilt is often understood through warmth and weight. This workshop scene turns attention to the preparation behind those feelings: the patient handling of fibers before a finished covering takes shape.", old: "Cotton is loosened and arranged by hand before a quilt is assembled.", now: "Factory-made bedding sits alongside small workshops and renewed interest in natural fibers.", tone: 180, wave: "sawtooth", noise: "lowpass" },
    { id: "niemianren", name: "Dough sculptor", roman: "Nie mianren", city: "Jinan", kind: "Making", subtitle: "A small world between the fingertips.", desc: "Soft dough becomes a figure with a personality.", tool: "modeling stick, dough and small scissors", scene: "A small piece of dough rolls between two palms. The sculptor pinches a head from it, adds a shoulder, and turns a thin strip into a sleeve. A wooden modeling tool presses a crease where cloth might fold. The figure is still small enough to disappear inside a closed hand, yet a tilt of its head already suggests a mood. Someone watching asks how the face will be made.", lesson: "Miniature work makes every adjustment visible. The pleasure of this imagined encounter is not a claim about a particular master, but an invitation to notice how much expression a few careful gestures can hold.", old: "Small figures take shape in a stall where onlookers can watch each step.", now: "Workshops, demonstrations and contemporary designs offer new settings for hand-modeling.", tone: 220, wave: "sine", noise: "lowpass" },
    { id: "peiyaoshi", name: "Key cutter", roman: "Pei yaoshi", city: "Chengdu", kind: "Repair", subtitle: "The shape of coming home.", desc: "Tiny differences turn a blank into a working key.", tool: "key blank, file and cutting machine", scene: "A worn key and a new blank sit beside one another. The cutter checks their profiles before securing them. The machine hums, stops, and hums again. Metal dust catches the light. After cutting, a file smooths the edge so the new key will not feel rough between the fingers. The final question is practical rather than decorative: will it turn the intended lock?", lesson: "A key is a small object with a very specific task. Looking at the work behind it reveals a world of tolerances and careful matching that usually disappears as soon as a door opens.", old: "A neighborhood stall cuts and finishes a metal duplicate.", now: "Mechanical keys share the doorway with cards, keypads and electronic access systems.", tone: 110, wave: "square", noise: "highpass" },
    { id: "xiuxie", name: "Cobbler", roman: "Xiu xie", city: "Wuhan", kind: "Repair", subtitle: "Another mile, another story.", desc: "Stitches and patches keep a well-worn pair moving.", tool: "awl, shoe last, thread and hammer", scene: "A shoe rests upside down on the bench. One seam has loosened near the toe. The cobbler follows the old holes with an awl, then draws a new length of thread through the leather. Each pull changes the shape just a little. A patch is trimmed, tested against the worn place, and trimmed again. The owner will recognize the shoe when it returns, but perhaps not the many small decisions inside the repair.", lesson: "Repair need not erase every sign of use. Sometimes its purpose is simply to make the next walk possible while keeping the comfort that years of wear have already created.", old: "A torn seam is stitched and a worn sole is examined for repair.", now: "New materials can complicate repairs, while repair-minded owners seek ways to keep shoes in use.", tone: 160, wave: "sine", noise: "bandpass" },
    { id: "baomihua", name: "Popcorn vendor", roman: "Bao mihua", city: "Shenyang", kind: "Performance", subtitle: "The street pauses for a familiar sound.", desc: "A remembered street snack and its unmistakable ritual.", tool: "illustrated pressure roaster and collection sack", scene: "In this imagined street scene, a small crowd leaves space around the vendor. A dark roaster is the focus of everyone's attention. Conversation gives way to anticipation. Then the scene breaks into movement, and a warm snack is ready to be shared. What stays in the memory is as much the waiting as the taste: people looking up from their errands for the same brief moment.", lesson: "This illustration is not an operating guide. Pressure roasting involves real hazards and belongs in trained, properly equipped hands. Here it is considered only as a visual and social motif in a creative archive.", old: "An outdoor snack-making ritual becomes a shared neighborhood spectacle.", now: "Packaged snacks and electric poppers offer different experiences of the same familiar food.", tone: 75, wave: "sine", noise: "lowpass" },
    { id: "piying", name: "Shadow puppeteer", roman: "Piying", city: "Xi'an", kind: "Performance", subtitle: "A whole world on the other side of light.", desc: "Jointed silhouettes bring a small stage to life.", tool: "articulated puppet, rods and illuminated screen", scene: "A pale screen waits between the audience and the performer. Behind it, a jointed figure lifts one arm. The motion is small in the hand but expansive in shadow. A second figure enters and the empty rectangle becomes a place of encounter. Light reveals the outline while hiding the person doing the work, so that a gesture can seem to belong entirely to the puppet.", lesson: "This imagined rehearsal concentrates on the relationship between light, movement and attention. It does not stand in for the many distinct regional traditions, performance histories or living practitioners associated with shadow theater.", old: "A backlit screen turns hand-operated figures into a shared performance.", now: "Live performances coexist with educational workshops, recordings and new experiments with light.", tone: 600, wave: "sine", noise: "bandpass" },
    { id: "titoujiang", name: "Street barber", roman: "Titou jiang", city: "Nanjing", kind: "Repair", subtitle: "A chair, a mirror, a moment of trust.", desc: "Everyday grooming as a familiar neighborhood ritual.", tool: "comb, scissors, mirror and folded towel", scene: "A chair is turned toward the light. The barber lays out a comb and scissors, then checks the cloth around the customer's shoulders. Conversation starts with something ordinary: the weather, perhaps, or how short the hair should be. A mirror reflects only part of the small working space. The rest is known through habit, from the reach toward a towel to the pause before the final check.", lesson: "The setting in this vignette is invented, but its question is simple. How does an everyday service become a relationship? Repeated visits can make a modest work station part of someone's mental map of home.", old: "A portable chair and simple tools make a small open-air workplace.", now: "Dedicated salons and mobile services offer varied settings for personal grooming.", tone: 1800, wave: "sine", noise: "highpass" },
    { id: "buguo", name: "Pot mender", roman: "Bu guo", city: "Changsha", kind: "Repair", subtitle: "A patch is not the end of the story.", desc: "An illustrated study of metal, wear and resourcefulness.", tool: "hammer, metal patch and iron vessel", scene: "A damaged cooking pot sits on a cloth, its worn surface catching a narrow band of light. The mender examines the break before setting out a hammer and a small piece of metal. In this imagined workshop, the first part of the job is observation. Is repair suitable? What would be safe? Not every object can or should be returned to service merely because someone wishes to keep it.", lesson: "The scene celebrates resourcefulness without giving instructions for repairing cookware. Materials, food contact and structural safety matter. An archive can invite appreciation of a trade while leaving practical work to qualified people.", old: "A household vessel is assessed rather than immediately discarded.", now: "Replacement cookware is common, while repair remains dependent on material, skill and safety.", tone: 310, wave: "triangle", noise: "bandpass" },
    { id: "kezhang", name: "Seal engraver", roman: "Ke zhang", city: "Suzhou", kind: "Making", subtitle: "A whole intention in a small square.", desc: "Stone, a cutting tool and the discipline of negative space.", tool: "blank stone seal, carving tool and paste dish", scene: "A small stone is held steadily above the bench. The engraver studies the available space before making another cut. Fine dust settles beside the hand. What is removed matters as much as what remains, because the finished surface will be read through an impression. In this English-language illustration the face is left abstract, so no invented inscription is presented as an authentic historical mark.", lesson: "The vignette draws attention to scale and reversal rather than offering a lesson in a particular school of engraving. A small object can hold a complex sequence of decisions that remains invisible in the finished print.", old: "A small stone is planned, cut and tested by hand.", now: "Hand engraving exists beside machine-cut marks and other systems of personal identification.", tone: 2300, wave: "triangle", noise: "bandpass" },
    { id: "tanghua", name: "Sugar painter", roman: "Tang hua", city: "Chongqing", kind: "Making", subtitle: "A fleeting drawing, a lasting delight.", desc: "A flowing line becomes an edible silhouette.", tool: "ladle, smooth slab and illustrated sugar ribbon", scene: "A ladle hovers above a smooth surface. A thin amber line follows its movement, curving into a loop, then meeting another line before it cools. The painter works with a material that will not wait indefinitely. The design needs enough connection to hold together and enough openness to read clearly. An onlooker follows the path without yet knowing which shape will emerge.", lesson: "This imagined demonstration is about line and timing, not a recipe or a heating guide. The finished object may be brief-lived, but watching it appear can make the making itself the most memorable part of the encounter.", old: "A hand-poured sugar silhouette turns a stall into a place to watch.", now: "Festival demonstrations and small workshops offer opportunities to encounter the process.", tone: 130, wave: "sine", noise: "lowpass" }
];
const observations = {
    xiugangbi: "Notice the contrast between the broad workbench and the tiny point where metal meets paper. In the illustration, the loupe stands for looking again rather than rushing to replace. What object in your own pocket would you most want a patient repairer to understand?",
    modaodao: "Follow the long line of the scissors in the tool plate. The water bowl and stone suggest a modest working space organized around a single task. Consider how the sound of repeated strokes might become part of a street's everyday identity, even for someone passing without stopping.",
    tanmianhua: "Look at the difference between the rigid curve of the bow and the loose forms beneath it. The composition brings tension and softness into the same frame. Think of a familiar textile at home, and of how little of its preparation remains visible once it is in use.",
    niemianren: "The illustrated figure is deliberately simple. A sleeve, an angle and a few small marks are enough to invite a reading. Imagine asking the maker to repeat the figure: would the next version feel identical, or would the differences be part of what makes a handmade object interesting?",
    peiyaoshi: "Compare the silhouettes hanging above the machine. Their differences are not merely decoration: the idea of matching is central to this scene. Think about how often an everyday object is noticed only when it fails, and how much quiet work is hidden inside the expectation that it will function.",
    xiuxie: "Trace the dotted seam around the illustrated shoe. The line makes a repair legible instead of pretending that wear never happened. Imagine bringing a favorite pair to a workbench and having to explain what matters most: appearance, comfort, a memory, or simply the wish to use them longer.",
    baomihua: "The rounded vessel dominates the plate while a few pale kernels interrupt its dark outline. That contrast is an artistic choice, not a reconstruction of a specific machine. Consider how a remembered snack can include a place, a sound and the company of others as strongly as a flavor.",
    piying: "Find the circles at the figure's joints and follow the thin control rods downward. The drawing makes the mechanism visible instead of concealing it behind a screen. Imagine how a small turn of a wrist could change the character of a movement when the audience sees only its shadow.",
    titoujiang: "The mirror, chair and comb describe a workplace without giving it a named owner. Each object has a place within reach. Think about the small routines that make a service feel familiar, and the difference between recognizing a setting as picturesque and understanding it as somebody's daily work.",
    buguo: "Look at the patch and the surrounding surface as two parts of one composition. Their contrast invites a question rather than supplying a technical answer. When is a visible repair a source of pride, and when must an object's intended use take priority over the wish to preserve it?",
    kezhang: "The abstract lines on the stone are intentionally not characters or a historical signature. They show how an arrangement can be considered within a limited surface. Try following the empty spaces with your eye: the image asks you to look at absence as carefully as at the material left behind.",
    tanghua: "Follow the amber line from one curve into the next. The plate emphasizes connection and movement rather than presenting a historically attributed design. Imagine watching a drawing appear without an eraser. The interest lies partly in the finished silhouette, and partly in the confidence of the path that created it."
};
let filter = "All";
let soundEnabled = false;
let audio;
let soundTimer;
let timelineIndex = 0;
let selected = trades[0];
const grid = document.querySelector("#trade-grid");
const dialog = document.querySelector("#trade-dialog");
const search = document.querySelector("#search");
const soundButton = document.querySelector("#play-sound");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const number = (index) => String(index + 1).padStart(2, "0");

function render()
{
    const query = search.value.toLowerCase().trim();
    const visible = trades.filter((trade) => (filter === "All" || trade.kind === filter) && `${trade.name} ${trade.city} ${trade.roman}`.toLowerCase().includes(query));
    grid.replaceChildren();
    for (const trade of visible)
    {
        const index = trades.indexOf(trade);
        const card = document.createElement("button");
        card.className = "trade-card";
        card.dataset.id = trade.id;
        card.setAttribute("aria-label", `Explore ${trade.name}, ${trade.city}`);
        card.innerHTML = `<span class="card-art"><img src="images/${trade.id}.svg" alt="Original illustrated ${trade.tool}" loading="lazy"><span class="card-number">${number(index)}</span><span class="card-category">${trade.kind.toUpperCase()} / FIELD STUDY</span><span class="card-arrow" aria-hidden="true">↗</span></span><span class="card-title">${trade.name}</span><span class="card-city">${trade.city} · ${trade.roman}</span><span class="card-desc">${trade.desc}</span>`;
        card.addEventListener("click", () => openTrade(trade));
        card.addEventListener("pointerenter", () =>
        {
            if (soundEnabled)
            {
                playTradeSound(trade);
            }
        });
        grid.append(card);
    }
    document.querySelector("#results").textContent = `${visible.length} ${visible.length === 1 ? "trade" : "trades"} to discover`;
    document.querySelector("#empty").hidden = visible.length > 0;
}

for (const button of document.querySelectorAll("[data-filter]"))
{
    button.addEventListener("click", () =>
    {
        filter = button.dataset.filter;
        for (const item of document.querySelectorAll("[data-filter]"))
        {
            const active = item === button;
            item.classList.toggle("active", active);
            item.setAttribute("aria-pressed", String(active));
        }
        render();
    });
}
search.addEventListener("input", render);

function openTrade(trade)
{
    selected = trade;
    document.querySelector("#detail-title").textContent = trade.name;
    document.querySelector("#detail-category").textContent = `${number(trades.indexOf(trade))} / ${trade.kind.toUpperCase()} & EVERYDAY LIFE`;
    document.querySelector("#detail-roman").textContent = trade.roman;
    document.querySelector("#detail-subtitle").textContent = trade.subtitle;
    document.querySelector("#detail-image").src = `images/${trade.id}.svg`;
    document.querySelector("#detail-image").alt = `Original illustration of ${trade.tool}`;
    document.querySelector("#detail-plate").textContent = `PLATE ${number(trades.indexOf(trade))} / ORIGINAL TOOL STUDY`;
    document.querySelector("#detail-story").innerHTML = `<p>${trade.scene}</p><p>${trade.lesson}</p><p>${observations[trade.id]}</p><p>Look closely at the ${trade.tool}. Imagine the difference between simply owning these tools and knowing how to use them well. This creative study is a starting point for curiosity, not an interview, a verified biography or evidence that a practice has vanished. Seek out living practitioners and reliable local sources to learn more about the craft in its own context.</p>`;
    document.querySelector("#detail-city").textContent = `Atlas association: ${trade.city}`;
    document.querySelector("#sound-status").textContent = "An original synthesized impression, not a field recording.";
    dialog.showModal();
    document.body.style.overflow = "hidden";
    document.querySelector("#close-dialog").focus();
}

function endSound()
{
    clearTimeout(soundTimer);
    soundButton.classList.remove("playing");
    soundButton.removeAttribute("aria-busy");
    if (audio)
    {
        audio.close().catch(() => {});
        audio = undefined;
    }
}

function closeTrade()
{
    dialog.close();
}
dialog.addEventListener("close", () =>
{
    document.body.style.overflow = "";
    endSound();
});
document.querySelector("#close-dialog").addEventListener("click", closeTrade);
dialog.addEventListener("click", (event) =>
{
    if (event.target === dialog)
    {
        const box = dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)
        {
            closeTrade();
        }
    }
});

async function playTradeSound(trade)
{
    endSound();
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio)
    {
        document.querySelector("#sound-status").textContent = "Audio synthesis is not available in this browser.";
        return;
    }
    try
    {
        const ctx = new Audio();
        audio = ctx;
        await ctx.resume();
        if (audio !== ctx)
        {
            return;
        }
        const now = ctx.currentTime;
        const duration = 1.6;
        const master = ctx.createGain();
        master.gain.value = 0.1;
        master.connect(ctx.destination);
        const oscillator = ctx.createOscillator();
        const envelope = ctx.createGain();
        oscillator.type = trade.wave;
        oscillator.frequency.setValueAtTime(trade.tone, now);
        oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, trade.tone * .4), now + duration);
        envelope.gain.setValueAtTime(.001, now);
        envelope.gain.exponentialRampToValueAtTime(.35, now + .04);
        envelope.gain.exponentialRampToValueAtTime(.001, now + duration);
        oscillator.connect(envelope).connect(master);
        oscillator.start(now);
        oscillator.stop(now + duration);
        const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
        const samples = buffer.getChannelData(0);
        const rhythm = trades.indexOf(trade) % 4 + 2;
        for (let index = 0; index < samples.length; index++)
        {
            const phase = index / ctx.sampleRate;
            samples[index] = (Math.random() * 2 - 1) * Math.max(0, Math.sin(phase * rhythm * Math.PI)) * (1 - phase / duration);
        }
        const noise = ctx.createBufferSource();
        const band = ctx.createBiquadFilter();
        band.type = trade.noise;
        band.frequency.value = trade.tone * 1.5;
        noise.buffer = buffer;
        noise.connect(band).connect(master);
        noise.start(now);
        noise.stop(now + duration);
        soundButton.classList.add("playing");
        soundButton.setAttribute("aria-busy", "true");
        document.querySelector("#sound-status").textContent = `Playing synthesized ${trade.name.toLowerCase()} sound.`;
        soundTimer = setTimeout(() =>
        {
            endSound();
            document.querySelector("#sound-status").textContent = "Sound finished. Play again to listen.";
        }, duration * 1000 + 100);
    }
    catch
    {
        endSound();
        document.querySelector("#sound-status").textContent = "Audio could not start. Try enabling sound again.";
    }
}
soundButton.addEventListener("click", () => playTradeSound(selected));
document.querySelector("#sound-toggle").addEventListener("click", (event) =>
{
    soundEnabled = !soundEnabled;
    event.currentTarget.setAttribute("aria-pressed", String(soundEnabled));
    event.currentTarget.innerHTML = `Sound ${soundEnabled ? "on" : "off"} <span aria-hidden="true">♪</span>`;
    if (soundEnabled)
    {
        playTradeSound(trades[0]);
    }
    else
    {
        endSound();
    }
});

const cityStops = [
    ["Beijing", 65, 27, 0], ["Tianjin", 73, 35, 1], ["Hangzhou", 78, 64, 2],
    ["Jinan", 66, 43, 3], ["Chengdu", 42, 63, 4], ["Wuhan", 62, 65, 5],
    ["Shenyang", 84, 20, 6], ["Xi'an", 50, 49, 7], ["Nanjing", 80, 52, 8],
    ["Changsha", 61, 77, 9], ["Suzhou", 88, 59, 10], ["Chongqing", 44, 75, 11],
    ["Guangzhou", 68, 89, null], ["Kunming", 32, 83, null], ["Lanzhou", 36, 44, null]
];
for (const [name, x, y, tradeIndex] of cityStops)
{
    const button = document.createElement("button");
    const trade = trades[tradeIndex];
    button.className = "city-point";
    button.style.left = `${x}%`;
    button.style.top = `${y}%`;
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `${name}: ${trade ? trade.name : "open research stop"}`);
    button.title = `${name} — ${trade ? `${trade.name}; 1 illustrated trade, no verified artisan count` : "Open research stop; no verified artisan count"}`;
    button.innerHTML = `<i aria-hidden="true"></i>${name}`;
    button.addEventListener("click", () =>
    {
        document.querySelectorAll(".city-point").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        document.querySelector("#city-note").innerHTML = `<span class="eyebrow">ILLUSTRATED ATLAS STOP</span><h3>${name}</h3><p>${trade ? `${trade.name} · ${trade.desc}` : "An open page in the notebook. No trade profile has been assigned to this stop."}</p>`;
        const link = document.querySelector("#city-link");
        link.textContent = trade ? `Find ${trade.name.toLowerCase()} in the archive ↗` : "Explore all trades ↗";
        link.onclick = () =>
        {
            filter = "All";
            search.value = trade ? name : "";
            document.querySelectorAll("[data-filter]").forEach((item) =>
            {
                item.classList.toggle("active", item.dataset.filter === "All");
                item.setAttribute("aria-pressed", String(item.dataset.filter === "All"));
            });
            render();
        };
    });
    document.querySelector("#city-points").append(button);
}

function renderTimeline()
{
    const trade = trades[timelineIndex];
    document.querySelector("#timeline-name").textContent = `${number(timelineIndex)} / ${trade.name}`;
    document.querySelector("#old-note").textContent = trade.old;
    document.querySelector("#now-note").textContent = trade.now;
    for (const name of ["before-image", "now-image"])
    {
        document.getElementById(name).src = `images/${trade.id}.svg`;
        document.getElementById(name).alt = `${trade.name} tool study in an ${name === "before-image" ? "warm workshop" : "cool contemporary"} illustrated setting`;
    }
    document.querySelector("#compare-range").value = 50;
    updateComparison();
}
function updateComparison()
{
    const value = document.querySelector("#compare-range").value;
    document.querySelector("#compare-before").style.clipPath = `inset(0 ${100 - value}% 0 0)`;
    document.querySelector("#compare-divider").style.left = `${value}%`;
    document.querySelector("#compare-range").setAttribute("aria-valuetext", `${value}% traditional context revealed`);
}
document.querySelector("#compare-range").addEventListener("input", updateComparison);
document.querySelector("#previous").addEventListener("click", () =>
{
    timelineIndex = (timelineIndex + trades.length - 1) % trades.length;
    renderTimeline();
});
document.querySelector("#next").addEventListener("click", () =>
{
    timelineIndex = (timelineIndex + 1) % trades.length;
    renderTimeline();
});

for (const trade of trades)
{
    const option = new Option(trade.name, trade.id);
    document.querySelector("#interest-trade").add(option);
    const button = document.createElement("button");
    button.textContent = trade.name;
    button.addEventListener("click", () => openTrade(trade));
    document.querySelector("#footer-trades").append(button);
}
let formTimer;
document.querySelector("#heritage-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const trade = trades.find((item) => item.id === document.querySelector("#interest-trade").value);
    document.querySelector("#form-status").textContent = `Thank you for your interest in ${trade.name.toLowerCase()}. Demo complete — nothing was sent or saved.`;
    event.target.reset();
    clearTimeout(formTimer);
    formTimer = setTimeout(() =>
    {
        document.querySelector("#form-status").textContent = "Demo only. Your curiosity stays with you.";
    }, 5000);
});
try
{
    const visits = Math.max(0, Number(localStorage.getItem("vanishing-trades-visits")) || 0) + 1;
    localStorage.setItem("vanishing-trades-visits", String(visits));
    document.querySelector("#visits").textContent = `Visits on this browser: ${visits}`;
}
catch
{
    document.querySelector("#visits").textContent = "Local visit counter unavailable";
}
if (!reducedMotion)
{
    let ticking = false;
    addEventListener("scroll", () =>
    {
        if (!ticking)
        {
            ticking = true;
            requestAnimationFrame(() =>
            {
                const shift = Math.min(scrollY, 800) * .15;
                document.querySelector(".hero-art").style.transform = `translateY(${shift}px) scale(1.02)`;
                ticking = false;
            });
        }
    }, { passive: true });
}
addEventListener("pagehide", endSound);
render();
renderTimeline();
