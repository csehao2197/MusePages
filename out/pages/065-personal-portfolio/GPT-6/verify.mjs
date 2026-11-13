import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

export async function verify(page,assert){
  let checks=0;
  const check=(actual,expected,message='') => {assert.deepEqual(actual,expected,message);checks++;};
  const ok=(actual,message='') => {assert.ok(actual,message);checks++;};
  const base=new URL(page.url()),folder=path.dirname(fileURLToPath(import.meta.url)),shots=path.join(folder,'.checks');
  const external=[],errors=[];
  page.on('request',(request) => {if(/^https?:/.test(request.url()) && new URL(request.url()).origin!==base.origin) external.push(request.url());});
  const close=async () => {await page.locator('#project-dialog .dialog-close').click();await page.waitForFunction(() => !document.querySelector('#project-dialog').open && document.querySelector('#project-content').childElementCount===0);};
  const open=async (id) => {await page.locator(`.project[data-id="${id}"] .project-art`).click();await page.locator('#project-dialog').waitFor({state:'visible'});};
  const tab=async (name) => {await page.locator(`#tab-${name}`).click();await page.locator(`#pane-${name}`).waitFor({state:'visible'});};
  const noOverflow=async () => {
    check(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth+1),true,'No document overflow');
    check(await page.locator('#project-dialog').evaluate((dialog) => dialog.scrollWidth<=dialog.clientWidth+1),true,'No modal overflow');
  };
  check(await page.locator('.project:not([hidden])').count(),4);
  check(await page.locator('.project-art img').evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth>0)),true);
  await page.locator('#hero-tasks input').nth(1).check();
  check(await page.locator('#desk-progress').innerText(),'2 of 3 little things complete');
  for(const [filter,count] of [['product',2],['website',1],['open-source',1],['all',4]]){
    await page.locator(`[data-filter="${filter}"]`).click();
    check(await page.locator('.project:not([hidden])').count(),count);
    check(await page.locator(`[data-filter="${filter}"]`).getAttribute('aria-pressed'),'true');
    check(new URL(page.url()).searchParams.get('work'),filter==='all'?null:filter);
  }
  await page.goto(base.href+'?work=website');
  check(await page.locator('.project:not([hidden])').getAttribute('data-id'),'fieldwork','Shareable initial filter');
  await page.locator('[data-filter=all]').click();
  await page.locator('[data-skill=design]').click();
  check(await page.locator('[data-skill-group]:not([hidden])').getAttribute('data-skill-group'),'design');
  await page.locator('[data-skill=all]').click();
  check(await page.locator('[data-skill-group]:not([hidden])').count(),3);

  await open('aster');
  check(new URL(page.url()).hash,'#project-aster');
  check(await page.locator('#project-title').innerText(),'Aster.');
  check(await page.locator('#pane-story').isVisible(),true);
  await page.locator('#tab-story').focus();await page.keyboard.press('ArrowRight');
  check(await page.locator('#tab-demo').getAttribute('aria-selected'),'true','Keyboard tab selection');
  check(await page.locator('#tab-demo').evaluate((element) => element===document.activeElement),true);
  check(await page.locator('#task-status').innerText(),'1 of 3 complete');
  await page.locator('#task-list input').nth(1).check();
  check(await page.locator('#task-status').innerText(),'2 of 3 complete');
  await page.locator('#new-task').fill('   ');await page.locator('#task-form button').click();
  check(await page.locator('#task-list .demo-task').count(),3,'Whitespace task rejected');
  await page.locator('#new-task').fill('<img src=x onerror=alert(1)>');await page.locator('#task-form button').click();
  check(await page.locator('#task-list .demo-task').count(),4);
  check(await page.locator('#task-list img').count(),0,'User task is rendered as text');
  check(await page.locator('#task-list label').last().innerText(),'<img src=x onerror=alert(1)>');
  await page.locator('[data-remove]').last().click();
  check(await page.locator('#task-list .demo-task').count(),3);
  for(let i=0;i<5;i++){await page.locator('#new-task').fill(`Small step ${i+1}`);await page.locator('#task-form button').click();}
  await page.locator('#new-task').fill('One too many');await page.locator('#task-form button').click();
  check(await page.locator('#task-list .demo-task').count(),8,'Explicit eight-task cap');
  ok((await page.locator('#task-status').innerText()).includes('Eight is enough'));
  for(let i=0;i<8;i++) await page.locator('[data-remove]').first().click();
  check(await page.locator('#task-status').innerText(),'A little room. Add your first task.');
  await close();await open('aster');await tab('demo');
  check(await page.locator('#task-status').innerText(),'1 of 3 complete','Closing resets transient tasks');
  await tab('source');
  const standalone={};
  for(const id of ['aster','fieldwork','relay','goodform']){
    if(id!=='aster'){await close();await open(id);await tab('source');}
    const source=await page.locator('#source-code').textContent();
    ok(source.startsWith('<!doctype html>'),`${id} offers real standalone HTML`);
    const script=source.match(/<script>([\s\S]*)<\/script>/)[1];
    ok(new vm.Script(script),`${id} source script has valid syntax`);
    const downloading=page.waitForEvent('download');await page.locator('#download-source').click();
    const download=await downloading;
    check(download.suggestedFilename(),`${id}-prototype.html`);
    check(await readFile(await download.path(),'utf8'),source,`${id} downloadable content is actual source`);
    standalone[id]=source;
    if(id==='aster'){
      const popupEvent=page.waitForEvent('popup');await page.locator('#run-source').click();
      const popup=await popupEvent;popup.on('pageerror',(error) => errors.push(error.message));await popup.waitForLoadState('domcontentloaded');
      check(await popup.locator('#task-list .demo-task').count(),3,'Blob demo really executes');
      await popup.close();
    }
  }
  await close();
  const context=await page.context().browser().newContext();
  const standalonePage=await context.newPage();standalonePage.on('pageerror',(error) => errors.push(error.message));
  standalonePage.on('request',(request) => {if(/^https?:/.test(request.url())) external.push(request.url());});
  for(const [id,source] of Object.entries(standalone)){
    await standalonePage.goto('about:blank');
    await standalonePage.setContent(source);
    if(id==='aster'){
      await standalonePage.locator('#new-task').fill('Runs from one HTML file');await standalonePage.locator('#task-form button').click();
      check(await standalonePage.locator('#task-list .demo-task').count(),4);
    }
    if(id==='fieldwork'){
      await standalonePage.locator('[data-topic=Development]').click();await standalonePage.locator('[data-article]').click();
      ok((await standalonePage.locator('.article-reading p').innerText()).includes('A placeholder disappears'));
    }
    if(id==='relay'){await standalonePage.locator('#quarter').selectOption('0');check(await standalonePage.locator('#relay-total').innerText(),'2,880');}
    if(id==='goodform'){
      await standalonePage.locator('#sample-email').fill('reader@example.com');await standalonePage.locator('#goodform-form button').click();
      ok((await standalonePage.locator('#goodform-status').innerText()).includes('Local preview: reader@example.com'));
    }
  }
  await context.close();
  await open('fieldwork');await tab('demo');
  check(await page.locator('#demo-articles>button').count(),4);
  for(const [topic,count] of [['Design',2],['Process',1],['Development',1],['All',4]]){
    await page.locator(`[data-topic="${topic}"]`).click();check(await page.locator('#demo-articles>button').count(),count);
  }
  for(const id of ['details','materials','labels','space']){
    await page.locator(`[data-article="${id}"]`).click();
    check(await page.locator('#article-reading p').innerText(),await page.evaluate((id) => window.portfolioJournal.find((article) => article.id===id).text,id),'Reader displays the complete original essay');
    check(await page.locator('#demo-articles').isVisible(),false);
    await page.locator('#close-article').click();check(await page.locator('#demo-articles').isVisible(),true);
  }
  await close();await open('relay');await tab('demo');
  for(const [quarter,total,comparison] of [['2','4,700','24.3%'],['1','3,780','31.3%'],['0','2,880','no prior-quarter']]){
    await page.locator('#quarter').selectOption(quarter);
    check(await page.locator('#relay-total').innerText(),total);
    ok((await page.locator('#relay-comparison').innerText()).includes(comparison));
    const sums=await page.evaluate(() => ({
      bars:[...document.querySelectorAll('.relay-bar')].reduce((sum,bar) => sum+Number(bar.childNodes[0].textContent.replaceAll(',','')),0),
      table:[...document.querySelectorAll('#relay-rows tr')].slice(0,3).reduce((sum,row) => sum+Number(row.lastElementChild.textContent.replaceAll(',','')),0)
    }));
    check(sums,{bars:Number(total.replaceAll(',','')),table:Number(total.replaceAll(',',''))},'Chart, table and headline agree');
  }
  await page.locator('#quarter').selectOption('2');
  await page.locator('#pane-demo').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(shots,'relay-desktop.png')});
  await close();await open('goodform');await tab('demo');
  await page.locator('#sample-email').fill('not-an-email');await page.locator('#goodform-form button').click();
  check(await page.locator('#sample-email').evaluate((input) => input.validity.typeMismatch),true);
  check(await page.locator('#goodform-status').innerText(),'');
  await page.locator('#sample-email').fill('reader@example.com');await page.locator('#topic-design').uncheck();
  await page.locator('#goodform-form button').click();
  check(await page.locator('#goodform-status').innerText(),'Choose at least one topic to preview.');
  await page.locator('#goodform-form input[value="Development notes"]').check();await page.locator('#goodform-form button').click();
  check(await page.locator('#goodform-status').innerText(),'Local preview: reader@example.com · Development notes. Nothing was sent or saved.');
  check(await page.locator('#sample-email').inputValue(),'');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.querySelector('#project-content').childElementCount===0);
  check(new URL(page.url()).hash,'#work');
  await page.goto(base.href+'#project-fieldwork');await page.locator('#project-dialog').waitFor({state:'visible'});
  check(await page.locator('#project-title').innerText(),'Fieldwork.','Direct case-study deep link');
  await close();
  await page.evaluate(() => location.hash='project-relay');
  await page.locator('#project-dialog').waitFor({state:'visible'});
  check(await page.locator('#project-title').innerText(),'Relay.','Hash-only navigation restores case study');
  await close();

  await page.locator('#contact-button').click();
  await page.locator('#brief-text').fill('      A tiny idea     ');await page.locator('#brief-form button').click();
  ok((await page.locator('#brief-status').innerText()).includes('at least 20'));
  await page.locator('#brief-type').selectOption('Design system');
  const idea='<script>alert("plain text")</script> — a useful interface for a small team.';
  await page.locator('#brief-text').fill(idea);
  const downloading=page.waitForEvent('download');await page.locator('#brief-form button').click();const brief=await downloading;
  check(brief.suggestedFilename(),'project-brief.txt');
  const briefText=await readFile(await brief.path(),'utf8');
  ok(briefText.includes(idea) && briefText.includes('Type: Design system'),'Downloaded brief preserves actual text and selection');
  check(await page.locator('#brief-text').inputValue(),'');
  ok((await page.locator('#brief-status').innerText()).includes('Nothing was sent'));
  await page.locator('#brief-text').fill('An unfinished draft that should be cleared on close.');
  await page.locator('#contact-dialog .dialog-close').click();
  await page.waitForFunction(() => !document.querySelector('#contact-dialog').open && !document.querySelector('#brief-text').value);
  await page.locator('#contact-button').click();
  check(await page.locator('#brief-text').inputValue(),'','Closing contact clears the draft');
  await page.context().grantPermissions(['clipboard-read','clipboard-write'],{origin:base.origin});
  await page.locator('#copy-email').click();
  await page.waitForFunction(() => document.querySelector('#copy-status').textContent.includes('copied'));
  check(await page.evaluate(() => navigator.clipboard.readText()),'hello@alexmorgan.example');
  await page.keyboard.press('Escape');await page.waitForFunction(() => !document.querySelector('#contact-dialog').open);
  check(await page.locator('#contact-button').evaluate((element) => element===document.activeElement),true,'Contact returns focus');
  for(const width of [768,390,320]){
    await page.setViewportSize({width,height:900});await open('aster');await tab('demo');
    await page.locator('#new-task').fill('A deliberately long task that should wrap safely across a very narrow screen.');
    await page.locator('#task-form button').click();
    await noOverflow();
    if(width===390){await page.locator('#pane-demo').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(shots,'aster-mobile.png')});}
    await tab('source');await noOverflow();await close();
  }
  await page.locator('#menu-button').click();check(await page.locator('#menu-button').getAttribute('aria-expanded'),'true');
  await page.locator('#navigation a[href="#about"]').click();check(await page.locator('#menu-button').getAttribute('aria-expanded'),'false');
  await page.locator('#menu-button').click();await page.keyboard.press('Escape');check(await page.locator('#menu-button').getAttribute('aria-expanded'),'false');
  await page.locator('[data-filter=website]').click();await page.locator('#menu-button').click();await page.locator('#navigation a[href="#work"]').click();
  check(await page.locator('.project:not([hidden])').count(),1,'In-page navigation preserves the selected project filter');
  await page.locator('[data-filter=all]').click();
  await page.locator('#contact-button').click();
  check(await page.locator('#contact-dialog').evaluate((dialog) => dialog.scrollWidth<=dialog.clientWidth+1),true,'Contact fits 320px');
  await page.locator('#contact-dialog').screenshot({path:path.join(shots,'contact-mobile.png')});
  await page.keyboard.press('Escape');await page.waitForFunction(() => !document.querySelector('#contact-dialog').open);
  await page.emulateMedia({reducedMotion:'reduce'});
  check(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),'auto');
  check(await page.evaluate(() => [localStorage.length,sessionStorage.length,document.cookie]),[0,0,'']);
  check(external,[],'No automatic external requests');
  check(errors,[],'Standalone demos have no runtime errors');
  return checks;
}
