import {writeFile,copyFile} from "node:fs/promises";
import {createRequire} from "node:module";
import {projects,dictionaries} from "./assets/content.js";
const require=createRequire(new URL("../../../../package.json",import.meta.url));
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server"),lucide=require("lucide-react");
const icons={ArrowUpRight:"arrow-up-right",ArrowDownRight:"arrow-down-right",Copy:"copy",UserRound:"user-round",Box:"box",RotateCw:"rotate-cw",RotateCcw:"rotate-ccw",Asterisk:"asterisk",GraduationCap:"graduation-cap",Terminal:"terminal",BadgeCheck:"badge-check",Search:"search",FolderOpen:"folder-open",Images:"images",Link:"link",Mail:"mail",Download:"download",FileText:"file-text",Shuffle:"shuffle"};
const symbols=Object.entries(icons).map(([name,id])=>renderToStaticMarkup(React.createElement(lucide[name])).replace(/<svg[^>]*>/,`<symbol id="${id}" viewBox="0 0 24 24">`).replace("</svg>","</symbol>"));
await writeFile(new URL("assets/icons.svg",import.meta.url),`<svg xmlns="http://www.w3.org/2000/svg"><defs>${symbols.join("")}</defs></svg>`);
for(const file of ["inter.woff2","inter-OFL.txt","lucide-LICENSE.txt"])await copyFile(new URL(`../../081-file-upload-saas/GPT-6/assets/${file}`,import.meta.url),new URL(`assets/${file}`,import.meta.url));
const escape=(value)=>String(value).replace(/[&<>"']/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const wrap=(value,max=66)=>{const lines=[];let line="";for(const word of value.split(/\s+/)){if((line+" "+word).trim().length>max&&line){lines.push(line);line=word;}else line=(line+" "+word).trim();}if(line)lines.push(line);return lines;};
const text=(lines,x,y,size=16,color="#25251f")=>lines.map((line,index)=>`<text x="${x}" y="${y+index*(size*1.6)}" font-family="Arial,sans-serif" font-size="${size}" fill="${color}">${escape(line)}</text>`).join("");
for(const locale of ["en"]){
  await writeFile(new URL(`assets/${locale}.json`,import.meta.url),JSON.stringify({ui:dictionaries[locale],projects:projects.map(({en,...project})=>({...project,description:en}))},null,2)+"\n");
  for(const [index,project]of projects.entries()){
    const accent=index%3===0?"#c8bce7":index%3===1?"#d5e69b":"#d4cbb9";
    for(let page=1;page<=2;page++){
      const notice="ORIGINAL REFERENCE SHEET / NOT A PRODUCT SCREENSHOT";
      const header=`<rect width="800" height="450" fill="#e9e7de"/><rect x="17" y="17" width="766" height="416" fill="#eeece3" stroke="#25251f" stroke-width="2"/><path d="M17 49h766" stroke="#25251f" stroke-width="2"/><rect x="18" y="18" width="764" height="30" fill="${accent}"/><text x="32" y="38" font-family="monospace" font-size="12" fill="#25251f">${escape(project.name)} / ${page===1?"PROJECT_SCOPE":"TECH_SHEET"}</text><text x="755" y="38" font-family="monospace" font-size="14" fill="#25251f">×</text>`;
      let body;
      if(page===1){
        const letters=project.name.replaceAll("-"," ").split(/\s+/).slice(0,2).map((word)=>word[0]).join("").toUpperCase();
        body=`<rect x="40" y="75" width="262" height="302" fill="${accent}" stroke="#25251f" stroke-width="2"/><pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#25251f" stroke-width=".6" opacity=".22"/></pattern><rect x="40" y="75" width="262" height="302" fill="url(#grid)"/><path d="m81 244 92-112 94 112-94 95Z" fill="#e9e7de" stroke="#25251f" stroke-width="2"/><path d="m81 244 92 32 94-32m-94-112v207" fill="none" stroke="#25251f" stroke-width="2"/><text x="171" y="228" font-family="Georgia,serif" font-size="64" text-anchor="middle" fill="#25251f">${escape(letters)}</text><text x="58" y="357" font-family="monospace" font-size="10" fill="#25251f">${escape(project.id.toUpperCase())}</text><text x="330" y="100" font-family="monospace" font-size="10" letter-spacing="2" fill="#65655c">${escape(dictionaries[locale][project.category].toUpperCase())}</text>${text(wrap(project.name,25),330,153,31)}${text(wrap(project.role,42),330,244,12)}${text(wrap(project.organization,42),330,268,12,"#65655c")}<path d="M330 292h405" stroke="#25251f"/>${text(wrap(project.stack.join(" / "),46),330,321,12)}<rect x="692" y="351" width="42" height="25" fill="${accent}" stroke="#25251f"/><path d="m701 368 19-9m-10-2 12 1-3 11" fill="none" stroke="#25251f" stroke-width="2"/>`;
      }else{
        const details=wrap(project.en,79);
        body=`<text x="40" y="94" font-family="monospace" font-size="11" letter-spacing="2">${escape(dictionaries[locale].tools.toUpperCase())}</text>${project.stack.map((item,itemIndex)=>`<rect x="${40+itemIndex*143}" y="115" width="133" height="63" fill="${itemIndex%2?accent:"#e9e7de"}" stroke="#25251f"/><text x="${48+itemIndex*143}" y="142" font-family="monospace" font-size="10">${escape(item.length>19?item.slice(0,17)+"…":item)}</text>`).join("")}<text x="40" y="220" font-family="monospace" font-size="11" letter-spacing="2">${escape(dictionaries[locale].scope.toUpperCase())}</text>${text(details,40,253,15)}<path d="M40 378h695" stroke="#25251f"/><text x="40" y="397" font-family="monospace" font-size="9" fill="#65655c">${"SOURCE: PROVIDED BRIEF / NOT VERIFIED SYSTEM ARCHITECTURE"}</text>`;
      }
      await writeFile(new URL(`assets/${project.id}-${locale}-${page}.svg`,import.meta.url),`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">${header}${body}<text x="32" y="421" font-family="monospace" font-size="8" fill="#65655c">${notice}</text></svg>`);
    }
  }
}
await writeFile(new URL("assets/object.svg",import.meta.url),'<svg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"><rect width="300" height="250" fill="#e9e7de"/><path d="m150 26 88 104-88 96-88-96Z" fill="#c8bce7" stroke="#25251f" stroke-width="2"/><path d="m62 130 88 21 88-21-88 96Z" fill="#a5b65f" stroke="#25251f" stroke-width="2"/><path d="M150 26v200m0-75 88-21" fill="none" stroke="#25251f" stroke-width="2"/></svg>');
await writeFile(new URL("assets/mark.svg",import.meta.url),'<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M3 3h42v42H3Z" fill="#d5e69b" stroke="#25251f" stroke-width="3"/><text x="24" y="33" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="#25251f">d.</text></svg>');
console.log("Prepared 26 original English reference sheets, a local dictionary, fallback artwork and licensed icons/font.");
