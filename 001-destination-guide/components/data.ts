import type { SceneKind } from "./scene";

export type Category = "All" | "Culture" | "Nature" | "Food" | "Shopping";
export type Attraction = { id: string; name: string; area: string; category: Category; description: string; time: string; cost: string; rating: string; scene: SceneKind };
export const attractions: Attraction[] = [
  { id: "senso", name: "Senso-ji Temple", area: "Asakusa", category: "Culture", description: "Tokyo’s oldest temple, dating to 645 AD, with the iconic Kaminarimon thunder gate.", time: "2–3 hours", cost: "Free", rating: "4.8", scene: "temple" },
  { id: "shibuya", name: "Shibuya Crossing", area: "Shibuya", category: "Culture", description: "The world’s busiest pedestrian crossing — up to 3,000 people cross at once.", time: "30 min", cost: "Free", rating: "4.6", scene: "crossing" },
  { id: "tsukiji", name: "Tsukiji Outer Market", area: "Chuo", category: "Food", description: "Street food paradise with fresh sushi, tamagoyaki, and wagyu skewers.", time: "2–3 hours", cost: "Free entry", rating: "4.9", scene: "market" },
  { id: "meiji", name: "Meiji Shrine", area: "Harajuku", category: "Nature", description: "A serene Shinto shrine surrounded by 170 acres of forest in the heart of the city.", time: "1–2 hours", cost: "Free", rating: "4.7", scene: "forest" },
  { id: "teamlab", name: "TeamLab Borderless", area: "Azabudai Hills", category: "Culture", description: "An immersive digital art museum with stunning interactive light installations.", time: "3–4 hours", cost: "¥3,800*", rating: "4.8", scene: "lights" },
  { id: "akihabara", name: "Akihabara Electric Town", area: "Akihabara", category: "Shopping", description: "A neon-drenched district for anime, manga, retro games, and electronics.", time: "3–4 hours", cost: "Free", rating: "4.5", scene: "electric" },
];
export type Stop = { time: string; name: string; detail: string };
export type Day = { title: string; scene: SceneKind; stops: Stop[]; meal: string };
const highlights: Day[] = [
  { title: "Old Tokyo, new perspectives", scene: "temple", stops: [
    { time: "09:00 · 2h", name: "Senso-ji & Nakamise Street", detail: "Step through the thunder gate, then browse traditional craft stalls." },
    { time: "12:00 · 2h", name: "Tokyo Skytree", detail: "Look out over the city; observation tickets are extra." },
    { time: "15:00 · 3h", name: "Akihabara", detail: "Arcades, retro games, and a little neon wandering." },
  ], meal: "Lunch: tempura in Asakusa · Dinner: a steaming bowl of Shinjuku ramen" },
  { title: "Forest paths & city lights", scene: "crossing", stops: [
    { time: "09:00 · 2h", name: "Meiji Shrine", detail: "A quiet walk beneath the forest canopy." },
    { time: "12:00 · 2h", name: "Harajuku", detail: "Explore Takeshita Street and the quieter lanes of Omotesando." },
    { time: "15:00 · 3h", name: "Shibuya Crossing & Shibuya Sky", detail: "Cross with the crowds, then watch sunset from above." },
  ], meal: "Lunch: Harajuku crêpes & soba · Dinner: an izakaya crawl (optional; adults only)" },
  { title: "Markets, gardens & the good life", scene: "market", stops: [
    { time: "08:00 · 2h", name: "Tsukiji Outer Market", detail: "Arrive hungry for sushi and fresh tamagoyaki." },
    { time: "11:00 · 2h", name: "Ginza shopping", detail: "Design stores, department stores, and coffee tucked down side streets." },
    { time: "14:00 · 2h", name: "Imperial Palace gardens", detail: "Slow down in the East Gardens; check opening days before visiting." },
    { time: "18:00 · 2h", name: "Roppongi night views", detail: "Toast your last evening above the lights." },
  ], meal: "Breakfast: market sushi · Dinner: a relaxed yakitori counter in Roppongi" },
];
const extras: Day[] = [
  { title: "A little sea air in Kamakura", scene: "forest", stops: [
    { time: "08:30 · 1h", name: "Train to Kamakura", detail: "A coastal day trip, approximately one hour from central Tokyo." },
    { time: "10:00 · 4h", name: "Great Buddha & temple trails", detail: "Historic paths, gardens, and a stroll toward the sea." },
    { time: "16:00 · 2h", name: "Shimokitazawa vintage shopping", detail: "Back in Tokyo, browse independent shops." },
  ], meal: "Lunch: local soba · Dinner: curry in Shimokitazawa" },
  { title: "Digital dreams & waterfront walks", scene: "lights", stops: [
    { time: "09:00 · 3h", name: "TeamLab Borderless, Azabudai Hills", detail: "Book a timed entry separately; the museum is no longer in Odaiba." },
    { time: "13:00 · 3h", name: "Odaiba waterfront", detail: "Ride to the bay for open skies and Rainbow Bridge views." },
    { time: "17:00 · 2h", name: "Sumo evening", detail: "Tournament only when scheduled; otherwise explore Ryogoku’s sumo heritage." },
  ], meal: "Lunch: waterfront noodles · Dinner: chanko-nabe in Ryogoku" },
  { title: "Mount Fuji on the horizon", scene: "skyline", stops: [
    { time: "07:30 · 2h", name: "Train to Hakone", detail: "Allow a full day; reserve trains independently." },
    { time: "10:00 · 5h", name: "Lake Ashi & mountain scenery", detail: "Fuji views depend on weather. Choose a museum if visibility is poor." },
    { time: "17:00 · 2h", name: "Return to Tokyo", detail: "Leave time for a gentle evening." },
  ], meal: "Lunch: lakeside set meal · Dinner: bento on the return journey" },
  { title: "Early markets, old-town soul", scene: "street", stops: [
    { time: "05:30 · 2h", name: "Toyosu fish market auction", detail: "Check access rules and any reservation requirements independently." },
    { time: "10:00 · 3h", name: "Ueno museums", detail: "Choose art, history, or natural science at your own pace." },
    { time: "14:00 · 3h", name: "Yanaka old town", detail: "Small shops, quiet lanes, and one last neighborhood wander." },
  ], meal: "Breakfast: Toyosu sushi · Lunch: Ueno café · Dinner: Yanaka neighborhood favorites" },
];
export const itineraries: Record<3 | 5 | 7, Day[]> = { 3: highlights, 5: [...highlights, ...extras.slice(0, 2)], 7: [...highlights, ...extras] };
export const neighborhoods = [
  { name: "Shinjuku", description: "A central hub with great transport links, nightlife, and department stores.", price: 120, range: "$120–240", best: "First-timers", transit: "JR Yamanote · Marunouchi line", scene: "electric" as SceneKind },
  { name: "Shibuya", description: "Young, trendy, and walkable, with great dining and shopping.", price: 100, range: "$100–220", best: "Couples & nightlife", transit: "JR Yamanote · Ginza line", scene: "crossing" as SceneKind },
  { name: "Asakusa", description: "Traditional atmosphere near Senso-ji, with budget-friendly places to stay.", price: 65, range: "$65–150", best: "Culture lovers & budget travelers", transit: "Ginza · Toei Asakusa lines", scene: "street" as SceneKind },
];
export const tips = [
  ["💳", "Your pocket-sized city pass", "Get a Suica or Pasmo IC card for seamless subway and convenience store payments."],
  ["🚇", "Let rush hour pass", "Avoid 7:30–9:30 AM on the subway — it’s extremely crowded."],
  ["🍜", "Slurp with confidence", "Slurping noodles is polite — it shows you’re enjoying the meal."],
  ["🏪", "The convenience-store surprise", "7-Eleven and Lawson have surprisingly excellent food, from onigiri to fresh sandwiches."],
  ["👟", "Slip on, slip off", "Wear slip-on shoes — you’ll remove them frequently at temples and restaurants."],
  ["📶", "Stay connected", "Rent pocket WiFi at the airport or arrange an eSIM; coverage is generally fast and reliable."],
  ["🗑️", "Leave no trace", "Public trash cans are rare — carry a small bag for your waste."],
  ["💴", "Keep some yen handy", "Carry cash, especially at small businesses and outside tourist areas."],
];
export const months = [
  { name: "Jan", temp: 6, rain: 52, mood: "Cold", note: "Crisp days, winter illuminations, and fewer crowds. Pack a warm coat." },
  { name: "Feb", temp: 7, rain: 56, mood: "Cold", note: "Plum blossoms and quiet museums. A good-value winter escape." },
  { name: "Mar", temp: 11, rain: 118, mood: "Best", note: "Cherry blossoms usually begin in late March. Bloom dates vary each year." },
  { name: "Apr", temp: 16, rain: 125, mood: "Best", note: "Spring walks and blossom picnics. Reserve popular stays early." },
  { name: "May", temp: 21, rain: 138, mood: "Best", note: "Comfortable days and fresh greenery. Golden Week can be busy." },
  { name: "Jun", temp: 24, rain: 168, mood: "Hot/Rainy", note: "Rainy season begins. Bring a light raincoat and plan indoor alternatives." },
  { name: "Jul", temp: 28, rain: 154, mood: "Hot/Rainy", note: "Hot and humid. Sumidagawa Fireworks typically take place in July; check dates." },
  { name: "Aug", temp: 29, rain: 168, mood: "Hot/Rainy", note: "Extreme humidity and 30°C+ afternoons. Stay hydrated and take indoor breaks." },
  { name: "Sep", temp: 25, rain: 225, mood: "Good", note: "Warm days with possible typhoons. Keep plans flexible and check forecasts." },
  { name: "Oct", temp: 19, rain: 235, mood: "Best", note: "Milder days, beautiful walks, and a great time to explore neighborhoods." },
  { name: "Nov", temp: 14, rain: 96, mood: "Best", note: "Autumn leaves brighten the parks. Bring layers for cool evenings." },
  { name: "Dec", temp: 9, rain: 51, mood: "Cold", note: "Festive illuminations and clear skies. Cold, but lovely with a warm scarf." },
];
