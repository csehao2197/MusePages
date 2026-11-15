const $ = (selector) => document.querySelector(selector);
const events =
[
    ["14 March 2027", "Edinburgh", "Topping and Company", "Launch reading"],
    ["22 March 2027", "Glasgow", "Waterstones Sauchiehall Street", "Reading and conversation"],
    ["3 April 2027", "London", "Daunt Books Marylebone", "Author conversation"],
    ["18 April 2027", "Bath", "Mr B’s Emporium", "Evening reading"],
    ["9 May 2027", "Hay-on-Wye", "Hay Festival", "Festival reading"]
];
function openDetails(html)
{
    $("#dialog-copy").innerHTML = html;
    $("#details").showModal();
}
$("#close").onclick = () => $("#details").close();
$("#event-list").innerHTML = events.map(([date, city, venue], index) => `<article class="event"><span>${date}</span><strong>${city}</strong><span>${venue}</span><button class="text" data-event="${index}">Tickets</button></article>`).join("");
document.addEventListener("click", (event) =>
{
    const buy = event.target.closest("[data-buy]");
    const ticket = event.target.closest("[data-event]");
    const info = event.target.closest("[data-info]");
    if (buy)
    {
        const title = buy.dataset.buy;
        openDetails(`<p class="label">Find your next read</p><h2>${title}</h2><p>Choose an independent shop or your preferred bookseller. This fictional title is not offered for sale.</p><div class="retailers"><a href="https://www.waterstones.com/" target="_blank" rel="noopener">Waterstones</a><a href="https://uk.bookshop.org/" target="_blank" rel="noopener">Bookshop.org</a><p>Ask your local bookshop for Mara Lindqvist.</p></div><p class="note">Retailer homepages only. No order or payment is taken here.</p>`);
    }
    if (ticket)
    {
        const [date, city, venue, title] = events[Number(ticket.dataset.event)];
        openDetails(`<p class="label">${date}</p><h2>${title}</h2><h3>${city}</h3><p>${venue}</p><p>A reading from The Heron Year, followed by conversation and questions.</p><p>Demonstration event only. Tickets are not being issued or reserved.</p>`);
    }
    if (info)
    {
        const type = info.dataset.info;
        const text = type === "Agent" ? "Represented by Hollis and Kerr Literary Agency. This is a fictional agency from the brief." : type === "Press kit" ? "Mara Lindqvist writes novels about water, work and things left unsaid. Four novels, including The Heron Year, March 2027. Original illustrated covers are conceptual artwork, not publication files." : "This concept site is not connected to a real author account.";
        openDetails(`<h2>${type}</h2><p>${text}</p>`);
    }
});
$("#chapter").onclick = () => openDetails(`<p class="label">The Heron Year</p><h2>One.<br>The first entry.</h2><p>The first bird was not a heron. It was a gull, balancing on the rail as though the ferry belonged to it. I wrote that down because the truth seemed a sensible place to start.</p><p>Beyond the window, the Forth held the colour of an unposted letter. The water was flat. My brother had been missing for thirty one days.</p><p>I opened the logbook to a clean page and wrote the date. By the time we reached the other shore, someone had written beneath it.</p><p class="note">Original short demonstration excerpt written for this concept, not a published chapter.</p>`);
$("#subscribe").onsubmit = (event) =>
{
    event.preventDefault();
    const email = $("#email");
    if (!email.value.trim() || !email.validity.valid)
    {
        $("#status").textContent = "Please enter a valid email address.";
        return;
    }
    $("#status").textContent = "Your seasonal letter preference is noted in this page only. No email was sent and no subscription was created.";
};
$("#menu").onclick = () =>
{
    const open = $("#nav").classList.toggle("open");
    $("#menu").setAttribute("aria-expanded", open);
};
$("#nav").onclick = () =>
{
    $("#nav").classList.remove("open");
    $("#menu").setAttribute("aria-expanded", "false");
};
addEventListener("scroll", () => $("header").classList.toggle("compact", scrollY > 80), { passive: true });
