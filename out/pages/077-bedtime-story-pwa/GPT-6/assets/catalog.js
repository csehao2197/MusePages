export const esc=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const stories=[
  {id:"lantern",title:"The little lantern",theme:"Wonder",character:"Pip the rabbit",description:"A small rabbit, a borrowed glow, and the lovely way home.",added:3,pages:[
    {key:"lantern-meadow",title:"A pocket of light",text:"Pip the rabbit found a little lantern beside the meadow path. It glowed like a sleepy firefly. The moon was already high, and every flower had folded its petals. Pip lifted the lantern gently. Perhaps, he thought, even a small light could be good company."},
    {key:"lantern-bridge",title:"The listening bridge",text:"At the little bridge, Pip stopped to listen. Water whispered beneath the wooden boards. An owl rustled softly in the willow tree. Pip placed the lantern on the railing, and a golden circle settled on the stream. Nobody needed to hurry. The night had room for everyone."},
    {key:"lantern-home",title:"Enough for tonight",text:"Back at his burrow, Pip set the lantern by the window. Its warm glow joined the moonlight on his blanket. He had not found a grand adventure, only a handful of lovely little things. That was plenty. Pip tucked in his ears and let the quiet hold him."}
  ]},
  {id:"whale",title:"A cloud for a whale",theme:"Kindness",character:"Bean the whale",description:"Somewhere between the sea and the stars, a little kindness floats.",added:2,pages:[
    {key:"whale-sky",title:"A very soft landing",text:"Bean was a small whale with a very big daydream. One evening, a low cloud drifted over the quiet sea. Bean imagined resting on its soft white edge. In his dream, the cloud held him as gently as the water did, and together they floated toward the evening stars."},
    {key:"whale-stars",title:"Room for a friend",text:"A tiny bird landed beside Bean. She had been looking for somewhere peaceful to rest. Bean moved a little to one side. There was room for two, and room for silence too. They watched a single star appear, then another, without needing to count them all."},
    {key:"whale-sea",title:"The sea remembers",text:"When Bean woke, he was floating safely in the familiar sea. The bird was a small shape on the shore. He sent her the gentlest little wave. Above them, the cloud continued its slow journey. Bean took a quiet breath and rested, held by the water he knew."}
  ]},
  {id:"fox",title:"The fox who found quiet",theme:"Calm",character:"Fern the fox",description:"Fern discovers that the best treasure can be a peaceful moment.",added:1,pages:[
    {key:"fox-garden",title:"The quiet garden",text:"Fern the fox liked collecting interesting things: a smooth stone, a curled leaf, a feather the color of rain. Tonight she carried an empty basket into the garden. She wondered if there was anything new to find. The garden answered with the softest rustle of grass."},
    {key:"fox-pond",title:"Something to keep",text:"By the pond, Fern sat on a flat warm stone. She watched the moon make a silver path across the water. Her basket was still empty, but her thoughts felt lighter. Perhaps this was something to keep: a moment that asked nothing at all, except for a little attention."},
    {key:"fox-rest",title:"A lovely nothing",text:"At home, Fern put her empty basket beside her favorite blanket. There was no new feather or stone to show. Instead, she remembered the moon, the grass, and the slow pond. She curled her tail around her paws. A lovely nothing, she decided, could be the nicest find of all."}
  ]}
];
export function readingMinutes(story){return Math.max(1,Math.ceil(story.pages.reduce((n,p)=>n+p.text.trim().split(/\s+/).length,0)/100));}
export function filterStories(items,query="",theme="all",favoritesOnly=false,favorites=new Set(),sort="newest"){
  const q=query.trim().toLowerCase();return items.filter(s=>(theme==="all"||s.theme===theme)&&(!favoritesOnly||favorites.has(s.id))&&`${s.title} ${s.character} ${s.description}`.toLowerCase().includes(q)).sort(sort==="title"?(a,b)=>a.title.localeCompare(b.title):(a,b)=>b.added-a.added);
}
export function makeDraft({title,setting,wish,character},serial){
  if(typeof title!=="string"||!title.trim()||title.length>60)throw Error("Give your draft a title of 1–60 characters.");
  if(typeof setting!=="string"||!setting.trim()||setting.length>80||typeof wish!=="string"||!wish.trim()||wish.length>120)throw Error("Use a place of 1–80 characters and a wish of 1–120 characters.");
  const base=stories.find(s=>s.id===character);if(!base)throw Error("Choose one of the three original characters.");
  const name=base.character,place=setting.trim(),idea=wish.trim();
  return{id:`draft-${serial}`,title:title.trim(),theme:base.theme,character:name,description:"A reading draft made with your words and a fixed local template.",added:100+serial,custom:true,pages:base.pages.map((p,index)=>({...p,title:["A little beginning","One small wish","A softer goodnight"][index],text:[
    `${name} imagined a peaceful place: ${place}. There was time to look around, time to notice the small things, and no reason to rush. The evening felt like an open page.`,
    `In that quiet place, there was one small wish: ${idea}. ${name} thought about taking a gentle first step. Sometimes a good beginning could be something as simple as pausing and paying attention.`,
    `For now, the little adventure could rest. ${name} remembered the place and the wish, then let the story grow quiet. There would be room for more another day. Tonight, this was enough.`
  ][index]}))};
}
export function validatePages(pages){if(!Array.isArray(pages)||pages.length!==3||pages.some(p=>typeof p.text!=="string"||!p.text.trim()||p.text.length>700))throw Error("Each of the three chapters needs 1–700 characters.");return pages.map(p=>({...p,text:p.text.trim()}));}
