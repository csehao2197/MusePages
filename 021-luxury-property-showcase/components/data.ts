export type Home = { id: string; name: string; address: string; price: number; beds: number; baths: number; area: number; district: "Downtown" | "Harbor" | "Parkside"; floor: number; };
export const homes: Home[] = [
  { id: "meridian", name: "The Meridian Penthouse", address: "The Meridian, PH42", price: 4200000, beds: 4, baths: 3.5, area: 3800, district: "Downtown", floor: 42 },
  { id: "apex", name: "Above the city", address: "The Apex, Unit 38A", price: 3800000, beds: 3, baths: 3, area: 3200, district: "Downtown", floor: 38 },
  { id: "harbor", name: "A harbor horizon", address: "Harborview Tower, PH2", price: 4500000, beds: 4, baths: 4, area: 4100, district: "Harbor", floor: 40 },
  { id: "park", name: "Life above the canopy", address: "One Park Place, Unit 52B", price: 3950000, beds: 3, baths: 3.5, area: 3500, district: "Parkside", floor: 52 }
];
export const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
export const rooms = ["Living room · west view", "Living room · city view", "Kitchen & dining", "Primary suite", "Primary bathroom", "Guest bedroom one", "Guest bedroom two", "Guest bedroom three", "Home office", "Wine cellar", "Terrace · harbor view", "Terrace · evening", "Arrival lobby", "Rooftop pool", "Fitness studio", "Residents’ lounge"];
export const planRooms = [
  ["Primary Suite", "18′ × 22′"], ["Living Room", "24′ × 30′"], ["Kitchen", "16′ × 20′"],
  ["Home Office", "12′ × 14′"], ["Guest Bedroom 1", "14′ × 16′"], ["Guest Bedroom 2", "12′ × 14′"], ["Guest Bedroom 3", "12′ × 12′"]
];
export const amenities = [
  ["Infinity pool & spa", "A rooftop retreat overlooking an imagined harbor."],
  ["Fitness studio", "A light-filled space for your daily ritual."],
  ["Private wine storage", "A temperature-controlled home for a collection."],
  ["Residents’ lounge & bar", "An intimate setting to gather above the city."],
  ["Screening room", "A private cinema for an evening in."],
  ["Children’s playroom", "A thoughtful space for smaller residents."],
  ["Pet spa & dog run", "Every member of the household considered."],
  ["Valet parking", "An effortless arrival, in this fictional setting."]
];
export const features = [
  ["Kitchen", "Sub-Zero refrigerator", "Wolf range", "Miele dishwasher", "Waterfall quartzite island"],
  ["Bath", "Heated floors", "Rain shower", "Freestanding soaking tub", "Toto fixtures"],
  ["Living", "European oak floors", "11-ft ceilings", "Gas fireplace", "Automated shades"],
  ["Technology", "Savant smart home", "Integrated Sonos", "Keyless entry", "EV charging"],
  ["Outdoor", "600 sq ft private terrace", "Built-in BBQ", "Plunge pool", "Panoramic views"],
  ["Security", "24/7 concierge", "Private elevator", "Biometric entry", "Video intercom"]
];
export const places = [
  ["Harbor Walk", "3 min walk", "A waterside promenade for a slower start."],
  ["Fine dining", "5 min walk", "An imagined restaurant quarter; no Michelin rating is claimed."],
  ["Financial District", "8 min drive", "An illustrative downtown business neighborhood."],
  ["International Airport", "22 min drive", "A fictional travel-time example, not a route estimate."],
  ["Central Park", "10 min walk", "An invented urban park, not a real address."]
];
