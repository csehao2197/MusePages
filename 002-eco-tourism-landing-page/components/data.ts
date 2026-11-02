export type SceneKind = "forest" | "fjord" | "orangutan" | "spring" | "safari" | "turtle" | "treehouse" | "cabin" | "bamboo" | "dome";
export type Trip = {
  id: string; name: string; destination: string; days: number; price: number;
  tags: string[]; highlight: string; rating: string; reviews: number;
  scene: SceneKind; activity: string; impact: string; itinerary: string[];
};
export const trips: Trip[] = [
  { id: "costa-rica", name: "Costa Rica Rainforest Retreat", destination: "Costa Rica", days: 7, price: 2450, tags: ["Wildlife", "Rainforest", "Carbon Neutral"], highlight: "Plants 50 trees per booking", rating: "4.9", reviews: 127, scene: "forest", activity: "Wildlife", impact: "Reforestation", itinerary: ["Arrive by shared electric transfer at a cloud-forest lodge.", "Walk the canopy with a local naturalist and visit a turtle protection project.", "Plant native trees with community guides, then unwind by the river."] },
  { id: "norway", name: "Norwegian Fjord Kayaking", destination: "Norway", days: 5, price: 1890, tags: ["Adventure", "Nordic", "Zero Waste"], highlight: "100% electric transport included", rating: "4.8", reviews: 89, scene: "fjord", activity: "Adventure", impact: "Clean energy", itinerary: ["Arrive by electric ferry and settle into a glass cabin.", "Paddle sheltered fjords with a qualified guide and enjoy locally sourced lunches.", "Follow a mountain trail and learn about Nordic renewable energy."] },
  { id: "borneo", name: "Borneo Orangutan Conservation", destination: "Borneo", days: 10, price: 3200, tags: ["Conservation", "Wildlife", "Volunteering"], highlight: "3 days hands-on conservation work", rating: "5.0", reviews: 64, scene: "orangutan", activity: "Wildlife", impact: "Conservation", itinerary: ["Meet the forest restoration team and learn responsible wildlife observation.", "Spend three days maintaining habitat and monitoring with conservation staff; no animal handling.", "Explore river ecosystems with local guides and visit a village cooperative."] },
  { id: "iceland", name: "Iceland Geothermal Explorer", destination: "Iceland", days: 6, price: 2100, tags: ["Geothermal", "Photography", "Eco-Lodge"], highlight: "Powered entirely by renewable energy", rating: "4.9", reviews: 103, scene: "spring", activity: "Adventure", impact: "Clean energy", itinerary: ["Settle into a geothermal-heated eco-lodge.", "Photograph volcanic landscapes and soak in managed geothermal pools.", "Walk with a geology guide and visit a renewable-energy learning center."] },
  { id: "kenya", name: "Kenyan Safari & Community Stay", destination: "Kenya", days: 8, price: 2800, tags: ["Safari", "Community", "Conservation"], highlight: "Funds local Maasai school programs", rating: "4.9", reviews: 91, scene: "safari", activity: "Wildlife", impact: "Community", itinerary: ["Meet your local guide at a community-owned camp.", "Observe elephants on low-impact game drives and take a guided savanna walk.", "Visit a community-run craft cooperative and learn about school funding."] },
  { id: "galapagos", name: "Galápagos Marine Biology Expedition", destination: "Galápagos", days: 9, price: 4500, tags: ["Marine", "Science", "Expedition"], highlight: "Led by marine biologists", rating: "5.0", reviews: 42, scene: "turtle", activity: "Marine", impact: "Conservation", itinerary: ["Meet the marine biology team for a reef-safety orientation.", "Snorkel designated sites and contribute to supervised citizen-science observations.", "Explore island trails and learn about protected-area stewardship."] },
];
const extensions: Record<string, string[]> = {
  "costa-rica": ["Cloud Forest Birding Escape", "Pacific Turtle Watch", "River & Rewilding Week"],
  norway: ["Arctic Islands Slow Journey", "Fjord Village Walking Trail", "Midnight Sun Paddle"],
  borneo: ["Kinabatangan River Discovery", "Rainforest Restoration Camp", "Forest Canopy Field Week"],
  iceland: ["Volcanic Coast Photography", "Highland Hot Springs Trail", "Northern Lights Eco Escape"],
  kenya: ["Savanna Ranger Discovery", "Community Conservancy Walk", "Rift Valley Birding Journey"],
  galapagos: ["Island Reef Discovery", "Sea Turtle Science Week", "Coastal Habitat Expedition"],
};
export const catalog: Trip[] = [...trips, ...trips.flatMap(t => extensions[t.id].map((name, i) => ({
  ...t, id: `${t.id}-${i}`, name, days: t.days + i - 1, price: t.price + (i - 1) * 150,
  reviews: 18 + i * 11, itinerary: [...t.itinerary],
})))];
export const lodges: { name: string; place: string; text: string; price: number; rating: string; badges: string[]; scene: SceneKind }[] = [
  { name: "Canopy Treehouse Lodge", place: "Costa Rica", text: "Solar-powered treehouses in the cloud forest", price: 180, rating: "4.9", badges: ["Solar Powered", "Locally Owned"], scene: "treehouse" },
  { name: "Arctic Glass Cabin", place: "Norway", text: "Northern lights from your bed, zero-emission heating", price: 220, rating: "4.8", badges: ["Zero Waste", "Locally Owned"], scene: "cabin" },
  { name: "Bamboo River Villa", place: "Bali", text: "Handcrafted bamboo architecture on a jungle river", price: 150, rating: "4.9", badges: ["Solar Powered", "Locally Owned"], scene: "bamboo" },
  { name: "Desert Eco-Dome", place: "Morocco", text: "Off-grid geodesic domes under Saharan stars", price: 130, rating: "4.7", badges: ["Solar Powered", "Zero Waste"], scene: "dome" },
];
export const cities = ["London", "New York", "Portland", "Tokyo", "Sydney", "Paris"];
const distance: Record<string, number[]> = {
  London: [8700, 1200, 11200, 1900, 6800, 10000],
  "New York": [3500, 5900, 15300, 4200, 11800, 4900],
  Portland: [5500, 7400, 12500, 6100, 14800, 6700],
  Tokyo: [13400, 8400, 4500, 8800, 11300, 14500],
  Sydney: [14500, 15900, 5600, 16600, 12200, 12900],
  Paris: [8900, 1400, 11000, 2200, 6500, 10100],
};
// Illustrative round-trip flight factor plus a fixed 100 kg ground/stay allowance per traveler.
export function estimate(city: string, destination: string, travelers: number) {
  const index = trips.findIndex(t => t.destination === destination);
  if (!distance[city] || index < 0 || !Number.isInteger(travelers) || travelers < 1 || travelers > 8) return null;
  const kg = Math.round((distance[city][index] * 2 * 0.115 + 100) * travelers);
  return { kg, trees: Math.ceil(kg / 22), cost: kg * 0.02, offset: kg * 2 };
}
