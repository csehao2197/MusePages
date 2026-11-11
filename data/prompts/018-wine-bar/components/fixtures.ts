export type Style = "Red" | "White" | "Rosé" | "Sparkling";
export type Wine = {
  id: string; name: string; vintage: number; region: string; country: string;
  flag: string; style: Style; notes: string; price: number; color: string;
  story: string; pairing: string; pairingPrice: number;
};

export const wines: Wine[] = [
  { id: "clairmont", name: "Château Clairmont", vintage: 2021, region: "Bordeaux", country: "France", flag: "FR", style: "Red", notes: "Dark fruit · tobacco · elegant tannins", price: 28, color: "#672c40", story: "An imagined Left Bank blend: slow evenings, cassis, and a beautifully lingering finish. A fictional family-estate story, not a real producer or provenance claim.", pairing: "Aged Comté & fig preserve", pairingPrice: 14 },
  { id: "ember", name: "Ember Ridge · Blend 389", vintage: 2022, region: "South Australia", country: "Australia", flag: "AU", style: "Red", notes: "Blackcurrant · chocolate · spice", price: 22, color: "#782b38", story: "Our fictional New World counterpoint. Generous dark fruit meets a fine thread of spice in this imagined Cabernet–Shiraz blend.", pairing: "Mushroom & thyme tartine", pairingPrice: 16 },
  { id: "tideline", name: "Tideline Sauvignon Blanc", vintage: 2023, region: "Marlborough", country: "New Zealand", flag: "NZ", style: "White", notes: "Citrus · passionfruit · mineral finish", price: 18, color: "#aaa46c", story: "A fictional coastal label with bright acidity and a cool, mineral finish. Made for lively conversation and a second look at the cheese board.", pairing: "Goat cheese & lemon crostini", pairingPrice: 12 },
  { id: "pietra", name: "Pietra Alta Barolo", vintage: 2020, region: "Piedmont", country: "Italy", flag: "IT", style: "Red", notes: "Rose petal · cherry · dried herbs", price: 26, color: "#864138", story: "An imagined hillside Nebbiolo, floral at first and quietly powerful at the finish. A fictional cellar selection inspired by Piedmont.", pairing: "Mushroom & thyme tartine", pairingPrice: 16 },
  { id: "lune", name: "Domaine de la Lune", vintage: 2023, region: "Loire Valley", country: "France", flag: "FR", style: "White", notes: "Green apple · flint · fresh herbs", price: 20, color: "#b9af75", story: "An imagined Sancerre-style white. A crisp, restrained glass with orchard fruit and the suggestion of river stones.", pairing: "Goat cheese & lemon crostini", pairingPrice: 12 },
  { id: "rosa", name: "Rosa del Camino", vintage: 2024, region: "Rioja", country: "Spain", flag: "ES", style: "Rosé", notes: "Wild strawberry · peach · orange peel", price: 16, color: "#cd816f", story: "A fictional rosado for the terrace. Delicate red fruit, a little citrus, and an easy-going finish.", pairing: "Marcona almonds & olives", pairingPrice: 9 },
  { id: "stelle", name: "Le Piccole Stelle", vintage: 2023, region: "Veneto", country: "Italy", flag: "IT", style: "Sparkling", notes: "Pear · white blossom · fine bubbles", price: 19, color: "#c0b787", story: "A fictional sparkling aperitif inspired by northern Italy. Gentle bubbles and a clean pear finish to start the evening.", pairing: "Marcona almonds & olives", pairingPrice: 9 },
];

export type BarEvent = { id: string; name: string; price: number; capacity: number; time: string; offset: number; scene: string; description: string };
export const events: BarEvent[] = [
  { id: "world", name: "Old World vs. New World", price: 65, capacity: 8, time: "19:00", offset: 7, scene: "bar", description: "Two traditions. One table. Compare contrasting regions in a guided five-pour exploration." },
  { id: "italy", name: "Italian Wine Masterclass", price: 85, capacity: 12, time: "18:30", offset: 14, scene: "cellar", description: "From Piedmont to Veneto: discover the textures and stories of an imagined Italian cellar." },
  { id: "blind", name: "Blind Tasting Challenge", price: 45, capacity: 20, time: "19:30", offset: 21, scene: "pour", description: "Trust your senses. A friendly, guided tasting with hidden labels and shared discoveries." },
];
export const gallery = [
  { scene: "bar", title: "A seat at the counter", caption: "Amber light, a thoughtful pour, no rush." },
  { scene: "cheese", title: "Better together", caption: "Textures and flavors made for sharing." },
  { scene: "cellar", title: "The warmth of old brick", caption: "A reimagined warehouse, an intimate evening." },
  { scene: "patio", title: "Under the evening sky", caption: "Our imagined courtyard at golden hour." },
  { scene: "pour", title: "The art of the pour", caption: "A small ritual, a new discovery." },
  { scene: "alcove", title: "Your own little corner", caption: "An alcove for stories and celebrations." },
];

export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function futureDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return localDate(date);
}
export function dateLabel(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
export const money = (n: number) => `$${n.toFixed(Number.isInteger(n) ? 0 : 2)}`;
