document.querySelectorAll("[data-service]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.querySelector("#service").value = button.dataset.service;
        document.querySelector("#urgency").value = button.dataset.service === "Emergency Repairs" ? "urgent" : "planned";
        document.querySelector("#contact").scrollIntoView();
    });
});
const result = document.querySelector("#result");
document.querySelector("#request").addEventListener("submit", (event) =>
{
    event.preventDefault();
    if (document.querySelector("#urgency").value === "urgent")
    {
        result.textContent = "Do not wait for this form. It is not monitored and cannot dispatch help. Contact a verified local professional directly; use emergency services if people are in danger. No request sent.";
        return;
    }
    const description = document.querySelector("#description").value.trim();
    const email = document.querySelector("#email");
    if (description.length < 15)
    {
        result.textContent = "Describe the work in at least 15 characters.";
        return;
    }
    if (!email.value.trim() || !email.validity.valid)
    {
        result.textContent = "Enter a valid email address for your local outline.";
        return;
    }
    result.textContent = `${document.querySelector("#service").value}: outline prepared locally. Ask about coverage, qualifications, attendance charges and a written estimate. Nothing sent; no price, appointment or arrival time confirmed.`;
});
document.querySelector("#request").addEventListener("reset", () => result.textContent = "");
