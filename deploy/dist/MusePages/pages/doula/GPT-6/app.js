const form = document.querySelector("form");
document.querySelectorAll("[data-package]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        form.elements.package.value = button.dataset.package;
        document.querySelector("#result").textContent = `Interested in ${button.dataset.package}. Tell me a little about you below.`;
        document.querySelector("#contact").scrollIntoView();
    });
});
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const invalid = [...form.querySelectorAll("input")].filter((input) =>
    {
        const valid = input.checkValidity() && (!input.required || input.value.trim().length > 0);
        input.setAttribute("aria-invalid", String(!valid));
        return !valid;
    });
    const result = document.querySelector("#result");
    if (invalid.length)
    {
        result.textContent = "Please enter your name and a valid email address.";
        invalid[0].focus();
        return;
    }
    result.textContent = "Thank you. I will reply within two days. Demo only: this message has not been sent.";
    form.reset();
});
