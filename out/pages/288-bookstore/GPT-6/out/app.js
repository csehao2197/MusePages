const $ = (selector) => document.querySelector(selector);
const picks =
[
    ["Piranesi", "Susanna Clarke", "Rosa", "I have sold ninety copies of this and had one person come back unhappy. Those are good odds.", "#264653", "#e7dcb9"],
    ["The Overstory", "Richard Powers", "Dev", "Six hundred pages about trees, which sounds like a threat and turns out to be the best novel I read last year.", "#747b4b", "#f7e9be"],
    ["Small Things Like These", "Claire Keegan", "Marion", "A hundred and sixteen pages. You will read it in one sitting and think about it for a month.", "#9b4d3e", "#f5e1b5"],
    ["The Hare with Amber Eyes", "Edmund de Waal", "Rosa", "A family history told through two hundred and sixty-four tiny Japanese carvings. It should not work. It absolutely does.", "#c3a75d", "#293f48"]
];
function cover([title, author, , , bg, color])
{
    return `<div class="book-cover" style="background:${bg};color:${color}"><span>${author.toUpperCase()}</span><strong>${title}</strong><div class="cover-motif"></div></div>`;
}
$("#staff-picks").innerHTML = picks.map((pick, index) => `<article class="pick">${cover(pick)}<div class="shelf-talker"><h3>${pick[0]}</h3><span class="author">${pick[1]}</span><p class="eyebrow">Picked by ${pick[2]}</p><p>${pick[3]}</p><button class="under" data-pick="${index}">Ask for this book ↗</button></div></article>`).join("");
const catalogue = [...picks.map(([title, author]) => ({ title, author, category: title === "The Hare with Amber Eyes" ? "Non-fiction" : "Fiction" })), { title: "Klara and the Sun", author: "Kazuo Ishiguro", category: "Fiction" }, { title: "Devotions", author: "Mary Oliver", category: "Poetry" }, { title: "The Lost Words", author: "Robert Macfarlane & Jackie Morris", category: "Children's" }, { title: "Convenience Store Woman", author: "Sayaka Murata", category: "Translated" }, { title: "Selected Poems", author: "Philip Larkin", category: "Secondhand" }, { title: "Sheffield: A History", author: "David Hey", category: "Local Interest" }];
let category = "";
const categories = ["Fiction", "Non-fiction", "Poetry", "Children's", "Translated", "Secondhand", "Local Interest", "Gifts & Cards"];
$("#categories").innerHTML = categories.map((name) => `<button data-category="${name}" aria-pressed="false">${name} ↗</button>`).join("");
function search()
{
    const term = $("#search").value.trim().toLowerCase();
    const results = catalogue.filter((book) => (!category || book.category === category) && `${book.title} ${book.author}`.toLowerCase().includes(term));
    $("#result-count").textContent = results.length ? `${results.length} suggestions${category ? ` · ${category}` : ""}` : "No sample titles match. Clear filters or ask us to order something.";
    $("#results").innerHTML = results.map((book) => `<button class="result" data-catalogue="${catalogue.indexOf(book)}"><strong>${book.title}</strong><span>${book.author} · ${book.category} ↗</span></button>`).join("");
    $("#categories").querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", button.dataset.category === category));
}
$("#search").oninput = search;
$("#reset").onclick = () => { category = ""; $("#search").value = ""; search(); };
function request(title = "", author = "", special = false)
{
    $("#request-heading").textContent = special ? "Order something in print." : "Reserve a book.";
    $("#book-title").value = title;
    $("#book-author").value = author;
    $("#book-status").textContent = "Local demo request. No book is held or ordered.";
    $("#book-dialog").showModal();
}
const events = [["12 SEP", "Claire Keegan in conversation", "19:00", 8, "Redeemable against the book"], ["19 SEP", "Poetry open mic", "19:30", 0, "Sign up on the door"], ["26 SEP", "Children's story hour", "10:30", 0, "Ages 3–7, with a responsible adult"], ["03 OCT", "Translated fiction evening", "19:00", 6, "Wine included; ask about an alcohol-free option"], ["10 OCT", "Local history talk: the Sheffield floods", "18:30", 5, "An evening of local history"]];
let eventPrice = 0;
let eventName = "";
function eventTotal()
{
    const n = Number($("#places").value);
    $("#event-total").textContent = Number.isInteger(n) && n >= 1 && n <= 6 ? `Illustrative total: £${n * eventPrice}${eventPrice === 0 ? " · Free entry" : ""}` : "Choose 1 to 6 whole places.";
}
function openEvent(index)
{
    const event = index === -1 ? ["Second Tuesday", "Book club: Klara and the Sun", "19:00", 0, "Upstairs at the shop. No obligation to have finished the book. Ask about access."] : events[index];
    eventPrice = event[3];
    eventName = event[1];
    $("#event-date").textContent = index === -1 ? "Monthly concept book club" : `${event[0]} 2027 · Illustrative programme`;
    $("#event-title").textContent = eventName;
    $("#event-info").textContent = `${event[2]} · ${event[4]}`;
    $("#event-status").textContent = "Demo attendance plan. No places reserved or tickets issued.";
    $("#places").value = "1";
    eventTotal();
    $("#event-dialog").showModal();
}
$("#event-list").innerHTML = events.map(([date, title, time, price, info], index) => `<article class="event"><strong>${date}</strong><div><h3>${title}</h3><p>${time} · ${info}</p></div><span>${price ? `£${price}` : "Free"}</span><button class="under" data-event="${index}">Details ↗</button></article>`).join("");
$("#places").oninput = eventTotal;
$("#join-club").onclick = () => openEvent(-1);
document.addEventListener("click", (event) =>
{
    const pick = event.target.closest("[data-pick]");
    const result = event.target.closest("[data-catalogue]");
    const filter = event.target.closest("[data-category]");
    const order = event.target.closest("[data-order]");
    const show = event.target.closest("[data-event]");
    const close = event.target.closest("[data-close]");
    if (pick) request(picks[Number(pick.dataset.pick)][0], picks[Number(pick.dataset.pick)][1]);
    if (result)
    {
        const book = catalogue[Number(result.dataset.catalogue)];
        request(book.title, book.author);
    }
    if (filter) { category = filter.dataset.category; search(); }
    if (order) request("", "", order.dataset.order === "special");
    if (show) openEvent(Number(show.dataset.event));
    if (close) $(`#${close.dataset.close}`).close();
});
$("#book-form").onsubmit = (event) =>
{
    event.preventDefault();
    $("#book-status").textContent = !$("#book-title").value.trim() || !$("#book-email").value || !$("#book-email").validity.valid ? "Enter a book title and a valid email address." : `Request draft ready for “${$("#book-title").value.trim()}”. Nothing ordered or held; call 0114 555 0177 to check stock.`;
};
$("#event-form").onsubmit = (event) =>
{
    event.preventDefault();
    const places = Number($("#places").value);
    if (!Number.isInteger(places) || places < 1 || places > 6) $("#event-status").textContent = "Choose 1 to 6 whole places.";
    else if (!$("#attendee").value.trim() || !$("#event-email").value || !$("#event-email").validity.valid) $("#event-status").textContent = "Enter your name and a valid email address.";
    else $("#event-status").textContent = `${places} place${places > 1 ? "s" : ""} planned for ${eventName}. Nothing reserved or sent; confirm the programme with the shop.`;
};
$("#newsletter").onsubmit = (event) =>
{
    event.preventDefault();
    $("#newsletter-status").textContent = $("#newsletter-email").value && $("#newsletter-email").validity.valid ? "Local preference noted. No subscription created." : "Please enter a valid email address.";
};
$("#menu").onclick = () =>
{
    const open = $("#nav").classList.toggle("open");
    $("#menu").setAttribute("aria-expanded", open);
};
$("#nav").onclick = () => { $("#nav").classList.remove("open"); $("#menu").setAttribute("aria-expanded", "false"); };
search();
