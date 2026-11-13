export const products = [
  {id:"little-leek",name:"The Little Leek Plush",category:"Collectibles",price:2400,stock:8,featured:true,badge:"FAN FAVORITE",color:"#eceddf",description:"A soft, very unbothered desk companion. A fictional 25 cm plush with embroidered little features.",detail:"Illustrated concept · polyester plush · 25 cm · surface-clean only",image:"plush.svg"},
  {id:"daily-greens-mug",name:"Daily Greens Mug",category:"Home",price:1800,stock:12,featured:true,badge:"DAILY ESSENTIAL",color:"#e5ebdf",description:"For your morning brew and your daily serving of nonsense. An illustrated cream ceramic mug.",detail:"Illustrated concept · ceramic · 350 ml · hand-wash suggested",image:"mug.svg"},
  {id:"leek-club-tee",name:"The Leek Club Tee",category:"Wearables",price:3200,stock:7,featured:true,badge:"CLUB UNIFORM",color:"#eee8dc",description:"A relaxed off-white tee for people who take their greens, but not themselves, seriously.",detail:"Illustrated concept · unisex relaxed fit · sample size M only · cotton",image:"tee.svg"},
  {id:"emotional-support-tote",name:"Emotional Support Tote",category:"Wearables",price:2200,stock:9,featured:true,badge:"CARRY GOOD ENERGY",color:"#e9e9d8",description:"Room for books, snacks, and absolutely no serious business. An everyday canvas concept.",detail:"Illustrated concept · canvas · 38 × 40 cm · open top",image:"tote.svg"},
  {id:"green-thinking-cap",name:"Green Thinking Cap",category:"Wearables",price:2600,stock:5,featured:false,badge:"FRESH PICK",color:"#e0e7dc",description:"A green cotton cap with a tiny embroidered leek. Big thoughts remain entirely optional.",detail:"Illustrated concept · cotton · adjustable strap · one sample size",image:"cap.svg"},
  {id:"rooting-for-you-socks",name:"Rooting For You Socks",category:"Wearables",price:1400,stock:11,featured:false,badge:"A LITTLE PICK-ME-UP",color:"#f0e9df",description:"Cream crew socks with a leafy ankle detail. For taking your next small step.",detail:"Illustrated concept · cotton blend · one sample size 6–9 US",image:"socks.svg"},
  {id:"tiny-leek-pin",name:"Tiny Leek Enamel Pin",category:"Collectibles",price:900,stock:20,featured:true,badge:"SMALL BUT MIGHTY",color:"#e8eadc",description:"A tiny green companion for your jacket, your bag, or your questionable sense of humor.",detail:"Illustrated concept · enamel-look metal · 30 mm · clutch back",image:"pin.svg"},
  {id:"pocket-leek-keyring",name:"Pocket Leek Keyring",category:"Collectibles",price:1200,stock:15,featured:false,badge:"TAKE A LEEK",color:"#e9e5db",description:"A miniature leafy friend that is much better at keeping company than keeping your keys safe.",detail:"Illustrated concept · acrylic-look charm · 50 mm · metal split ring",image:"keyring.svg"},
  {id:"good-greens-stickers",name:"Good Greens Sticker Sheet",category:"Stationery",price:700,stock:25,featured:false,badge:"STICK WITH US",color:"#e8eddf",description:"Six cheerful little illustrations, ready to make a notebook look less like homework.",detail:"Illustrated concept · six paper stickers · A6 sheet · indoor use",image:"stickers.svg"},
  {id:"fresh-start-notebook",name:"Fresh Start Notebook",category:"Stationery",price:1600,stock:10,featured:false,badge:"NEW CHAPTER ENERGY",color:"#e7e5d9",description:"A soft green notebook for good ideas, grocery lists, and drawings of suspiciously tall vegetables.",detail:"Illustrated concept · A5 · 80 dotted pages · soft cover",image:"notebook.svg"},
  {id:"stay-rooted-print",name:"Stay Rooted Art Print",category:"Home",price:2000,stock:6,featured:false,badge:"WALLS NEED GREENS TOO",color:"#e9e3d8",description:"An original typographic print with a small leek and a very gentle reminder.",detail:"Illustrated concept · A4 paper print · pictured frame not included",image:"print.svg"},
  {id:"after-dark-leek",name:"After Dark Leek Light",category:"Home",price:4800,stock:0,featured:true,badge:"TAKING A LITTLE NAP",color:"#e0e7dc",description:"A leek-shaped ambient light concept. Unavailable in this sample catalog, but still full of personality.",detail:"Illustrated concept · decorative light · not an available product",image:"lamp.svg"},
];
const catalog = new Map(products.map((product) => [product.id, product]));
export const emptyCart = () => ({schema:1,revision:0,items:[]});
export function validateCart(cart) {
  if (!cart || cart.schema !== 1 || !Number.isSafeInteger(cart.revision) || cart.revision < 0 || !Array.isArray(cart.items) || cart.items.length > products.length) throw new Error("Saved cart format is not supported.");
  const seen = new Set();
  for (const item of cart.items) {
    const product = catalog.get(item?.id);
    if (!product || seen.has(item.id) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > product.stock) throw new Error("Saved cart contains an invalid item or quantity.");
    seen.add(item.id);
  }
  return cart;
}
export function restoreCart(raw) { return raw === null ? emptyCart() : validateCart(JSON.parse(raw)); }
export function setQuantity(cart,id,quantity) {
  validateCart(cart);
  const product = catalog.get(id);
  if (!product || !Number.isInteger(quantity) || quantity < 0 || quantity > product.stock) throw new Error(`Sample stock limit: ${product?.stock ?? 0}.`);
  const old = cart.items.find((item) => item.id === id)?.quantity || 0;
  if (quantity === old) throw new Error("The cart is already at that quantity.");
  if (cart.revision === Number.MAX_SAFE_INTEGER) throw new Error("Start a new cart to continue.");
  const next = structuredClone(cart);
  next.items = next.items.flatMap((item) => item.id === id ? quantity ? [{id,quantity}] : [] : [item]);
  if (quantity && !old) next.items.push({id,quantity});
  next.revision++;
  return next;
}
export function totals(cart,{zone="local",speed="standard"}={}) {
  validateCart(cart);
  if (!["local","farther"].includes(zone) || !["standard","express"].includes(speed)) throw new Error("Choose a supported demo delivery option.");
  const subtotal = cart.items.reduce((sum,item) => sum + catalog.get(item.id).price*item.quantity,0);
  const count = cart.items.reduce((sum,item) => sum + item.quantity,0);
  const shipping = !count ? 0 : speed === "express" ? (zone === "local" ? 1100 : 1900) : zone === "farther" ? 1200 : subtotal >= 6000 ? 0 : 500;
  return {subtotal,count,shipping,total:subtotal+shipping};
}
export function browse({query="",category="All",sort="featured"}={}) {
  if (!["featured","low","high","name"].includes(sort)) throw new Error("Unsupported sort order.");
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const found = products.filter((product) => (category === "All" || product.category === category) && terms.every((term) => `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(term)));
  return found.sort((a,b) => sort === "low" ? a.price-b.price : sort === "high" ? b.price-a.price : sort === "name" ? a.name.localeCompare(b.name) : Number(b.featured)-Number(a.featured));
}
export const money = (cents) => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(cents/100);
export const cartFingerprint = (cart) => JSON.stringify(validateCart(cart));
export function checkoutDraft(cart,{nickname,zone,speed,confirmed}) {
  if (!cart.items.length) throw new Error("Add an available sample product first.");
  const label = String(nickname || "").trim();
  if (label.length < 2 || label.length > 40 || /[\u0000-\u001f\u007f]/.test(label)) throw new Error("Use a fictional nickname of 2–40 characters.");
  if (!confirmed) throw new Error("Confirm this is a demo receipt, not a real order.");
  const quote = totals(cart,{zone,speed});
  return {schema:1,kind:"UNSENT DEMO RECEIPT",nickname:label,zone,speed,items:cart.items.map((item) => ({...item,name:catalog.get(item.id).name,unitPrice:catalog.get(item.id).price,lineTotal:catalog.get(item.id).price*item.quantity})),...quote,currency:"USD",status:"No order placed. No payment taken. No shipping arranged."};
}
export function assistantReply(query,cart) {
  const text = query.trim().toLowerCase();
  if (!text || text.length > 180) throw new Error("Use a message of 1–180 characters.");
  if (/\b(cart|basket)\b/.test(text)) return {rule:"cart summary",message:`Your local cart has ${totals(cart).count} item(s), with a merchandise subtotal of ${money(totals(cart).subtotal)}. Open the cart to make changes. I do not modify it.`,ids:[]};
  if (/\b(shipping|delivery)\b/.test(text)) return {rule:"sample shipping policy",message:"Demo standard delivery: $5 local, free at $60 merchandise; farther-away zone $12. Express is $11 local or $19 farther away. No actual shipping is arranged.",ids:[]};
  if (/\b(checkout|order|payment)\b/.test(text)) return {rule:"demo checkout boundary",message:"The cart offers a three-step demo receipt. No account, payment, real order or tracking is connected.",ids:[]};
  const budget = /\b(?:under|below)\s*\$?(\d+(?:\.\d{1,2})?)(?![\d.])/.exec(text);
  const limit = budget ? Math.round(Number(budget[1])*100) : null;
  const category = ["Home","Wearables","Stationery","Collectibles"].find((value) => text.includes(value.toLowerCase()));
  const terms = ["plush","mug","tee","tote","cap","socks","pin","keyring","sticker","notebook","print","light"].filter((term) => new RegExp(`\\b${term}s?\\b`).test(text));
  const supported = limit !== null || category || terms.length || /\b(gift|recommend|featured|available)\b/.test(text);
  if (!supported) return {rule:"help",message:"Try “gifts under $25”, “home”, “plush”, “shipping”, or “my cart”. I match a few fixed catalog rules, not open-ended AI questions.",ids:[]};
  let matches = products.filter((product) => product.stock > 0 && (limit === null || product.price < limit) && (!category || product.category === category) && (!terms.length || terms.some((term) => `${product.id} ${product.name}`.toLowerCase().includes(term))));
  if (/\bfeatured\b/.test(text)) matches = matches.filter((product) => product.featured);
  matches = matches.sort((a,b) => a.price-b.price).slice(0,3);
  const rule = [limit !== null ? `price strictly below ${money(limit)}` : "",category || "",terms.join("/"),"available sample stock"].filter(Boolean).join(" + ");
  return {rule,message:matches.length ? "These little greens match the rules below. Open a product to see its sample details." : "No available sample products match those rules. Try a higher budget or another category.",ids:matches.map((product) => product.id)};
}
