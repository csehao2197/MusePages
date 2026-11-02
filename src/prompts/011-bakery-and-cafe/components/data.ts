export const categories = ["Breads", "Pastries", "Breakfast", "Lunch", "Coffee & Drinks"] as const;
export type Category = typeof categories[number];
export type Product = { id: string; name: string; description: string; cents: number; category: Category; art: "bread" | "croissant" | "coffee" | "sandwich" | "cake"; dietary?: string; tag?: string };
export const products: Product[] = [
  { id: "sourdough", name: "Sourdough Boule", description: "48-hour fermented, with a crackling crust.", cents: 850, category: "Breads", art: "bread", dietary: "Plant-based recipe", tag: "Best Seller" },
  { id: "multigrain", name: "Multigrain Farmhouse Loaf", description: "Toasty seeds, a soft heart, a hearty slice.", cents: 900, category: "Breads", art: "bread", dietary: "Plant-based recipe" },
  { id: "ciabatta", name: "Ciabatta", description: "Airy crumb and a flour-dusted crust.", cents: 650, category: "Breads", art: "bread" },
  { id: "focaccia", name: "Olive Rosemary Focaccia", description: "Olive oil, garden rosemary, flaky salt.", cents: 775, category: "Breads", art: "bread", dietary: "Plant-based recipe" },
  { id: "rye", name: "Rye Pumpernickel", description: "Deep, earthy rye with a little caraway.", cents: 800, category: "Breads", art: "bread" },
  { id: "baguette", name: "Baguette", description: "Golden, crisp, and made for sharing.", cents: 450, category: "Breads", art: "bread" },
  { id: "almond", name: "Almond Croissant", description: "Twice-baked with almond cream and toasted almonds.", cents: 575, category: "Pastries", art: "croissant", dietary: "Contains nuts", tag: "Staff Pick" },
  { id: "butter", name: "Butter Croissant", description: "Delicate layers of cultured-butter pastry.", cents: 450, category: "Pastries", art: "croissant" },
  { id: "pain", name: "Pain au Chocolat", description: "Dark chocolate tucked inside golden layers.", cents: 500, category: "Pastries", art: "croissant" },
  { id: "lemon", name: "Lemon Tea Cake", description: "Bright lemon glaze and a tender crumb.", cents: 475, category: "Pastries", art: "cake", dietary: "Gluten-free recipe option" },
  { id: "egg", name: "Baker’s Breakfast Sandwich", description: "Soft egg, cheddar, and our butter croissant.", cents: 1050, category: "Breakfast", art: "sandwich" },
  { id: "toast", name: "Avocado Sourdough Toast", description: "Avocado, lemon, radish, and a little crunch.", cents: 950, category: "Breakfast", art: "sandwich", dietary: "Plant-based recipe" },
  { id: "granola", name: "Honey Yogurt & Granola", description: "Thick yogurt, berries, and toasted granola.", cents: 750, category: "Breakfast", art: "coffee", dietary: "Contains nuts" },
  { id: "morning", name: "Morning Bun", description: "Orange zest and cinnamon sugar swirls.", cents: 500, category: "Breakfast", art: "croissant" },
  { id: "tomato", name: "Tomato & Mozzarella Ciabatta", description: "Basil, ripe tomato, and fresh mozzarella.", cents: 1150, category: "Lunch", art: "sandwich" },
  { id: "soup", name: "Roasted Tomato Soup", description: "A warming bowl with a slice of sourdough.", cents: 850, category: "Lunch", art: "coffee" },
  { id: "garden", name: "Garden Focaccia Sandwich", description: "Roasted vegetables and lemon hummus.", cents: 1100, category: "Lunch", art: "sandwich", dietary: "Plant-based recipe" },
  { id: "cheese", name: "Three-Cheese Toastie", description: "Melty cheddar, Swiss, and mozzarella.", cents: 1000, category: "Lunch", art: "sandwich" },
  { id: "lavender", name: "Lavender Honey Latte", description: "Honey, dried lavender, and our house espresso.", cents: 625, category: "Coffee & Drinks", art: "coffee", tag: "Seasonal" },
  { id: "flat", name: "Flat White", description: "A double espresso with silky steamed milk.", cents: 475, category: "Coffee & Drinks", art: "coffee" },
  { id: "cold", name: "Cold Brew", description: "Slow-steeped, smooth, and served over ice.", cents: 450, category: "Coffee & Drinks", art: "coffee" },
  { id: "tea", name: "Garden Herbal Tea", description: "A comforting caffeine-free botanical blend.", cents: 375, category: "Coffee & Drinks", art: "coffee" },
];
export const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function pickupError(value: string, hasBread: boolean) {
  const date = new Date(`${value}T12:00:00`);
  if (!value || Number.isNaN(date.getTime()) || localDate(date) !== value) return "Choose a valid pickup date.";
  if (value < localDate()) return "Pickup must be today or later.";
  if (date.getDay() === 1) return "Monday is our baking day. Please choose Tuesday–Sunday.";
  if (date.getDay() === 0 && hasBread) return "Sunday is pastries & drinks only. Choose another day for this order.";
  return "";
}
