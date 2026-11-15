const stripe = document.querySelector(".stripe-image");
const observer = new IntersectionObserver((entries) =>
{
    if (entries.some((entry) => entry.isIntersecting))
    {
        stripe.classList.add("clean");
        observer.disconnect();
    }
}, { threshold: .35 });
observer.observe(stripe);
const boxes = [...document.querySelectorAll(".practical input")];
function update()
{
    const count = boxes.filter((box) => box.checked).length;
    document.querySelector("#prepared").textContent = count === 5 ? "5 of 5 preparation items checked. Confirm access and any hazards directly with the provider." : `${count} of 5 preparation items checked.`;
}
boxes.forEach((box) => box.addEventListener("change", update));
document.querySelector("#reset-checklist").addEventListener("click", () =>
{
    boxes.forEach((box) => box.checked = false);
    update();
});
