const issues = [
    ["084", "The quiet month at Felixstowe", "Nine per cent down, one berth out, and a rota nobody will put in writing.", "9 MIN", "Box volumes through Felixstowe fell nine per cent in August. The opening paragraph is reproduced in the letter above."],
    ["083", "What a chart tells you about Panama", "Draft restrictions, lake levels and the queue that is no longer a queue.", "11 MIN", "Reading note: how do lake levels change a ship’s permitted draft? This concept provides a synopsis only, not a full reported article."],
    ["082", "The last cable ship in Europe", "Repairing the physical internet, from a vessel built in 1994.", "13 MIN", "Nobody decided that the internet would run along the seabed in a cable the width of a garden hose. It simply turned out to be cheapest."],
    ["081", "Rotterdam runs on wind now, mostly", "The port’s own grid, and what it does when the wind drops.", "10 MIN", "Reading note: explore the difference between annual renewable supply and reliable power at every hour. A synopsis, not a full article."],
    ["080", "Who owns the boxes", "Leasing, repositioning and why empties travel more than full ones.", "12 MIN", "The empty container is the most honest object in world trade. It goes where the money is not."],
    ["079", "A week on the night shift at Antwerp", "Written from a crane cab, with permission and a hard hat.", "15 MIN", "Reading note: the people and timing behind a night at the terminal. The original brief supplies this summary only."]
];
const $ = (s) => document.querySelector(s);
function render()
{
    const term = $("#search").value.trim().toLowerCase();
    const filtered = issues.filter((issue) => issue.join(" ").toLowerCase().includes(term));
    $("#issues").innerHTML = filtered.map((issue) => `<details class="issue"><summary><small>${issue[0]}</small><strong>${issue[1]}</strong><span class="summary">${issue[2]}</span><small>${issue[3]} +</small></summary><p>${issue[4]}<br><small>EXCERPT / SAMPLE EDITORIAL COPY</small></p></details>`).join("");
    $("#count").textContent = `${filtered.length} of 6 letters`;
    $("#empty").hidden = filtered.length !== 0;
}
$("#search").addEventListener("input", render);
$("#clear-search").addEventListener("click", () =>
{
    $("#search").value = "";
    render();
    $("#search").focus();
});
render();
document.querySelectorAll(".subscribe").forEach((form) =>
{
    form.addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const input = form.querySelector("input");
        const result = form.querySelector(".status");
        if (!input.value.trim() || !input.validity.valid)
        {
            result.textContent = "Enter a valid email address to preview the confirmation.";
            input.setAttribute("aria-invalid", "true");
            input.focus();
            return;
        }
        document.querySelectorAll(".status").forEach((status) => status.textContent = `Local confirmation for ${input.value.trim()}. No subscription created. No email sent or stored.`);
        input.removeAttribute("aria-invalid");
    });
});
$("#reset-subscription").addEventListener("click", () =>
{
    document.querySelectorAll(".subscribe").forEach((form) =>
    {
        form.reset();
        form.querySelector(".status").textContent = "";
        form.querySelector("input").removeAttribute("aria-invalid");
    });
});
const observer = new IntersectionObserver((entries) =>
{
    entries.forEach((entry) =>
    {
        if (entry.isIntersecting)
        {
            entry.target.classList.add("open");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: .15 });
observer.observe($(".letter"));
