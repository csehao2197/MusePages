export function seed(){
  const media=[
    ["city","look-1.jpg","Blue coat and scarf, photographed in a city square"],
    ["warm","look-2.jpg","Warm-toned garments on a dark green clothing rail"],
    ["neutral","look-3.jpg","Neutral garments hanging on a minimal clothing rail"],
    ["jacket","look-4.jpg","Terracotta bomber jacket on a hanger"],
    ["trouser","look-5.jpg","Rose-colored trousers with a relaxed silhouette"],
    ["weekend","look-6.jpg","Dark casual outfit, trousers and sneakers arranged flat"]
  ].map(([id,file,alt])=>({id,url:`assets/${file}`,alt,name:file,uploaded:false}));
  const categories=[{id:"outerwear",name:"Outerwear",slug:"outerwear",description:"Layers with a point of view."},{id:"everyday",name:"Everyday",slug:"everyday",description:"Easy silhouettes, quietly expressive."},{id:"edits",name:"Wardrobe edits",slug:"wardrobe-edits",description:"A little inspiration for getting dressed."}];
  const products=[
    ["city-coat","The city coat","outerwear","city","A blue statement layer, reimagined as an easy everyday uniform. An editorial concept inspired by the accompanying photograph.","240"],
    ["terracotta-jacket","The terracotta jacket","outerwear","jacket","A warm color and a clean, familiar silhouette. A fictional catalog piece illustrated by inspiration photography.","160"],
    ["easy-trouser","The easy trouser","everyday","trouser","A softer approach to everyday dressing, with an easy shape and a rose-colored palette. A sample styling concept.","95"],
    ["weekend-uniform","The weekend uniform","everyday","weekend","Dark tones, familiar shapes, and room to make it your own. A complete-look concept, rather than a purchasable bundle.",""],
    ["warm-palette","The warm palette edit","edits","warm","A study in warm colors and playful contrast. An inspiration edit of the garments shown, not a set of items for sale.",""],
    ["soft-neutrals","The soft neutrals edit","edits","neutral","Light tones and quiet textures, gathered into one visual mood. An editorial reference, not a claim about fabric or stock.",""]
  ].map(([id,name,categoryId,image,description,price],index)=>({id,slug:id,name,categoryId,images:[image],description,priceCents:price?Number(price)*100:null,featured:index<4,status:"published",createdAt:"2026-11-01T00:00:00.000Z",updatedAt:"2026-11-01T00:00:00.000Z"}));
  return {schema:1,media,categories,products,saved:[],hero:{title:"Less, but considered.",subtitle:"A quieter approach to getting dressed. Discover a small collection of everyday silhouettes with a point of view.",cta:"Explore the collection",image:"city"},about:{title:"Room for what matters.",description:"We believe a wardrobe can feel like a deep breath. FORME is a fictional fashion catalog exploring thoughtful color, familiar shapes, and the freedom to wear things your own way.",image:"neutral"},gallery:["warm","weekend"],settings:{brand:"FORME",accent:"#394235"}};
}
const clean=(value)=>String(value??"").trim();
const bounded=(value,min,max,label)=>{const text=clean(value);if(text.length<min||text.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text))throw Error(`${label}: use ${min}–${max} characters.`);return text;};
export const slugify=(value)=>clean(value).normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
export function parsePrice(value){const text=clean(value);if(!text)return null;if(!/^\d{1,5}(?:\.\d{1,2})?$/.test(text))throw Error("Price: use a positive amount with up to two decimals, or leave blank.");const [whole,fraction=""]=text.split(".");return Number(whole)*100+Number(fraction.padEnd(2,"0"));}
export const money=(cents)=>cents===null?"Price not listed":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:cents%100?2:0,minimumFractionDigits:cents%100?2:0}).format(cents/100);
export function queryProducts(state,{query="",category="",saved=false,sort="editorial",featured=false}={}){
  const terms=clean(query).normalize("NFKC").toLowerCase().split(/\s+/).filter(Boolean);
  const results=state.products.filter((item)=>item.status==="published"&&(!category||item.categoryId===category)&&(!saved||state.saved.includes(item.id))&&(!featured||item.featured)&&terms.every((term)=>`${item.name} ${item.description} ${state.categories.find((cat)=>cat.id===item.categoryId)?.name??""}`.normalize("NFKC").toLowerCase().includes(term)));
  if(sort==="name")results.sort((a,b)=>a.name.localeCompare(b.name));
  if(["price-low","price-high"].includes(sort))results.sort((a,b)=>a.priceCents===null?b.priceCents===null?0:1:b.priceCents===null?-1:(a.priceCents-b.priceCents)*(sort==="price-high"?-1:1));
  return results;
}
export function saveProduct(state,input,id=null,now=new Date().toISOString()){
  const old=id?state.products.find((item)=>item.id===id):null;if(id&&!old)throw Error("This piece no longer exists.");
  if(!old&&state.products.length>=50)throw Error("This local catalog supports up to 50 pieces.");
  const name=bounded(input.name,3,80,"Name"),slug=clean(input.slug)||slugify(name);
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||slug.length>90)throw Error("Slug: use lowercase words separated by hyphens.");
  if(state.products.some((item)=>item.id!==id&&item.slug===slug))throw Error("That product slug is already in use.");
  if(!state.categories.some((cat)=>cat.id===input.categoryId))throw Error("Choose an existing category.");
  const images=[...new Set(input.images??[])];if(!images.length||images.length>3||images.some((image)=>!state.media.some((asset)=>asset.id===image)))throw Error("Choose one to three available images.");
  if(!["published","draft"].includes(input.status))throw Error("Choose a valid status.");
  const product={id:old?.id??`piece-${crypto.randomUUID().slice(0,8)}`,name,slug,categoryId:input.categoryId,description:bounded(input.description,10,900,"Description"),images,priceCents:parsePrice(input.price),status:input.status,featured:Boolean(input.featured),createdAt:old?.createdAt??now,updatedAt:now};
  if(old)state.products[state.products.indexOf(old)]=product;else state.products.push(product);
  if(product.status==="draft")state.saved=state.saved.filter((key)=>key!==product.id);
  return product;
}
export function deleteProduct(state,id){if(!state.products.some((item)=>item.id===id))throw Error("This piece no longer exists.");state.products=state.products.filter((item)=>item.id!==id);state.saved=state.saved.filter((key)=>key!==id);}
export function saveCategory(state,input,id=null){
  const old=id?state.categories.find((cat)=>cat.id===id):null;if(id&&!old)throw Error("This category no longer exists.");
  if(!old&&state.categories.length>=12)throw Error("This local catalog supports up to 12 categories.");
  const name=bounded(input.name,2,40,"Category name"),slug=slugify(name);
  if(!slug)throw Error("Use a category name containing Latin letters or numbers.");
  if(state.categories.some((cat)=>cat.id!==id&&(cat.slug===slug||cat.name.toLocaleLowerCase()===name.toLocaleLowerCase())))throw Error("That category name is already in use.");
  const category={id:old?.id??`category-${crypto.randomUUID().slice(0,8)}`,name,slug,description:bounded(input.description,5,160,"Category description")};
  if(old)state.categories[state.categories.indexOf(old)]=category;else state.categories.push(category);return category;
}
export function deleteCategory(state,id){if(state.products.some((item)=>item.categoryId===id))throw Error("Move or delete this category's pieces first, including drafts.");state.categories=state.categories.filter((cat)=>cat.id!==id);}
export function removeMedia(state,id){if(state.products.some((item)=>item.images.includes(id))||state.hero.image===id||state.about.image===id||state.gallery.includes(id))throw Error("This image is in use. Replace its references before removing it.");state.media=state.media.filter((item)=>item.id!==id);}
export function saveContent(state,input){
  const hero={title:bounded(input.heroTitle,3,70,"Hero title"),subtitle:bounded(input.heroSubtitle,10,220,"Hero subtitle"),cta:bounded(input.heroCta,2,32,"Button label"),image:input.heroImage};
  const about={title:bounded(input.aboutTitle,3,80,"About title"),description:bounded(input.aboutDescription,20,900,"About description"),image:input.aboutImage};
  const gallery=[...new Set(input.gallery??[])];
  if(!gallery.length||gallery.length>4||[hero.image,about.image,...gallery].some((id)=>!state.media.some((asset)=>asset.id===id)))throw Error("Choose valid images and one to four gallery images.");
  state.hero=hero;state.about=about;state.gallery=gallery;
}
export function saveSettings(state,input){
  const brand=bounded(input.brand,2,24,"Brand"),accent=clean(input.accent);
  if(!/^#[a-f0-9]{6}$/i.test(accent))throw Error("Use a six-digit hex accent color.");
  const rgb=accent.slice(1).match(/../g).map((hex)=>parseInt(hex,16)/255).map((value)=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4);
  if(1.05/(rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722+.05)<4.5)throw Error("Choose a darker accent with readable white button text (4.5:1 contrast).");
  state.settings={brand,accent};
}
export function makeDraft(subject,message){return `UNSENT CATALOG INQUIRY\nSubject: ${bounded(subject,3,100,"Subject")}\n\n${bounded(message,10,2000,"Message")}\n\nDownloaded locally. Not sent to a store.\n`;}
