export const categories = ["Destinations", "Adventure", "Culture", "Food & Drink", "Budget Travel", "Travel Tips"] as const;
export type Category = typeof categories[number];
export const archiveCounts = [42, 28, 19, 24, 16, 31];
export type Author = { name: string; role: string; count: number; bio: string; color: string };
export const authors: Author[] = [
  { name: "Elena Vasquez", role: "Senior Writer", count: 89, bio: "Former architect turned full-time nomad. Based in Lisbon; drawn to the Mediterranean and Latin America.", color: "#d4a285" },
  { name: "Marcus Chen", role: "Travel Hacker", count: 64, bio: "Points & miles obsessive. His fictional beat: making the long way round a little more affordable. Based in Singapore.", color: "#a8b4a2" },
  { name: "Priya Sharma", role: "Food & Culture Editor", count: 52, bio: "Culinary school graduate who traded the kitchen for the road. If it's fermented, she's curious.", color: "#dbab67" },
  { name: "Diego Morales", role: "Adventure & Budget Editor", count: 41, bio: "A fictional former volunteer who believes the best travel costs the least. Based nowhere specific.", color: "#94b2bb" }
];
export type Story = {
  id: string; title: string; category: Category; author: string; date: string; minutes: number;
  image: string; location: string; excerpt: string; reads: number; badge?: string;
  sections: { heading: string; text: string }[];
};
export const stories: Story[] = [
  {
    id: "santorini", title: "48 Hours in Santorini: Beyond the Instagram Spots", category: "Destinations", author: "Elena Vasquez", date: "2026-03-08", minutes: 12, image: "santorini", location: "Santorini, Greece", reads: 18000,
    excerpt: "We skipped the crowded caldera viewpoints and found hidden cliff-side tavernas, volcanic hot springs, and a winery that's been family-run since 1947.",
    sections: [
      { heading: "Day one: trade the queue for a quiet lane", text: "In this imagined weekend, we start in a village away from the postcard circuit. Whitewashed stairways catch the morning light; a bakery opens its shutters. Walk slowly, leave room for residents to pass and ask before photographing a doorway. The point is not to collect a secret location, but to notice an ordinary morning." },
      { heading: "A table with a view, not a timetable", text: "Our fictional cliff-side taverna serves tomatoes, capers and bread while the sea turns silver. A family winery, imagined here as opening in 1947, provides the afternoon setting. In a real visit, confirm opening hours, book directly and arrange transport before tasting; this story does not recommend an actual business." },
      { heading: "Day two: the island is bigger than its image", text: "Explore the volcanic landscape with a licensed local guide if conditions allow. Hot-spring excursions involve boats, swimming ability and changing weather; ask operators about access and safety instead of assuming the experience suits everyone. End with a sunset walk, not a race to the famous blue dome." }
    ]
  },
  {
    id: "japan-rail", title: "The Complete Japan Rail Pass Guide for 2026", category: "Travel Tips", author: "Marcus Chen", date: "2026-02-28", minutes: 8, image: "japan", location: "Kyoto, Japan", reads: 9600,
    excerpt: "Everything you need to know about the JR Pass — routes, pricing, where to buy, and the 7 mistakes first-timers make.",
    sections: [
      { heading: "Start with the journey, not the pass", text: "List the train trips you actually want to take, including their dates. Compare individual tickets with a national pass and regional passes using current official prices. This demo deliberately gives no live fares: rail rules, eligibility and supplements change, and a pass is not automatically the cheapest choice." },
      { heading: "Seven easy mistakes to avoid", text: "Do not assume all trains are covered, count airport transfers twice, activate too early, forget seat reservations, ignore luggage rules, plan impossible connections or purchase from an unverified seller. Group nearby cities into slower stays; fewer hotel changes can save more than any ticket trick." },
      { heading: "Build a flexible rail day", text: "Keep your passport and booking details accessible. Allow extra time in unfamiliar stations and check lift access if needed. Reserve popular routes through the official operator, verify oversized-baggage requirements, and keep an alternative departure in mind. A station lunch and an unhurried platform are part of the trip." }
    ]
  },
  {
    id: "bangkok", title: "Street Food Markets of Bangkok: A Neighborhood-by-Neighborhood Guide", category: "Food & Drink", author: "Priya Sharma", date: "2026-02-25", minutes: 10, image: "bangkok", location: "Bangkok, Thailand", reads: 12000,
    excerpt: "From Chinatown's legendary Yaowarat Road to the hidden alley stalls of Ari — where locals actually eat.",
    sections: [
      { heading: "Yaowarat after the lights come on", text: "The opening scene in this original fictional dispatch is all steam, bright signs and a queue that curls around a wok. Start with one small dish rather than a long checklist. Watch where people line up, make space on the pavement and ask a vendor whether there is somewhere appropriate to stand and eat." },
      { heading: "A quieter morning in Ari", text: "Change the pace with breakfast and a neighborhood walk. Order something freshly cooked, carry water and learn a few courteous words. Markets are workplaces, not sets: ask before taking a close-up photograph, and do not block someone who is carrying a hot pan." },
      { heading: "Eat with curiosity and care", text: "Explain allergies clearly and remember that shared utensils or sauces can introduce allergens. If safe communication is not possible, choose somewhere else. This is not a vetted food-safety directory; research current openings and local advice before turning a story into an itinerary." }
    ]
  },
  {
    id: "patagonia", title: "Backpacking Patagonia on $50 a Day", category: "Budget Travel", author: "Diego Morales", date: "2026-02-22", minutes: 14, image: "patagonia", location: "Patagonia, Chile", reads: 15000, badge: "Editor's Pick",
    excerpt: "Yes, it's possible. Here's exactly how we spent 3 weeks in one of the world's most expensive hiking destinations — without breaking the bank.",
    sections: [
      { heading: "The $50 is a planning exercise", text: "Our fictional daily envelope puts $18 toward camping, $15 toward groceries, $10 toward transport and $7 toward contingency. These are illustrative dollars, not researched 2026 prices. Flights, equipment, park permits and travel insurance are excluded; those costs can change the total substantially." },
      { heading: "Book the essentials, leave the rest loose", text: "Research park access and campsite requirements well ahead. Cook simple shared meals and use public transport where available, but do not choose a risky route to save money. A buffer for a weather delay is part of a realistic budget, not an optional luxury." },
      { heading: "Leave only the path you walked", text: "Stay on marked trails, carry out all waste and follow stove restrictions. Wind can turn a mild day into a serious situation. Check official forecasts and ranger guidance; bring appropriate layers and turn back early if the conditions exceed your experience." }
    ]
  },
  {
    id: "sri-lanka", title: "Learning to Surf in Sri Lanka: A Beginner's Honest Diary", category: "Adventure", author: "Elena Vasquez", date: "2026-02-18", minutes: 9, image: "surf", location: "Arugam Bay, Sri Lanka", reads: 7200,
    excerpt: "Day 1: swallowed half the Indian Ocean. Day 7: stood up for 3 glorious seconds. Day 14: hooked for life.",
    sections: [
      { heading: "Day one: begin on the sand", text: "Our fictional beginner spends the first lesson practicing a pop-up away from the waves. A qualified instructor explains the break, other surfers' right of way and how to fall safely. Being comfortable swimming is a starting point, not a replacement for local guidance." },
      { heading: "Day seven: three good seconds", text: "The small victory arrives on a gentle white-water wave. Between sessions we rest, refill water and learn to recognize when fatigue makes the next attempt a bad idea. Progress is not a straight line and there is no deadline to stand up." },
      { heading: "Day fourteen: a practice, not a trophy", text: "Choose a beginner-appropriate school, verify current seasonal conditions and ask about rescue arrangements. Respect beach access and local surf etiquette. The diary's timeline is invented; a safe lesson and a good afternoon matter more than copying someone else's pace." }
    ]
  },
  {
    id: "ceramics", title: "The Ceramics Villages of Portugal Nobody Talks About", category: "Culture", author: "Sophie Laurent", date: "2026-02-15", minutes: 7, image: "ceramics", location: "Alentejo, Portugal", reads: 6200,
    excerpt: "In Alcobaça, São Pedro do Corval, and Bordallo Pinheiro's hometown, centuries-old pottery traditions are alive and thriving.",
    sections: [
      { heading: "Let the workshop set the rhythm", text: "In an imagined studio in São Pedro do Corval, a bowl turns slowly under a painter's hand. The brushwork is the event. Ask whether visitors are welcome and whether photography is permitted; a working studio may not have the schedule of a museum." },
      { heading: "From tiles to tableware", text: "Alcobaça and Caldas da Rainha offer different entry points into Portuguese ceramics. Look for maker information, ask how a piece was produced and understand the difference between a handmade object and a souvenir reproduction. No individual workshop is endorsed in this demo." },
      { heading: "Bring a story home carefully", text: "Buy directly when possible, pack fragile pieces properly and check baggage limits before choosing a large platter. A small piece with a known maker can hold more meaning than a suitcase full of anonymous tiles. Never remove tiles from buildings or public sites." }
    ]
  },
  {
    id: "business-class", title: "How to Fly Business Class for Economy Prices", category: "Travel Tips", author: "Marcus Chen", date: "2026-02-12", minutes: 11, image: "flight", location: "Somewhere above the clouds", reads: 24000, badge: "Popular",
    excerpt: "Award flights, positioning fares, mistake fares, and the 5 credit cards that actually deliver. No clickbait — real strategies we've used.",
    sections: [
      { heading: "Value the entire trip", text: "This fictional headline is an invitation to compare, not a promise of cheap premium seats. Add taxes, positioning flights, overnight stays and cancellation fees before celebrating a redemption. Sometimes a direct economy flight is the better journey." },
      { heading: "Points are not free money", text: "Check award availability before transferring points; transfers can be irreversible. This demo recommends no credit cards and has no affiliate links. Interest, annual fees and overspending can outweigh any rewards, so do not borrow to chase a flight." },
      { heading: "Keep expectations flexible", text: "Search alternate dates and airports, understand change rules and use official airline channels. An unusually low fare may be canceled, so avoid making nonrefundable connected plans until ticketing is confirmed. All examples here are editorial scenarios rather than current deals." }
    ]
  },
  {
    id: "marrakech", title: "48 Hours in Marrakech: Medina, Mountains & Mint Tea", category: "Destinations", author: "Priya Sharma", date: "2026-02-08", minutes: 8, image: "marrakech", location: "Marrakech, Morocco", reads: 8400,
    excerpt: "A whirlwind weekend itinerary covering the souk, Atlas Mountains day trip, and the best riad rooftop dinners.",
    sections: [
      { heading: "Find your bearings before getting lost", text: "Our imagined first morning starts with a map saved offline and a slow walk through the medina. Note a few landmarks and your accommodation's address. Ask permission before photographing people, and agree on prices before accepting services." },
      { heading: "Blue walls and a quieter hour", text: "A garden visit offers a pause from narrow lanes and busy markets. Check the official ticket process, opening hours and accessibility in advance. Leave room for lunch rather than packing every attraction into one afternoon." },
      { heading: "Mountains are not an afterthought", text: "For an Atlas outing, choose a qualified local guide and a route that fits your ability. Conditions and road access can change. If the trip would turn two days into a rushed commute, stay in the city and give a rooftop tea its own unhurried hour." }
    ]
  },
  {
    id: "oaxaca", title: "Oaxaca's Mezcal Trail: Farm to Glass", category: "Food & Drink", author: "Diego Morales", date: "2026-02-05", minutes: 6, image: "agave", location: "Oaxaca, Mexico", reads: 5100,
    excerpt: "We visited 5 family palenques and tasted mezcal made from wild agave species you'll never find in a bar.",
    sections: [
      { heading: "Begin in the field", text: "Five imagined family palenques give this original story its structure. We follow agave from the dry hillside to the roasting pit and learn why years of growth matter more than a quick tasting note. These are fictional visits, not a verified tour or list of businesses." },
      { heading: "Ask about the maker", text: "A good conversation includes who grew the plants, who distilled the batch and how the producer approaches sustainability. Wild agave is not automatically a more responsible choice. Pay fairly for visits and ask before photographing work." },
      { heading: "Taste slowly, travel safely", text: "Keep servings small, eat, drink water and arrange a sober driver. Alcohol is optional; a farm conversation can be worthwhile without a tasting. Follow local age laws and do not transport bottles without checking airline and customs rules." }
    ]
  },
  {
    id: "jordan", title: "Solo Female Travel in Jordan: What I Wish I'd Known", category: "Adventure", author: "Elena Vasquez", date: "2026-02-01", minutes: 13, image: "petra", location: "Petra, Jordan", reads: 11000,
    excerpt: "From Amman's street art scene to floating in the Dead Sea — safety tips, packing advice, and the moments that made it unforgettable.",
    sections: [
      { heading: "Plan the arrival before the adventure", text: "In this fictional account, a prearranged transfer and a first-night booking make arrival less stressful. Share your itinerary with someone you trust, keep emergency contacts offline and check current government travel advice. No destination or itinerary can be guaranteed safe." },
      { heading: "Petra at your own pace", text: "Wear comfortable shoes, carry water and research route length and access before setting out. Dress with attention to local norms and your own comfort. If an interaction feels wrong, leave and ask staff or a trusted local contact for support." },
      { heading: "Leave room for rest", text: "An afternoon of street art or a quiet meal can be as memorable as a major site. At the Dead Sea, follow posted bathing guidance and protect eyes and broken skin. This is a reflective story, not personalized safety or medical advice." }
    ]
  },
  {
    id: "lisbon", title: "Lisbon's Hidden Miradores: 8 Viewpoints the Guidebooks Miss", category: "Destinations", author: "Elena Vasquez", date: "2026-01-28", minutes: 7, image: "lisbon", location: "Lisbon, Portugal", reads: 4800,
    excerpt: "A slow route through tiled streets, small gardens and the changing light above the Tagus.",
    sections: [
      { heading: "Eight pauses, not eight pins", text: "This illustrative route treats a viewpoint as a reason to slow down rather than a secret to reveal. Begin near Alfama, follow public streets uphill and take breaks in accessible gardens. Respect residential courtyards and never enter a private terrace for a photograph." },
      { heading: "Follow the light", text: "Morning brings cool shadows to the lanes; afternoon warms the terracotta roofs. Carry water, wear shoes with grip and expect steep sections. Trams are everyday transport: make space for residents and confirm current routes before relying on a timetable." },
      { heading: "Make the walk your own", text: "There is no live map or verified eight-stop itinerary in this demo. Choose viewpoints from current municipal visitor information and adapt the day to your mobility and the weather. The best stop may simply be a public bench with a breeze." }
    ]
  },
  {
    id: "douro", title: "Porto Wine Tasting: A Route Through the Douro Valley", category: "Food & Drink", author: "Priya Sharma", date: "2026-01-24", minutes: 9, image: "douro", location: "Douro Valley, Portugal", reads: 4300,
    excerpt: "From riverside cellars to terraced vineyards, a slower look at the people behind the glass.",
    sections: [
      { heading: "Start with the river", text: "An imagined journey follows the Douro from Porto toward hillside vineyards. Look at the landscape before tasting: terraces tell a story of labor and water, not just a scenic backdrop. Compare current train and tour options and avoid squeezing the valley into a rushed evening." },
      { heading: "Reserve a conversation", text: "Contact producers directly for current visiting arrangements. Ask about growing practices, working conditions and the styles they make. This fictional feature lists no actual estates, live prices or guaranteed tasting slots." },
      { heading: "Return without driving", text: "Arrange safe transport before drinking, keep tastings modest and remember that non-alcoholic participation is welcome in a thoughtful itinerary. Leave room in your budget for a slower journey and in your bag only for what customs rules permit." }
    ]
  },
  {
    id: "algarve", title: "Algarve Coast on a Budget: Camping, Hiking & Beach Life", category: "Budget Travel", author: "Diego Morales", date: "2026-01-20", minutes: 8, image: "algarve", location: "Algarve, Portugal", reads: 3900,
    excerpt: "Clifftop paths, simple picnics and legal campsites: finding a gentler rhythm on Portugal's southern coast.",
    sections: [
      { heading: "A campsite is part of the plan", text: "Use authorized campsites and check local rules; a beautiful empty cliff is not permission to camp. Compare transport and accommodation together, since a remote bargain can become expensive once transfers are added." },
      { heading: "Walk above the sea, with care", text: "Stay behind barriers and away from unstable cliff edges. Check tide and weather information before beach walks and never assume a cave is safe because it appears in a photograph. Choose marked routes appropriate to your experience." },
      { heading: "Simple can still be generous", text: "Shop locally, pack a picnic and bring reusable water bottles. This demo contains no live calculator or bookable inventory. Make your own budget with current campsite quotes and a contingency for the days when the weather says to stay indoors." }
    ]
  }
];
export function dateLabel(date: string) {
  return new Date(date + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}
