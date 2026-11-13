import {readFile,writeFile,mkdir,copyFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const folder=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(folder,'..','..','..','..');
const names=['map-pin','arrow-up-right','menu','arrow-down','flower-2','arrow-left','arrow-right','flame','moon','cloud','eye','heart','dumbbell','sparkles','play','pause','star','camera','users','video','music-2','x'];
const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const symbols=[];
for(const name of names){const {__iconData}=await import(pathToFileURL(path.join(root,'node_modules','lucide-react','dist','esm','icons',`${name==='music-2'?'eighth-note':name}.mjs`)));symbols.push(`<symbol id="${name}" viewBox="0 0 24 24">${__iconData.node.map(([tag,attributes])=>`<${tag} ${Object.entries(attributes).filter(([key])=>key!=='key').map(([key,value])=>`${key}="${esc(value)}"`).join(' ')}></${tag}>`).join('')}</symbol>`);}
await writeFile(path.join(folder,'assets','icons.svg'),`<svg xmlns="http://www.w3.org/2000/svg">${symbols.join('')}</svg>\n`);
for(const [name,label,road,x,y] of [['south','South Lamar','S LAMAR BLVD',290,125],['domain','Domain','BURNET ROAD',310,112]]){
  await writeFile(path.join(folder,'assets',`${name}-map.svg`),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 250"><rect width="600" height="250" fill="#eeeee5"/><g fill="#e1e4d7"><rect x="10" y="12" width="120" height="80" rx="8"/><rect x="360" y="10" width="180" height="70" rx="8"/><rect x="370" y="175" width="200" height="65" rx="8"/><rect x="120" y="150" width="110" height="80" rx="8"/></g><g stroke="#fff" fill="none" stroke-width="14"><path d="M-20 180 620 60M50-10l60 270M440-10l60 270M-10 45l620 140"/><path d="M250-20l100 300" stroke-width="28"/></g><path d="m275-20 85 290" stroke="#d7d0bc" stroke-width="2"/><text x="332" y="190" font-family="Arial,sans-serif" fill="#939480" font-size="8" transform="rotate(71 332 190)">${road}</text><g transform="translate(${x} ${y})"><circle r="28" fill="#7c6f5b" opacity=".12"/><circle r="15" fill="#7c6f5b"/><path d="M-6 2 0-5 6 2M0-5v12" fill="none" stroke="#fff" stroke-width="1.5"/><rect x="25" y="-13" width="115" height="30" rx="5" fill="#fff"/><text x="38" y="6" font-family="Arial,sans-serif" font-size="11" fill="#625b4b">Inhale · ${label}</text></g></svg>\n`);
}
const original=await readFile(path.join(root,'data','prompts','041-yoga-studio','041-yoga-studio.md'),'utf8'),design=await readFile(path.join(root,'src','workflows','AI Agent','DESIGN.md'),'utf8');
await writeFile(path.join(folder,'.generation-input.sha256'),createHash('sha256').update(JSON.stringify([original,design])).digest('hex')+'\n');
const exported=path.join(folder,'out');await mkdir(path.join(exported,'assets'),{recursive:true});
for(const name of ['index.html','style.css','app.js'])await copyFile(path.join(folder,name),path.join(exported,name));
for(const name of await readdir(path.join(folder,'assets')))await copyFile(path.join(folder,'assets',name),path.join(exported,'assets',name));
console.log('Clean export prepared; unverified metadata preserved.');
