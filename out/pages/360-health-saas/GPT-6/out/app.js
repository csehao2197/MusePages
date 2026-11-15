const views = ["Overview", "Biomarkers", "Sleep", "Activity", "AI Insights", "Reports", "Settings"];
const hrv = [51, 56, 49, 61, 58, 60, 55, 63, 59, 65, 62, 67, 64, 68];
const sleep = [6.8, 7.1, 6.4, 7.3, 7.2, 6.9, 7.4, 7.5, 6.8, 7.6, 7.2, 7.8, 7.3, 7.4];
const activity = [5800, 6200, 4300, 7100, 6800, 8300, 5200, 7400, 6700, 8200, 7600, 9100, 7800, 8400];
const markers = [["Ferritin", 52, 44, 34, "ng/mL"], ["Vitamin D", 28, 31, 33, "ng/mL"], ["Glucose", 92, 94, 90, "mg/dL"]];
let currentView = "Overview";
let range = 14;
let compact = false;
let anonymous = false;
const connections = new Set();
function download(filename, type, content)
{
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function exportCsv()
{
    const rows = ["SYNTHETIC DEMO DATA - NOT A CLINICAL REPORT", "sample_day,hrv_ms,sleep_hours,activity_steps", ...hrv.map((value, i) => `2026-09-${String(i + 1).padStart(2, "0")},${value},${sleep[i]},${activity[i]}`)];
    download("meridian-synthetic-sample.csv", "text/csv", rows.join("\n"));
}
function exportJson()
{
    download("meridian-synthetic-sample.json", "application/json", JSON.stringify({ synthetic: true, medicalAdvice: false, dates: "2026-09-01 through 2026-09-14", hrv_ms: hrv, sleep_hours: sleep, activity_steps: activity, biomarkers: markers }, null, 2));
}
document.querySelector("#export").addEventListener("click", exportCsv);
document.querySelector("#footer-export").addEventListener("click", exportJson);
document.querySelector("#dashboard-nav").innerHTML = views.map((view) => `<button data-tab="${view}" aria-pressed="${view === currentView}">${view}</button>`).join("");
function chartMarkup(kind)
{
    const data = kind === "Sleep" ? sleep : kind === "Activity" ? activity : hrv;
    const unit = kind === "Sleep" ? "hours" : kind === "Activity" ? "steps" : "ms";
    const values = data.slice(-range);
    const max = Math.max(...values) * 1.12;
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    return `<div class="trend-card"><div class="trend-heading"><p class="mono">${kind === "Overview" ? "HRV" : kind} / ${range}-day synthetic series</p><label>Window<select id="chart-range"><option value="14" ${range === 14 ? "selected" : ""}>14 days</option><option value="7" ${range === 7 ? "selected" : ""}>7 days</option></select></label></div><div class="chart">${values.map((value, i) => `<button class="chart-bar ${i === values.length - 1 ? "active" : ""}" data-index="${i + data.length - range}" style="height:${value / max * 100}%" aria-label="September ${i + data.length - range + 1}: ${value} ${unit}"></button>`).join("")}</div><div class="chart-axis"><span>SEP ${15 - range}</span><span>SEP 14 / 2026</span></div><p class="chart-reading" id="chart-reading" role="status">Sample average: ${average.toFixed(kind === "Activity" ? 0 : 1)} ${unit} across ${range} days. No health interpretation.</p></div>`;
}
function wireChart(kind)
{
    document.querySelector("#chart-range").addEventListener("change", (event) =>
    {
        range = Number(event.target.value);
        renderView(currentView);
    });
    const data = kind === "Sleep" ? sleep : kind === "Activity" ? activity : hrv;
    const unit = kind === "Sleep" ? "hours" : kind === "Activity" ? "steps" : "ms";
    document.querySelectorAll(".chart-bar").forEach((button) =>
    {
        const reveal = () =>
        {
            document.querySelectorAll(".chart-bar").forEach((bar) => bar.classList.toggle("active", bar === button));
            const index = Number(button.dataset.index);
            document.querySelector("#chart-reading").textContent = `September ${index + 1}: ${data[index]} ${unit}. Synthetic sample only.`;
        };
        ["mouseenter", "focus", "click"].forEach((event) => button.addEventListener(event, reveal));
    });
}
function renderMarkers(query = "")
{
    const matches = markers.filter((marker) => marker[0].toLowerCase().includes(query.trim().toLowerCase()));
    document.querySelector("#marker-rows").innerHTML = matches.map(([name, march, june, september, unit]) => `<tr><td>${name}</td><td>${march}</td><td>${june}</td><td>${september}</td><td>${unit}</td></tr>`).join("");
    document.querySelector("#marker-empty").hidden = matches.length > 0;
    document.querySelector("#marker-count").textContent = `${matches.length} synthetic biomarkers. No clinical reference range or interpretation.`;
}
function renderView(view)
{
    currentView = view;
    document.querySelectorAll("[data-tab]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.tab === view)));
    document.querySelector("#view-title").textContent = view === "Overview" ? "Health overview" : view;
    const content = document.querySelector("#view-content");
    const pulse = compact ? "" : `<div class="insight-card"><h3>Illustrative pattern note / Not an AI assessment</h3><p>The synthetic ferritin values differ across three dates. Their cause, clinical relevance and appropriate next steps cannot be inferred here.</p><button class="text-link" id="open-pattern">Read the context & limitations ↗</button></div>`;
    if (["Overview", "Sleep", "Activity"].includes(view))
    {
        content.innerHTML = chartMarkup(view) + (view === "Overview" ? pulse : `<p class="workspace-note">These device-style measurements are synthetic estimates. They do not establish sleep quality, fitness, recovery or a diagnosis.</p>`);
        wireChart(view);
        document.querySelector("#open-pattern")?.addEventListener("click", () => openInfo("method"));
    }
    if (view === "Biomarkers")
    {
        content.innerHTML = `<label>Find a sample biomarker<input id="marker-search" type="search" placeholder="Try ferritin"></label><table class="data-table"><thead><tr><th>Marker</th><th>Mar 1</th><th>Jun 1</th><th>Sep 1</th><th>Unit</th></tr></thead><tbody id="marker-rows"></tbody></table><p id="marker-empty" class="workspace-note" hidden>No sample biomarker matches.</p><p id="marker-count" class="workspace-note" role="status"></p><p class="workspace-note">All dates are 2026. Units are explicit, but no real lab, patient, normal range or clinical result is represented. Real report upload is intentionally unavailable.</p>`;
        renderMarkers();
        document.querySelector("#marker-search").addEventListener("input", (event) => renderMarkers(event.target.value));
    }
    if (view === "AI Insights")
    {
        content.innerHTML = `<ul class="workspace-list"><li><strong>Different samples, incomplete context</strong>Ferritin: 52, 44 and 34 ng/mL in synthetic samples. No symptoms, collection conditions or history are available. No diagnosis or supplement recommendation follows.</li><li><strong>A small observation window</strong>Fourteen synthetic HRV readings do not establish a personal baseline or predictive relationship with sleep.</li><li><strong>No model is running</strong>All notes are authored examples. Confidence scores and scientific citations have not been fabricated.</li></ul><button class="text-link" id="insight-method">How to read this demo ↗</button>`;
        document.querySelector("#insight-method").addEventListener("click", () => openInfo("method"));
    }
    if (view === "Reports")
    {
        content.innerHTML = `<h3>Take the sample with you.</h3><p class="workspace-note">Fourteen days of synthetic HRV, sleep and activity values. CSV and JSON are marked demo data and are not clinical reports. No PDF, provider link or real patient record is created.</p><div class="workspace-actions"><button class="button" id="report-csv">Download sample CSV</button><button class="ghost" id="report-json">Download sample JSON</button></div><p class="workspace-note">Current sample connections: ${connections.size}. They are local UI states and include no provider data.</p>`;
        document.querySelector("#report-csv").addEventListener("click", exportCsv);
        document.querySelector("#report-json").addEventListener("click", exportJson);
    }
    if (view === "Settings")
    {
        content.innerHTML = `<form id="settings-form"><label><input id="anonymous" type="checkbox" ${anonymous ? "checked" : ""}> Replace fictional member name with “Sample member”</label><label><input id="compact" type="checkbox" ${compact ? "checked" : ""}> Hide the illustrative pattern note on Overview</label><button class="ghost" id="reset-demo" type="button">Reset sample settings & connections</button><p id="settings-result" role="status">Settings are memory-only and reset on reload.</p></form>`;
        document.querySelector("#anonymous").addEventListener("change", (event) =>
        {
            anonymous = event.target.checked;
            document.querySelector("#sample-name").innerHTML = `${anonymous ? "Sample member" : "Alex R."}<small>Fictional member</small>`;
            document.querySelector("#settings-result").textContent = "Sample display name updated in memory only.";
        });
        document.querySelector("#compact").addEventListener("change", (event) =>
        {
            compact = event.target.checked;
            document.querySelector("#settings-result").textContent = "Overview note preference updated in memory only.";
        });
        document.querySelector("#reset-demo").addEventListener("click", () =>
        {
            anonymous = false;
            compact = false;
            range = 14;
            connections.clear();
            document.querySelector("#sample-name").innerHTML = "Alex R.<small>Fictional member</small>";
            renderIntegrations();
            renderView("Settings");
            document.querySelector("#settings-result").textContent = "Sample settings and simulated connections reset.";
        });
        document.querySelector("#settings-form").addEventListener("submit", (event) => event.preventDefault());
    }
}
document.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => renderView(button.dataset.tab)));
document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () =>
{
    renderView(button.dataset.view);
    document.querySelector("#dashboard").scrollIntoView();
}));
const sources = [["Apple Health", "Wearable"], ["WHOOP", "Wearable"], ["Oura Ring", "Wearable"], ["Garmin", "Wearable"], ["Fitbit", "Wearable"], ["Withings", "Wearable"], ["LabCorp", "Lab"], ["Quest Diagnostics", "Lab"]];
let kind = "all";
function renderIntegrations()
{
    const query = document.querySelector("#integration-search").value.trim().toLowerCase();
    const list = sources.filter(([name, type]) => (kind === "all" || kind === type) && name.toLowerCase().includes(query));
    document.querySelector("#integration-grid").innerHTML = list.map(([name, type]) => `<article class="integration ${connections.has(name) ? "connected" : ""}"><span class="mono">${type} / Sample</span><h3>${name}</h3><button data-connect="${name}" aria-pressed="${connections.has(name)}">${connections.has(name) ? "Disconnect sample" : "Simulate connection"} ↗</button></article>`).join("");
    document.querySelector("#integration-empty").hidden = list.length > 0;
    document.querySelector("#integration-count").textContent = `${list.length} sources shown · ${connections.size} simulated connections · No provider data accessed.`;
    document.querySelectorAll("[data-kind]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.kind === kind)));
    document.querySelectorAll("[data-connect]").forEach((button) => button.addEventListener("click", () =>
    {
        const name = button.dataset.connect;
        connections.has(name) ? connections.delete(name) : connections.add(name);
        renderIntegrations();
    }));
}
document.querySelectorAll("[data-kind]").forEach((button) => button.addEventListener("click", () =>
{
    kind = button.dataset.kind;
    renderIntegrations();
}));
document.querySelector("#integration-search").addEventListener("input", renderIntegrations);
document.querySelector("#reset-integrations").addEventListener("click", () =>
{
    kind = "all";
    document.querySelector("#integration-search").value = "";
    renderIntegrations();
});
renderIntegrations();
renderView("Overview");
const plans =
{
    Starter: [0, ["Up to 3 test uploads / year", "Apple Health sync concept", "Basic trend tracking", "5 AI-style insights / month", "Sample report export"]],
    Core: [19, ["Unlimited upload concept", "All wearable connection concepts", "Full insight interface", "Correlation exploration", "Clinician-share report concept", "Priority support concept"]],
    Pro: [49, ["Everything in Core", "API access concept", "Family profile concept", "Raw CSV / JSON export", "Monthly analyst call concept"]]
};
let plan = "Starter";
function openPlan(name)
{
    plan = name;
    const price = plans[name][0];
    document.querySelector("#plan-selection").textContent = `${name}: ${price ? `$${price}/month equivalent, billed $${price * 12}/year in this illustrative concept.` : "Free product tier concept."} Plan features describe a future product, not services delivered by this page.`;
    document.querySelector("#signup-result").textContent = "No account, email, trial or charge is created.";
    document.querySelector("#signup-dialog").showModal();
}
function renderPricing()
{
    const annual = document.querySelector("#billing").value === "annual";
    document.querySelector("#price-grid").innerHTML = Object.entries(plans).map(([name, [price, benefits]]) => `<article class="price-card ${name === "Core" ? "featured" : ""}">${name === "Core" ? '<span class="popular">Most popular / Concept</span>' : ""}<h3>${name}</h3><p class="price-value">$${price * (annual ? 12 : 1)}<small>/${annual ? "year" : "month"}</small></p><p class="annual-note">${price ? `$${price * 12}/year billed annually · illustrative` : "Free tier concept · no billing"}</p><ul>${benefits.map((benefit) => `<li>${benefit}</li>`).join("")}</ul><button class="button" data-plan="${name}">${name === "Starter" ? "Explore free tier" : "Preview 14-day trial"} ↗</button></article>`).join("");
    document.querySelectorAll("#price-grid [data-plan]").forEach((button) => button.addEventListener("click", () => openPlan(button.dataset.plan)));
}
document.querySelector("#billing").addEventListener("change", renderPricing);
renderPricing();
document.querySelectorAll("[data-plan]:not(#price-grid [data-plan])").forEach((button) => button.addEventListener("click", () => openPlan(button.dataset.plan)));
document.querySelector("#signup").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const form = event.currentTarget;
    const result = document.querySelector("#signup-result");
    if (form.elements.name.value.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.elements.email.value.trim()))
    {
        result.textContent = "Enter a name and a valid email address for this local preview.";
        return;
    }
    if (!form.elements.understand.checked)
    {
        result.textContent = "Confirm that this creates no account or health service.";
        return;
    }
    result.textContent = `${plan} preview ready for ${form.elements.name.value.trim()}. No account opened, trial started, email sent or payment taken. Nothing stored.`;
});
const info =
{
    method: ["Context before conclusions.", "Every value here is synthetic and authored for UI demonstration. The ferritin sequence is not a diagnosis, the wearable series is not a medical baseline, and correlation does not establish causation. No AI model, clinical validation study, confidence score or scientific source is represented as verified. Discuss real symptoms and test results with a qualified clinician; this interface gives no medication, supplement or retesting advice."],
    security: ["No compliance claim.", "This static page accepts no health files, uses no provider credentials and sends no personal data. It is not a HIPAA-compliant healthcare service or SOC 2-certified organization. Real health-data processing would need independent security, privacy, regulatory and clinical review."],
    privacy: ["Memory, not a medical record.", "Forms, settings and simulated connections are held only in this page's memory and reset on reload. No analytics, cookies or local storage are used. Downloads are explicitly requested synthetic files under your control."],
    terms: ["A product concept, not care.", "Prices and plan features are illustrative. No healthcare service, diagnostic outcome, trial, subscription, API, analyst, lab connection or treatment is provided. No medical or compliance credential is claimed."],
    blog: ["Journal / Reading a trend responsibly", "Start with units and dates. Ask whether sources are comparable. Notice missing information and the size of the observation window. A line going up or down is not, on its own, a diagnosis or explanation. This short product-design note is not medical advice."],
    about: ["A clearer interface.", "Meridian is a fictional preventive-health product concept. Its working frontend explores how multiple sources could be presented with explicit limits. There is no operating health company or real member population behind this showcase."],
    careers: ["Press & careers", "No live vacancies, press endorsements or professional credentials are represented. The page is an independent fictional product-design study with original coded charts."],
    changelog: ["Concept release / Interface preview", "This local version includes seven workspace views, synthetic CSV/JSON downloads, comparison windows, simulated integration states, plan previews and honest data-handling notes. No production service has launched."],
    signin: ["A sample, not a sign-in.", "There is no authentication backend and no password is requested. Open the fictional workspace to explore synthetic records; no real member account or health data is accessible."]
};
function openInfo(key)
{
    document.querySelector("#info-title").textContent = info[key][0];
    document.querySelector("#info-copy").textContent = info[key][1];
    document.querySelector("#info-dialog").showModal();
}
document.querySelectorAll("[data-info]").forEach((button) => button.addEventListener("click", () => openInfo(button.dataset.info)));
document.querySelector("#sign-in").addEventListener("click", () => openInfo("signin"));
document.querySelector("#info-workspace").addEventListener("click", () =>
{
    document.querySelector("#info-dialog").close();
    renderView("Overview");
    document.querySelector("#dashboard").scrollIntoView();
});
const demoSteps = [["One view, three sample streams.", "The overview places synthetic HRV, sleep and ferritin values together. The labels make clear that no real person or clinical assessment is represented."], ["Follow the history.", "The Biomarkers view shows three synthetic dates with explicit units. Search markers, compare sample values and notice that no normal ranges or diagnoses are implied."], ["Try connections without permissions.", "The integration catalog simulates local UI states. No API, login, lab file or wearable permission is used."], ["Take the limits with you.", "Reports download synthetic CSV/JSON. Scripted notes explain missing context. Explore the workspace, and keep real medical questions with a qualified clinician."]];
let demoStep = 0;
function renderDemo()
{
    document.querySelector("#demo-step").textContent = `Step ${demoStep + 1} of 4`;
    document.querySelector("#demo-title").textContent = demoSteps[demoStep][0];
    document.querySelector("#demo-copy").textContent = demoSteps[demoStep][1];
    document.querySelector("#demo-back").disabled = demoStep === 0;
    document.querySelector("#demo-next").textContent = demoStep === 3 ? "Open sample workspace ↗" : "Next ↗";
    document.querySelector(".demo-progress span").style.width = `${(demoStep + 1) * 25}%`;
}
function startDemo()
{
    demoStep = 0;
    renderDemo();
    document.querySelector("#demo-dialog").showModal();
}
document.querySelector("#watch-demo").addEventListener("click", startDemo);
document.querySelector("#bottom-demo").addEventListener("click", startDemo);
document.querySelector("#demo-back").addEventListener("click", () =>
{
    demoStep = Math.max(0, demoStep - 1);
    renderDemo();
});
document.querySelector("#demo-next").addEventListener("click", () =>
{
    if (demoStep === 3)
    {
        document.querySelector("#demo-dialog").close();
        renderView("Biomarkers");
        document.querySelector("#dashboard").scrollIntoView();
        return;
    }
    demoStep++;
    renderDemo();
});
document.querySelectorAll(".close").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
const menu = document.querySelector("#mobile-menu");
const menuButton = document.querySelector("#menu-button");
menuButton.addEventListener("click", () =>
{
    menu.showModal();
    menuButton.setAttribute("aria-expanded", "true");
});
menu.addEventListener("close", () => menuButton.setAttribute("aria-expanded", "false"));
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () =>
{
    menuButton.setAttribute("aria-expanded", "false");
    menu.close();
}));
document.querySelector("#mobile-demo").addEventListener("click", () =>
{
    menuButton.setAttribute("aria-expanded", "false");
    menu.close();
    renderView("Overview");
    document.querySelector("#dashboard").scrollIntoView();
});
