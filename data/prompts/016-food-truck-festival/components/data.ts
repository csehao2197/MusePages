export type Cuisine = "Mexican" | "Asian" | "BBQ" | "Vegan" | "Seafood" | "Desserts" | "Fusion" | "Mediterranean";
export type Zone = "A" | "B" | "C";
export type Food = { name: string; price: number; dietary: string; allergens: string };
export type Truck = { id: string; name: string; cuisine: Cuisine; zone: Zone; description: string; badge?: string; art: "tacos" | "bao" | "bbq" | "slider" | "lobster" | "icecream" | "wrap" | "burger"; color: string; menu: Food[] };
export const cuisines: Cuisine[] = ["Mexican", "Asian", "BBQ", "Vegan", "Seafood", "Desserts", "Fusion", "Mediterranean"];
export const trucks: Truck[] = [
  { id: "taco", name: "Taco Libre", cuisine: "Mexican", zone: "A", description: "Wood-fired birria tacos, elote, churros", badge: "Fan Favorite", art: "tacos", color: "#f6ab42", menu: [
    { name: "Birria taco trio", price: 14, dietary: "Contains meat", allergens: "Milk; shared wheat preparation" },
    { name: "Street corn elote", price: 6, dietary: "Vegetarian", allergens: "Milk" },
    { name: "Cinnamon churros", price: 7, dietary: "Vegetarian", allergens: "Wheat, milk" }] },
  { id: "bao", name: "Bao Down", cuisine: "Asian", zone: "B", description: "Steamed bao buns, kimchi fries, matcha soft serve", art: "bao", color: "#a6c7b0", menu: [
    { name: "Mushroom bao duo", price: 12, dietary: "Plant-based recipe", allergens: "Wheat, soy, sesame" },
    { name: "Kimchi fries", price: 9, dietary: "Vegetarian", allergens: "Soy, milk" },
    { name: "Matcha soft serve", price: 6, dietary: "Vegetarian", allergens: "Milk" }] },
  { id: "bbq", name: "Holy Smoke BBQ", cuisine: "BBQ", zone: "A", description: "14-hour brisket, pulled pork mac & cheese, cornbread", badge: "New This Year", art: "bbq", color: "#e59b78", menu: [
    { name: "Smoked brisket plate", price: 18, dietary: "Contains meat", allergens: "Soy, wheat" },
    { name: "Pulled pork mac & cheese", price: 13, dietary: "Contains meat", allergens: "Wheat, milk" },
    { name: "Cornbread", price: 5, dietary: "Vegetarian", allergens: "Wheat, egg, milk" }] },
  { id: "green", name: "Green Machine", cuisine: "Vegan", zone: "C", description: "Jackfruit sliders, cauliflower wings, açaí bowls", art: "slider", color: "#baca7f", menu: [
    { name: "Jackfruit sliders", price: 12, dietary: "Vegan recipe", allergens: "Wheat, soy" },
    { name: "Cauliflower wings", price: 10, dietary: "Vegan recipe", allergens: "Wheat" },
    { name: "Açaí bowl", price: 11, dietary: "Vegan recipe", allergens: "Tree nuts" }] },
  { id: "catch", name: "Catch of the Day", cuisine: "Seafood", zone: "B", description: "Lobster rolls, fish & chips, clam chowder bowls", art: "lobster", color: "#8dbfc9", menu: [
    { name: "Lobster roll", price: 22, dietary: "Contains seafood", allergens: "Shellfish, wheat, milk, egg" },
    { name: "Fish & chips", price: 16, dietary: "Contains seafood", allergens: "Fish, wheat" },
    { name: "Clam chowder bowl", price: 10, dietary: "Contains seafood", allergens: "Shellfish, milk" }] },
  { id: "sugar", name: "Sugar Rush", cuisine: "Desserts", zone: "C", description: "Mini donuts, rolled ice cream, churro sundaes", art: "icecream", color: "#e8a9c0", menu: [
    { name: "Mini donut dozen", price: 9, dietary: "Vegetarian", allergens: "Wheat, milk, egg" },
    { name: "Strawberry rolled ice cream", price: 8, dietary: "Vegetarian", allergens: "Milk" },
    { name: "Churro sundae", price: 10, dietary: "Vegetarian", allergens: "Wheat, milk, egg" }] },
  { id: "naan", name: "Naan Stop", cuisine: "Mediterranean", zone: "A", description: "Lamb shawarma wraps, falafel plates, halloumi fries", art: "wrap", color: "#dfb57e", menu: [
    { name: "Lamb shawarma wrap", price: 15, dietary: "Contains meat", allergens: "Wheat, milk" },
    { name: "Falafel plate", price: 13, dietary: "Vegan recipe", allergens: "Sesame; shared wheat preparation" },
    { name: "Halloumi fries", price: 9, dietary: "Vegetarian", allergens: "Milk, wheat" }] },
  { id: "umami", name: "Umami Lab", cuisine: "Fusion", zone: "B", description: "Ramen burgers, Korean corn dogs, miso caramel popcorn", badge: "Must Try", art: "burger", color: "#b2a6d3", menu: [
    { name: "Ramen burger", price: 15, dietary: "Contains meat", allergens: "Wheat, soy, egg, sesame" },
    { name: "Korean corn dog", price: 8, dietary: "Contains meat", allergens: "Wheat, milk, egg" },
    { name: "Miso caramel popcorn", price: 6, dietary: "Vegetarian", allergens: "Soy, milk" }] },
];
export const days = [
  { value: "2026-07-25", short: "Sat", label: "Saturday · Jul 25" },
  { value: "2026-07-26", short: "Sun", label: "Sunday · Jul 26" },
  { value: "2026-07-27", short: "Mon", label: "Monday · Jul 27" },
] as const;
export type Stage = "Main Stage" | "Acoustic Stage" | "DJ Tent" | "Beer Garden" | "All zones";
export type Event = { id: string; day: number; time: string; name: string; stage: Stage; description: string };
export const events: Event[] = [
  { id: "open1", day: 0, time: "4:00 PM", name: "Gates open", stage: "All zones", description: "The first bite of the weekend. All demo trucks serving." },
  { id: "toast", day: 0, time: "5:30 PM", name: "Opening Toast", stage: "Main Stage", description: "A waterfront welcome with our fictional festival MC." },
  { id: "peppers", day: 0, time: "6:00 PM", name: "The Saucy Peppers", stage: "Main Stage", description: "Indie rock with a splash of ska." },
  { id: "bite", day: 0, time: "7:30 PM", name: "The Big Bite Challenge", stage: "Main Stage", description: "Illustrative contest showcase. No registration or eating challenge offered." },
  { id: "wasabi", day: 0, time: "8:30 PM", name: "DJ Wasabi", stage: "DJ Tent", description: "Electronic grooves meet funk." },
  { id: "close1", day: 0, time: "10:00 PM", name: "Festival closes", stage: "All zones", description: "One last wave to the waterfront." },
  { id: "open2", day: 1, time: "11:00 AM", name: "Brunch & gates open", stage: "All zones", description: "Start your day with something delicious." },
  { id: "kids", day: 1, time: "12:00 PM", name: "Kids cooking demo", stage: "Acoustic Stage", description: "Little chefs, big ideas. Fictional supervised demonstration." },
  { id: "panel", day: 1, time: "1:00 PM", name: "The Street Food Revolution", stage: "Acoustic Stage", description: "A chef panel on creativity and community." },
  { id: "plantain", day: 1, time: "3:00 PM", name: "Plantain Kings", stage: "Main Stage", description: "A sunny afternoon of Latin funk." },
  { id: "cocktail", day: 1, time: "5:00 PM", name: "Cocktail masterclass", stage: "Beer Garden", description: "Illustrative $15 add-on; 21+ only. No real alcohol service." },
  { id: "neon", day: 1, time: "7:00 PM", name: "Neon Flavor", stage: "Main Stage", description: "The fictional funk & soul headliner." },
  { id: "close2", day: 1, time: "10:30 PM", name: "Festival closes", stage: "All zones", description: "Save some room for tomorrow." },
  { id: "open3", day: 2, time: "11:00 AM", name: "Brunch service", stage: "All zones", description: "A slow morning on the lawn." },
  { id: "vote", day: 2, time: "12:30 PM", name: "People’s Choice voting", stage: "Main Stage", description: "Fictional awards showcase; save your favorite trucks in your plan." },
  { id: "rosemary", day: 2, time: "2:00 PM", name: "Rosemary & Thyme", stage: "Acoustic Stage", description: "Warm harmonies from a fictional folk duo." },
  { id: "awards", day: 2, time: "4:00 PM", name: "Awards ceremony", stage: "Main Stage", description: "Best Truck, Best Dessert, Most Creative & People’s Choice." },
  { id: "final", day: 2, time: "5:00 PM", name: "Final service hour", stage: "All zones", description: "Your last chance to revisit a demo favorite." },
  { id: "close3", day: 2, time: "6:00 PM", name: "See you next summer", stage: "All zones", description: "Good food. Good neighbors. Goodnight." },
];
export const stages: Stage[] = ["Main Stage", "Acoustic Stage", "DJ Tent", "Beer Garden", "All zones"];
export const tiers = [
  { id: "day", name: "Day Pass", price: 15, label: "Buy Day Pass", perks: ["One day, your choice", "All zones & three stages", "Festival wristband"], badge: null },
  { id: "weekend", name: "Weekend Pass", price: 35, label: "Buy Weekend Pass", perks: ["All three days", "Priority entry", "Festival tote bag"], badge: "Best Value · save $10" },
  { id: "vip", name: "VIP Experience", price: 89, label: "Go VIP", perks: ["All three days + lounge", "Welcome drink (nonalcoholic available)", "Shaded seating & power outlets", "Featured chef meet & greet", "$20 illustrative food voucher"], badge: "Extra flavor" },
] as const;
export type Tier = (typeof tiers)[number]["id"];
export const faqs = [
  ["Can I bring my dog?", "In this fictional festival plan, yes: leashed dogs, cleaned-up paws, and water stations in every zone. This is not a statement of actual park event policy."],
  ["Is there parking?", "The source suggests limited street parking, bikes, MAX (Yamhill District) or rideshare, with a free bike valet. These are illustrative arrangements: verify real transit and park access independently."],
  ["Can I use cards or is it cash only?", "The imagined trucks accept cards and mobile pay, with two ATMs in the map. This demo accepts no payment and does not represent vendor payment policies."],
  ["Are there vegetarian/vegan options?", "Explore Green Machine in Zone C or search the menu for plant-based recipes. All dietary labels are fictional, not allergy-safe assurances. Ask an actual vendor about ingredients and cross-contact."],
  ["What if it rains?", "The source imagines rain-or-shine service and covered VIP / garden seating. Layers recommended; no actual weather, safety or shelter guarantee is provided."],
  ["Can I buy tickets at the door?", "The source describes door prices $5 higher, subject to stock. All prices and capacity are illustrative; no tickets exist here. Local checkout only demonstrates a calculation."],
  ["Is the festival accessible?", "The concept includes step-free routes, accessible parking and restrooms. The diagram is not a surveyed accessibility map. Use the local inquiry form to try an accommodation request; nothing is sent."],
  ["What are the age restrictions?", "The concept welcomes all ages: under-10s free with a paid adult. Ages 10–17 use a paid pass with adult supervision. Demo purchaser must be 18+. The garden and optional cocktail class require 21+; no alcohol is sold."],
];
