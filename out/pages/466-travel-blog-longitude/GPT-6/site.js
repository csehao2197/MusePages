const menu = document.querySelector("#menu");
const nav = document.querySelector("#navigation");
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("open", expanded);
});
nav.addEventListener("click", () =>
{
    menu.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
});
const posts = [
    { id: "slovenia", country: "Slovenia", title: "Four weeks in the Julian Alps", time: 10, place: "Bohinj, Slovenia · 46.2806° N, 13.8797° E · September", paragraphs: ["I went for the lake and stayed for the valley behind it. In this imagined September notebook, the first useful discovery wasn't a viewpoint. It was the bakery that still had warm bread after the early bus had gone.", "The budget page in my notebook has three columns: a simple room, groceries, and local transport. An illustrative month might total €1,260, but that is fictional diary arithmetic, not current travel pricing. Check actual accommodation and seasonal bus timetables before making plans.", "By the second week I had stopped trying to see the whole valley. I walked the same lane after breakfast and noticed the trees changing instead. October, I wrote, might be quieter still."] },
    { id: "portugal", country: "Portugal", title: "The Alentejo has no crowds and no shade", time: 9, place: "Monsaraz, Portugal · 38.4436° N, 7.3797° W · May", paragraphs: ["The fields looked empty until I began walking through them slowly. Then there were stone walls, a broken gate, and a sound I kept mistaking for rain.", "In the village the day rearranged itself around the sun. I bought bread early and left the long walk until evening. These are imagined diary observations, not a weather forecast or route guide.", "The notebook has no list of attractions. It has a sketch of a cork oak and the name of a square where I sat until the shadows reached my shoes."] },
    { id: "japan", country: "Japan", title: "A month of trains in Tohoku, off the tourist line", time: 12, place: "Aomori, Japan · 40.8244° N, 140.7400° E · April", paragraphs: ["I learned the platform before I learned the town. There was a vending machine, a wooden bench and a timetable I photographed twice because I didn't trust my first attempt.", "A slow journey needs room for a missed connection. In this fictional notebook the best afternoon began when I stayed put rather than rushing for another train. Real services and passes need checking with the operator.", "By the fourth week the same view from the carriage felt less like scenery and more like a way of measuring the weather."] },
    { id: "morocco", country: "Morocco", title: "Living in Taghazout for the winter, honestly", time: 8, place: "Taghazout, Morocco · 30.5450° N, 9.7100° W · February", paragraphs: ["The village had a rhythm I couldn't photograph: shutters lifting, the first delivery, a chair dragged into the sun. I spent the first week trying to make it an itinerary.", "The second week was better. I found a desk, learned when my street was quiet, and stopped describing every ordinary errand as an adventure.", "This is a fictional diary excerpt, including its little inconveniences. For actual travel, verify local conditions, accommodation and transport rather than relying on a journal."] },
    { id: "scotland", country: "Scotland", title: "Walking the Fife Coastal Path in bad weather", time: 7, place: "Elie, Scotland · 56.1880° N, 2.8170° W · August", paragraphs: ["The rain arrived sideways before breakfast. I put the camera away and listened to the coast instead. A good coat changes the shape of a day, though it doesn't change the forecast.", "In the notebook version I walked a short section and turned back when the wind rose. A route is never an instruction to keep going. Check official path conditions, tides and weather for a real walk.", "There was tea afterwards. Some pages of the notebook contain very little else."] },
    { id: "italy", country: "Italy", title: "Puglia in November, when it is all still open", time: 10, place: "Puglia, Italy · 40.7510° N, 17.3260° E · November", paragraphs: ["The square looked empty in the photograph. Five minutes later a delivery van arrived and three people appeared to discuss where it ought to park.", "The title is a diary exaggeration, not an opening-hours guarantee. In a real November visit, check individual businesses and transport. In this fictional one, the quiet was the point.", "I kept returning to the same bench until it stopped feeling like a place I was visiting and started feeling like the end of my morning."] },
    { id: "georgia", country: "Georgia", title: "Tbilisi on twenty euros a day", time: 11, place: "Tbilisi, Georgia · 41.7151° N, 44.8271° E · October", paragraphs: ["Twenty euros was the heading, not a promise. This imagined notebook counts food, a local journey and a little room for mistakes. It doesn't make a current budget recommendation.", "I spent more time looking up at balconies than looking down at my map. The paint was never quite the colour I remembered from the day before.", "If a place rewards a long stay, perhaps it is because a long stay finally gives ordinary details enough time to become interesting."] }
];
const grid = document.querySelector("#posts");
posts.slice(1).forEach((post) =>
{
    const article = document.createElement("article");
    article.innerHTML = `<button class="post" data-post="${post.id}"><figure><img src="art.svg#${post.id}" alt="Original illustrated field note from ${post.country}"><figcaption>${post.place}</figcaption></figure><p class="meta">${post.country}</p><h3>${post.title}</h3><small>${post.time} MIN IN THE BRIEF · READ A NOTEBOOK EXCERPT ↗</small></button>`;
    grid.append(article);
});
let current = posts[0];
const saved = new Set();
const dialog = document.querySelector("#dispatch-dialog");
function renderSaved()
{
    const list = document.querySelector("#saved-posts");
    list.replaceChildren();
    for (const id of saved)
    {
        const post = posts.find((item) => item.id === id);
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.className = "read";
        button.textContent = post.title;
        button.addEventListener("click", () => openPost(post));
        li.append(button);
        list.append(li);
    }
    document.querySelector("#saved-status").textContent = saved.size ? `${saved.size} dispatch${saved.size === 1 ? "" : "es"} set aside for later.` : "No saved dispatches yet. Open a story and save it for later.";
}
function openPost(post)
{
    current = post;
    document.querySelector("#dispatch-title").textContent = post.title;
    const image = document.querySelector("#dispatch-art");
    image.src = `art.svg#${post.id}`;
    image.alt = `Original ${post.country} field notebook illustration`;
    document.querySelector("#dispatch-caption").textContent = post.place;
    document.querySelector("#dispatch-text").replaceChildren(...post.paragraphs.map((text) =>
    {
        const p = document.createElement("p");
        p.textContent = text;
        return p;
    }));
    document.querySelector("#save-story").textContent = saved.has(post.id) ? "Remove from reading list" : "Save for later ↗";
    document.querySelector("#save-status").textContent = "";
    dialog.showModal();
    dialog.scrollTop = 0;
}
document.querySelectorAll("[data-post]").forEach((button) => button.addEventListener("click", () => openPost(posts.find((post) => post.id === button.dataset.post))));
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelector("#save-story").addEventListener("click", () =>
{
    if (saved.has(current.id)) saved.delete(current.id);
    else saved.add(current.id);
    document.querySelector("#save-story").textContent = saved.has(current.id) ? "Remove from reading list" : "Save for later ↗";
    document.querySelector("#save-status").textContent = saved.has(current.id) ? "Saved in this page's memory." : "Removed from reading list.";
    renderSaved();
});
document.querySelector("#clear-saved").addEventListener("click", () =>
{
    saved.clear();
    renderSaved();
});
document.querySelector("#newsletter-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    document.querySelector("#newsletter-status").textContent = "Letter preview requested locally. Nothing sent or stored; no subscription created.";
});
