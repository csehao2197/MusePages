import {stories,esc,readingMinutes,filterStories,makeDraft,validatePages} from "./assets/catalog.js";
const $=id=>document.getElementById(id),icon=name=>`<svg aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
let items=[...stories],favorites=new Set(),favoritesOnly=false,theme="all",serial=0,draft=null,active=null,voiceEpoch=0,musicEpoch=0,toastTimer,dialogOpener=null;
const reader=$("reader"),voice=$("narration"),music=$("soundtrack");music.volume=.18;voice.volume=.9;
function toast(text){$("toast").textContent=text;$("toast").hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("toast").hidden=true,3200);}
function navState(id){document.querySelectorAll(".sidebar nav .nav-button").forEach(b=>b.classList.toggle("active",b.id===id));}
function renderShelf(){
  const visible=filterStories(items,$("search").value,theme,favoritesOnly,favorites,$("sort").value);
  $("shelf-count").textContent=items.length;$("favorites-count").textContent=favorites.size;
  $("library-title").textContent=favoritesOnly?"A few close-to-heart favorites.":"Find their next favorite.";
  $("result-count").textContent=`${visible.length} ${visible.length===1?"story":"stories"}${favoritesOnly?" in favorites":""} · ${items.filter(s=>s.custom).length} local drafts`;
  $("empty").hidden=visible.length>0;
  $("story-grid").innerHTML=visible.map(s=>`<article class="story-card" data-story="${s.id}"><div class="card-picture"><button data-read="${s.id}" aria-label="Read ${esc(s.title)}"><img src="assets/${s.pages[0].key}.svg" width="600" height="420" loading="lazy" alt="${esc(s.character)} in an original moonlit story illustration."></button><button class="favorite-button" data-favorite="${s.id}" aria-label="Favorite ${esc(s.title)}" aria-pressed="${favorites.has(s.id)}">${icon("heart")}</button><span class="mood-tag">${s.theme}</span></div><div class="card-info"><p class="card-meta"><span>3 CHAPTERS</span><span>·</span><span>~${readingMinutes(s)} MIN READ</span><span>·</span><span>${s.custom?"YOUR DRAFT":"ORIGINAL STORY"}</span></p><h3><button data-read="${s.id}">${esc(s.title)}</button></h3><p class="card-description">${esc(s.description)}</p><div class="card-footer"><button class="text-button" data-read="${s.id}">Read together ${icon("arrow")}</button><button class="text-button" data-listen="${s.id}" ${s.custom?'disabled title="Matching narration is not connected for custom stories"':""}>${icon(s.custom?"book":"headphones")}${s.custom?"Read-aloud only":"Sample narration"}</button></div></div></article>`).join("");
}
function setTheme(value){theme=value;document.querySelectorAll("[data-theme]").forEach(b=>{b.classList.toggle("selected",b.dataset.theme===theme);b.setAttribute("aria-pressed",b.dataset.theme===theme);});renderShelf();}
function allStories(){favoritesOnly=false;$("search").value="";setTheme("all");navState("shelf-nav");}
function toggleFavorite(id){if(favorites.has(id))favorites.delete(id);else favorites.add(id);renderShelf();if(active?.story.id===id)renderFavorite();toast(favorites.has(id)?"Added to this tab’s favorites.":"Removed from favorites.");}
function renderFavorite(){const yes=favorites.has(active.story.id);$("reader-favorite").setAttribute("aria-pressed",yes);$("reader-favorite").querySelector("span").textContent=yes?"Favorited":"Favorite";}
function showDialog(id,opener){dialogOpener=opener?.isConnected?opener:null;$(id).showModal();}
function endReading(){active=null;stopVoice(true);stopMusic(true);}
function closeDialog(dialog){if(dialog.open){if(dialog===reader)endReading();dialog.close();}}
document.querySelectorAll("dialog").forEach(dialog=>dialog.addEventListener("close",()=>{if(dialog.open)return;if(dialog===reader&&active)endReading();const target=dialogOpener?.isConnected&&!dialogOpener.disabled?dialogOpener:$("tonight");target.focus();dialogOpener=null;}));
reader.addEventListener("cancel",endReading);
function clock(time){const t=Number.isFinite(time)?Math.max(0,Math.floor(time)):0;return `${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`;}
function voiceLabel(){const custom=active?.story.custom;const playing=!voice.paused&&!voice.ended;$("voice-button").disabled=!!custom;$("voice-button").innerHTML=icon(playing?"pause":"play")+`<span>${custom?"Read-aloud only":playing?"Pause narration":"Play narration"}</span>`;}
function stopVoice(unload=false){voiceEpoch++;voice.pause();if(unload){voice.removeAttribute("src");voice.load();}$("seek").disabled=true;$("seek").value=0;$("audio-time").textContent="0:00 / 0:00";voiceLabel();}
function stopMusic(rewind=false){musicEpoch++;music.pause();if(rewind)music.currentTime=0;$("music-toggle").setAttribute("aria-pressed","false");}
function chapter(index,autoplay=false){
  if(!active||index<0||index>=active.story.pages.length)return;
  stopVoice();active.index=index;const s=active.story,p=s.pages[index];
  const image=$("scene-image");image.src=`assets/${p.key}.svg`;image.alt=`${s.character} in “${p.title}”, an original illustrated scene.`;
  image.style.animation="none";void image.offsetWidth;image.style.animation="";
  $("reader-title").textContent=s.title;$("chapter-title").textContent=p.title;$("chapter-text").textContent=p.text;$("chapter-count").textContent=`CHAPTER ${index+1} OF ${s.pages.length}`;
  $("previous").disabled=index===0;$("next").disabled=index===s.pages.length-1;
  $("page-dots").innerHTML=s.pages.map((_,i)=>`<button data-chapter="${i}" aria-label="Go to chapter ${i+1}" aria-current="${i===index}"></button>`).join("");
  $("chapter-text").hidden=!$("captions").checked;$("hidden-caption").hidden=$("captions").checked;
  $("advance").disabled=!!s.custom;
  if(s.custom){voice.removeAttribute("src");voice.load();$("audio-status").textContent="Your reading draft. Matching narration is not connected.";$("narration-source").textContent="Included character art · Your edited words · Read aloud together";}
  else{voice.src=`assets/${p.key}.wav`;voice.load();$("audio-status").textContent="Ready when you are. Narration starts only when you choose it.";$("narration-source").textContent="Prerecorded local English sample · Microsoft Zira (Windows SAPI), not ElevenLabs · Original quiet music";}
  voiceLabel();if(autoplay&&!s.custom)playVoice();
}
function openStory(id,listen,opener){const story=items.find(s=>s.id===id);if(!story)return;stopMusic(true);active={story,index:0};$("captions").checked=true;$("advance").checked=false;showDialog("reader",opener);renderFavorite();chapter(0,listen);}
async function playVoice(){
  if(!active||!reader.open||active.story.custom)return;
  const epoch=++voiceEpoch;
  try{await voice.play();if(epoch===voiceEpoch&&reader.open){voiceLabel();$("audio-status").textContent="A little listening time. You can pause or turn the page at any moment.";}}
  catch{if(epoch===voiceEpoch&&reader.open){voiceLabel();$("audio-status").textContent="Narration could not start. Try Play again, or read the words together.";}}
}
voice.addEventListener("loadedmetadata",()=>{if(!active||active.story.custom||!Number.isFinite(voice.duration))return;$("seek").max=voice.duration;$("seek").disabled=false;$("audio-time").textContent=`${clock(voice.currentTime)} / ${clock(voice.duration)}`;});
voice.addEventListener("timeupdate",()=>{if(!active)return;$("seek").value=voice.currentTime;$("audio-time").textContent=`${clock(voice.currentTime)} / ${clock(voice.duration)}`;});
voice.addEventListener("pause",voiceLabel);voice.addEventListener("play",voiceLabel);
voice.addEventListener("error",()=>{if(active&&!active.story.custom&&voice.getAttribute("src")){$("audio-status").textContent="This narration could not load. The complete story is still here to read.";$("seek").disabled=true;}});
voice.addEventListener("ended",()=>{if(!active||!reader.open||active.story.custom)return;voiceLabel();if($("advance").checked&&active.index<active.story.pages.length-1)chapter(active.index+1,true);else{$("audio-status").textContent=active.index===2?"The end. A softer goodnight, whenever you are ready.":"Chapter complete. Turn the page whenever you are ready.";if(active.index===2)stopMusic(true);}});
$("voice-button").addEventListener("click",()=>{if(voice.paused||voice.ended)playVoice();else{voiceEpoch++;voice.pause();$("audio-status").textContent="Paused. Take all the time you need.";}});
$("seek").addEventListener("input",()=>{if(Number.isFinite(voice.duration)&&active&&!active.story.custom)voice.currentTime=Number($("seek").value);});
$("music-toggle").addEventListener("click",async()=>{if(!music.paused){stopMusic();return;}const epoch=++musicEpoch;try{await music.play();if(epoch===musicEpoch&&reader.open)$("music-toggle").setAttribute("aria-pressed","true");}catch{if(epoch===musicEpoch&&reader.open)$("audio-status").textContent="Music could not start. Try the music button again.";}});
$("previous").addEventListener("click",()=>chapter(active.index-1));$("next").addEventListener("click",()=>chapter(active.index+1));
$("page-dots").addEventListener("click",e=>{const b=e.target.closest("[data-chapter]");if(b)chapter(Number(b.dataset.chapter));});
$("captions").addEventListener("change",()=>{$("chapter-text").hidden=!$("captions").checked;$("hidden-caption").hidden=$("captions").checked;});
$("reader-favorite").addEventListener("click",()=>toggleFavorite(active.story.id));
$("download").addEventListener("click",()=>{if(!active)return;const s=active.story,content=`${s.title}\n${s.custom?"Your local reading draft":"Original Dreamio sample story"}\n\n${s.pages.map((p,i)=>`${i+1}. ${p.title}\n\n${p.text}`).join("\n\n")}\n\n${s.custom?"Included character illustrations are reused. Custom narration is not connected.":"Sample narration uses prerecorded Windows Zira, not ElevenLabs."}\n`,blob=new Blob([content],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=s.custom?"my-dreamio-story.txt":`dreamio-${s.id}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);$("audio-status").textContent="Story text download prepared. Your browser controls where it is saved.";});
reader.addEventListener("keydown",e=>{if(e.target.matches("input,button,select,textarea"))return;if(e.key==="ArrowRight"){e.preventDefault();chapter(active.index+1);}if(e.key==="ArrowLeft"){e.preventDefault();chapter(active.index-1);}});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&reader.open){voiceEpoch++;voice.pause();stopMusic();$("audio-status").textContent="Listening paused while this tab is away. Choose Play to resume.";}});
window.addEventListener("pagehide",()=>{voice.pause();music.pause();});
function openCreator(opener){if(items.filter(s=>s.custom).length>=8){toast("This tab has 8 drafts. Download your favorites; refresh to start a new shelf.");return;}draft=null;$("draft-form").reset();$("draft-form").hidden=false;$("draft-editor").hidden=true;$("draft-status").textContent="";showDialog("creator",opener);}
$("draft-form").addEventListener("submit",e=>{e.preventDefault();try{draft=makeDraft(Object.fromEntries(new FormData(e.target)),serial+1);$("draft-chapters").innerHTML=draft.pages.map((p,i)=>`<label>Chapter ${i+1} · ${esc(p.title)}<textarea name="chapter-${i}" maxlength="700" required rows="5">${esc(p.text)}</textarea></label>`).join("");$("draft-form").hidden=true;$("draft-editor").hidden=false;$("draft-status").textContent="Three editable chapters, made with a fixed template. Nothing was sent anywhere.";$("draft-chapters").querySelector("textarea").focus();}catch(error){$("draft-status").textContent=error.message;}});
$("back-to-idea").addEventListener("click",()=>{$("draft-form").hidden=false;$("draft-editor").hidden=true;$("draft-status").textContent="Edit the idea, then make a fresh template draft.";$("draft-form").elements.namedItem("title").focus();});
$("chapter-form").addEventListener("submit",e=>{e.preventDefault();if(!draft)return;try{if(items.filter(s=>s.custom).length>=8)throw Error("This tab already has 8 custom stories.");const pages=validatePages(draft.pages.map((p,i)=>({...p,text:$(`draft-chapters`).querySelector(`[name="chapter-${i}"]`).value})));serial++;items.push({...draft,pages});draft=null;allStories();$("sort").value="newest";renderShelf();closeDialog($("creator"));$("story-shelf").scrollIntoView();toast("Your reading draft is on this tab’s shelf. Download its text to keep it.");}catch(error){$("draft-status").textContent=error.message;}});
document.addEventListener("click",e=>{const b=e.target.closest("button");if(!b||b.disabled)return;if(b.dataset.close)closeDialog($(b.dataset.close));else if(b.hasAttribute("data-create"))openCreator(b);else if(b.hasAttribute("data-about"))showDialog("about",b);else if(b.dataset.read)openStory(b.dataset.read,false,b);else if(b.dataset.listen)openStory(b.dataset.listen,true,b);else if(b.dataset.favorite)toggleFavorite(b.dataset.favorite);else if(b.dataset.theme)setTheme(b.dataset.theme);});
$("search").addEventListener("input",renderShelf);$("sort").addEventListener("change",renderShelf);
$("shelf-nav").addEventListener("click",()=>{favoritesOnly=false;navState("shelf-nav");renderShelf();$("story-shelf").scrollIntoView();});
$("favorites-nav").addEventListener("click",()=>{favoritesOnly=true;navState("favorites-nav");renderShelf();$("story-shelf").scrollIntoView();});
$("tonight").addEventListener("click",()=>{allStories();navState("tonight");window.scrollTo({top:0,behavior:"smooth"});});
$("clear-filters").addEventListener("click",allStories);
$("night-toggle").addEventListener("click",()=>{const enabled=document.body.classList.toggle("night");$("night-toggle").setAttribute("aria-pressed",enabled);$("night-toggle").innerHTML=icon(enabled?"sun":"moon")+`<span>${enabled?"Day colors":"Night colors"}</span>`;});
renderShelf();
