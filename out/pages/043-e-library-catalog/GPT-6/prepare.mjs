import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
const folder=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(folder,'..','..','..','..'),assets=path.join(folder,'assets');
await fs.mkdir(assets,{recursive:true});
for(const name of ['inter.ttf','INTER-OFL.txt'])await fs.copyFile(path.join(root,'out','pages','035-crossfit-gym','GPT-6','assets',name),path.join(assets,name));
const names=['book-open','bookmark','search','x','arrow-right','trending-up','sparkles','award','lock-open','graduation-cap','sliders-horizontal','layout-grid','list','rotate-ccw','leaf','arrow-down','orbit','play','video','file-text','code-xml','headphones','star','share-2','history'];
const symbols=[];
for(const name of names){const filename=name==='history'?'rotate-ccw-clock':name;const module=await import(pathToFileURL(path.join(root,'node_modules','lucide-react','dist','esm','icons',`${filename}.mjs`)));const data=module.__iconData;if(!data)throw Error(`Missing Lucide geometry: ${name}`);symbols.push(`<symbol id="${name}" viewBox="0 0 24 24">${data.node.map(([tag,attrs])=>`<${tag} ${Object.entries(attrs).filter(([key])=>key!=='key').map(([key,value])=>`${key}="${value}"`).join(' ')}/>`).join('')}</symbol>`);}
await fs.writeFile(path.join(assets,'icons.svg'),`<svg xmlns="http://www.w3.org/2000/svg"><defs>${symbols.join('')}</defs></svg>\n`);
await fs.copyFile(path.join(root,'node_modules','lucide-react','LICENSE'),path.join(assets,'LUCIDE-LICENSE.txt'));
const prompt=await fs.readFile(path.join(root,'data','prompts','043-e-library-catalog','043-e-library-catalog.md'),'utf8'),design=await fs.readFile(path.join(root,'src','workflows','AI Agent','DESIGN.md'),'utf8');
await fs.writeFile(path.join(folder,'.generation-input.sha256'),crypto.createHash('sha256').update(JSON.stringify([prompt,design])).digest('hex')+'\n');
const exported=path.join(folder,'out');await fs.mkdir(exported,{recursive:true});
for(const name of ['index.html','style.css','app.js'])await fs.copyFile(path.join(folder,name),path.join(exported,name));
await fs.cp(assets,path.join(exported,'assets'),{recursive:true});
console.log('Prepared clean static catalog export.');
