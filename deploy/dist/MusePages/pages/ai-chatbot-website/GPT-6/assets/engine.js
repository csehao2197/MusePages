export const starters=[
  {id:"ideas",icon:"bulb",label:"Find a fresh angle",hint:"A little spark for your next project",prompt:"Brainstorm names for a neighborhood coffee shop"},
  {id:"explain",icon:"code",label:"Make it make sense",hint:"Break down a tricky idea",prompt:"Explain JavaScript closures with a simple example"},
  {id:"write",icon:"pen",label:"Find the right words",hint:"Turn a blank page into a beginning",prompt:"Draft a friendly note to reschedule a meeting"},
  {id:"plan",icon:"compass",label:"Make a little plan",hint:"Give the week a clearer shape",prompt:"Help me outline a calmer, more focused week"}
];
const samples={
  ideas:{title:"A few names to play with",body:"## A little neighborhood energy\nHere are five original sample directions for a fictional coffee shop:\n- Corner & Cup — familiar and welcoming.\n- Little Hours — a small pause in a busy day.\n- Common Table — built around connection.\n- First Light Coffee — an optimistic morning ritual.\n- The Daily Pour — simple, friendly, and memorable.\nThese are brainstorming examples, not checked trademarks or available business names.",next:"## One more creative direction\nTry pairing a place with a feeling: “Porchlight Coffee” suggests a warm, familiar welcome.\nThis is another fixed sample, not a new AI-generated suggestion."},
  explain:{title:"Closures, one small step at a time",body:"## A function with a memory\nA JavaScript closure lets a function keep access to variables from the scope where it was created, even after that outer function returns.\n```javascript\nfunction makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst next = makeCounter();\nnext(); // 1\nnext(); // 2\n```\nThe returned function remembers its own count. Creating a second counter starts a separate count.\nThis is a fixed educational sample, not a live Gemini answer.",next:"## A small exercise\nCreate two counters with makeCounter(), call the first twice and the second once, and compare the results.\nExpected results: 1, 2, and 1 — each closure keeps its own outer variable."},
  write:{title:"A softer way to reschedule",body:"## A friendly starting point\nHi there,\nWould you be open to moving our meeting to another time this week? My schedule has shifted, and I want to make sure I can give our conversation my full attention.\nPlease let me know what works best for you. Thanks for being flexible.\nBest,\n[Your name]\nThis is a fixed fictional draft. Review and personalize it; nothing has been sent.",next:"## A shorter alternative\nHi there — could we find another time for our meeting this week? Thanks for your flexibility, and please let me know what works for you.\nThis is a fixed alternative, not a response tailored to a real recipient."},
  plan:{title:"A week with a little breathing room",body:"## Start small, leave some space\n- Monday: choose one meaningful priority for the week.\n- Tuesday: protect a focused block for that priority.\n- Wednesday: check what is working and adjust the plan.\n- Thursday: make room for collaboration and loose ends.\n- Friday: reflect, wrap up, and leave a note for next week.\nKeep some time unassigned. A useful plan should have room for real life.\nThis is a fixed general example, not personalized advice or a calendar connection.",next:"## A smaller first step\nWrite one sentence: “By Friday, I would like to have made progress on ___.” Then choose one 25-minute block to begin.\nThis follow-up uses the last sample category only; it is not AI reasoning."}
};
export function chooseReply(text,messages=[]){
  const value=String(text).trim().toLowerCase();
  if(!value||value.length>2000)return {error:"Write a message of 1–2,000 characters."};
  if(/^(continue|go on|one more|another|tell me more)[.!? ]*$/.test(value)){
    const previous=[...messages].reverse().find(m=>m.role==="assistant"&&samples[m.topic]);
    if(previous)return {topic:previous.topic,title:"A little more to explore",body:samples[previous.topic].next,followup:true};
    return {topic:null,title:"A little context would help",body:"This local preview has no previous sample category to continue. Try one of the four starter prompts first."};
  }
  const topic=/closure|javascript|makecounter/.test(value)?"explain":/reschedule|friendly note|meeting/.test(value)?"write":/coffee|brainstorm|names/.test(value)?"ideas":/focused week|calmer|outline.*week|weekly plan/.test(value)?"plan":null;
  return topic?{topic,...samples[topic]}:{topic:null,title:"This is a local preview, not Gemini",body:"I cannot answer this question without a connected model. This page selects a small set of fixed samples by keyword; it does not understand arbitrary messages.\nTry a starter prompt, or open Connection details to see what the live product would need."};
}
export const escape=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function sampleHtml(source){
  let html="",list=false,code=false;
  const closeList=()=>{if(list){html+="</ul>";list=false;}};
  for(const line of source.split("\n")){
    if(line.startsWith("```")){closeList();if(code)html+="</code></pre>";else html+="<pre><code>";code=!code;continue;}
    if(code){html+=escape(line)+"\n";continue;}
    if(line.startsWith("- ")){if(!list){html+="<ul>";list=true;}html+=`<li>${escape(line.slice(2))}</li>`;continue;}
    closeList();if(line.startsWith("## "))html+=`<h3>${escape(line.slice(3))}</h3>`;else if(line)html+=`<p>${escape(line)}</p>`;
  }
  closeList();if(code)html+="</code></pre>";return html;
}
export const failureMessages={
  network:"Simulated network failure. No request was made. Retry to run the normal local sample.",
  key:"Simulated invalid API key. This page has no API key or live connection; configure a private backend for real use.",
  rate:"Simulated rate limit. No provider quota was used. Retry when you are ready to run the local sample."
};
