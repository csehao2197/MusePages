const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("open", expanded);
});
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () =>
{
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
}));
const frame = document.querySelector(".product-frame");
window.addEventListener("scroll", () => frame.classList.toggle("flat", scrollY > 200), { passive: true });
const dialog = document.querySelector("dialog");
const body = document.querySelector("#modal-body");
document.querySelector(".close").addEventListener("click", () => dialog.close());
function show(title, label)
{
    document.querySelector("#modal-title").textContent = title;
    document.querySelector("#modal-label").textContent = label;
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    if (!dialog.open) dialog.showModal();
}
const tour = [
    { title: "Read a cohort, not a hunch.", text: "January starts at 100%. Month 1 retains 96%; month 3 retains 90%. Blank future cells mean the cohort has not reached that age, not that retention is zero." },
    { title: "Signals start a conversation.", text: "Juniper Labs has a fictional risk score of 84. A high score is a review prompt, not proof a customer will leave. No customer data or predictive model runs on this page." },
    { title: "Share context, not noise.", text: "The sample Monday digest combines MRR, retention, new business, expansion and churn. It is an email layout preview; no message is sent. Your guided preview is complete." }
];
let step = 0;
function renderTour()
{
    const item = tour[step];
    body.innerHTML = '<p id="tour-copy"></p><p class="fine">Local guided tour. No calendar event or demo meeting is booked.</p><div class="tour-actions"><button class="outline" id="previous">← Previous</button><button class="primary" id="next"></button></div>';
    body.querySelector("#tour-copy").textContent = item.text;
    body.querySelector("#previous").disabled = step === 0;
    body.querySelector("#next").textContent = step === 2 ? "Finish tour ✓" : "Next →";
    body.querySelector("#previous").addEventListener("click", () =>
    {
        step--;
        renderTour();
    });
    body.querySelector("#next").addEventListener("click", () =>
    {
        if (step === 2) dialog.close();
        else
        {
            step++;
            renderTour();
        }
    });
    show(item.title, `GUIDED PREVIEW / ${step + 1} OF 3`);
}
document.querySelector("#tour").addEventListener("click", () =>
{
    step = 0;
    renderTour();
});
document.querySelectorAll("[data-tour-step]").forEach((button) => button.addEventListener("click", () =>
{
    step = Number(button.dataset.tourStep);
    renderTour();
}));
document.querySelectorAll("[data-start]").forEach((button) => button.addEventListener("click", () =>
{
    body.innerHTML = '<p>Explore a setup checklist, without creating an account or connecting billing.</p><form id="plan"><label>Billing provider<select name="provider" required><option value="">Choose provider</option><option>Stripe</option><option>Paddle</option><option>Chargebee</option></select></label><label><input type="checkbox" name="ack" required> I understand this is a local product preview.</label><button class="primary">Show setup checklist ↗</button><p id="plan-status" role="status"></p></form>';
    show(`${button.dataset.start}: a clearer next step.`, "PLAN PREVIEW / NO AUTHENTICATION");
    document.querySelector("#plan").addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const provider = event.target.elements.provider.value;
        document.querySelector("#plan-status").textContent = provider === "Chargebee" ? "Chargebee is a beta concept. No connection is available in this demo. You can still explore sample cohort metrics." : `${provider} concept checklist: review read-only permissions; backfill history; invite teammates. No connection, workspace or free trial has been created.`;
    });
}));
const info = {
    "Release 2.4": "Concept release note: cohort retention is included across the proposed plans. No real release or service availability is verified.",
    "Documentation": "Read the sample cohort across each row. MRR is monthly recurring revenue; NRR includes expansion, contraction and churn. Use the guided preview and sample CSV to explore.",
    "Changelog": "Concept timeline: 2.4 cohort tables; 2.3 Monday summary; 2.2 churn review list. These are illustrative product milestones.",
    "Log in": "This static preview provides no authentication. No credentials are requested or accepted.",
    "Security": "SOC 2 Type II, SSO and read-only access appear in the product brief. This demo has no verified certification or security service and requests no API keys.",
    "Careers": "Pace is a fictional product concept. No real job openings or application collection are offered.",
    "Privacy": "This page sets no cookies, saves no user data and sends no form submissions. Selections remain in page memory until reload.",
    "Terms": "Illustrative product preview, not a subscription agreement. Pricing, metrics and performance claims are not service commitments.",
    "Status": "The local demo loaded successfully. This indicator is not monitoring a production service or reporting real uptime."
};
document.querySelectorAll("[data-info]").forEach((button) => button.addEventListener("click", () =>
{
    body.textContent = info[button.dataset.info];
    show(button.dataset.info, "PRODUCT CONCEPT / INFORMATION");
}));
document.querySelector("#download").addEventListener("click", () =>
{
    const blob = new Blob(["metric,value,scope\nMRR,84290,fictional sample\nNRR_percent,112,fictional sample\nnew_business,6800,fictional sample\nexpansion,2120,fictional sample\nchurn,3700,fictional sample\n"], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pace-sample-metrics.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    document.querySelector("#download-status").textContent = "Sample CSV prepared. All figures are fictional.";
});
