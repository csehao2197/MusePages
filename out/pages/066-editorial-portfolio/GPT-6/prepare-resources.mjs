import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import vm from 'node:vm';

const folder=path.dirname(fileURLToPath(import.meta.url)),assets=path.join(folder,'assets');
const require=createRequire(path.join(process.cwd(),'package.json'));
const {chromium}=require('@playwright/test');
const context={window:{}};
vm.runInNewContext(await readFile(path.join(assets,'profile.js'),'utf8'),context);
const D=context.window.editorialProfile;
const escape=(value) => String(value).replace(/[&<>"]/g,(character) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[character]));
const font=(await readFile(path.join(assets,'inter.woff2'))).toString('base64');
const resume=`<!doctype html><html lang="en"><meta charset="utf-8"><title>Morgan Ellis — Fictional demonstration resume</title><style>@font-face{font-family:Inter;src:url(data:font/woff2;base64,${font})}*{box-sizing:border-box}@page{size:A4;margin:0}body{margin:0;color:#233c54;background:white;font:11px/1.8 Inter,Arial,sans-serif}main{width:210mm;min-height:296mm;padding:17mm 19mm}h1{font:45px/1.1 Georgia,serif;letter-spacing:-1.5px;margin:0 0 9px}h2{font-size:9px;letter-spacing:1.2px;font-weight:500;border-bottom:1px solid #cdd6d8;padding-bottom:7px;margin:23px 0 11px}h3{font-size:12px;font-weight:500;margin:12px 0 3px;color:#253f56}p{margin:0 0 7px}.role{font-size:12px;color:#64788b}.badge{font-size:8px;letter-spacing:1px;margin:16px 0 21px;color:#778998}.line{display:flex;justify-content:space-between;align-items:baseline;gap:15px}.line span{font-size:9px;color:#788b98}.company{font-size:10px;color:#6a7e8d}.skills{display:grid;grid-template-columns:1fr 1fr;gap:8px 35px}.skills strong{font-weight:500;font-size:10px}.skills p{font-size:10px;color:#64788b}.projects{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.projects h3{font:18px/1.2 Georgia,serif}.projects p{font-size:9px;color:#64788b}.disclosure{font-size:8px;color:#7e8d97;border-top:1px solid #dce2e3;padding-top:11px;margin-top:22px}</style><main><h1>${D.name}</h1><p class="role">${D.role}</p><p class="badge">FICTIONAL PROFILE / DEMONSTRATION RESUME / 2026</p><h2>PROFILE</h2><p>${D.summary}</p><h2>ILLUSTRATIVE EXPERIENCE</h2>${D.experience.map((item) => `<div class="line"><h3>${escape(item.role)}</h3><span>${item.dates}</span></div><p class="company">${item.company} — fictional sample entry</p><p>${item.description}</p>`).join('')}<h2>SKILLS & PRACTICE</h2><div class="skills">${Object.entries(D.skills).map(([name,items]) => `<div><strong>${name}</strong><p>${items.join(' / ')}</p></div>`).join('')}</div><h2>SELECTED EXPLORATIONS</h2><div class="projects">${D.projects.map((project) => `<div><h3>${project.title}</h3><p>${project.subtitle}</p></div>`).join('')}</div><h2>CONTACT</h2><p>hello@morganellis.example — reserved example address, not a working mailbox.</p><p class="disclosure">All profile details, companies, roles, dates and projects are fictional. No professional credentials, client results, or employment history are claimed. Created as an original static portfolio demonstration.</p></main></html>`;
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const server=createServer(async (request,response) => {
  try{
    const url=new URL(request.url,'http://localhost'),filename=path.resolve(assets,'.'+decodeURIComponent(url.pathname));
    if(!filename.startsWith(assets+path.sep)){response.writeHead(403).end();return;}
    response.setHeader('Content-Type',types[path.extname(filename)]||'application/octet-stream');response.end(await readFile(filename));
  }catch{response.writeHead(404).end();}
});
await new Promise((resolve) => server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch();
try{
  const page=await browser.newPage({viewport:{width:1000,height:700}});
  const errors=[];page.on('pageerror',(error) => errors.push(error.message));page.on('response',(response) => {if(response.status()>=400) errors.push(`${response.status()} ${response.url()}`);});
  for(const project of D.projects){
    await page.goto(`http://127.0.0.1:${server.address().port}/demos/${project.demo}`);await page.evaluate(() => document.fonts.ready);
    await page.screenshot({path:path.join(assets,project.image)});
  }
  await page.setViewportSize({width:794,height:1123});await page.setContent(resume);await page.evaluate(() => document.fonts.ready);
  await page.pdf({path:path.join(assets,'morgan-ellis-resume.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true});
  await page.screenshot({path:path.join(assets,'resume-preview.png')});
  const pdf=await readFile(path.join(assets,'morgan-ellis-resume.pdf'));
  if((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length!==1) throw Error('Resume must be one actual PDF page');
  if(errors.length) throw Error(errors.join('\n'));
  console.log('Prepared three actual prototype screenshots and a verified one-page PDF/image resume.');
}finally{
  await browser.close();await new Promise((resolve) => server.close(resolve));
}
