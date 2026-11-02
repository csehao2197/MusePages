export const styles = ["Beach", "Adventure", "Cultural", "Luxury", "Family", "Food & Wine"] as const;
export type TripStyle = typeof styles[number];
export type SceneName = "coast" | "santorini" | "kyoto" | "jungle" | "amalfi" | "bali" | "iceland" | "patagonia" | "mexico";
export interface Trip {
  id: string;
  destination: string;
  country: string;
  title: string;
  days: number;
  price: number;
  rating: string;
  reviews: number;
  tag: string;
  scene: SceneName;
  styles: TripStyle[];
  description: string;
  highlights: string[];
}
export const trips: Trip[] = [
  { id: "santorini", destination: "Santorini", country: "Greece", title: "Aegean Slow Days", days: 7, price: 2499, rating: "4.9", reviews: 128, tag: "Most Popular", scene: "santorini", styles: ["Beach", "Luxury", "Food & Wine"], description: "Whitewashed villages, long lunches, and sunsets you don't have to hurry through. An island escape with room to simply be.", highlights: ["A boutique caldera-view stay", "Sailing the Aegean at sunset", "A village walk and vineyard tasting"] },
  { id: "kyoto", destination: "Kyoto", country: "Japan", title: "Beyond the Torii Gates", days: 10, price: 3199, rating: "4.8", reviews: 94, tag: "Cultural", scene: "kyoto", styles: ["Cultural", "Food & Wine"], description: "Follow quiet bamboo paths into a city of living traditions. Tea ceremonies, neighborhood kitchens, and unhurried temple mornings.", highlights: ["An early walk in Arashiyama", "A hands-on tea ceremony", "A local-led Nishiki Market tasting"] },
  { id: "costa-rica", destination: "Costa Rica", country: "", title: "Into the Green", days: 8, price: 1899, rating: "4.9", reviews: 156, tag: "Adventure", scene: "jungle", styles: ["Adventure", "Family", "Beach"], description: "Trade your usual routine for hanging bridges, wildlife-rich forests, and Pacific beach afternoons. A little wild, a lot of pura vida.", highlights: ["A guided cloud-forest trail", "Wildlife walks with a naturalist", "A family-friendly Pacific beach stay"] },
  { id: "amalfi", destination: "Amalfi Coast", country: "Italy", title: "La Dolce Coast", days: 9, price: 3499, rating: "4.9", reviews: 112, tag: "Luxury", scene: "amalfi", styles: ["Luxury", "Beach", "Food & Wine"], description: "Pastel villages tucked into cliffs, lemon groves, and the Mediterranean at your doorstep. Italy, at its most effortlessly beautiful.", highlights: ["A small coastal boutique hotel", "A private boat day along the coast", "Fresh pasta in a family-run kitchen"] },
  { id: "bali", destination: "Bali", country: "Indonesia", title: "Bali Explorer", days: 10, price: 2399, rating: "4.9", reviews: 86, tag: "Weekly Deal", scene: "bali", styles: ["Beach", "Adventure", "Cultural", "Family"], description: "From Ubud's emerald terraces to ocean-side mornings. Explore temples, meet local makers, and try your first wave.", highlights: ["Illustrative flights + 4-star hotels", "Guided temple and terrace tours", "A beginner-friendly surf lesson"] },
  { id: "iceland", destination: "Iceland", country: "", title: "Wild North, Warm Welcome", days: 8, price: 2899, rating: "4.8", reviews: 73, tag: "Adventure", scene: "iceland", styles: ["Adventure", "Family"], description: "Waterfalls, black-sand shorelines, and geothermal pools. Take the scenic route around a landscape that feels like another planet.", highlights: ["South-coast waterfall stops", "A guided glacier viewpoint walk", "A geothermal soak"] },
  { id: "patagonia", destination: "Patagonia", country: "Chile", title: "At the Edge of the World", days: 12, price: 3899, rating: "4.9", reviews: 61, tag: "Adventure", scene: "patagonia", styles: ["Adventure"], description: "Big skies and even bigger mountain views. A small-group walking journey for curious travelers who love the outdoors.", highlights: ["Guided trails in Torres del Paine", "A lakeside lodge stay", "Local conservation stories"] },
  { id: "mexico", destination: "Mexico City", country: "Mexico", title: "Markets, Makers & Mezcal", days: 6, price: 1699, rating: "4.8", reviews: 48, tag: "Food & Wine", scene: "mexico", styles: ["Food & Wine", "Cultural"], description: "Discover a city through its flavors: neighborhood markets, contemporary kitchens, and the makers keeping traditions alive.", highlights: ["A neighborhood taco walk", "A market-to-table cooking class", "An art and architecture afternoon"] },
];
export const categories: { style: TripStyle; title: string; description: string; scene: SceneName; icon: string }[] = [
  { style: "Beach", title: "Beach & Island", description: "Turquoise waters and white sand bliss", scene: "coast", icon: "☀" },
  { style: "Adventure", title: "Adventure", description: "Trekking, diving, and adrenaline rushes", scene: "patagonia", icon: "△" },
  { style: "Cultural", title: "Cultural", description: "Ancient ruins, local cuisine, and living history", scene: "kyoto", icon: "⌘" },
  { style: "Luxury", title: "Luxury", description: "Five-star stays and exclusive experiences", scene: "amalfi", icon: "✧" },
  { style: "Family", title: "Family", description: "Kid-friendly adventures everyone will love", scene: "jungle", icon: "♡" },
  { style: "Food & Wine", title: "Food & Wine", description: "Culinary tours and vineyard discoveries", scene: "mexico", icon: "♧" },
];
export const articles = [
  { id: "beaches", title: "Top 10 Hidden Beaches in Southeast Asia", category: "Travel Guides", minutes: 5, author: "Lena Rivers", scene: "coast" as SceneName, excerpt: "Sometimes the best beach is the one you take the long way to.", paragraphs: ["Start with quieter corners of Bali, then look toward the coves of Lombok, the islands off southern Thailand, and the sheltered shores of Vietnam. This illustrated demo guide is inspiration, not a current destination advisory.", "Our ten-stop dream list: Amed, Bias Tugel, Selong Belanak, Tanjung Aan, Koh Yao Noi, Koh Kradan, Koh Mak, Con Dao, Bai Xep, and the quieter coves of Langkawi. Always check local conditions, tide times, conservation rules, and access before you go.", "Pack a refillable bottle, reef-conscious sun protection, and patience. Leave shells where they belong, support local beach businesses, and ask before photographing people. The best secret spot is one you help protect."] },
  { id: "packing", title: "How to Pack for a 2-Week Europe Trip in a Carry-On", category: "Travel Tips", minutes: 4, author: "Alex Morgan", scene: "amalfi" as SceneName, excerpt: "Less luggage. More room for the unexpected.", paragraphs: ["Think in combinations, not outfits: a small palette, layers for changing weather, and shoes you have already walked in. A lightweight jacket, five tops, three bottoms, and a laundry plan can go a long way.", "Keep medication, documents, and a change of clothes accessible. Check your airline's actual cabin-bag dimensions and restrictions; the demo does not provide current airline policies.", "Plan a mid-trip wash, roll soft items, and leave a little space. You don't need a different version of yourself for every city."] },
  { id: "food", title: "A Foodie's Guide to Mexico City", category: "Food & Culture", minutes: 6, author: "Sofia Cruz", scene: "mexico" as SceneName, excerpt: "Meet a city one wonderful bite at a time.", paragraphs: ["Begin with a neighborhood breakfast and let a local guide introduce you to the market. Ask about seasonal ingredients, regional recipes, and the people behind the counter.", "Build your days around a mix of street food, family-run kitchens, and contemporary cooking. Make dietary requirements clear, choose food prepared fresh, and carry safe drinking water.", "A great food journey is about listening as much as tasting. These fictional editorial notes are a starting point, not restaurant endorsements or live recommendations."] },
];
export const money = (value: number) => `$${value.toLocaleString("en-US")}`;
export const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
export function dateError(start: string, end: string, required = false): string {
  if (!start && !end && !required) return "";
  if (!start || !end) return "Choose both a departure and return date.";
  if (start < today()) return "Departure must be today or later.";
  if (end <= start) return "Return must be after departure.";
  return "";
}
