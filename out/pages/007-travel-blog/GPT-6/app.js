"use strict";

const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
const escapeText = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const authors = [
  { name: "Elena Vasquez", image: "elena", role: "Senior Writer", count: 89, bio: "Former architect turned full-time nomad. Currently based in Lisbon. Specializes in Mediterranean & Latin America." },
  { name: "Marcus Chen", image: "marcus", role: "Travel Hacker", count: 64, bio: "Points & miles obsessive. Flies 100K+ miles a year on airline rewards. Based in Singapore." },
  { name: "Priya Sharma", image: "priya", role: "Food & Culture Editor", count: 52, bio: "Culinary school graduate who traded the kitchen for the road. If it's fermented, she's tried it." },
  { name: "Diego Morales", image: "diego", role: "Adventure & Budget Editor", count: 41, bio: "Former Peace Corps volunteer. Believes the best travel costs the least. Based nowhere specific." },
];
const posts = [
  {
    id: "rail", title: "The Complete Japan Rail Pass Guide for 2026", category: "Travel Tips", image: "train", alt: "A train traveling through a green landscape",
    excerpt: "Everything you need to know about the JR Pass — routes, pricing, where to buy, and the 7 mistakes first-timers make.",
    author: "Marcus Chen", date: "2026-02-28", minutes: 8, reads: 9400,
    body: ["A good rail itinerary starts with a map, not a pass. Sketch the journeys you actually want to make, leave space for slower days, and compare the individual fares before committing to a bundle.", "Check the operator's current eligibility rules, reservation requirements and train restrictions. This is a sample editorial introduction rather than a live fare guide; the 2026 title comes from the original design brief."],
  },
  {
    id: "bangkok", title: "Street Food Markets of Bangkok: A Neighborhood-by-Neighborhood Guide", category: "Food & Drink", image: "bangkok", alt: "An inviting spread of food photographed from above",
    excerpt: "From Chinatown's legendary Yaowarat Road to the hidden alley stalls of Ari — where locals actually eat.",
    author: "Priya Sharma", date: "2026-02-25", minutes: 10, reads: 12000,
    body: ["The best way into a food neighborhood is on foot, with an empty afternoon and room to change your mind. Watch what is being cooked, ask before photographing people, and treat a busy stall as someone's workplace rather than your backdrop.", "Our sample Bangkok notebook is about curiosity rather than a definitive ranking. Opening times, ingredients and prices change; ask about allergens directly and consult current local guidance before planning a visit."],
  },
  {
    id: "patagonia", title: "Backpacking Patagonia on $50 a Day", category: "Budget Travel", image: "patagonia", alt: "Hikers following a winding mountain trail",
    excerpt: "Yes, it's possible. Here's exactly how we spent 3 weeks in one of the world's most expensive hiking destinations — without breaking the bank.",
    author: "Diego Morales", date: "2026-02-22", minutes: 14, reads: 15000, badge: "Editor's Pick",
    body: ["A modest travel budget buys freedom only when it leaves room for the unexpected. Shared meals, fewer transfers and properly planned rest days make a better starting point than racing between every trail on a map.", "The $50 headline is an illustrative figure from the brief, not a verified current cost or a promise. Park reservations, transport, weather equipment and emergency plans need independent, up-to-date research. Open our budget calculator for a simple arithmetic planning aid."],
  },
  {
    id: "surf", title: "Learning to Surf in Sri Lanka: A Beginner's Honest Diary", category: "Adventure", image: "surf", alt: "Turquoise ocean washing onto a bright sandy beach",
    excerpt: "Day 1: swallowed half the Indian Ocean. Day 7: stood up for 3 glorious seconds. Day 14: hooked for life.",
    author: "Elena Vasquez", date: "2026-02-18", minutes: 9, reads: 7300,
    body: ["There is a particular kind of humility in being a beginner again. The lesson starts before the first wave: listening, noticing the shoreline, and accepting that watching from the sand can be a very good decision.", "This fictional diary celebrates learning slowly, not instruction for entering the water. Choose a qualified local instructor, follow their assessment of conditions and your ability, and respect other people in the lineup."],
  },
  {
    id: "ceramics", title: "The Ceramics Villages of Portugal Nobody Talks About", category: "Culture", image: "ceramics", alt: "Handmade ceramic vessels in a sunlit pottery workshop",
    excerpt: "In Alcobaça, São Pedro do Corval, and Bordallo Pinheiro's hometown, centuries-old pottery traditions are alive and thriving.",
    author: "Sophie Laurent", date: "2026-02-15", minutes: 7, reads: 6200,
    body: ["A workshop is a place to linger. Look at the repeating shapes, the tools left beside a half-finished piece, the small decisions that make one bowl unlike the next. Ask before taking photographs and let the maker tell their own story.", "Our Portugal notebook connects ceramics with the everyday rituals that give them meaning. The villages in this preview are a starting point for research, not a verified directory of open studios or available tours."],
  },
  {
    id: "business", title: "How to Fly Business Class for Economy Prices", category: "Travel Tips", image: "suite", alt: "A thoughtfully arranged room illustrating the comfort of a slower journey",
    excerpt: "Award flights, positioning fares, mistake fares, and the 5 credit cards that actually deliver. No clickbait — real strategies we've used.",
    author: "Marcus Chen", date: "2026-02-12", minutes: 11, reads: 24000, badge: "Popular",
    body: ["Before chasing an upgrade, decide what you actually value: a simpler route, a better departure time, or a comfortable overnight journey. The cheapest headline is not always the lowest total cost.", "This is a fictional article preview, not a reviewed list of cards, financial advice or a current fare offer. No credit-card products are recommended here. Check fees, eligibility, connection risks and the full terms of any rewards program independently."],
  },
  {
    id: "marrakech", title: "48 Hours in Marrakech: Medina, Mountains & Mint Tea", category: "Destinations", image: "desert", alt: "Sculpted dunes and warm desert light",
    excerpt: "A whirlwind weekend itinerary covering the souk, Atlas Mountains day trip, and the best riad rooftop dinners.",
    author: "Priya Sharma", date: "2026-02-08", minutes: 8, reads: 8700,
    body: ["A short city break does not need to be a race. Begin with one neighborhood, a long tea break, and enough unplanned time to notice the change of light on a wall or the rhythm of a busy square.", "Our fictional Marrakech sketch favors fewer stops over an impossible checklist. Choose either a city-focused weekend or a properly planned excursion; current transport, opening hours and local guidance belong in your real itinerary."],
  },
  {
    id: "mezcal", title: "Oaxaca's Mezcal Trail: Farm to Glass", category: "Food & Drink", image: "forest", alt: "Sunlight falling across a lush green landscape",
    excerpt: "We visited 5 family palenques and tasted mezcal made from wild agave species you'll never find in a bar.",
    author: "Diego Morales", date: "2026-02-05", minutes: 6, reads: 5800,
    body: ["The most interesting question at a small producer is often not what is in the glass, but how it got there. Land, labor and patient knowledge are part of the story; a visitor's role begins with listening.", "The five-producer journey in the brief is a fictional editorial premise, not a list of verified businesses. Arrange visits respectfully, follow local laws and guidance, and use an appropriate transport plan rather than driving after tasting."],
  },
  {
    id: "jordan", title: "Solo Female Travel in Jordan: What I Wish I'd Known", category: "Adventure", image: "desert", alt: "A quiet desert landscape in warm morning light",
    excerpt: "From Amman's street art scene to floating in the Dead Sea — safety tips, packing advice, and the moments that made it unforgettable.",
    author: "Elena Vasquez", date: "2026-02-01", minutes: 13, reads: 11000,
    body: ["A solo trip can be both independent and well supported. The practical work happens before departure: understanding local expectations, leaving a flexible plan with someone you trust, and choosing transport and accommodation with care.", "This fictional personal essay is not a safety assessment or current travel advisory. Check your government's current advice, entry rules and local conditions before making plans, and reassess them as your departure approaches."],
  },
  {
    id: "slow-travel", title: "The Quiet Joy of Staying One More Day", category: "Culture", image: "lisbon", alt: "Lisbon rooftops and layered city streets",
    excerpt: "What happens when you stop collecting destinations and start learning the name of the person who makes your morning coffee?",
    author: "Elena Vasquez", date: "2026-01-28", minutes: 5, reads: 4100,
    body: ["The extra day has no itinerary. It is the day you walk the same street without checking a map, return to a small café, and notice the door that was closed yesterday.", "This original sample essay is an invitation to travel at a gentler pace. The people and encounters are fictional, and there is no claim that staying longer is possible for every traveler or every budget."],
  },
  {
    id: "packing", title: "A Smaller Bag, a Bigger Sense of Freedom", category: "Travel Tips", image: "coast", alt: "A clear lake beneath a dramatic mountain landscape",
    excerpt: "A thoughtful packing list for the things you'll actually use, with a little room left for whatever the road brings.",
    author: "Marcus Chen", date: "2026-01-24", minutes: 6, reads: 3500,
    body: ["Start with the journey you are taking, not the imaginary journey in which every eventuality needs its own outfit. Layering and a realistic laundry plan can make a small bag feel generous.", "Our sample packing checklist is a memory aid, not a universal equipment list. Adapt it to current weather, accessibility needs, your activities and the rules of your transport providers."],
  },
  {
    id: "market", title: "How to Make a Market Morning Last All Day", category: "Food & Drink", image: "bangkok", alt: "A colorful shared meal with vegetables and spices",
    excerpt: "An unhurried breakfast, a conversation with a producer, and the delicious art of leaving a little room for lunch.",
    author: "Priya Sharma", date: "2026-01-20", minutes: 7, reads: 2900,
    body: ["Arrive curious, buy something small, and let the morning unfold. Markets reward attention: the change in produce through the seasons, the sound of people greeting one another, and the quiet expertise behind a familiar stall.", "This original editorial sample does not review a particular market or vendor. Ask about ingredients and photography, respect working space, and leave the place as welcoming as you found it."],
  },
];
const featured = {
  id: "santorini", title: "48 Hours in Santorini: Beyond the Instagram Spots", category: "Destinations", image: "santorini", alt: "Santorini's whitewashed rooftops above the blue Aegean Sea",
  excerpt: "We skipped the crowded caldera viewpoints and found hidden cliff-side tavernas, volcanic hot springs, and a winery that's been family-run since 1947.",
  author: "Elena Vasquez", date: "2026-03-08", minutes: 12, reads: 18000,
  body: ["A place changes when you give it time. Leave the first morning open, walk away from the busiest viewpoint, and pause where everyday life continues beyond the frame. The island is more than the photograph you came to take.", "For a slower two-day sketch, pair a village walk and a long lunch with a second day shaped by the weather and your interests. Confirm transport and any guided activities with current local providers instead of treating a beautiful itinerary as a booking.", "The hidden tavernas, hot springs and family winery in the original brief are fictional editorial details, not verified recommendations. This sample preview offers the feeling of a travel magazine without pretending a reported full-length article or a real reservation service exists."],
};
const portugalNotes = [
  { id: "miradores", title: "Lisbon's Hidden Miradores: 8 Viewpoints the Guidebooks Miss", category: "Destinations", image: "lisbon", alt: "Lisbon rooftops", excerpt: "A slower walk through a city that always has another hill to climb.", author: "Elena Vasquez", date: "2026-03-01", minutes: 6, body: ["A viewpoint is not only the place where you stop to take a picture. The walk up, a shady bench, and the streets on the other side can become the best part of the day.", "This is a short original Portugal notebook preview. A researched eight-stop itinerary is not included; check current access, gradients and transport for a route that suits you."] },
  { id: "douro", title: "Porto Wine Tasting: A Route Through the Douro Valley", category: "Food & Drink", image: "coast", alt: "A scenic waterside landscape", excerpt: "Following a river, taking our time, and listening to the people who make a place.", author: "Priya Sharma", date: "2026-02-26", minutes: 7, body: ["The most memorable part of a producer visit is often a conversation about the land, not a tasting note. Leave space between stops and arrange visits with the people who will host you.", "This original editorial preview does not list verified wineries, tastings or transport. Check availability and local rules directly, and choose transport that does not involve driving after drinking."] },
  { id: "algarve", title: "Algarve Coast on a Budget: Camping, Hiking & Beach Life", category: "Budget Travel", image: "surf", alt: "A sunlit beach and turquoise water", excerpt: "Making room for the coast without filling every hour of the day.", author: "Diego Morales", date: "2026-02-20", minutes: 8, body: ["Coastal days can be wonderfully simple: a walk, a picnic and enough time to follow the changing light. Simplicity still needs planning, especially when protected landscapes and seasonal transport are involved.", "This sample is not a current campsite directory or trail safety guide. Use permitted accommodation, verify access and current local conditions, and keep a realistic reserve in your budget."] },
];
const allStories = [...posts, featured, ...portugalNotes];
const byId = new Map(allStories.map((post) => [post.id, post]));
const avatar = (name) => authors.find((author) => author.name === name)?.image ?? "sophie";
const dateLabel = (date) => new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
let saved;
try {
  const stored = JSON.parse(localStorage.getItem("wanderlust-saved") || "[]");
  saved = new Set(Array.isArray(stored) ? stored.filter((id) => typeof id === "string" && byId.has(id)) : []);
} catch { saved = new Set(); }
let category = "All";
let authorFilter = "";
let savedOnly = false;
let order = "recent";
let visibleLimit = 9;
let toastTimer;
const grid = document.querySelector("#story-grid");
const contentDialog = document.querySelector("#content-dialog");
const dialogContent = document.querySelector("#dialog-content");
const menuDialog = document.querySelector("#menu-dialog");

function toast(message) {
  const element = document.querySelector("#toast");
  element.textContent = message;
  element.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove("visible"), 3500);
}
function openDialog(markup) {
  dialogContent.innerHTML = markup;
  if (!contentDialog.open) contentDialog.showModal();
  contentDialog.scrollTop = 0;
  document.querySelector("#dialog-close").focus();
}
function updateSaved() {
  const badge = document.querySelector("#saved-count");
  badge.textContent = saved.size;
  badge.hidden = saved.size === 0;
  for (const button of document.querySelectorAll("[data-save]")) {
    button.setAttribute("aria-pressed", String(saved.has(button.dataset.save)));
    button.setAttribute("aria-label", `${saved.has(button.dataset.save) ? "Unsave" : "Save"} ${byId.get(button.dataset.save).title}`);
  }
}
function toggleSaved(id) {
  const isSaved = saved.has(id);
  if (isSaved) saved.delete(id);
  else saved.add(id);
  let persisted = true;
  try { localStorage.setItem("wanderlust-saved", JSON.stringify([...saved])); }
  catch { persisted = false; }
  updateSaved();
  if (savedOnly) renderStories();
  toast(`${isSaved ? "Removed from" : "Added to"} your reading list.${persisted ? "" : " Saved for this session only."}`);
}
function storyCard(post) {
  return `<article class="story-card" data-id="${post.id}">
    <div class="card-photo"><button class="card-image-link" data-post="${post.id}" aria-label="Read ${escapeText(post.title)}"><img src="assets/${post.image}.jpg" alt="${escapeText(post.alt)}" width="640" height="360" loading="lazy"></button>
      <button class="bookmark" data-save="${post.id}" aria-label="Save ${escapeText(post.title)}" aria-pressed="${saved.has(post.id)}">${icon("Bookmark")}</button>
      ${post.badge ? `<span class="card-badge ${post.badge === "Popular" ? "popular" : ""}">${escapeText(post.badge)}</span>` : ""}</div>
    <div class="card-body"><span class="card-category">${escapeText(post.category)}</span><h3 class="card-title"><button data-post="${post.id}">${escapeText(post.title)}</button></h3><p class="card-excerpt">${escapeText(post.excerpt)}</p>
      <div class="card-byline"><img src="assets/${avatar(post.author)}.jpg" alt="" width="29" height="29" loading="lazy"><div><strong>${escapeText(post.author)}</strong><span>${dateLabel(post.date)}</span></div><span class="read-time">${post.minutes} min read</span></div>
    </div></article>`;
}
function renderStories() {
  let filtered = posts.filter((post) => (category === "All" || post.category === category) && (!authorFilter || post.author === authorFilter) && (!savedOnly || saved.has(post.id)));
  if (savedOnly) filtered = allStories.filter((post) => saved.has(post.id));
  filtered.sort(order === "popular" ? (a, b) => b.reads - a.reads : (a, b) => b.date.localeCompare(a.date));
  const shown = filtered.slice(0, visibleLimit);
  grid.innerHTML = shown.map(storyCard).join("");
  document.querySelector("#empty-state").hidden = filtered.length !== 0;
  const load = document.querySelector("#load-more");
  load.hidden = shown.length >= filtered.length;
  document.querySelector("#load-note").textContent = filtered.length === 0 ? "" : shown.length >= filtered.length ? "You're all caught up with this sample edition." : "A little more inspiration, just around the corner.";
  document.querySelector("#story-status").textContent = `${shown.length} of ${filtered.length} sample stories${savedOnly ? " in your reading list" : authorFilter ? ` by ${authorFilter}` : category !== "All" ? ` · ${category}` : ""}.`;
  document.querySelector("#clear-filters").hidden = category === "All" && !authorFilter && !savedOnly;
  document.querySelector("#stories-title").innerHTML = `${savedOnly ? "Your Reading List" : authorFilter ? "Writer's Stories" : "Latest Stories"}<span class="accent-dot">.</span>`;
  for (const button of document.querySelectorAll("[data-filter]")) {
    const active = !savedOnly && !authorFilter && button.dataset.filter === category;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  }
  updateSaved();
}
function filterCategory(next) {
  category = next;
  authorFilter = "";
  savedOnly = false;
  visibleLimit = 9;
  renderStories();
}
function goToStories() {
  document.querySelector("#stories").scrollIntoView();
}
function openPost(id) {
  const post = byId.get(id);
  if (!post) return;
  openDialog(`<p class="eyebrow dialog-eyebrow">${escapeText(post.category)} · The reading room</p>
    <h2 id="dialog-title">${escapeText(post.title)}</h2><p class="dialog-byline">By ${escapeText(post.author)} · ${dateLabel(post.date)} · ${post.minutes} min read (brief fixture)</p>
    <img class="dialog-cover" src="assets/${post.image}.jpg" alt="${escapeText(post.alt)}" width="680" height="380">
    <div class="article-notice">Original sample preview, not a full reported article. Authors, dates, claims and reading times are fictional design fixtures. Photography is illustrative and may not depict the named place.</div>
    <div class="article-copy">${post.body.map((paragraph) => `<p>${escapeText(paragraph)}</p>`).join("")}</div>
    <div class="article-actions"><button class="button button-outline" data-save="${post.id}" aria-pressed="${saved.has(post.id)}" aria-label="${saved.has(post.id) ? "Unsave" : "Save"} ${escapeText(post.title)}">${icon("Bookmark")} Save to reading list</button></div>`);
}
function searchResults(query) {
  const term = query.trim().toLocaleLowerCase();
  const matches = term ? allStories.filter((post) => `${post.title} ${post.category} ${post.author} ${post.excerpt}`.toLocaleLowerCase().includes(term)) : [];
  document.querySelector("#search-results").innerHTML = matches.map((post) => `<button class="search-result" data-post="${post.id}"><span>${escapeText(post.category)} · ${escapeText(post.author)}</span>${escapeText(post.title)}</button>`).join("");
  document.querySelector("#search-status").textContent = !term ? "Search this sample edition by destination, topic or writer." : matches.length ? `${matches.length} sample ${matches.length === 1 ? "story" : "stories"} found.` : "No stories found. Try Portugal, Japan or Elena.";
}
function openSearch() {
  openDialog(`<p class="eyebrow">Take the scenic route</p><h2 id="dialog-title">Where does curiosity take you?</h2><label class="search-label" for="story-search">Search stories, places and writers</label><input class="dialog-input" id="story-search" type="search" maxlength="150" placeholder="Try Portugal, Japan, or Elena…" autocomplete="off"><p class="search-note" id="search-status" role="status">Search this sample edition by destination, topic or writer.</p><div class="search-results" id="search-results"></div>`);
  const input = document.querySelector("#story-search");
  input.addEventListener("input", () => searchResults(input.value));
  input.focus();
}
const information = {
  story: ["A magazine for the beautifully curious", "Wanderlust Chronicles is an independent travel magazine concept: a place for slower journeys, thoughtful questions and perspectives that reach beyond the postcard.", "The writers, readership and reported experiences on this page are fictional. Every expanded reading preview was written for this demonstration, rather than copied from a published travel article."],
  write: ["Every journey has a point of view", "Our imagined contributors care about people, place and responsible storytelling. A thoughtful pitch would explain its perspective, research, consent and why the story matters.", "This is a static concept, not an operating publication. No pitch submission or contact service is connected."],
  guidelines: ["Curiosity, with care", "Our editorial direction values clear sourcing, respectful photography, transparent corrections and a distinction between personal experience and verified practical advice.", "Sample claims, titles, dates and profiles are fictional. Check current prices, opening times, access, local laws and travel advice directly before planning a real journey."],
  press: ["The press room", "The magazine identity and all audience statistics are illustrative. No press kit, verified circulation report or media endorsement is available.", "Publication names in the newsletter section are plain-text design references, not logos, permissions or claims of an actual feature."],
  advertise: ["Good stories come first", "This concept has no advertisers, sponsored content or affiliate links. It does not collect inquiries or offer a commercial rate card."],
  insurance: ["A note on travel insurance", "Coverage depends on your policy, eligibility, activities and destination. Read the actual policy wording, exclusions and assistance procedures, and discuss your needs with a qualified provider.", "This demonstration does not compare products, provide personalized advice or sell insurance."],
  visa: ["Check the source before the suitcase", "Entry rules depend on your citizenship, travel documents, route and current circumstances. Verify requirements with the relevant official immigration authority or consulate.", "No live eligibility checker or current visa database is connected. This page is not an authoritative source of entry advice."],
  flights: ["A little flexibility goes a long way", "Compare complete itineraries, baggage, transfers, change rules and total costs rather than only a headline fare.", "No live fares, alerts or booking service are connected. Stories about prices and rewards are fictional editorial previews, not available offers."],
  instagram: ["A visual travel notebook", "The six photographs below are a local, illustrative gallery, not a live Instagram feed. @WanderlustChron is the fictional identity supplied in the design brief.", "No account, follow action, social login or external tracking service is connected."],
  social: ["A journey, not a connected account", "Social channels are part of this magazine concept. No verified YouTube, Twitter/X or Pinterest account is linked, and no account access is requested."],
  rss: ["The next edition, in your reader", "An RSS feed would need a real publishing archive and canonical article addresses. This static homepage offers sample reading previews only; no feed is fabricated."],
  privacy: ["A simpler kind of privacy", "This page sends no newsletter signups, searches or reading activity to a backend. Search and form feedback run in your browser. The email input is cleared after the demonstration signup.", "Saved story identifiers are stored locally under wanderlust-saved when browser storage is available. You can clear them in Cookie Settings. No analytics, social embeds or tracking cookies are used."],
  terms: ["About this concept", "This is an illustrative static magazine homepage, not a travel provider, safety advisory, financial adviser or operating publisher. No bookings, payments or subscriptions are made here.", "Travel stories and author profiles are fictional. Images remain subject to their source licenses; font and icon license notices accompany the static files. This collection grants no additional image rights."],
};
function openInfo(key) {
  if (key === "packing") {
    openDialog(`<p class="eyebrow">A useful little list</p><h2 id="dialog-title">Pack less. Notice more.</h2><p class="search-note">A starting checklist for a short city trip. Adjust for your needs, weather and activities. Checks last only while this panel is open.</p><div class="pack-list">${["Travel documents and required entry paperwork", "Medication and personal essentials", "Layers suited to the weather", "Comfortable shoes", "Chargers and the right plug adapter", "Refillable bottle and a small day bag", "Booking details and emergency contacts"].map((item) => `<label><input type="checkbox">${item}</label>`).join("")}</div>`);
    return;
  }
  if (key === "budget") {
    openDialog(`<p class="eyebrow">Leave a little room for the unexpected</p><h2 id="dialog-title">Your simple travel budget</h2><p class="search-note">An arithmetic planning aid in USD, not current destination pricing. Daily costs include accommodation, food and local transport.</p><div class="budget-fields"><label>Days<input id="budget-days" type="number" min="1" max="365" step="1" value="7"></label><label>Daily costs ($)<input id="budget-daily" type="number" min="0" max="10000" step="0.01" value="50"></label><label>Transport ($)<input id="budget-transport" type="number" min="0" max="100000" step="0.01" value="300"></label></div><p class="eyebrow">Estimated total + 15% reserve</p><output class="budget-output" id="budget-total" aria-live="polite"></output><p class="search-note">Add insurance, visas and any other expenses separately.</p>`);
    const inputs = [...document.querySelectorAll(".budget-fields input")];
    const calculate = () => {
      const valid = inputs.every((input) => input.value !== "" && input.checkValidity());
      const [days, daily, transport] = inputs.map((input) => Number(input.value));
      document.querySelector("#budget-total").textContent = valid ? ((days * daily + transport) * 1.15).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }) : "Enter valid costs and 1–365 whole days.";
    };
    inputs.forEach((input) => input.addEventListener("input", calculate));
    calculate();
    return;
  }
  if (key === "cookies") {
    openDialog(`<p class="eyebrow">You are in control</p><h2 id="dialog-title">Local storage, not tracking</h2><div class="article-copy"><p>No tracking cookies, advertising or analytics are used. Only your saved story IDs are stored on this device when browser storage is available.</p></div><button class="button button-outline" id="clear-saved">Clear my saved stories</button><p class="search-note" id="storage-status" role="status"></p>`);
    document.querySelector("#clear-saved").addEventListener("click", () => {
      let cleared = true;
      try { localStorage.removeItem("wanderlust-saved"); } catch { cleared = false; }
      saved.clear();
      renderStories();
      document.querySelector("#storage-status").textContent = cleared ? "Saved stories cleared from this device." : "Session reading list cleared. Browser storage is unavailable; use browser settings to remove older saved data.";
    });
    return;
  }
  const [title, ...paragraphs] = information[key] ?? information.story;
  openDialog(`<p class="eyebrow">Wanderlust Chronicles</p><h2 id="dialog-title">${escapeText(title)}</h2><div class="article-copy">${paragraphs.map((text) => `<p>${escapeText(text)}</p>`).join("")}</div>`);
}

document.querySelector("#trending-list").innerHTML = ["business", "santorini", "patagonia", "bangkok", "jordan"].map((id, index) => {
  const post = byId.get(id);
  return `<button class="trending-entry" data-post="${id}"><span class="trend-number">${index + 1}</span><span><span class="trend-title">${escapeText(post.title)}</span><span class="trend-meta">${escapeText(post.author)}<br>${Math.round(post.reads / 1000)}K reads · illustrative</span></span></button>`;
}).join("");
document.querySelector("#writers-grid").innerHTML = authors.map((author) => `<article class="writer-card"><img src="assets/${author.image}.jpg" alt="Illustrative portrait for fictional writer ${escapeText(author.name)}" width="80" height="80" loading="lazy"><h3>${escapeText(author.name)}</h3><p class="writer-role">${escapeText(author.role)} · ${author.count} articles</p><p class="writer-bio">${escapeText(author.bio)}</p><button class="text-link writer-link teal-link" data-author="${escapeText(author.name)}">View All Posts ${icon("ArrowRight")}</button></article>`).join("");
const photos = [
  { image: "japan", location: "Kyoto, Japan", post: "rail" },
  { image: "desert", location: "Marrakech, Morocco", post: "marrakech" },
  { image: "lisbon", location: "Lisbon, Portugal", post: "miradores" },
  { image: "surf", location: "Arugam Bay, Sri Lanka", post: "surf" },
  { image: "santorini", location: "Santorini, Greece", post: "santorini" },
  { image: "patagonia", location: "Patagonia, South America", post: "patagonia" },
];
document.querySelector("#photo-grid").innerHTML = photos.map((photo) => `<button class="photo-tile" data-post="${photo.post}" aria-label="Explore ${escapeText(photo.location)} · illustrative photograph"><img src="assets/${photo.image}.jpg" alt="Illustrative travel photograph for ${escapeText(photo.location)}" width="640" height="400" loading="lazy"><span>${escapeText(photo.location)} ${icon("ArrowUpRight")}</span></button>`).join("");
document.addEventListener("click", (event) => {
  const button = event.target.closest("button, a");
  if (!button) return;
  if (button.dataset.post) openPost(button.dataset.post);
  else if (button.dataset.save) toggleSaved(button.dataset.save);
  else if (button.dataset.info) openInfo(button.dataset.info);
  else if (button.dataset.filter) filterCategory(button.dataset.filter);
  else if (button.dataset.category) {
    event.preventDefault();
    if (menuDialog.open) menuDialog.close();
    filterCategory(button.dataset.category);
    goToStories();
  } else if (button.dataset.author) {
    category = "All"; savedOnly = false; authorFilter = button.dataset.author; visibleLimit = 9;
    renderStories(); goToStories();
  } else if (button.dataset.sort) {
    order = button.dataset.sort;
    document.querySelectorAll("[data-sort]").forEach((item) => {
      const active = item.dataset.sort === order;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    renderStories();
  }
});
document.querySelector("#search-open").addEventListener("click", openSearch);
document.querySelector("#saved-open").addEventListener("click", () => {
  category = "All"; authorFilter = ""; savedOnly = true; visibleLimit = 100;
  renderStories(); goToStories();
});
document.querySelector("#dialog-close").addEventListener("click", () => contentDialog.close());
document.querySelector("#menu-open").addEventListener("click", () => menuDialog.showModal());
document.querySelector("#menu-close").addEventListener("click", () => menuDialog.close());
document.querySelector("#mobile-subscribe").addEventListener("click", () => menuDialog.close());
document.querySelector("#clear-filters").addEventListener("click", () => filterCategory("All"));
document.querySelector("#empty-reset").addEventListener("click", () => filterCategory("All"));
document.querySelector("#load-more").addEventListener("click", () => {
  const previous = grid.querySelectorAll(".story-card").length;
  visibleLimit += 3;
  renderStories();
  grid.querySelectorAll(".card-title button")[previous]?.focus({ preventScroll: true });
});
document.querySelector("#portugal-all").addEventListener("click", () => {
  const related = [...portugalNotes, byId.get("ceramics")];
  openDialog(`<p class="eyebrow">Destination deep dive</p><h2 id="dialog-title">The Portugal notebook</h2><p class="search-note">Four sample reading previews. A monthly publishing service is not connected.</p><div class="search-results">${related.map((post) => `<button class="search-result" data-post="${post.id}"><span>${escapeText(post.category)}</span>${escapeText(post.title)}</button>`).join("")}</div>`);
});
document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#newsletter-status").textContent = "Thanks for exploring! This is a demo — no email was stored or sent.";
  document.querySelector("#newsletter-email").value = "";
});
const backTop = document.querySelector("#back-top");
window.addEventListener("scroll", () => { backTop.hidden = window.scrollY < 650; }, { passive: true });
backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }));
for (const dialog of [contentDialog, menuDialog]) {
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [...dialog.querySelectorAll("a[href], button, input, select, textarea, [tabindex]")]
      .filter((element) => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length);
    const target = event.shiftKey && document.activeElement === controls[0] ? controls.at(-1)
      : !event.shiftKey && document.activeElement === controls.at(-1) ? controls[0] : null;
    if (target) {
      event.preventDefault();
      target.focus();
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
}
renderStories();
