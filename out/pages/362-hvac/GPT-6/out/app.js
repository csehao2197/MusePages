const services =
[
    ["AC Installation & Replacement", 2400, "Properly sized central air and ductless systems.", "01"],
    ["Heating Installation", 1800, "Furnaces and heat pumps for the way you live.", "02"],
    ["AC & Heating Repair", 89, "Understand the problem. Explore a practical fix.", "03"],
    ["Tune-Up & Maintenance", 89, "Seasonal inspections, cleaning and efficiency checks.", "04"],
    ["Air Quality Solutions", 350, "Filtration, purification and humidity control.", "05"],
    ["Emergency Service", 149, "Explore urgent help for a system that can’t wait.", "06"]
];
const select = document.querySelector("#service");
document.querySelector("#service-grid").innerHTML = services.map(([name, price, description, number]) => `<article class="service"><div class="service-top"><span>${number}</span><span aria-hidden="true">↗</span></div><div class="service-body"><small>EXAMPLE FROM $${price.toLocaleString()}</small><h3>${name}</h3><p>${description}</p><button data-quote="${name}">Explore service →</button></div></article>`).join("");
select.innerHTML = services.map(([name]) => `<option>${name}</option>`).join("");
const estimate = () =>
{
    const item = services.find(([name]) => name === select.value);
    document.querySelector("#estimate").textContent = `Illustrative starting price: $${item[1].toLocaleString()}. Final scope requires professional diagnosis.`;
};
select.addEventListener("change", estimate);
document.addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-quote]");
    if (button)
    {
        select.value = button.dataset.quote;
        estimate();
        document.querySelector("#quote-result").textContent = "";
        document.querySelector("#quote").showModal();
    }
});
document.querySelector(".close").addEventListener("click", () => document.querySelector("#quote").close());
document.querySelector("#quote-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const form = event.target.elements;
    const result = document.querySelector("#quote-result");
    if (!form.name.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.value) || !/^\d{5}$/.test(form.zip.value))
    {
        result.textContent = "Enter your name, a valid email and a five-digit ZIP code.";
        return;
    }
    result.textContent = `Prepared locally: ${select.value} for ${form.name.value.trim()} in ${form.zip.value}. Nothing sent; no appointment created.`;
});
document.querySelector("#area-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const zip = document.querySelector("#zip").value;
    document.querySelector("#area-result").textContent = !/^\d{5}$/.test(zip) ? "Enter a five-digit ZIP code." : zip.startsWith("606") ? "Inside the example metro area. Confirm actual availability with a provider." : "Outside our example area. Contact a local HVAC provider; no service has been scheduled.";
});
document.querySelector("#menu").addEventListener("click", (event) =>
{
    const open = document.querySelector("#navigation").classList.toggle("open");
    event.currentTarget.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", () =>
{
    document.querySelector("#navigation").classList.remove("open");
    document.querySelector("#menu").setAttribute("aria-expanded", "false");
}));
