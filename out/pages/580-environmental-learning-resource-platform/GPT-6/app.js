const resources = [
    {
        id: "climate",
        topic: "Climate",
        format: "Lesson",
        title: "Climate change, without the overwhelm",
        description: "Understand the science, the language, and where we go from here.",
        minutes: 5,
        art: "landscape.svg",
        source: "https://science.nasa.gov/climate-change/",
        sourceName: "NASA Climate Change",
        paragraphs: [
            "Weather is what happens over hours or days. Climate describes patterns over decades. A cold day does not cancel a long-term warming trend, just as a rainy afternoon does not define a whole season.",
            "Greenhouse gases absorb and re-emit infrared radiation. Human activities, especially burning coal, oil, and gas, have increased their concentrations. This changes Earth’s energy balance and warms the planet.",
            "Warming affects heat extremes, sea levels, ecosystems, and rainfall patterns. The risks are not distributed equally. Reducing emissions limits future warming; adaptation reduces harm from changes already happening. Both matter.",
            "Try this: choose one climate claim in your news feed. Find its original source, check its date and geographic scope, and separate measured evidence from a prediction."
        ],
        question: "Which statement describes climate?",
        answers: ["Tomorrow’s afternoon temperature", "Long-term patterns of weather", "The wind speed outside right now"],
        correct: 1,
        explanation: "Climate is about long-term patterns. Individual weather events sit within those patterns."
    },
    {
        id: "energy",
        topic: "Energy",
        format: "Lesson",
        title: "A brighter look at clean energy",
        description: "From sun to socket: the possibilities and trade-offs of renewables.",
        minutes: 4,
        art: "energy.svg",
        source: "https://www.iea.org/energy-system/renewables",
        sourceName: "International Energy Agency",
        paragraphs: [
            "Solar panels convert sunlight into electricity. Wind turbines convert the motion of air. Neither needs to burn fuel during electricity generation, although manufacturing, construction, and disposal still have environmental impacts.",
            "Electricity supply and demand must stay balanced. Because sun and wind vary, grids combine many tools: transmission, storage, flexible demand, and other sources of generation. A cleaner grid is a system, not just a collection of panels.",
            "Energy efficiency delivers the same service with less energy. Insulation, efficient appliances, and well-designed public transport can reduce the amount of energy a community needs before new supply is added.",
            "Try this: find your electricity provider’s published generation mix. Check the reporting year and whether figures describe annual generation, installed capacity, or purchased certificates."
        ],
        question: "Why does a renewable electricity grid need flexibility?",
        answers: ["Solar panels generate equally at all hours", "Supply and demand must be balanced as conditions change", "Renewables have no material impacts"],
        correct: 1,
        explanation: "Storage, connected grids, and flexible demand help balance changing supply and demand."
    },
    {
        id: "waste",
        topic: "Waste",
        format: "Toolkit",
        title: "Less waste. More intention.",
        description: "A practical, pressure-free checklist for a more circular everyday.",
        minutes: 6,
        art: "objects.svg",
        source: "https://www.epa.gov/recycle/reducing-and-reusing-basics",
        sourceName: "US EPA — Reducing and Reusing Basics",
        paragraphs: [
            "Waste reduction begins before the bin. Avoiding an unnecessary purchase can prevent extraction, manufacturing, packaging, and transport impacts. Reuse and repair help keep the materials already in circulation useful for longer.",
            "For one week, notice which items you throw away most often. Choose one repeat item to reduce. A reusable container works best when it is used many times; buying more reusable things is not the goal.",
            "Recycling rules vary locally. Check your municipality’s instructions for accepted materials, cleaning requirements, batteries, and electronics. A recycling symbol alone does not guarantee local collection.",
            "Use the downloadable checklist to plan one achievable experiment. Record what worked and what was difficult, then adjust. Progress should fit your circumstances rather than depend on perfection."
        ],
        checklist: ["Observe your household waste for one week.", "Choose one repeat item you can avoid.", "Repair or borrow before buying something new.", "Check local collection guidance for batteries and electronics.", "Review your experiment after two weeks."],
        question: "What should you check before placing an unusual item in recycling?",
        answers: ["Whether it looks like plastic", "Your local collection rules", "Whether another country accepts it"],
        correct: 1,
        explanation: "Local facilities and rules determine what can be collected safely and effectively."
    },
    {
        id: "nature",
        topic: "Nature",
        format: "Lesson",
        title: "Make room for the wild",
        description: "Why biodiversity matters, from a window box to a whole ecosystem.",
        minutes: 5,
        art: "landscape.svg",
        source: "https://www.cbd.int/biodiversity",
        sourceName: "Convention on Biological Diversity",
        paragraphs: [
            "Biodiversity includes diversity within species, between species, and across ecosystems. It is not simply a count of the animals we find most beautiful. Fungi, soil organisms, insects, and plants all play roles.",
            "Ecosystems support food production, clean water, pollination, and human wellbeing. Habitat loss, pollution, invasive species, overexploitation, and climate change can interact to put pressure on them.",
            "Small spaces can support life, but place matters. Ask a local conservation group which plants are native and appropriate for your conditions. Avoid releasing non-native plants or animals into the wild.",
            "Try this: spend ten minutes observing one outdoor space. Record the kinds of living things you notice without disturbing them. Repeat on another day and compare your observations."
        ],
        question: "What does biodiversity include?",
        answers: ["Only endangered mammals", "Genetic, species, and ecosystem diversity", "Only the number of trees in a forest"],
        correct: 1,
        explanation: "Biodiversity spans variation within species, among species, and between ecosystems."
    },
    {
        id: "water",
        topic: "Nature",
        format: "Toolkit",
        title: "Every drop has a story",
        description: "Follow water through your home and discover where care counts.",
        minutes: 4,
        art: "landscape.svg",
        source: "https://www.epa.gov/watersense/start-saving",
        sourceName: "US EPA WaterSense",
        paragraphs: [
            "Fresh water is shared by people, agriculture, industry, and ecosystems. Local rainfall, infrastructure, and water management all affect its availability. A global average cannot tell you the condition of your watershed.",
            "Find out where your tap water comes from. Your supplier may publish a water quality report and seasonal conservation advice. Follow local restrictions during drought and never compromise safe hygiene.",
            "A dripping tap or running toilet can waste water without being obvious. Check for leaks, use full loads where practical, and choose water-efficient fixtures when existing ones need replacement.",
            "Try this: record a meter reading when no water is being used, then check it later. If the reading changes unexpectedly, investigate safely or contact a qualified professional."
        ],
        checklist: ["Find the name of your local watershed.", "Read your supplier’s conservation advice.", "Check visible taps and toilets for leaks.", "Run full laundry loads where practical.", "Keep a short record of changes you make."],
        question: "Why should water-saving advice consider location?",
        answers: ["Water availability and infrastructure differ", "Every watershed has identical rainfall", "Local restrictions never change"],
        correct: 0,
        explanation: "Local conditions, seasons, and infrastructure influence which actions are useful."
    },
    {
        id: "home",
        topic: "Energy",
        format: "Toolkit",
        title: "A home that uses a little less",
        description: "A room-by-room starting point for everyday energy awareness.",
        minutes: 6,
        art: "energy.svg",
        source: "https://www.energy.gov/energysaver/energy-saver",
        sourceName: "US Department of Energy — Energy Saver",
        paragraphs: [
            "Home energy use depends on climate, building design, equipment, and household needs. Start with understanding your bills and comfort requirements rather than assuming every household should use the same amount.",
            "Heating and cooling often offer important opportunities. Reduce unwanted drafts safely, keep vents clear, and use appropriate shading. Never block required ventilation or use unsafe heating equipment.",
            "Turn off unneeded lights and compare the energy labels of appliances when replacement is necessary. Renters can ask property managers about insulation and maintenance without making unauthorized structural changes.",
            "Try this: select one low-cost change, note the date, and compare energy use over time. Weather and occupancy can change consumption, so a lower bill alone does not prove which action caused it."
        ],
        checklist: ["Read a recent energy bill and note the units.", "Check for drafts without blocking required ventilation.", "Keep heating and cooling equipment maintained.", "Switch off lights in unused rooms.", "Compare future use while considering weather and occupancy."],
        question: "Does a lower energy bill prove a particular change saved energy?",
        answers: ["Always", "No: prices, weather, and occupancy can also change", "Only if the bill is printed"],
        correct: 1,
        explanation: "Separate energy use from price, and consider weather and occupancy before drawing conclusions."
    }
];

const storage = {
    load(key)
    {
        try
        {
            const value = JSON.parse(localStorage.getItem(`rooted-${key}`) || "[]");
            return new Set(Array.isArray(value) ? value.filter((id) => resources.some((r) => r.id === id)) : []);
        }
        catch
        {
            return new Set();
        }
    },
    save(key, value)
    {
        try
        {
            localStorage.setItem(`rooted-${key}`, JSON.stringify([...value]));
            return true;
        }
        catch
        {
            notify("Storage is unavailable. Changes last only for this visit.");
            return false;
        }
    }
};
const saved = storage.load("saved");
const completed = storage.load("completed");
let topic = "All";
let savedOnly = false;
let toastTimer;
const grid = document.getElementById("resource-grid");
const reader = document.getElementById("reader");

function notify(message)
{
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
}

function render()
{
    const query = document.getElementById("resource-search").value.trim().toLowerCase();
    const format = document.getElementById("format").value;
    const visible = resources.filter((resource) =>
        (topic === "All" || resource.topic === topic) &&
        (format === "All" || resource.format === format) &&
        (!savedOnly || saved.has(resource.id)) &&
        `${resource.title} ${resource.description} ${resource.topic} ${resource.paragraphs.join(" ")}`.toLowerCase().includes(query));
    grid.innerHTML = visible.map((resource) => `
        <article class="resource-card">
            <button class="resource-art art-${resource.id}" data-open-resource="${resource.id}" aria-label="Read ${resource.title}"><img src="${resource.art}" width="600" height="340" alt="" loading="lazy"></button>
            <div class="resource-meta"><span>${resource.topic} · ${resource.format}</span><button class="save-button" data-save="${resource.id}" aria-label="${saved.has(resource.id) ? "Unsave" : "Save"} ${resource.title}" aria-pressed="${saved.has(resource.id)}">${bookmarkIcon}</button></div>
            <h3><button data-open-resource="${resource.id}">${resource.title}</button></h3>
            <p>${resource.description}</p>
            <div class="resource-bottom"><span>${completed.has(resource.id) ? "✓ Knowledge check complete" : `${resource.minutes} min read · Original learning note`}</span><button data-open-resource="${resource.id}">Explore ↗</button></div>
        </article>`).join("");
    document.getElementById("result-count").textContent = `${visible.length} ${visible.length === 1 ? "resource" : "resources"} to explore`;
    document.getElementById("saved-count").textContent = saved.size;
    document.getElementById("empty").hidden = visible.length > 0;
    document.querySelectorAll("[data-filter]").forEach((button) =>
    {
        const selected = button.dataset.filter === topic;
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", selected);
    });
}

function chooseTopic(value)
{
    topic = value;
    savedOnly = false;
    document.querySelector(".saved-filter").setAttribute("aria-pressed", "false");
    document.getElementById("resource-search").value = "";
    document.getElementById("format").value = "All";
    render();
}

function download(name, text, type = "text/plain;charset=utf-8")
{
    const url = URL.createObjectURL(new Blob([text], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function openResource(id)
{
    const resource = resources.find((item) => item.id === id);
    if (!resource) return;
    document.getElementById("reader-content").innerHTML = `
        <p class="eyebrow">${resource.topic.toUpperCase()} / ${resource.format.toUpperCase()} / ${resource.minutes} MIN READ</p>
        <h2 id="reader-title">${resource.title}</h2><p>${resource.description}</p>
        <div class="reader-body">${resource.paragraphs.map((text) => `<p>${text}</p>`).join("")}</div>
        ${resource.checklist ? `<h3>Your small-step checklist</h3><ul>${resource.checklist.map((text) => `<li>${text}</li>`).join("")}</ul>` : ""}
        <form class="quiz" id="quiz-form"><fieldset><legend>Knowledge check: ${resource.question}</legend>${resource.answers.map((answer, index) => `<label><input type="radio" name="answer" value="${index}" required> ${answer}</label>`).join("")}</fieldset><button class="button small" type="submit">Check my understanding</button><p class="quiz-feedback" id="quiz-feedback" role="status">${completed.has(id) ? "You have completed this knowledge check on this device." : ""}</p></form>
        <p class="reader-source">Go deeper: <a href="${resource.source}" target="_blank" rel="noopener">${resource.sourceName} ↗</a><br>Original introductory note; not a quotation or a comprehensive scientific review.</p>
        <div class="reader-actions">${resource.checklist ? '<button class="button small" id="download-toolkit">Download checklist ↓</button>' : ""}<button class="button small" id="share-resource">Copy resource link ↗</button></div>`;
    document.getElementById("quiz-form").addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const answer = Number(new FormData(event.currentTarget).get("answer"));
        const correct = answer === resource.correct;
        document.getElementById("quiz-feedback").textContent = `${correct ? "Well understood! " : "Not quite. Try again. "}${resource.explanation}`;
        if (correct)
        {
            completed.add(id);
            storage.save("completed", completed);
            render();
        }
    });
    document.getElementById("download-toolkit")?.addEventListener("click", () =>
    {
        download(`rooted-${id}-checklist.txt`, `ROOTED — ${resource.title}\n\n${resource.checklist.map((text) => `[ ] ${text}`).join("\n")}\n\nLearn more: ${resource.source}\nOriginal educational checklist. Adapt to local conditions.\n`);
        notify("Your checklist is ready to keep.");
    });
    document.getElementById("share-resource").addEventListener("click", async () =>
    {
        const url = new URL(location.href);
        url.hash = `resource-${id}`;
        try
        {
            await navigator.clipboard.writeText(url.href);
            notify("Resource link copied.");
        }
        catch
        {
            const field = document.createElement("input");
            field.value = url.href;
            field.setAttribute("aria-label", "Resource link — select and copy");
            document.querySelector(".reader-actions").append(field);
            field.select();
            notify("Select and copy the resource link.");
        }
    });
    if (!reader.open) reader.showModal();
    reader.scrollTop = 0;
}

const bookmarkIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
document.addEventListener("click", (event) =>
{
    const target = event.target.closest("button, a");
    if (!target) return;
    if (target.dataset.openResource) openResource(target.dataset.openResource);
    if (target.dataset.save)
    {
        const id = target.dataset.save;
        saved.has(id) ? saved.delete(id) : saved.add(id);
        const persisted = storage.save("saved", saved);
        render();
        grid.querySelector(`[data-save="${id}"]`)?.focus({ preventScroll: true });
        if (persisted) notify(saved.has(id) ? "Saved to your reading list on this device." : "Removed from your reading list.");
    }
    if (target.dataset.filter) chooseTopic(target.dataset.filter);
    if (target.dataset.topicLink) chooseTopic(target.dataset.topicLink);
    if (target.hasAttribute("data-onboard")) document.getElementById("onboarding").showModal();
    if (target.dataset.path)
    {
        chooseTopic(target.dataset.path);
        document.getElementById("onboarding").close();
        document.getElementById("library").scrollIntoView();
        document.querySelector(`[data-filter="${topic}"]`).focus({ preventScroll: true });
    }
    if (target.classList.contains("dialog-close")) target.closest("dialog").close();
});
document.getElementById("resource-search").addEventListener("input", render);
document.getElementById("format").addEventListener("change", render);
document.querySelector(".saved-filter").addEventListener("click", (event) =>
{
    savedOnly = !savedOnly;
    event.currentTarget.setAttribute("aria-pressed", savedOnly);
    render();
});
document.querySelector(".menu-toggle").addEventListener("click", (event) =>
{
    const open = event.currentTarget.getAttribute("aria-expanded") !== "true";
    event.currentTarget.setAttribute("aria-expanded", open);
    event.currentTarget.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    document.getElementById("navigation").classList.toggle("open", open);
});
document.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.getElementById("navigation").classList.remove("open");
    document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
    document.querySelector(".menu-toggle").setAttribute("aria-label", "Open navigation");
}));
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && document.getElementById("navigation").classList.contains("open"))
    {
        document.getElementById("navigation").classList.remove("open");
        const button = document.querySelector(".menu-toggle");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Open navigation");
        button.focus();
    }
});

function updateImpact()
{
    const distance = Number(document.getElementById("distance").value);
    const days = Number(document.getElementById("days").value);
    const factor = Number(document.getElementById("travel-mode").value);
    document.getElementById("distance-label").textContent = `${distance} km`;
    document.getElementById("impact-value").textContent = (distance * days * (0.20 - factor)).toFixed(1);
}
document.getElementById("impact-form").addEventListener("submit", (event) => event.preventDefault());
document.getElementById("impact-form").addEventListener("input", updateImpact);
const places = {
    garden: ["A community garden, imagined", "Shared plots can connect neighbors and support local growing. Ask your municipality or a local garden network about real spaces, access, and volunteer arrangements."],
    recycling: ["A recycling hub, imagined", "Collection sites handle different materials. Use your municipality’s official directory to check accepted items, opening hours, and safe battery disposal."],
    habitat: ["A habitat project, imagined", "Habitat restoration needs local ecological knowledge. Look for an established conservation group and ask about native planting and volunteer training."]
};
document.querySelectorAll("[data-place]").forEach((button) => button.addEventListener("click", () =>
{
    const [title, description] = places[button.dataset.place];
    document.getElementById("place-title").textContent = title;
    const copy = document.getElementById("place-copy");
    copy.textContent = description;
    copy.setAttribute("role", "status");
}));
document.getElementById("calendar-download").addEventListener("click", () =>
{
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = `${tomorrow.getFullYear()}${String(tomorrow.getMonth() + 1).padStart(2, "0")}${String(tomorrow.getDate()).padStart(2, "0")}`;
    download("rooted-nature-walk.ics", ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Rooted//Learning reminder//EN", "BEGIN:VEVENT", `UID:rooted-walk-${date}@example.invalid`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`, `DTSTART;VALUE=DATE:${date}`, "SUMMARY:Take a ten-minute nature observation walk", "DESCRIPTION:A personal learning reminder from Rooted. Not an organized event. Observe without disturbing plants or wildlife.", "END:VEVENT", "END:VCALENDAR"].join("\r\n"), "text/calendar;charset=utf-8");
    notify("Downloaded a personal reminder for tomorrow — not an organized event.");
});
function openHash()
{
    if (location.hash.startsWith("#resource-")) openResource(location.hash.slice(10));
}
window.addEventListener("hashchange", openHash);
render();
updateImpact();
openHash();
