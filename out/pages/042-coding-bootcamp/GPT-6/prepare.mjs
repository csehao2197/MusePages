import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
const folder=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(folder,'..','..','..','..');
const assets=path.join(folder,'assets');
await fs.mkdir(assets,{recursive:true});
const copies=[
  ['032-agency-process-page','jakarta.ttf','jakarta.ttf'],['032-agency-process-page','JAKARTA-OFL.txt','JAKARTA-OFL.txt'],
  ['035-crossfit-gym','inter.ttf','inter.ttf'],['035-crossfit-gym','INTER-OFL.txt','INTER-OFL.txt'],
  ['033-creative-agency-team','team.jpg','students.jpg'],['033-creative-agency-team','portrait-rachel.jpg','maria.jpg'],
  ['033-creative-agency-team','portrait-marcus.jpg','jamal.jpg'],['033-creative-agency-team','portrait-priya.jpg','priya.jpg'],['033-creative-agency-team','portrait-david.jpg','alex.jpg']
];
for(const [prompt,source,destination]of copies)await fs.copyFile(path.join(root,'out','pages',prompt,'GPT-6','assets',source),path.join(assets,destination));
const names=['rocket','arrow-right','arrow-up-right','x','menu','star','shield-check','graduation-cap','trending-up','code-2','chart-no-axes-combined','pen-tool','send','messages-square','wallet','calendar-days','handshake','quote','pause','play','briefcase-business','message-circle','video','camera','download'];
const symbols=[];
for(const name of names){const filename=name==='code-2'?'code-xml':name;const module=await import(pathToFileURL(path.join(root,'node_modules','lucide-react','dist','esm','icons',`${filename}.mjs`)));const data=module.__iconData; if(!data)throw Error(`Missing Lucide geometry: ${name}`);symbols.push(`<symbol id="${name}" viewBox="0 0 24 24">${data.node.map(([tag,attrs])=>`<${tag} ${Object.entries(attrs).filter(([key])=>key!=='key').map(([key,value])=>`${key}="${value}"`).join(' ')}/>`).join('')}</symbol>`);}
await fs.writeFile(path.join(assets,'icons.svg'),`<svg xmlns="http://www.w3.org/2000/svg"><defs>${symbols.join('')}</defs></svg>\n`);
await fs.copyFile(path.join(root,'node_modules','lucide-react','LICENSE'),path.join(assets,'LUCIDE-LICENSE.txt'));
const prompt=await fs.readFile(path.join(root,'data','prompts','042-coding-bootcamp','042-coding-bootcamp.md'),'utf8');
const design=await fs.readFile(path.join(root,'src','workflows','AI Agent','DESIGN.md'),'utf8');
await fs.writeFile(path.join(folder,'.generation-input.sha256'),crypto.createHash('sha256').update(JSON.stringify([prompt,design])).digest('hex')+'\n');
const exported=path.join(folder,'out');
await fs.mkdir(exported,{recursive:true});
for(const file of ['index.html','style.css','app.js'])await fs.copyFile(path.join(folder,file),path.join(exported,file));
await fs.cp(assets,path.join(exported,'assets'),{recursive:true});
console.log('Prepared clean static export; preserved source.');
