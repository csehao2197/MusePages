import { people } from "./people.js";

const backgrounds = document.querySelector(".portraits");
const picker = document.querySelector(".picker");
people.forEach((person, index) =>
{
    const layer = document.createElement("div");
    layer.className = "portrait";
    layer.style.backgroundImage = `url("portrait-${index}.svg")`;
    backgrounds.append(layer);
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `Show ${person.name}`);
    button.innerHTML = `<span class="dot"></span><img src="portrait-${index}.svg" alt="${person.name}">`;
    button.addEventListener("click", () => select(index));
    picker.append(button);
});
function select(index)
{
    const person = people[index];
    document.querySelectorAll(".portrait").forEach((layer, item) => layer.classList.toggle("active", item === index));
    picker.querySelectorAll("button").forEach((button, item) => button.setAttribute("aria-pressed", String(item === index)));
    for (const [id, value] of [["name", person.name], ["bio", person.bio], ["role", person.role]])
    {
        const node = document.getElementById(id);
        node.textContent = value;
        if (id !== "role")
        {
            node.classList.remove("fade");
            void node.offsetWidth;
            node.classList.add("fade");
        }
    }
}
select(0);
