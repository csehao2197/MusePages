const month = new Date().getMonth();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const produce = ["Leeks", "Purple sprouting", "Forced rhubarb", "Asparagus", "Broad beans", "Strawberries", "New potatoes", "Sweetcorn", "Plums", "Squash", "Cavolo nero", "Parsnips"];
document.querySelector("#season-name").textContent = `${months[month].toUpperCase()} ON THE FARM.`;
function showMonth(index)
{
    document.querySelector("#active-month").textContent = months[index].toUpperCase();
    document.querySelector("#produce").textContent = produce[index];
}
months.forEach((name, i) =>
{
    const angle = i * Math.PI / 6 - Math.PI / 2;
    const button = document.createElement("button");
    button.className = "month";
    button.textContent = name.slice(0, 3).toUpperCase();
    button.setAttribute("aria-label", `Explore ${name}`);
    button.dataset.month = i;
    button.style.left = `${50 + Math.cos(angle) * 44}%`;
    button.style.top = `${50 + Math.sin(angle) * 44}%`;
    if (i === month) button.setAttribute("aria-current", "date");
    ["mouseenter", "focus", "click"].forEach((event) => button.addEventListener(event, () => showMonth(i)));
    ["mouseleave", "blur"].forEach((event) => button.addEventListener(event, () => showMonth(month)));
    document.querySelector("#months").append(button);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", 200 + Math.cos(angle - Math.PI / 12) * 104);
    line.setAttribute("y1", 200 + Math.sin(angle - Math.PI / 12) * 104);
    line.setAttribute("x2", 200 + Math.cos(angle - Math.PI / 12) * 141);
    line.setAttribute("y2", 200 + Math.sin(angle - Math.PI / 12) * 141);
    document.querySelector("#spokes").append(line);
});
showMonth(month);
const arc = document.querySelector("#season-arc");
const draw = () => arc.style.strokeDashoffset = String(1 - (month + 1) / 12);
if (matchMedia("(prefers-reduced-motion: reduce)").matches) draw();
else
{
    const observer = new IntersectionObserver((entries) =>
    {
        if (entries.some((entry) => entry.isIntersecting))
        {
            draw();
            observer.disconnect();
        }
    });
    observer.observe(arc);
}
const crops = {
    Vegetables: [["Potatoes", "May to October", [4,5,6,7,8,9]], ["Leeks", "October to March", [9,10,11,0,1,2]], ["Squash", "September to December", [8,9,10,11]], ["Broad beans", "May to July", [4,5,6]], ["Kale", "November to March", [10,11,0,1,2]], ["Asparagus", "April to June", [3,4,5]]],
    Orchard: [["Cider apples", "September", [8]], ["Eating apples", "October", [9]], ["Plums", "August", [7]], ["Damsons", "September", [8]], ["Pears", "October", [9]]],
    Meat: [["Ryeland hogget", "Autumn", [8,9,10]], ["Tamworth pork", "Year round", [0,1,2,3,4,5,6,7,8,9,10,11]], ["Mutton", "Winter", [11,0,1]]]
};
function filter()
{
    const term = document.querySelector("#search").value.trim().toLowerCase();
    const seasonal = document.querySelector("#season-filter").value === "now";
    const list = document.querySelector("#produce-list");
    list.replaceChildren();
    let count = 0;
    Object.entries(crops).forEach(([name, items]) =>
    {
        const found = items.filter(([title, , season]) => title.toLowerCase().includes(term) && (!seasonal || season.includes(month)));
        if (!found.length) return;
        const section = document.createElement("section");
        const h3 = document.createElement("h3");
        h3.textContent = name;
        section.append(h3);
        found.forEach(([title, timing]) =>
        {
            const row = document.createElement("div");
            row.className = "produce-row";
            row.textContent = title;
            const span = document.createElement("span");
            span.className = "meta";
            span.textContent = timing.toUpperCase();
            row.append(span);
            section.append(row);
            count++;
        });
        list.append(section);
    });
    document.querySelector("#produce-count").textContent = `${count} ITEMS / ${seasonal ? months[month].toUpperCase() : "ALL SEASONS"}`;
    document.querySelector("#empty").hidden = count > 0;
}
document.querySelector("#search").addEventListener("input", filter);
document.querySelector("#season-filter").addEventListener("change", filter);
document.querySelector("#reset-produce").addEventListener("click", () =>
{
    document.querySelector("#search").value = "";
    document.querySelector("#season-filter").value = "all";
    filter();
});
const boxes = { small: { name: "Small box", price: 14 }, large: { name: "Large box", price: 22 }, fruit: { name: "Fruit box", price: 9 }, meat: { name: "Quarterly meat box", price: 65 } };
const dialog = document.querySelector("#order");
const form = document.querySelector("form");
form.elements.date.min = new Date().toLocaleDateString("en-CA");
function updateBox()
{
    const id = form.elements.box.value;
    const options = id === "meat" ? [["quarterly", "Quarterly"]] : id === "fruit" ? [["weekly", "Weekly, August to January"]] : [["weekly", "Weekly"], ["fortnightly", "Fortnightly"]];
    const previous = form.elements.frequency.value;
    form.elements.frequency.replaceChildren(...options.map(([value, name]) => new Option(name, value)));
    if (options.some(([value]) => value === previous)) form.elements.frequency.value = previous;
    const delivery = form.elements.method.value === "delivery";
    document.querySelector("#postcode-label").hidden = !delivery;
    form.elements.postcode.required = delivery;
    document.querySelector("#box-summary").textContent = `${boxes[id].name} · £${boxes[id].price} per box · ${form.elements.frequency.selectedOptions[0].textContent}. ${id === "fruit" ? "Seasonal harvest must be confirmed." : id === "meat" ? "Quarterly dates and contents require confirmation." : "Contents vary with the harvest."}`;
    document.querySelector("#result").textContent = "";
}
document.querySelectorAll("[data-box]").forEach((button) => button.addEventListener("click", () =>
{
    form.elements.box.value = button.dataset.box;
    updateBox();
    dialog.showModal();
}));
form.addEventListener("change", updateBox);
document.querySelector("#close").addEventListener("click", () => dialog.close());
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const result = document.querySelector("#result");
    const day = new Date(`${form.elements.date.value}T12:00:00`).getDay();
    if (!form.checkValidity() || !form.elements.name.value.trim()) result.textContent = "Enter a future date, name, valid email and delivery postcode if needed.";
    else if (day !== (form.elements.method.value === "delivery" ? 5 : 4)) result.textContent = "Choose Thursday for collection or Friday for a delivery enquiry.";
    else if (form.elements.method.value === "delivery" && !/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(form.elements.postcode.value.trim())) result.textContent = "Enter a full UK postcode. The twelve-mile route still needs direct confirmation.";
    else result.textContent = `${boxes[form.elements.box.value].name} · £${boxes[form.elements.box.value].price} per box. Local enquiry reviewed. No order or subscription placed. Delivery distance, harvest and dates need direct confirmation.`;
});
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
dayNames.forEach((name, i) =>
{
    const li = document.createElement("li");
    li.textContent = `${name}: ${i === 0 ? "10:00 to 14:00" : i === 5 ? "10:00 to 17:00" : i === 6 ? "9:00 to 17:00" : i === 4 ? "box collection only" : "closed"}${i === new Date().getDay() ? " · today" : ""}`;
    if (i === new Date().getDay()) li.className = "today";
    document.querySelector("#hours").append(li);
});
document.querySelector("#menu").addEventListener("click", (event) =>
{
    const open = event.currentTarget.getAttribute("aria-expanded") !== "true";
    event.currentTarget.setAttribute("aria-expanded", String(open));
    document.querySelector("nav").classList.toggle("open", open);
});
filter();
