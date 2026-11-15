const services =
{
    voice: ["Brand voice, found.", "A discovery workshop, a practical voice guide and sample copy. A shared language your whole team can use.", 950],
    landing: ["One page. A clear next step.", "Message hierarchy, a full landing-page draft and two revision rounds. Designed around one meaningful action.", 650],
    email: ["An introduction worth opening.", "A five-email welcome or launch sequence, subject lines, preview text and two revision rounds.", 1100]
};
const samples =
[
    ["SAAS / BRAND VOICE", "Less jargon. More human.", "The challenge: replace enterprise jargon with a voice a busy team can actually understand.", "Leverage our end-to-end operational optimisation platform.", "Less chasing updates. More getting things done.", "The shift: from a list of capabilities to a clear, human benefit."],
    ["DTC / EMAIL LAUNCH", "A launch with a little feeling.", "The challenge: introduce a skincare range without manufacturing urgency.", "Our revolutionary skincare collection is now available. Buy today.", "A little less in your routine. A little more in your day.", "The shift: a calm introduction and a reason to care before a reason to click."],
    ["FINTECH / WEBSITE COPY", "Money talk. Minus the headache.", "The challenge: make a financial product feel understandable without oversimplifying decisions.", "Seamlessly deploy capital across diverse investment vehicles.", "Know where your money is. And what it’s doing.", "The shift: direct language and a concrete question. No unsupported return promises."]
];
let active = 0;
function service()
{
    const [title, detail, price] = services[document.querySelector("#service").value];
    document.querySelector("#service-title").textContent = title;
    document.querySelector("#service-detail").textContent = detail;
    document.querySelector("#service-price").textContent = `From £${price.toLocaleString("en-GB")}`;
}
document.querySelector("#service").addEventListener("change", service);
function version(after)
{
    document.querySelector("#before").setAttribute("aria-pressed", String(!after));
    document.querySelector("#after").setAttribute("aria-pressed", String(after));
    document.querySelector("#case-copy").textContent = samples[active][after ? 4 : 3];
}
document.querySelectorAll("[data-case]").forEach((button) => button.addEventListener("click", () =>
{
    active = Number(button.dataset.case);
    document.querySelector("#case-label").textContent = samples[active][0];
    document.querySelector("#case-title").textContent = samples[active][1];
    document.querySelector("#case-challenge").textContent = samples[active][2];
    document.querySelector("#case-reason").textContent = samples[active][5];
    version(true);
    document.querySelector("#case-dialog").showModal();
}));
document.querySelector("#before").addEventListener("click", () => version(false));
document.querySelector("#after").addEventListener("click", () => version(true));
document.querySelector("#close").addEventListener("click", () => document.querySelector("#case-dialog").close());
document.querySelector("#rate-card").addEventListener("click", () =>
{
    const lines = ["MARA COLE - COPYWRITING RATE GUIDE", "Illustrative 2026 starting rates. GBP. Not a binding quote.", "", "Brand voice workshop, guide and samples: from GBP 950", "Landing page copy and two revision rounds: from GBP 650", "Five-email sequence and two revision rounds: from GBP 1100", "", "Scope, taxes and delivery dates are agreed separately.", "This frontend concept takes no bookings or payments.", "Prepared locally in your browser. No personal data included."];
    const stream = `BT /F1 14 Tf 50 780 Td 20 TL ${lines.map((line, index) => `${index ? "T* " : ""}(${line}) Tj`).join("\n")} ET`;
    const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object, index) =>
    {
        offsets.push(pdf.length);
        pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xref = pdf.length;
    pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "mara-cole-rate-guide.pdf";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
});
document.querySelector("#brief-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email");
    const project = document.querySelector("#project").value.trim();
    const date = document.querySelector("#date").value;
    const status = document.querySelector("#status");
    if (name.length < 2 || !email.value || !email.validity.valid)
    {
        status.textContent = "Add your name and a valid email address.";
        return;
    }
    if (project.length < 20)
    {
        status.textContent = "Give your project a little context — at least 20 characters.";
        return;
    }
    if (!date || date <= new Date().toLocaleDateString("en-CA"))
    {
        status.textContent = "Choose a future ideal start date.";
        return;
    }
    const [title, , price] = services[document.querySelector("#service").value];
    status.textContent = `${name}, your local discovery brief: ${title} Starting estimate £${price.toLocaleString("en-GB")}, ideal start ${date}. ${project} Nothing sent or booked; scope and availability need confirmation.`;
});
document.querySelector("#menu").addEventListener("click", (event) =>
{
    event.currentTarget.setAttribute("aria-expanded", String(document.querySelector("#nav").classList.toggle("open")));
});
document.querySelectorAll("#nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#nav").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
}));
service();
