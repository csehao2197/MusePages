export const TODAY=new Date().toISOString().slice(0,10);
export const escape=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const gcd=(a,b)=>b?gcd(b,a%b):a;
export function rational(n,d=1n){n=BigInt(n);d=BigInt(d);if(d<=0n)throw Error("Invalid denominator");const g=gcd(n,d);return {n:n/g,d:d/g};}
export const add=(a,b)=>rational(a.n*b.d+b.n*a.d,a.d*b.d);
export function quantity(text){
  const clean=text.trim();let n,d;
  if(/^\d+(?: \d+)?\/\d+$/.test(clean)){const [left,den]=clean.split("/"),parts=left.split(" ").map(BigInt);d=BigInt(den);if(d===0n||d>1000n)throw Error("Use a fraction denominator from 1 to 1000");n=parts.length===2?parts[0]*d+parts[1]:parts[0];}
  else if(/^\d+(?:\.\d{1,3})?$/.test(clean)){const [whole,fraction=""]=clean.split(".");d=10n**BigInt(fraction.length);n=BigInt(whole)*d+BigInt(fraction||"0");}
  else throw Error("Use a positive number, decimal or fraction");
  if(n<=0n||n>1000000n*d)throw Error("Quantity must be above zero and at most 1,000,000");return rational(n,d);
}
export function format(q){const whole=q.n/q.d,r=q.n%q.d;return r?(whole?`${whole} ${r}/${q.d}`:`${r}/${q.d}`):`${whole}`;}
const unitAliases={g:"g",gram:"g",grams:"g",kg:"kg",kilogram:"kg",kilograms:"kg",lb:"lb",lbs:"lb",pound:"lb",pounds:"lb",oz:"oz",ounce:"oz",ounces:"oz",ml:"ml",milliliter:"ml",milliliters:"ml",l:"l",liter:"l",liters:"l",litre:"l",litres:"l",cup:"cup",cups:"cup",tbsp:"tbsp",tablespoon:"tbsp",tablespoons:"tbsp",tsp:"tsp",teaspoon:"tsp",teaspoons:"tsp",each:"each",head:"head",heads:"head",clove:"clove",cloves:"clove",bunch:"bunch",bunches:"bunch",pinch:"pinch",pinches:"pinch",can:"can",cans:"can"};
export const units=Object.freeze([...new Set(Object.values(unitAliases))]);
export const UNIT_NOTE="Exact rational sums: g↔kg, lb↔oz (1 lb = 16 oz), ml↔l. US measures: 1 cup = 16 tbsp = 48 tsp. Metric mass, imperial mass, metric volume, US volume and different count units stay separate. No density conversions.";
export const groups=["protein","carbohydrate","vegetable","other"];
const aliases={"carrots":"carrot","tomatoes":"tomato","potatoes":"potato","chicken breasts":"chicken breast","onions":"onion","bell peppers":"bell pepper","eggs":"egg","garlic cloves":"garlic","green onions":"spring onion"};
const normalize=name=>{const clean=name.toLowerCase().replace(/\s+/g," ").trim();return aliases[clean]||clean;};
export function category(name){if(/\b(chicken|tofu|salmon|beef|turkey|egg|lentils?|chickpeas?|beans?)\b/.test(name))return "protein";if(/\b(rice|pasta|noodles?|quinoa|couscous|potato|bread|oats?)\b/.test(name))return "carbohydrate";if(/\b(broccoli|spinach|carrot|tomato|onion|kale|zucchini|courgette|bell pepper|cabbage|peas?)\b/.test(name))return "vegetable";return "other";}
export function parse(raw){
  const lines=String(raw).split(/\r?\n/).map(s=>s.trim()).filter(Boolean),ingredients=[],errors=[];
  if(!lines.length||lines.length>30)return {ingredients,errors:["Use 1–30 ingredient lines."]};
  for(const [index,line]of lines.entries()){
    const text=line.replace(/[½¼¾⅓⅔⅛⅜⅝⅞]/g,c=>" "+({"½":"1/2","¼":"1/4","¾":"3/4","⅓":"1/3","⅔":"2/3","⅛":"1/8","⅜":"3/8","⅝":"5/8","⅞":"7/8"}[c])).replace(/\s+/g," ").trim(),match=/^(\d+(?: \d+\/\d+|\/\d+|\.\d{1,3})?)\s+(.+)$/.exec(text);
    if(!match){errors.push(`Line ${index+1}: start with a quantity, then an optional known unit and ingredient.`);continue;}
    try{const q=quantity(match[1]),rest=match[2],rawToken=rest.split(" ")[0],token=rawToken.toLowerCase().replace(/\.$/,""),unit=unitAliases[token]||"each",name=normalize(unitAliases[token]?rest.slice(rawToken.length).trim():rest);if(!name||name.length>100)throw Error("Ingredient name needs 1–100 characters");ingredients.push({name,quantity:q,unit,category:category(name)});}catch(error){errors.push(`Line ${index+1}: ${error.message}.`);}
  }
  return {ingredients,errors};
}
export function primary(ingredients){return Object.fromEntries(groups.slice(0,3).map(group=>[group,ingredients.find(i=>i.category===group)?.name||null]));}
export const validMeal=ingredients=>Object.values(primary(ingredients)).filter(Boolean).length>=2;
const unitInfo={g:["mass",1n],kg:["mass",1000n],lb:["imperial-mass",16n],oz:["imperial-mass",1n],ml:["metric-volume",1n],l:["metric-volume",1000n],cup:["us-volume",48n],tbsp:["us-volume",3n],tsp:["us-volume",1n]};
export function aggregate(recipes){
  const rows=new Map();
  for(const recipe of recipes)for(const i of recipe.ingredients){const [family,multiplier]=unitInfo[i.unit]||[i.unit,1n],key=`${normalize(i.name)}|${family}`,q=rational(i.quantity.n*multiplier,i.quantity.d),row=rows.get(key);if(row){row.quantity=add(row.quantity,q);row.sources.add(recipe.id);}else rows.set(key,{key,name:normalize(i.name),family,quantity:q,category:i.category,sources:new Set([recipe.id])});}
  return [...rows.values()].map(row=>{let unit=row.family,multiplier=1n;if(row.family==="mass"){unit=row.quantity.n>=1000n*row.quantity.d?"kg":"g";multiplier=unit==="kg"?1000n:1n;}if(row.family==="imperial-mass"){unit=row.quantity.n>=16n*row.quantity.d?"lb":"oz";multiplier=unit==="lb"?16n:1n;}if(row.family==="metric-volume"){unit=row.quantity.n>=1000n*row.quantity.d?"l":"ml";multiplier=unit==="l"?1000n:1n;}if(row.family==="us-volume"){unit=row.quantity.n>=48n*row.quantity.d?"cup":row.quantity.n>=3n*row.quantity.d?"tbsp":"tsp";multiplier=unitInfo[unit][1];}return {...row,unit,quantity:rational(row.quantity.n,row.quantity.d*multiplier),sources:[...row.sources]};}).sort((a,b)=>groups.indexOf(a.category)-groups.indexOf(b.category)||a.name.localeCompare(b.name));
}
export function suggest(recipes,{exclude=[],avoid=[],offset=0,count=3}={}){
  const candidates=recipes.filter(r=>!exclude.includes(r.id)).sort((a,b)=>(a.lastPlanned||"").localeCompare(b.lastPlanned||"")||a.id.localeCompare(b.id)),fresh=candidates.filter(r=>!avoid.includes(r.id)),pool=fresh.length>=Math.min(count,candidates.length)?fresh:candidates;
  if(!pool.length)return [];
  const rotated=[...pool.slice(offset%pool.length),...pool.slice(0,offset%pool.length)],chosen=[],used=new Set();
  while(chosen.length<count&&rotated.length){const signatures=r=>Object.values(primary(r.ingredients)).filter(Boolean),index=Math.max(0,rotated.findIndex(r=>signatures(r).every(s=>!used.has(s)))),[recipe]=rotated.splice(index,1);chosen.push(recipe);signatures(recipe).forEach(s=>used.add(s));}
  return chosen;
}
export function validDate(value){const time=Date.parse(value+"T00:00:00Z");return value===""||/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(time)&&new Date(time).toISOString().slice(0,10)===value&&value<=TODAY;}
const ago=days=>new Date(Date.parse(TODAY+"T00:00:00Z")-days*86400000).toISOString().slice(0,10);
const make=(id,name,raw,art,lastPlanned,totalPlans)=>({id,name,raw,art,lastPlanned,totalPlans,ingredients:parse(raw).ingredients});
export const initialRecipes=()=>[
  make("chickpea-bowl","The feel-good chickpea bowl","400 g chickpeas\n1 cup quinoa\n200 g spinach\n2 tbsp olive oil","bowl",null,0),
  make("tofu-noodles","Sticky tofu, happy noodles","300 g tofu\n200 g noodles\n250 g broccoli\n2 tbsp soy sauce","tofu",ago(18),2),
  make("tomato-pasta","Sunday kind of tomato pasta","300 g pasta\n400 g tomato\n100 g spinach\n1 tbsp olive oil","pasta",ago(12),3),
  make("lentil-rice","A little lentil & rice comfort","300 g lentils\n1 cup rice\n200 g carrot\n1 tbsp olive oil","lentils",ago(6),2),
  make("ginger-chicken","Ginger chicken & greens","400 g chicken breast\n1 cup rice\n300 g broccoli\n2 tbsp soy sauce","chicken",ago(3),4),
  make("egg-potato","Golden potatoes, soft greens","4 egg\n500 g potato\n200 g spinach\n1 tbsp olive oil","potatoes",ago(1),5)
];
