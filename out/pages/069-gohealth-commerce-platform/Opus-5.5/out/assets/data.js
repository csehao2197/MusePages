// GoHealth demo catalog and seed data (fictional). Persisted changes live in localStorage.
window.SEED = {
  categories: [
    { id: "vitamins", name: "Vitamins & Supplements" },
    { id: "teas", name: "Herbal Teas" },
    { id: "sports", name: "Sports Nutrition" },
    { id: "care", name: "Personal Care" },
    { id: "superfoods", name: "Superfoods" },
    { id: "sleep", name: "Sleep & Calm" }
  ],
  products: [
    { id: "p1", cat: "vitamins", name: "Daily Multivitamin", short: "MULTI", sub: "60 tablets", price: 18.99, rating: 4.7, reviews: 412, shape: "bottle", color: "#16A34A", body: "#DCFCE7", cap: "#15803D", bg: "#F0FDF4", desc: "A complete once-a-day formula with 23 vitamins and minerals, including D3, B12 and zinc." },
    { id: "p2", cat: "vitamins", name: "Vitamin D3 + K2 Drops", short: "D3 + K2", sub: "30 ml", price: 14.5, rating: 4.8, reviews: 289, shape: "dropper", color: "#D97706", body: "#FEF3C7", cap: "#B45309", bg: "#FFFBEB", desc: "Liquid D3 (1000 IU) with K2 for bone and immune support. Vegan, in coconut MCT oil." },
    { id: "p3", cat: "vitamins", name: "Omega-3 Algae Oil", short: "OMEGA-3", sub: "90 softgels", price: 26, rating: 4.6, reviews: 198, shape: "bottle", color: "#0284C7", body: "#E0F2FE", cap: "#0369A1", bg: "#F0F9FF", desc: "Plant-based EPA and DHA from algae. No fishy aftertaste, sustainably sourced." },
    { id: "p4", cat: "vitamins", name: "Magnesium Glycinate", short: "MAGNESIUM", sub: "120 capsules", price: 21.75, rating: 4.8, reviews: 534, shape: "bottle", color: "#7C3AED", body: "#EDE9FE", cap: "#6D28D9", bg: "#F5F3FF", desc: "Gentle, highly absorbable magnesium for muscle function and relaxation." },
    { id: "p5", cat: "teas", name: "Ginger Lemon Tea", short: "GINGER", sub: "20 tea bags", price: 7.99, rating: 4.5, reviews: 167, shape: "box", color: "#EA580C", body: "#FFEDD5", cap: "#C2410C", bg: "#FFF7ED", desc: "Warming organic ginger with bright lemon peel. Caffeine-free." },
    { id: "p6", cat: "teas", name: "Chamomile Calm", short: "CHAMOMILE", sub: "20 tea bags", price: 6.99, rating: 4.7, reviews: 221, shape: "box", color: "#CA8A04", body: "#FEF9C3", cap: "#A16207", bg: "#FEFCE8", desc: "Whole chamomile flowers for a soothing evening cup." },
    { id: "p7", cat: "teas", name: "Matcha Ceremonial", short: "MATCHA", sub: "30 g tin", price: 24, rating: 4.6, reviews: 143, shape: "jar", color: "#15803D", body: "#DCFCE7", cap: "#166534", bg: "#F0FDF4", desc: "Stone-ground first-harvest matcha from Uji. Smooth, vibrant and naturally energizing." },
    { id: "p8", cat: "sports", name: "Plant Protein Vanilla", short: "PROTEIN", sub: "1 kg", price: 39.99, rating: 4.5, reviews: 376, shape: "pouch", color: "#0F766E", body: "#CCFBF1", cap: "#115E59", bg: "#F0FDFA", desc: "Pea and brown rice protein: 24 g per scoop, 5 g BCAAs, no added sugar." },
    { id: "p9", cat: "sports", name: "Electrolyte Mix", short: "HYDRATE", sub: "30 sticks", price: 19.5, rating: 4.6, reviews: 251, shape: "box", color: "#2563EB", body: "#DBEAFE", cap: "#1D4ED8", bg: "#EFF6FF", desc: "Sodium, potassium and magnesium for hydration during training. Zero sugar." },
    { id: "p10", cat: "sports", name: "Creatine Monohydrate", short: "CREATINE", sub: "300 g", price: 22.99, rating: 4.9, reviews: 612, shape: "jar", color: "#475569", body: "#E2E8F0", cap: "#334155", bg: "#F8FAFC", desc: "Pure micronized creatine for strength and power. Unflavored, mixes easily." },
    { id: "p11", cat: "care", name: "Aloe Recovery Gel", short: "ALOE", sub: "150 ml", price: 11.5, rating: 4.4, reviews: 98, shape: "tube", color: "#65A30D", body: "#ECFCCB", cap: "#4D7C0F", bg: "#F7FEE7", desc: "Cooling organic aloe vera gel for post-sun and post-workout skin." },
    { id: "p12", cat: "care", name: "Mineral Sunscreen SPF 50", short: "SPF 50", sub: "75 ml", price: 18, rating: 4.6, reviews: 187, shape: "tube", color: "#DB2777", body: "#FCE7F3", cap: "#BE185D", bg: "#FDF2F8", desc: "Reef-friendly zinc formula that leaves no white cast on most skin tones." },
    { id: "p13", cat: "superfoods", name: "Organic Spirulina", short: "SPIRULINA", sub: "200 g", price: 16.5, rating: 4.3, reviews: 121, shape: "pouch", color: "#0D9488", body: "#CCFBF1", cap: "#0F766E", bg: "#F0FDFA", desc: "Nutrient-dense blue-green algae powder, great in smoothies." },
    { id: "p14", cat: "superfoods", name: "Chia Seeds", short: "CHIA", sub: "500 g", price: 9.25, rating: 4.7, reviews: 302, shape: "pouch", color: "#57534E", body: "#E7E5E4", cap: "#44403C", bg: "#FAFAF9", desc: "Whole organic chia, rich in fibre and omega-3s." },
    { id: "p15", cat: "sleep", name: "Melatonin 1 mg", short: "SLEEP", sub: "60 gummies", price: 12.99, rating: 4.5, reviews: 264, shape: "jar", color: "#4F46E5", body: "#E0E7FF", cap: "#4338CA", bg: "#EEF2FF", desc: "Low-dose melatonin gummies with passionflower to support a regular sleep cycle." },
    { id: "p16", cat: "sleep", name: "Ashwagandha KSM-66", short: "CALM", sub: "60 capsules", price: 23.5, rating: 4.6, reviews: 330, shape: "bottle", color: "#9333EA", body: "#F3E8FF", cap: "#7E22CE", bg: "#FAF5FF", desc: "Clinically studied ashwagandha root extract to help the body manage stress." }
  ],
  users: [
    { email: "demo@gohealth.example", name: "Jamie Rivera", role: "customer", password: "demo1234" },
    { email: "admin@gohealth.example", name: "Store Admin", role: "admin", password: "admin1234" }
  ],
  customers: ["Ava T.", "Ben K.", "Chen L.", "Dara O.", "Eli M.", "Farah S.", "Gus P.", "Hana Y.", "Ivan R.", "Jo W.", "Kemi A.", "Leo B."]
};
