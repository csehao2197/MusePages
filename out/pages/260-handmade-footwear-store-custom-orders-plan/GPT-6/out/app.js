const $ = (id) => document.getElementById(id);
let step = 0;
let paid = 0;
let estimate = 18000;
const fields = ["kind", "product", "reference", "idea", "roses", "colour", "tone", "note", "size", "pairs", "timing", "date", "budget", "name", "phone", "email"];
for (let size = 36; size <= 47; size++)
{
    $("size").add(new Option(`EU ${size} / UK ${size - 33}`, String(size)));
}
function save()
{
    const draft = Object.fromEntries(fields.map((id) => [id, $(id).type === "checkbox" ? $(id).checked : $(id).value]));
    try
    {
        localStorage.setItem("atelier-draft", JSON.stringify(draft));
    }
    catch
    {
        $("error").textContent = "Device storage is unavailable; this draft stays in this session.";
    }
}
function summary()
{
    const kind = $("kind").value;
    const base = $("product").value === "Amara slide" ? 18000 : 22000;
    estimate = (base + ($("roses").checked ? 2000 : 0) + ($("colour").checked ? 1500 : 0)) * Number($("pairs").value);
    return `${kind === "modify" ? $("product").value : kind === "recreate" ? "Reference recreation" : "A new design"}\n${$("roses").checked ? "Roses · " : ""}${$("colour").checked ? $("tone").value + " colour · " : ""}EU ${$("size").value} · ${$("pairs").value} pair(s)\n${kind === "modify" ? "Estimate: ₦" + estimate.toLocaleString("en-NG") : "Maker quote required"}${$("note").value.trim() ? "\nSpecial details: " + $("note").value.trim() : ""}`;
}
function update()
{
    const kind = $("kind").value;
    $("product-field").hidden = kind !== "modify";
    $("reference-field").hidden = kind !== "recreate";
    $("idea-field").hidden = kind !== "new";
    $("budget-field").hidden = kind === "modify";
    $("date-field").hidden = $("timing").value !== "date";
    document.querySelectorAll("[data-step]").forEach((section) => section.hidden = Number(section.dataset.step) !== step);
    $("bar").style.width = `${(step + 1) * 25}%`;
    $("step-label").textContent = `STEP ${step + 1} OF 4`;
    $("back").disabled = step === 0;
    $("next").textContent = step === 3 ? "Send local request ↗" : "Continue →";
    $("review").textContent = summary();
}
function restore()
{
    try
    {
        const draft = JSON.parse(localStorage.getItem("atelier-draft") || "{}");
        fields.forEach((id) =>
        {
            if (draft[id] !== undefined)
            {
                if ($(id).type === "checkbox") $(id).checked = draft[id] === true;
                else $(id).value = String(draft[id]);
            }
        });
    }
    catch
    {
        $("error").textContent = "Saved draft could not be read. You can start fresh.";
    }
}
function open(kind)
{
    if (kind) $("kind").value = kind;
    step = 0;
    update();
    $("wizard").showModal();
}
$("start").addEventListener("click", () => open());
$("resume").addEventListener("click", () => { restore(); open(); });
document.querySelectorAll("[data-path]").forEach((button) => button.addEventListener("click", () => open(button.dataset.path)));
$("close").addEventListener("click", () => $("wizard").close());
$("hub-close").addEventListener("click", () => $("hub").close());
$("design-form").addEventListener("input", () => { save(); update(); });
$("design-form").addEventListener("change", () => { save(); update(); });
$("back").addEventListener("click", () => { step = Math.max(0, step - 1); $("error").textContent = ""; update(); });
$("design-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    let error = "";
    if (step === 0 && $("kind").value === "recreate" && !/^https:\/\/[^ ]+\.[^ ]+/.test($("reference").value.trim())) error = "Add a valid https reference link.";
    if (step === 0 && $("kind").value === "new" && $("idea").value.trim().length < 10) error = "Tell us a little more: at least 10 characters.";
    if (step === 2)
    {
        if (!$("size").value) error = "Choose a size, or ask us in chat.";
        else if (!Number.isInteger(Number($("pairs").value)) || Number($("pairs").value) < 1 || Number($("pairs").value) > 10) error = "Choose 1–10 whole pairs.";
        else if ($("timing").value === "date" && (!$("date").value || $("date").value < new Date().toISOString().slice(0, 10))) error = "Choose today or a future date.";
    }
    if (step === 3 && (!$("name").value.trim() || !/^\+234\d{10}$/.test($("phone").value.trim()) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("email").value.trim()))) error = "Add your name, a +234 phone with 10 following digits, and a valid email.";
    $("error").textContent = error;
    if (error) return;
    if (step < 3)
    {
        step++;
        update();
    }
    else
    {
        $("hub-spec").textContent = summary();
        $("wizard").close();
        paid = 0;
        $("hub-status").textContent = "Received · Waiting for maker review";
        $("pay-status").textContent = "";
        $("quote").hidden = false;
        $("deposit").hidden = true;
        $("balance").hidden = true;
        $("dispatch").disabled = true;
        $("hub").showModal();
    }
});
$("clear").addEventListener("click", () =>
{
    try { localStorage.removeItem("atelier-draft"); } catch {}
    $("design-form").reset();
    step = 0;
    $("error").textContent = "Draft cleared.";
    update();
});
$("quote").addEventListener("click", () =>
{
    $("hub-status").textContent = `Sample quote: ₦${estimate.toLocaleString("en-NG")} · 50% deposit · valid for 7 days`;
    $("deposit").hidden = false;
    $("quote").hidden = true;
});
$("deposit").addEventListener("click", () =>
{
    paid = estimate / 2;
    $("hub-status").textContent = "Being made · Approved specification frozen in this preview";
    $("pay-status").textContent = `Sample deposit recorded: ₦${paid.toLocaleString("en-NG")}. Balance remains due; dispatch locked.`;
    $("deposit").hidden = true;
    $("balance").hidden = false;
});
$("balance").addEventListener("click", () =>
{
    paid = estimate;
    $("pay-status").textContent = "Sample balance settled. Ready for dispatch preview.";
    $("balance").hidden = true;
    $("dispatch").disabled = false;
});
$("dispatch").addEventListener("click", () =>
{
    if (paid === estimate) $("hub-status").textContent = "On the way · Local preview only. Nothing was shipped.";
});
$("chat").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const text = $("message").value.trim();
    if (!text) return;
    const message = document.createElement("p");
    message.className = "message";
    message.textContent = `You: ${text}`;
    $("messages").append(message);
    $("message").value = "";
});
restore();
update();
