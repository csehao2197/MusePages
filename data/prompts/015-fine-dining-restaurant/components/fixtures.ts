export type Course = { label: string; dish: string; vegetarian: string; note: string; allergens: string; wine?: string };
export const courses: Course[] = [
  { label: "Amuse-bouche", dish: "Potato Velouté", vegetarian: "Potato Velouté", note: "Truffle foam · chive oil", allergens: "Milk" },
  { label: "First course", dish: "Hokkaido Scallop", vegetarian: "Roasted King Oyster Mushroom", note: "Cauliflower purée · golden raisin · brown butter", allergens: "Shellfish, milk", wine: "2024 Chablis Premier Cru · Maison du Vallon" },
  { label: "Second course", dish: "Roasted Beet Tartare", vegetarian: "Roasted Beet Tartare", note: "Goat cheese mousse · walnut · aged balsamic", allergens: "Milk, tree nuts", wine: "2023 Sancerre Rosé · Clos des Brumes" },
  { label: "Fish course", dish: "Wild Turbot", vegetarian: "Salt-baked Celeriac", note: "Fennel · saffron broth · sea beans", allergens: "Fish, celery", wine: "2022 Meursault · Domaine de la Lune" },
  { label: "Main course", dish: "Dry-Aged Duck Breast", vegetarian: "Roasted Delicata Squash", note: "Roasted fig · parsnip · jus gras (vegetable jus for vegetarian)", allergens: "Milk, celery", wine: "2021 Chambolle-Musigny · Domaine des Feuilles" },
  { label: "Pre-dessert", dish: "Yuzu Sorbet", vegetarian: "Yuzu Sorbet", note: "Champagne granita · mint; alcohol-free citrus granita on request", allergens: "Illustrative recipe; ask the kitchen", },
  { label: "Dessert", dish: "Dark Chocolate Soufflé", vegetarian: "Dark Chocolate Soufflé", note: "Crème fraîche · smoked salt caramel", allergens: "Milk, eggs, wheat", wine: "2020 Banyuls · Les Roches Dorées" },
];
export const bottles = [
  { name: "Barolo", year: "2021", producer: "Tenuta Aurea", price: 145, note: "Rose petal, dried cherry, a long mineral finish.", color: "#9b493d" },
  { name: "Pouilly-Fumé", year: "2022", producer: "Clos du Silex", price: 110, note: "Citrus peel, flint and a finely etched freshness.", color: "#b6a670" },
  { name: "Châteauneuf-du-Pape", year: "2020", producer: "Domaine du Crépuscule", price: 280, note: "Dark fruit, wild herbs and warm spice.", color: "#89534d" },
  { name: "Champagne", year: "NV", producer: "Maison Étoile · Grande Cuvée", price: 320, note: "Brioche, orchard fruit and a delicate bead.", color: "#b99d50" },
];
export const gallery = [
  { title: "A study in restraint", caption: "Scallop, autumn leaves and brown butter.", scene: "plate" },
  { title: "The room after dusk", caption: "Warm light, quiet conversations, linen.", scene: "room" },
  { title: "At the pass", caption: "The final gesture before a plate leaves the kitchen.", scene: "chef" },
  { title: "A generous pour", caption: "A fictional cellar, imagined in amber and ruby.", scene: "wine" },
  { title: "The season, gathered", caption: "Mushrooms, roots and the last garden herbs.", scene: "ingredients" },
  { title: "A place for you", caption: "Linen, candlelight and a moment of anticipation.", scene: "table" },
] as const;
export function nextServiceDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 1 || d.getDay() === 2) d.setDate(d.getDate() + 1);
  return localDate(d);
}
export function localDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
