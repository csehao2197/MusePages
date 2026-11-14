// D'FOOTPRINT demo catalog. Prices, products and policies are sample data for this static homepage.
window.SHOP = {
  colors: {
    black: { name: "Black", strap: "#1C1C1C", sole: "#2B2B2B", insole: "#D9D4CC" },
    tan: { name: "Tan", strap: "#A0622D", sole: "#6B4423", insole: "#E6D3B8" },
    cream: { name: "Cream", strap: "#EFE6D2", sole: "#8D6E63", insole: "#F4ECDD" },
    brown: { name: "Chocolate", strap: "#5B3A29", sole: "#3E2A1E", insole: "#D7C3A8" },
    wine: { name: "Wine", strap: "#7B1E3A", sole: "#3B2328", insole: "#E8D6D0" },
    olive: { name: "Olive", strap: "#5E6B3A", sole: "#3F3A2A", insole: "#E1DCC6" },
    pink: { name: "Blush", strap: "#E8B4B8", sole: "#9C7A6E", insole: "#F6E7E4" },
    white: { name: "White", strap: "#F7F7F5", sole: "#BDB5AA", insole: "#FFFFFF" }
  },
  products: [
    { id: "amaka-buckle-slide", name: "Amaka Buckle Slide", type: "Slides", price: 15000, style: "band", accent: "buckle", colors: ["black", "tan", "brown"], badge: "Bestseller", desc: "A wide leather band with a polished gold-tone buckle. Our most re-ordered design since 2023." },
    { id: "rose-garden-slide", name: "Rose Garden Slide", type: "Slides", price: 18500, style: "double", accent: "rose", colors: ["cream", "pink", "white"], badge: "Gift favourite", desc: "Two soft straps finished with a hand-stitched rose. A favourite for birthdays and bridal gifts." },
    { id: "eko-cross-slipper", name: "Eko Cross Slipper", type: "Slippers", price: 13500, style: "cross", accent: "", colors: ["tan", "black", "olive"], desc: "Criss-cross straps that hold the foot securely. Easy everyday wear from market runs to Sunday lunch." },
    { id: "adire-braid-slide", name: "Adire Braid Slide", type: "Slides", price: 16000, style: "braid", accent: "", colors: ["brown", "tan", "black"], desc: "Hand-braided leather strips with a woven texture that softens beautifully with wear." },
    { id: "lekki-chain-slide", name: "Lekki Chain Slide", type: "Slides", price: 21000, style: "band", accent: "chain", colors: ["black", "wine", "cream"], badge: "New", desc: "A clean band with a gold-tone chain detail. Dressy enough for evenings out." },
    { id: "yaba-toe-post", name: "Yaba Toe-Post Slipper", type: "Slippers", price: 12000, style: "toe", accent: "", colors: ["tan", "black", "pink"], desc: "Minimal toe-post design with a cushioned footbed. Light, breezy and our lowest starting price." },
    { id: "ikoyi-mule", name: "Ikoyi Closed Mule", type: "Mules", price: 24000, style: "mule", accent: "", colors: ["black", "brown", "olive"], desc: "A closed-toe mule with visible saddle stitching. Smart enough for the office." },
    { id: "cloud-fur-slide", name: "Cloud Fur Slide", type: "Slides", price: 17500, style: "fur", accent: "", colors: ["cream", "pink", "white"], desc: "Plush faux-fur band over a firm handmade sole. Cosy indoors, stylish outdoors." },
    { id: "studded-signature-slide", name: "Studded Signature Slide", type: "Slides", price: 19500, style: "double", accent: "studs", colors: ["black", "wine", "tan"], desc: "Double straps lined with silver-tone studs, set by hand one by one." },
    { id: "ribbon-bow-mule", name: "Ribbon Bow Mule", type: "Mules", price: 26000, style: "mule", accent: "bow", colors: ["wine", "black", "pink"], badge: "Gift favourite", desc: "Our softest closed mule, finished with a satin-look bow. Arrives gift-ready." },
    { id: "monogram-slide", name: "D'F Monogram Slide", type: "Slides", price: 16500, style: "band", accent: "logo", colors: ["cream", "tan", "black"], desc: "A wide band embossed with the D'F monogram. A quiet signature piece." },
    { id: "allen-everyday-slipper", name: "Allen Everyday Slipper", type: "Slippers", price: 12500, style: "band", accent: "", colors: ["olive", "brown", "black"], desc: "The simplest band slipper we make: durable, comfortable and easy to style." }
  ],
  sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
  edits: [["Remove buckle / hardware", "Usually free"], ["Add a rose or bow", "from ₦2,000"], ["Change strap colour", "from ₦1,500"], ["Add initials / monogram", "from ₦2,500"], ["Wider or narrower fit", "Free (send foot length)"]],
  gift: { packaging: 2500, card: 1000 },
  states: ["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"],
  southWest: ["Ekiti", "Ogun", "Ondo", "Osun", "Oyo"],
  lagosZones: [["Mainland", 2500], ["Island & Lekki", 3500], ["Outskirts (Ikorodu, Badagry, Epe)", 4500]],
  faq: [
    ["How long does an order take?", "Every pair is made to order. Production takes 5–7 working days, then delivery takes 1–2 days in Lagos or 2–5 days nationwide by waybill."],
    ["Can I change a design?", "Yes, but every edit is reviewed first. Add a note when ordering and we'll confirm whether it's possible and any extra cost before we start. You're never charged for an edit you haven't agreed to."],
    ["Can you recreate a design I saw online?", "Often, yes. Use the Custom Order page to send a picture. We'll reply with a quote and timeline; custom requests aren't charged until you approve the quote."],
    ["What if my pair doesn't fit?", "Check the size guide before ordering. If a pair doesn't fit because of our mistake, we remake or exchange it. Other cases are handled individually, so message us within 48 hours of delivery."],
    ["Who pays for delivery?", "Delivery is paid by the buyer and shown clearly at checkout before payment."],
    ["Do you do gift wrapping?", "Yes: premium packaging (₦2,500) and a handwritten greeting card (₦1,000) can be added at checkout."]
  ]
};
