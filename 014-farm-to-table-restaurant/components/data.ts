export type Category = "Starters" | "Mains" | "Desserts";
export type Season = "Spring 2026" | "Summer 2026";
export type Diet = "All dishes" | "Vegetarian" | "Plant-based";
export type Dish = {
  id: string; name: string; description: string; price: number; category: Category;
  season: Season; diet: "Vegetarian" | "Plant-based" | "Omnivore"; allergens: string;
  farm: string; note: string;
};
const dish = (id: string, name: string, description: string, price: number, category: Category,
  diet: Dish["diet"], allergens: string, farm: string, note: string, season: Season = "Spring 2026"): Dish =>
  ({ id, name, description, price, category, season, diet, allergens, farm, note });
export const dishes: Dish[] = [
  dish("gazpacho", "Heirloom Tomato Gazpacho", "Roasted garlic croutons, basil oil, microgreens", 14, "Starters", "Plant-based", "Wheat", "Sunnyside Organic Farm", "A chilled bowl with the brightness of the first harvest."),
  dish("burrata", "Burrata & Stone Fruit", "Grilled peaches, arugula, aged balsamic, toasted hazelnuts", 18, "Starters", "Vegetarian", "Milk, tree nuts", "Blue Ridge Creamery", "Soft burrata meets lightly charred fruit and peppery greens."),
  dish("tartine", "Farm Egg Tartine", "Sourdough, whipped ricotta, pickled shallots, herb salad", 16, "Starters", "Vegetarian", "Egg, milk, wheat", "Willow Creek Ranch", "A farmhouse lunch, reimagined for the evening table."),
  dish("pea", "Spring Pea Soup", "Mint crème fraîche, pea shoots, lemon zest", 13, "Starters", "Vegetarian", "Milk", "Sunnyside Organic Farm", "Sweet peas and garden mint, finished with cultured cream."),
  dish("trout", "Pan-Seared Trout", "Asparagus, fingerling potatoes, brown butter, capers", 32, "Mains", "Omnivore", "Fish, milk", "Sunnyside Organic Farm", "Crisp-skinned trout with tender spring vegetables; fish supplier is a fictional regional fishery."),
  dish("ribeye", "Grass-Fed Ribeye", "Roasted root vegetables, bone marrow jus, chimichurri", 42, "Mains", "Omnivore", "Ask the kitchen; stock ingredients vary", "Willow Creek Ranch", "A hearty cut with a lively, herb-forward finish."),
  dish("risotto", "Wild Mushroom Risotto", "Porcini, chanterelle, truffle oil, aged parmesan", 28, "Mains", "Vegetarian", "Milk", "Blue Ridge Creamery", "Slow-stirred rice, woodland mushrooms, and a generous shaving of cheese; illustrative vegetarian-style cheese."),
  dish("pork", "Heritage Pork Chop", "Braised greens, apple mostarda, sweet potato purée", 36, "Mains", "Omnivore", "Milk, mustard", "Willow Creek Ranch", "Orchard sweetness alongside a beautifully seared chop."),
  dish("brulee", "Lavender Crème Brûlée", "Shortbread cookie, fresh berries", 14, "Desserts", "Vegetarian", "Egg, milk, wheat", "Blue Ridge Creamery", "A delicate lavender custard beneath a crisp amber shell."),
  dish("galette", "Seasonal Fruit Galette", "Vanilla bean ice cream, honey drizzle", 15, "Desserts", "Vegetarian", "Milk, wheat, egg", "Sunnyside Organic Farm", "Hand-folded pastry filled with the day's orchard fruit."),
  dish("torte", "Dark Chocolate Torte", "Raspberry coulis, whipped cream, edible flowers", 16, "Desserts", "Vegetarian", "Milk, egg; possible tree nuts", "Blue Ridge Creamery", "Deep cocoa, bright berries, and flowers from the garden."),
  dish("summer-tomato", "Garden Tomato & Melon", "Cucumber ribbons, basil, lemon dressing", 15, "Starters", "Plant-based", "No listed major allergens; cross-contact possible", "Sunnyside Organic Farm", "An imagined summer arrival, served cool.", "Summer 2026"),
  dish("summer-corn", "Ember-Roasted Sweet Corn", "White beans, summer squash, parsley oil", 27, "Mains", "Plant-based", "No listed major allergens; cross-contact possible", "Sunnyside Organic Farm", "A summer-only plant-based plate from our fictional test kitchen.", "Summer 2026"),
  dish("summer-peach", "Warm Peach Shortcake", "Cultured cream, oat crumble", 15, "Desserts", "Vegetarian", "Wheat, milk", "Blue Ridge Creamery", "The sunniest ending to a long summer evening.", "Summer 2026"),
];
export type Farm = { name: string; distance: number; products: string; scene: "rows" | "cows" | "pasture"; story: string; practices: string[] };
export const farms: Farm[] = [
  { name: "Sunnyside Organic Farm", distance: 8, products: "Heirloom tomatoes, leafy greens, herbs", scene: "rows", story: "In this fictional valley, the Sunnyside family grows small, rotating plots and picks for the kitchen each morning.", practices: ["Seasonal crop rotation", "Compost-led soil care", "Reusable harvest crates"] },
  { name: "Blue Ridge Creamery", distance: 22, products: "Artisan cheeses, fresh butter, crème fraîche", scene: "cows", story: "An imagined small-batch creamery turning pasture-raised milk into soft cheeses and cultured butter.", practices: ["Small-batch production", "Returnable delivery containers", "Illustrative pasture grazing"] },
  { name: "Willow Creek Ranch", distance: 15, products: "Grass-fed beef, heritage pork, free-range eggs", scene: "pasture", story: "Our fictional ranch partner brings a nose-to-tail philosophy and carefully planned grazing to the seasonal table.", practices: ["Rotational grazing concept", "Whole-animal menu planning", "Weekly coordinated deliveries"] },
];
export const gallery = [
  { title: "A little spring on a plate", scene: "plate" as const, caption: "Edible flowers and a seasonal composition." },
  { title: "The farmhouse dining room", scene: "room" as const, caption: "Warm timber, linen, and a candle at every table." },
  { title: "The final, thoughtful touch", scene: "chef" as const, caption: "An illustrated moment at Chef Elara's kitchen pass." },
  { title: "Evenings in the courtyard", scene: "patio" as const, caption: "String lights and the last light of the valley." },
  { title: "The morning's farm delivery", scene: "produce" as const, caption: "An imagined basket from our farm family." },
  { title: "Something worth lingering over", scene: "wine" as const, caption: "A table set for a slow, celebratory evening." },
];
export const reviews = [
  { quote: "The best meal I've had in years. You can taste the care in every bite.", name: "Sarah M.", platform: "Google Reviews" },
  { quote: "We drove two hours for the farm dinner and it was worth every mile. Extraordinary.", name: "James & Lina T.", platform: "Yelp" },
  { quote: "The mushroom risotto changed my life. I'm not exaggerating.", name: "Devon R.", platform: "OpenTable" },
];
export const farmDinner = { name: "Spring Harvest Dinner", date: "April 18, 2026", farm: "Sunnyside Farm", price: 125, available: 8 };
export function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function dayOf(date: string) { return new Date(`${date}T12:00:00`).getDay(); }
export function timeSlots(date: string) {
  return dayOf(date) === 0 ? ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30"] :
    ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
}
export function displayTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}
export type Reservation = { date: string; time: string; guests: number; name: string; email: string; phone: string; requests: string };
export function validateReservation(r: Reservation): string | null {
  if (!r.date || r.date < localToday() || Number.isNaN(dayOf(r.date))) return "Choose today or a future date.";
  if (dayOf(r.date) === 1) return "The farmhouse rests on Mondays. Please choose Tuesday–Sunday.";
  if (!timeSlots(r.date).includes(r.time)) return "Choose an available time for that day's service.";
  if (!Number.isInteger(r.guests) || r.guests < 1 || r.guests > 12) return "Table reservations accommodate 1–12 guests. Try private dining for a larger party.";
  if (!r.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email) || !/^[+()\d\s.-]{7,20}$/.test(r.phone) || r.phone.replace(/\D/g, "").length < 7) return "Please check your name, email, and phone number.";
  if (r.time === "19:00") return "That sitting is full in this demo. Please choose another time; 6:30 PM and 7:30 PM are available.";
  return null;
}
