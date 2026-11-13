import {readFile,writeFile,mkdir,copyFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const folder=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(folder,'..','..','..','..');
const names=['activity','menu','arrow-up-right','arrow-down','users','move-horizontal','sparkles','search','heart','dumbbell','leaf','play','pause','arrow-left','arrow-right','share-2','upload','info','x','award'];
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const symbols=[];
for(const name of names){
  const {__iconData}=await import(pathToFileURL(path.join(root,'node_modules','lucide-react','dist','esm','icons',`${name}.mjs`)));
  symbols.push(`<symbol id="${name}" viewBox="0 0 24 24">${__iconData.node.map(([tag,attributes])=>`<${tag} ${Object.entries(attributes).filter(([key])=>key!=='key').map(([key,value])=>`${key}="${escape(value)}"`).join(' ')}></${tag}>`).join('')}</symbol>`);
}
await writeFile(path.join(folder,'assets','icons.svg'),`<svg xmlns="http://www.w3.org/2000/svg">${symbols.join('')}</svg>\n`);
const prompt=await readFile(path.join(root,'data','prompts','040-transformation-story-gallery','040-transformation-story-gallery.md'),'utf8');
const design=await readFile(path.join(root,'src','workflows','AI Agent','DESIGN.md'),'utf8');
await writeFile(path.join(folder,'.generation-input.sha256'),createHash('sha256').update(JSON.stringify([prompt,design])).digest('hex')+'\n');
const exported=path.join(folder,'out');
await mkdir(path.join(exported,'assets'),{recursive:true});
for(const name of ['index.html','style.css','app.js']) await copyFile(path.join(folder,name),path.join(exported,name));
for(const name of await readdir(path.join(folder,'assets'))) await copyFile(path.join(folder,'assets',name),path.join(exported,'assets',name));
console.log('Clean export prepared; metadata remains unverified.');
