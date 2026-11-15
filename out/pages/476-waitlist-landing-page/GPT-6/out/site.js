let joinedEmail = "";
const forms = [...document.querySelectorAll(".waitlist")];
forms.forEach((form) => form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    if (joinedEmail) return;
    joinedEmail = form.querySelector("input").value.trim();
    forms.forEach((item) =>
    {
        item.querySelector("input").value = joinedEmail;
        item.querySelector("input").readOnly = true;
        item.querySelector("button").disabled = true;
        item.querySelector("button").textContent = "Demo ticket ready";
    });
    document.querySelectorAll("#hero-status, #footer-status").forEach((status) =>
    {
        status.hidden = false;
        status.textContent = "Your demo ticket is 0412. Nothing sent or stored. You have not joined a real waitlist.";
    });
    document.querySelectorAll("#ticket-number span").forEach((digit, index) => digit.textContent = "0412"[index]);
    document.querySelector("#ticket-number").setAttribute("aria-label", "Demo ticket 0412");
    document.querySelector("#ticket-caption").textContent = "Local demo. No queue joined.";
    document.querySelector(".ticket").classList.add("joined");
}));
const category = document.querySelector("#category");
category.addEventListener("change", () =>
{
    let visible = 0;
    document.querySelectorAll("[data-category]").forEach((row) =>
    {
        row.hidden = category.value !== "All expenses" && row.dataset.category !== category.value;
        if (!row.hidden) visible++;
    });
    document.querySelector("#filter-status").textContent = `${visible} ${visible === 1 ? "transaction" : "transactions"} · sample data only`;
});
document.querySelectorAll("[data-team]").forEach((button) =>
{
    function selectTeam()
    {
        document.querySelectorAll("[data-team]").forEach((item) =>
        {
            item.classList.toggle("selected", item === button);
            item.setAttribute("aria-pressed", String(item === button));
        });
        const image = document.querySelector("#team-image");
        image.src = button.querySelector("img").getAttribute("src");
        image.alt = button.querySelector("img").alt;
        document.querySelector("#team-caption").textContent = button.dataset.team;
    }
    button.addEventListener("mouseenter", selectTeam);
    button.addEventListener("focus", selectTeam);
    button.addEventListener("click", selectTeam);
});
const dialog = document.querySelector("#privacy-dialog");
document.querySelector("#privacy").addEventListener("click", () => dialog.showModal());
document.querySelector("#storage").addEventListener("click", () => dialog.showModal());
document.querySelector("#close-privacy").addEventListener("click", () => dialog.close());
