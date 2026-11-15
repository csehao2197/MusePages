const dialog = document.querySelector("#detail");
document.querySelectorAll("[data-condition]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        const condition = button.dataset.condition;
        document.querySelector("#detail-title").textContent = condition;
        document.querySelector("#detail-copy").textContent = condition === "Post-Surgical Rehab" ? "Discuss your surgeon's guidance and restrictions with a qualified clinician before starting rehabilitation. This page cannot assess recovery or clear you for activity." : `An individual assessment can explore ${condition.toLowerCase()} and the activities important to you. This page does not diagnose symptoms or recommend treatment. Seek urgent help for severe, sudden or worsening symptoms.`;
        dialog.showModal();
    });
});
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelector("#detail-action").addEventListener("click", () => dialog.close());
document.querySelectorAll("[data-service]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        document.querySelector("#service").value = button.dataset.service;
        document.querySelector("#book").scrollIntoView();
    });
});
const result = document.querySelector("#result");
document.querySelector("#planner").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const date = document.querySelector("#date").value;
    const today = new Date();
    const threshold = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    if (!date || date <= threshold)
    {
        result.textContent = "Choose a future preferred date.";
        return;
    }
    if (new Date(`${date}T12:00:00`).getDay() === 0)
    {
        result.textContent = "The example clinic is closed on Sundays. Choose Monday to Saturday.";
        return;
    }
    if (!document.querySelector("#ack").checked)
    {
        result.textContent = "Please acknowledge that this is a local outline.";
        return;
    }
    result.textContent = `${document.querySelector("#service").value}, ${date}, ${document.querySelector("#time").value.toLowerCase()}: outline prepared locally. No appointment booked, medical assessment performed or data sent. Contact a verified provider for suitability and availability.`;
});
document.querySelector("#planner").addEventListener("reset", () => result.textContent = "");
