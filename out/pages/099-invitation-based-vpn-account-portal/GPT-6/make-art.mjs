import {writeFile,copyFile,mkdir} from "node:fs/promises";
import {createRequire} from "node:module";
const require=createRequire(new URL("../../../../package.json",import.meta.url));
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server"),lucide=require("lucide-react");
await mkdir(new URL("assets/",import.meta.url),{recursive:true});
const icons={ArrowUpRight:"external",ArrowRight:"right",Check:"check",X:"x",Laptop:"laptop",Smartphone:"phone",Monitor:"monitor",Shield:"shield",Plus:"plus",Download:"download",QrCode:"qr",RefreshCw:"refresh",Trash2:"trash",Copy:"copy",KeyRound:"key",Globe2:"globe",LogOut:"logout",CircleHelp:"help",MailX:"mail-x",Ticket:"ticket",LockKeyhole:"lock",Menu:"menu"};
await writeFile(new URL("assets/icons.svg",import.meta.url),`<svg xmlns="http://www.w3.org/2000/svg"><defs>${Object.entries(icons).map(([name,id])=>renderToStaticMarkup(React.createElement(lucide[name])).replace(/<svg[^>]*>/,`<symbol id="${id}" viewBox="0 0 24 24">`).replace("</svg>","</symbol>")).join("")}</defs></svg>`);
for(const file of ["inter.woff2","inter-OFL.txt","lucide-LICENSE.txt"])await copyFile(new URL(`../../081-file-upload-saas/GPT-6/assets/${file}`,import.meta.url),new URL(`assets/${file}`,import.meta.url));
await writeFile(new URL("assets/mark.svg",import.meta.url),'<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" rx="14" fill="#173c36"/><path d="M13 13v23h21v-6H20V13Z" fill="#c5e1af"/><circle cx="32" cy="15" r="5" fill="#c5e1af"/></svg>');
