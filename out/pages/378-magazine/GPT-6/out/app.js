const stories =
[
    ["Food", "The long lunch is back, and it never really left the south of Italy", "Sofia Marino", "The table is laid before anyone is hungry. A bowl of tomatoes arrives, followed by bread, then a conversation that refuses to hurry. In this fictional Puglian dispatch, lunch is less an event than a generous stretch of time.", "The lesson is not to imitate a holiday at home. It is to leave a little room around a meal: put the bread within reach, let people help themselves and resist the urge to clear the table too soon."],
    ["Travel", "Twelve hours in Porto without a single queue", "Dan Hollis", "Start with a walk rather than a list. A side street, an ordinary café and a river seen from somewhere quiet can make a city feel less like a collection of obligations.", "This sample itinerary is a way of thinking, not a verified route. Check current opening hours and transport locally, and leave the afternoon open enough to change your mind."],
    ["Home", "Why everyone is painting their kitchen the colour of bread", "Ruth Adeyemi", "A warm neutral changes with the light. Before naming it beige, look at the difference between crust, flour and the inside of a loaf.", "Try sample patches on more than one wall and live with them through a day. The best colour is one you enjoy in your own kitchen, not one that photographs well elsewhere."],
    ["Gardens", "What to plant in October if you only have a balcony", "Tom Fielding", "A small growing space asks you to pay attention to exposure, drainage and how often you can water. Begin with the conditions, not the shopping list.", "This general seasonal note is illustrative. Plant suitability depends on local climate and the weight and safety limits of your balcony. Ask a local nursery before choosing."],
    ["Culture", "The quiet comeback of the paper map", "Ella Ng", "A paper map shows you the things between where you are and where you intended to go. It is a useful invitation to notice the shape of a place.", "Take a pencil, mark a café and fold it imperfectly. Keep current navigation and safety information available too. Nostalgia is pleasant, but it is not a substitute for preparation."],
    ["Travel", "The slowest way across the Baltic is also the best", "Dan Hollis", "There is a particular freedom in being in transit with no useful errands to do. A ferry cabin offers a window, a bed and permission to watch the water.", "This is a fictional travel essay, not a sailing recommendation. Routes, schedules, accessibility and weather conditions should be checked directly with an operator."],
    ["Home", "Inside the pottery that makes bowls for half of London’s restaurants", "Ruth Adeyemi", "A bowl begins as weight in the hand. The workshop in this fictional studio visit is organised around repetition: centring, shaping, drying and trying again.", "The headline is illustrative, not a verified market claim. What matters in the story is the quiet skill behind an object used every day."],
    ["Food", "Is this the best sourdough in the north?", "Sofia Marino", "The first slice is eaten standing up. The second gets butter. By the third, it becomes clear that the best loaf is partly about when and where you eat it.", "This fictional tasting notebook names no winning bakery. Look for a loaf that suits your table, and ask the baker about ingredients if you have allergies."],
    ["Recipes", "Slow roasted tomatoes with garlic and thyme", "The Weekend Kitchen", "Serves 4. Prep 10 minutes. Cook about 2 hours. You will need 800g ripe tomatoes, 4 garlic cloves, 2 tablespoons olive oil, a few thyme sprigs and salt to taste.", "Heat the oven to 150°C, or 130°C fan. Halve the tomatoes and place cut side up in a roasting dish. Add garlic and thyme, drizzle with oil and season. Roast for around 2 hours until softened and concentrated, checking occasionally. Serve on toast or with pasta. Cool leftovers promptly, refrigerate within 2 hours and use within 2 days. Do not store garlic in oil at room temperature. Check ingredients for allergies."],
    ["Opinion", "I have stopped apologising for going to bed at nine", "Grace Whitfield", "The evening does not become more worthwhile simply because it lasts longer. There is pleasure in closing the book at a good moment and leaving a little energy for tomorrow.", "This is a fictional personal column, not health advice. An earlier bedtime is a preference, not a moral achievement."],
    ["Opinion", "The case for eating dinner at the same table every night", "Owen Price", "A familiar table is an anchor. It need not be carefully styled or large enough for guests. It only needs a cleared corner and a few minutes of attention.", "Some evenings dinner happens elsewhere, and that is fine. A small ritual is useful only when it makes life easier rather than becoming another rule."],
    ["Opinion", "Holidays are better when you go back to the same place", "Leila Haddad", "Returning changes what you notice. The first visit is about landmarks; the next is about the route to the bakery and which bench catches the evening light.", "A familiar place is not an unchanging one. The pleasure lies in meeting it again, without expecting it to remain exactly as you remember."],
    ["Opinion", "Nobody needs a smart kettle", "Marcus Bell", "A kettle has a clear job, and there is something reassuring about a tool that does not ask for an account. Some objects are already good at being themselves.", "This fictional column is an opinion about simplicity, not a product test. Useful technology is personal; the point is to choose deliberately."],
    ["Travel", "A week in the hill towns of Umbria, by bus", "Sofia Marino", "From a bus window, the landscape arrives at a different pace. A town appears, disappears behind a hill and returns as a cluster of warm windows.", "This sample essay is not a verified itinerary. Check routes, return services, accessibility and seasonal timetables before travelling. Leave enough time for the journey home."],
    ["Travel", "Where to swim in the sea in November, if you are brave", "Dan Hollis", "The shore can be rewarding without going into the water. A winter walk, a flask and a sheltered place to sit may be all the adventure a day needs.", "Cold water can be dangerous. This fictional essay is not swimming advice or a location recommendation. Follow local safety guidance and never enter unsafe conditions."],
    ["Travel", "The best train journeys in Europe under four hours", "Ella Ng", "A short train journey can still feel like a proper departure. Pack something to read, look out of the window and let the station be part of the day.", "No routes or journey times are verified in this sample note. Check current timetables, reservation requirements and accessibility directly before booking."]
];
document.querySelector("#today").textContent = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
document.querySelector("#side-stories").innerHTML = stories.slice(1, 5).map((story, index) => `<article><p class="label">${story[0]}</p><h2><a href="#reading" data-story="${index + 1}">${story[1]}</a></h2><p class="byline">BY ${story[2]}</p></article>`).join("");
document.querySelector("#opinion-grid").innerHTML = stories.slice(9, 13).map((story, index) => `<article><div class="initials" aria-hidden="true">${story[2].split(" ").map((name) => name[0]).join("")}</div><p>${story[2]}</p><h3><a href="#reading" data-story="${index + 9}">${story[1]}</a></h3></article>`).join("");
document.querySelector("#most-read").innerHTML = [0, 2, 1, 8, 4].map((index) => `<li><a href="#reading" data-story="${index}">${stories[index][1]}</a></li>`).join("");
function readStory(index)
{
    const story = stories[index];
    document.querySelector("#reading").hidden = false;
    document.querySelector("#reading-category").textContent = story[0];
    document.querySelector("#reading-title").textContent = story[1];
    document.querySelector("#reading-byline").textContent = `BY ${story[2].toUpperCase()} · SAMPLE READING NOTE`;
    const copy = document.querySelector("#reading-copy");
    copy.replaceChildren(...story.slice(3).map((text) =>
    {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        return paragraph;
    }));
    document.querySelector("#archive").hidden = true;
    document.querySelector("#reading").scrollIntoView();
}
document.addEventListener("click", (event) =>
{
    const storyLink = event.target.closest("[data-story]");
    if (storyLink) readStory(Number(storyLink.dataset.story));
    const category = event.target.closest("[data-category]");
    if (category)
    {
        const name = category.dataset.category;
        const matches = stories.map((story, index) => ({ story, index })).filter(({ story }) => story[0] === name);
        document.querySelector("#archive").hidden = false;
        document.querySelector("#reading").hidden = true;
        document.querySelector("#archive-title").textContent = name;
        document.querySelector("#archive-list").innerHTML = matches.map(({ story, index }) => `<article><h3><a href="#reading" data-story="${index}">${story[1]}</a></h3><p>By ${story[2]}</p></article>`).join("");
        document.querySelector("#archive-empty").hidden = matches.length > 0;
        document.querySelector("#archive").scrollIntoView();
    }
});
["reading", "archive", "account"].forEach((name) => document.querySelector(`#close-${name}`).addEventListener("click", () => document.querySelector(`#${name}`).hidden = true));
document.querySelector("#signin").addEventListener("click", () => document.querySelector("#account").hidden = false);
document.querySelector("#newsletter").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const result = document.querySelector("#result");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.querySelector("#email").value))
    {
        result.textContent = "Enter a valid example email to preview the subscription.";
        return;
    }
    result.textContent = document.querySelector("#ack").checked ? "Your local Friday letter preview is ready. No subscription created, no email sent and no address stored." : "Confirm that this is a local subscription preview.";
});
