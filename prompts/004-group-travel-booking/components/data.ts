export type Category = "All" | "Adventure" | "Beach & Relax" | "Cultural" | "Corporate";
export type Tier = "Budget" | "Mid-Range" | "Premium";
export type Destination = "Bali" | "Costa Rica" | "Iceland" | "Japan" | "Morocco" | "Portugal" | "Thailand" | "Peru";
export interface Trip {
  id: string; name: string; destination: Destination; days: number; route: string;
  price: number; min: number; max: number; rating: string; reviews: number;
  tags: string[]; categories: Category[]; art: string; description: string; itinerary: string[];
}
export const destinations: Destination[] = ["Bali", "Costa Rica", "Iceland", "Japan", "Morocco", "Portugal", "Thailand", "Peru"];
export const categories: Category[] = ["All", "Adventure", "Beach & Relax", "Cultural", "Corporate"];
export const trips: Trip[] = [
  { id: "bali", name: "Bali Bliss", destination: "Bali", days: 7, route: "Ubud · Seminyak · Nusa Penida", price: 1100, min: 8, max: 20, rating: "4.9", reviews: 342, tags: ["Beach", "Culture"], categories: ["Beach & Relax", "Cultural"], art: "bali", description: "Slow mornings in the rice terraces, island-hopping afternoons, and sunset dinners with your favorite people.", itinerary: ["Days 1–2 · Arrive in Ubud, rice terraces & welcome dinner", "Days 3–4 · Temple walk, cooking class & time to unwind", "Days 5–6 · Nusa Penida boat trip & Seminyak beach", "Day 7 · Shared breakfast & departure"] },
  { id: "iceland", name: "Iceland Ring Road", destination: "Iceland", days: 10, route: "The full island circuit", price: 2400, min: 6, max: 15, rating: "4.8", reviews: 187, tags: ["Adventure"], categories: ["Adventure"], art: "iceland", description: "Waterfalls, volcanic landscapes, and an unforgettable road trip around the land of fire and ice.", itinerary: ["Days 1–3 · Reykjavík, Golden Circle & south coast", "Days 4–6 · Glacier lagoon & eastern fjords", "Days 7–9 · Mývatn, Akureyri & Snæfellsnes", "Day 10 · Reykjavík & departure"] },
  { id: "costa", name: "Costa Rica Adventure", destination: "Costa Rica", days: 7, route: "Arenal · Monteverde · Manuel Antonio", price: 1350, min: 8, max: 25, rating: "4.9", reviews: 256, tags: ["Adventure", "Nature"], categories: ["Adventure"], art: "costa", description: "Zip through the cloud forest, soak in volcano-fed springs, and find your own little slice of pura vida.", itinerary: ["Days 1–2 · Arenal volcano & hot springs", "Days 3–4 · Monteverde cloud forest & zip-lining", "Days 5–6 · Manuel Antonio wildlife & beach", "Day 7 · San José transfer & departure"] },
  { id: "morocco", name: "Morocco Explorer", destination: "Morocco", days: 9, route: "Marrakech · Sahara · Fes · Chefchaouen", price: 1500, min: 8, max: 20, rating: "4.7", reviews: 198, tags: ["Cultural"], categories: ["Cultural"], art: "morocco", description: "Wander colorful medinas, share a meal under the stars, and wake up to the silence of the Sahara.", itinerary: ["Days 1–2 · Marrakech markets & courtyard dinner", "Days 3–5 · Atlas Mountains & Sahara desert camp", "Days 6–8 · Fes workshops & Chefchaouen", "Day 9 · Breakfast & departure"] },
  { id: "portugal", name: "Portugal Coast", destination: "Portugal", days: 7, route: "Lisbon · Sintra · Algarve · Porto", price: 1200, min: 6, max: 18, rating: "4.8", reviews: 221, tags: ["Beach", "Culture"], categories: ["Beach & Relax", "Cultural"], art: "portugal", description: "Ocean air, tiled streets, and long lunches. A coastal escape made for reconnecting.", itinerary: ["Days 1–2 · Lisbon neighborhoods & Sintra palaces", "Days 3–4 · Algarve beach & coastal kayaking", "Days 5–6 · Porto walking tour & shared food experience", "Day 7 · Farewell breakfast & departure"] },
  { id: "japan", name: "Japan Highlights", destination: "Japan", days: 10, route: "Tokyo · Kyoto · Osaka · Hakone", price: 2800, min: 6, max: 16, rating: "4.9", reviews: 164, tags: ["Cultural"], categories: ["Cultural"], art: "japan", description: "From Tokyo's energy to Kyoto's quiet paths, explore the extraordinary together.", itinerary: ["Days 1–3 · Tokyo neighborhoods & food walk", "Days 4–6 · Kyoto temples & Fushimi Inari", "Days 7–9 · Osaka street food & Hakone onsen", "Day 10 · Breakfast & departure"] },
];
const dailyRates: Record<Destination, number> = { Bali: 200, "Costa Rica": 240, Iceland: 350, Japan: 390, Morocco: 215, Portugal: 210, Thailand: 175, Peru: 230 };
const tierFactors: Record<Tier, number> = { Budget: 0.75, "Mid-Range": 1, Premium: 1.45 };
export const money = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
export function estimate(destination: Destination, size: number, days: number, tier: Tier) {
  const individual = Math.round(dailyRates[destination] * days * tierFactors[tier]);
  const discount = size >= 30 ? 0.25 : size >= 20 ? 0.22 : size >= 12 ? 0.20 : 0.12;
  const perPerson = Math.round(individual * (1 - discount));
  return { perPerson, total: perPerson * size, savings: (individual - perPerson) * size, discount };
}
export function earliestDeparture() {
  const day = new Date();
  day.setDate(day.getDate() + 1);
  return `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
}
export const faqs = [
  ["What's the minimum group size?", "6 travelers for standard packages and 10 for corporate retreats. Some packages have their own minimum and maximum, shown on every trip card."],
  ["Can we customize the itinerary?", "Absolutely. In this demo, explore the sample itinerary and vote on optional activities. In the fictional service, every package would be customizable after booking."],
  ["How does split payment work?", "Each member would get a unique payment link and choose three installments or payment in full. Our preview only changes local demo statuses; no payment links or money are exchanged."],
  ["What if someone drops out?", "The fictional policy offers a full refund for cancellations at least 30 days before departure. Closer to departure, contact a coordinator. The payment preview lets you simulate both cases."],
  ["Do you handle flights?", "Flights could be included in a custom quote or booked independently. All displayed package prices exclude flights, insurance, and optional activities."],
  ["Is travel insurance included?", "No. Optional travel insurance would be available at checkout with a real provider. This demo does not sell or provide insurance."],
];
