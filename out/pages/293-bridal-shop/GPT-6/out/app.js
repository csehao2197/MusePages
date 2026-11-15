const $ = (s) => document.querySelector(s);
const shortlist = new Set();
function invalidate()
{
    $("#email-draft").hidden = true;
    $("#status").textContent = "";
}
document.querySelectorAll("[data-designer]").forEach((button) => button.addEventListener("click", () =>
{
    const name = button.dataset.designer;
    shortlist.has(name) ? shortlist.delete(name) : shortlist.add(name);
    button.setAttribute("aria-pressed", shortlist.has(name));
    button.textContent = shortlist.has(name) ? "Shortlisted ✓" : "Shortlist +";
    $("#shortlist").textContent = shortlist.size ? `Your shortlist: ${[...shortlist].join(", ")}.` : "Your shortlist is empty.";
    invalidate();
}));
$("#size-enquiry").addEventListener("click", () =>
{
    $("#reason").value = "Ask about my size";
    invalidate();
});
$("#enquiry").addEventListener("input", invalidate);
$("#enquiry").addEventListener("submit", (event) =>
{
    event.preventDefault();
    let message;
    if ($("#name").value.trim().length < 2) message = "Please tell us your name.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#email").value.trim())) message = "Please add a valid email address.";
    else if ($("#note").value.trim().length < 10) message = "Add a short note of at least ten characters.";
    else
    {
        const body = `Hello Ivory & Thread,\n\n${$("#note").value.trim()}\n\nDesigner shortlist: ${[...shortlist].join(", ") || "Open to suggestions"}\n\n${$("#name").value.trim()}\nReply email: ${$("#email").value.trim()}\n\nDraft prepared on the demonstration website. Please confirm appointment and stock directly.`;
        $("#email-draft").href = `mailto:hello@ivoryandthread.co.uk?subject=${encodeURIComponent($("#reason").value)}&body=${encodeURIComponent(body)}`;
        $("#email-draft").hidden = false;
        message = "Your email draft is ready. Nothing has been sent. Open your email app to review and send it.";
    }
    $("#status").textContent = message;
});
new IntersectionObserver((entries, observer) =>
{
    entries.forEach((entry) =>
    {
        if (entry.isIntersecting)
        {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}).observe($(".drawing"));
$("#menu").addEventListener("click", () => $("#menu").setAttribute("aria-expanded", $("#nav").classList.toggle("open")));
$("#nav").addEventListener("click", () =>
{
    $("#nav").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
});
