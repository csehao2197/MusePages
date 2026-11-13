'use strict';
(() => {
  const R=window.orbitReference, E=window.orbitExamples;
  const $=(id) => document.getElementById(id);
  const escape=(value) => String(value).replace(/[&<>"']/g,(char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const icon=(name) => `<svg aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
  const snippets=new Map();
  const groups=[
    ['Getting started','compass',[['introduction','Introduction'],['quick-start','Quick start'],['authentication','Authentication'],['rate-limits','Rate limits'],['errors','Errors'],['versioning','Versioning']]],
    ['Core resources','layers',[['users','Users'],['projects','Projects'],['tasks','Tasks'],['comments','Comments'],['files','Files']]],
    ['Webhooks','webhook',[['webhook-setup','Setup'],['webhook-events','Events'],['webhook-payloads','Payloads'],['webhook-security','Security']]],
    ['SDKs & libraries','blocks',[['sdk-javascript','JavaScript'],['sdk-python','Python'],['sdk-ruby','Ruby'],['sdk-go','Go'],['sdk-php','PHP']]],
    ['Guides','book-open',[['pagination','Pagination'],['filtering','Filtering'],['batch','Batch operations'],['changelog','Changelog']]]
  ];
  const searchIndex=groups.flatMap(([group,,items]) => items.map(([id,label]) => ({id,label,group})));
  const descriptions={authentication:'Bearer API key OAuth access refresh tokens PKCE security',errors:'400 401 404 409 429 500 error codes request id',pagination:'cursor page limit next_cursor page size',filtering:'filter role admin member query',batch:'bulk operations contract sequential',versioning:'legacy v1 full_name migration breaking changes', 'webhook-security':'HMAC SHA-256 signature timestamp verify raw body'};
  let version='2.1', language='cURL', selected='users-get', sandbox=R.createSandbox(), requestTimer, requestRun=0, webhookRun=0, searchSelection=0, searchMatches=[], observer, toastTimer;
  function toast(message) {$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(() => {$('toast').hidden=true;},4000);}
  function highlight(source) {
    return source.split(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|(?:\/\/|#)[^\n]*|\b(?:const|let|await|async|import|from|try|except|with|as|if|else|return|func|package|defer|nil|true|false|null|require|do|end|puts|unless|echo|new|throw|public)\b|\b\d+(?:\.\d+)?\b)/g).map((part) => {
      if (!part) return '';
      const style=/^["']/.test(part)?'string':/^(\/\/|#)/.test(part)?'comment':/^\d/.test(part)?'number':/^[a-z]+$/.test(part)?'keyword':'';
      return style?`<span class="token-${style}">${escape(part)}</span>`:escape(part);
    }).join('');
  }
  function code(id,source,label='JSON') {
    snippets.set(id,source);
    return `<div class="code-block"><div class="code-top"><span>${escape(label)}</span><button type="button" data-copy="${id}" aria-label="Copy ${escape(label)} code">${icon('copy')}<span>Copy</span></button></div><pre tabindex="0"><code>${highlight(source)}</code></pre></div>`;
  }
  const table=(headers,rows) => `<div class="table-scroll" tabindex="0"><table><thead><tr>${headers.map((value) => `<th>${value}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((value) => `<td>${value}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const section=(id,title,body,eyebrow) => `<section id="${id}" class="doc-section">${eyebrow?`<p class="eyebrow">${eyebrow}</p>`:''}<h2>${title}<a class="heading-anchor" href="#${id}" aria-label="Link to ${title}">#</a></h2>${body}</section>`;
  function languageTabs(compact=false) {
    return E.languages.map((item) => `<button type="button" data-language="${item}" aria-pressed="${item===language}">${compact?{cURL:'cURL',JavaScript:'JS',Python:'Py',Ruby:'Rb',Go:'Go',PHP:'PHP'}[item]:item}</button>`).join('');
  }
  function parameterRows(endpoint) {
    const rows=[];
    if (endpoint.path.includes('{id}')) rows.push(['<code>id</code>','string','<span class="required">required</span>','2–40 lowercase letters, digits or underscores; starts with a letter.']);
    if (endpoint.id==='users-get' && version==='2.1') rows.push(['<code>include</code>','string','optional','<code>projects</code> to include owned projects.']);
    if (endpoint.id==='users-list') {
      rows.push(['<code>limit</code>','integer','optional','1–100 results; default 2 in this demo.'],[version==='1.x'?'<code>page</code>':'<code>cursor</code>',version==='1.x'?'integer':'string','optional',version==='1.x'?'Page number, starting at 1; maximum 100000.':'Opaque next_cursor from the previous page.'],['<code>role</code>','string','optional','Filter by <code>admin</code> or <code>member</code>.']);
    }
    if (['POST','PUT'].includes(endpoint.method)) rows.push([`<code>${version==='1.x'?'full_name':'name'}</code>`,'string',endpoint.method==='POST'?'<span class="required">required</span>':'optional','2–100 trimmed characters.'],['<code>email</code>','string',endpoint.method==='POST'?'<span class="required">required</span>':'optional','Unique address, at most 254 characters.'],['<code>role</code>','string','optional','<code>admin</code> or <code>member</code>; create defaults to member.']);
    return rows;
  }
  function endpointCard(endpoint) {
    const fields=endpoint.fields.map(([name,type,description]) => [`<code>${name==='name' && version==='1.x'?'full_name':name}</code>`,type,description]);
    if (endpoint.id==='users-get' && version==='2.1') fields.push(['<code>projects</code>','array','Present only with include=projects.']);
    return `<article class="endpoint-card" id="${endpoint.id}"><div class="endpoint-header"><div><span class="method ${endpoint.method.toLowerCase()}">${endpoint.method}</span><code>${R.prefix(version)}${endpoint.path}</code></div><button class="try-button" data-try="${endpoint.id}">Try it ${icon('play')}</button></div><h3>${endpoint.title}</h3><p>${endpoint.description}</p><h4>${['POST','PUT'].includes(endpoint.method)?'Body & path parameters':'Parameters'}</h4>${table(['Parameter','Type','Presence','Description'],parameterRows(endpoint))}${endpoint.method==='PUT'?'<p class="small-note">At least one documented field is required. Unknown fields are rejected.</p>':''}<div class="request-example"><div class="language-tabs">${languageTabs()}</div><div data-request-code="${endpoint.id}"></div></div><details class="example-response"><summary><span class="success-dot"></span>${endpoint.method==='POST'?'201 Created':endpoint.method==='DELETE'?'204 No Content':'200 OK'} · example response ${icon('chevron-down')}</summary>${endpoint.method==='DELETE'?'<p class="small-note">204 responses have no body.</p>':code(`response-${endpoint.id}`,JSON.stringify(R.sample(endpoint,version),null,2))}</details>${fields.length?`<details class="response-fields"><summary>Response fields ${icon('chevron-down')}</summary>${table(['Field','Type','Description'],fields)}</details>`:''}</article>`;
  }
  const webhookPayload=() => JSON.stringify(version==='2.1'?{id:'evt_demo_1',type:'task.completed',created_at:'2026-03-01T10:30:00Z',data:{id:'task_design',status:'completed'}}:{id:'evt_demo_1',type:'project.created',created_at:'2026-03-01T10:30:00Z',data:{id:'proj_alpha',name:'Website refresh'}},null,2);
  function sdkSection(id,title,installation,example,repo,docs) {
    return section(id,title,`<p>Use a maintained HTTP library. Orbit has no published proprietary SDK; examples target a fictional API.</p>${code(`install-${id}`,installation,'SHELL')}${code(`sdk-code-${id}`,example,title)}<div class="sdk-links"><a href="${repo}" target="_blank" rel="noopener noreferrer">GitHub repository ${icon('arrow-up-right')}</a><a href="${docs}" target="_blank" rel="noopener noreferrer">Library documentation ${icon('arrow-up-right')}</a></div>`,'SDKs & LIBRARIES');
  }
  function renderMain() {
    webhookRun++;
    const legacy=version==='1.x';
    const quick=E.requestCode(R.endpoints[0],'cURL',version);
    $('documentation').innerHTML=`
      <section id="introduction" class="intro-section"><div class="breadcrumb">DEVELOPER DOCUMENTATION <span>/</span> API REFERENCE</div><div class="intro-meta"><span class="intro-pill">REST API</span><span class="intro-version">v${version}${version==='2.1'?' · latest':legacy?' · legacy':''}</span></div><h1>Your ideas.<br>A little more connected.</h1><p class="intro-lead">One thoughtful API for the people, projects and work in between. Let’s build something that works together.</p><div class="intro-links"><a href="#quick-start" class="orange-button">Make your first request ${icon('arrow-right')}</a><a href="#users">Explore the reference ${icon('arrow-up-right')}</a></div><div class="local-notice">${icon('flask-conical')}<div><strong>A safe space to try things.</strong><p>Orbit is a fictional platform. All requests run locally against sample data. <code>api.example.com</code> is a reserved example domain.</p></div></div>${legacy?'<div class="warning-notice"><strong>Legacy contract</strong><p>v1 uses full_name and page-based pagination. This is a migration example, not a live deprecation notice.</p></div>':''}<div class="intro-facts"><span><i></i> REST + JSON</span><span>${icon('lock-keyhole')}Bearer authentication</span><span>${icon('braces')}Six language examples</span></div></section>
      ${section('quick-start','Your first request. Three small steps.',`<ol class="quick-steps"><li><span>1</span><div><h3>Pick up a demo key</h3><p>Start with <code>demo_local</code> or <button class="inline-button" data-open-key>create a public demo key</button>. No account needed.</p></div></li><li><span>2</span><div><h3>Say hello to the API</h3><p>Replace YOUR_API_KEY in real integrations. Here, use the local playground.</p></div></li></ol>${code('quick-request',quick,'cURL')}<details class="example-response"><summary>See an example response ${icon('chevron-down')}</summary>${code('quick-response',JSON.stringify(R.sample(R.endpoints[0],version),null,2))}</details><div class="quick-final"><span>3</span><div><h3>Make it your own</h3><p>Explore a resource, change a parameter and <button class="inline-button" data-try="users-get">send your first test request</button>.</p></div></div>`,'GETTING STARTED')}
      ${section('authentication','A key. A header. You’re in.',`<p>Use <code>Authorization: Bearer YOUR_API_KEY</code> over HTTPS. Real API credentials belong on trusted servers, never in public browser bundles or shared snippets. This page accepts public <code>demo_</code> keys only.</p><div class="language-tabs">${languageTabs()}</div><div data-request-code="users-get" data-auth-code></div><details class="prose-details"><summary>OAuth 2.0 & token refresh ${icon('chevron-down')}</summary><p>The illustrative OAuth contract uses authorization code + PKCE: generate a verifier and S256 challenge, store a random state value, redirect to <code>https://auth.example.com/authorize</code>, validate state on return, then exchange the code at <code>/oauth/token</code>.</p><p>Access tokens last 3,600 seconds. On expiry, exchange the refresh token using <code>grant_type=refresh_token</code>. Rotate refresh tokens after use, keep them server-side, and require reauthorization if refresh fails. No OAuth server is connected to this demonstration.</p></details><div class="tip">${icon('shield-check')}Scope keys to the minimum permissions. Rotate on exposure, redact logs, and retry 401 only after correcting authentication.</div>`)}
      ${section('rate-limits','A little room for everyone.',`<p>Illustrative plan limits apply per key per minute. The local sandbox uses fixed 60-second windows starting when the sandbox is created or an elapsed window is next used, including errors; Reset starts a fresh window.</p>${table(['Plan','Requests / minute','Behavior'],[['Sandbox','60','Enforced in this tab only.'],['Team concept','600','Documented concept; not enabled here.'],['Enterprise concept','By agreement','No real plan or quota is offered.']])}${code('rate-headers','X-RateLimit-Limit: 60\\nX-RateLimit-Remaining: 59\\nX-RateLimit-Reset: 1772361060\\nRetry-After: 60'.replaceAll('\\n','\n'),'HTTP')}<p>On 429, read <code>Retry-After</code> (seconds), pause the queue and use exponential backoff with jitter. Cache reads, deduplicate requests and avoid retrying non-idempotent creates automatically.</p>`)}
      ${section('errors','When a request needs a second look.',`${table(['Status','Name','What to do'],[['400','Bad Request','Check documented fields, IDs and parameter bounds.'],['401','Unauthorized','Use the public demo key or correct real server-side authentication.'],['404','Not Found','Verify the resource identifier.'],['409','Conflict','Choose a unique user email.'],['429','Rate Limited','Wait for Retry-After or reset this local sandbox.'],['500','Server Error','Retry safe reads with bounded backoff.']])}${code('error-response',JSON.stringify({error:{code:'not_found',message:'User not found.',request_id:'req_demo_0001'}},null,2))}<p>Include the request ID when investigating errors. Forced response scenarios never modify sandbox resources.</p>`)}
      ${section('versioning','A clear contract, as you grow.',`<p>The version selector changes paths, schemas, examples and playground validation together.</p>${table(['Version','Base URL','Contract'],[['v2.1 · latest','<code>https://api.example.com/v2</code>','name, cursor pagination, include=projects, task.completed.'],['v2.0','<code>https://api.example.com/v2</code>','name and cursors; no include parameter or task.completed.'],['v1.x · legacy','<code>https://api.example.com/v1</code>','full_name and page/per_page metadata; no include parameter.']])}<p>The minor version is a documentation contract in this demo. A real gateway would also need explicit version negotiation for v2.0 vs v2.1; no live gateway exists here.</p>`)}
      ${['users','projects','tasks','comments','files'].map((resource) => section(resource,resource[0].toUpperCase()+resource.slice(1),`<p>${resource==='users'?'The people behind the work. Create, read, update and remove sample users. Changes persist only in this page.':'Read a focused sample resource. The playground implements only the documented GET endpoint for this resource.'}</p>${R.endpoints.filter((endpoint) => endpoint.resource===resource).map(endpointCard).join('')}`,'CORE RESOURCES')).join('')}
      ${section('pagination',legacy?'A page at a time.':'Keep the next page close.',`<p>${legacy?'v1 uses page (starting at 1) and limit (1–100), returning page, per_page and total. Increment page until all records are read.':'v2 uses opaque cursors. Send limit (1–100), read pagination.next_cursor, then pass that value as cursor. Stop when has_more is false. Keep the same filters while paging.'}</p>${code('pagination-request',E.requestCode(R.endpoints[0],'cURL',version,legacy?{page:2}:{cursor:'after_usr_456'}),'cURL')}<button class="outline-button" data-try="users-list">Try pagination ${icon('arrow-right')}</button><p class="small-note">The playground offers a Next page action after a successful list request. Reset cursor when changing filters. Concurrent changes may alter a result set; snapshot consistency is outside this demo.</p>`,'GUIDES')}
      ${section('filtering','Find the smaller, useful set.',`<p>List users accepts <code>role=admin</code> or <code>role=member</code>. Invalid role values are rejected by the local model. Role filtering happens before pagination.</p>${code('filter-request',E.requestCode(R.endpoints[0],'cURL',version,{role:'member'}),'cURL')}<p>Changing a filter requires a fresh cursor. No arbitrary query language or server-side search is implemented.</p>`)}
      ${section('batch','One plan for a few operations.',`<p>A proposed v2.1 batch contract could accept up to 20 sequential operations with independent results. It would be non-atomic: failures would not roll back earlier successes. Use idempotency keys for retryable writes in a real implementation.</p>${code('batch-example',JSON.stringify({operations:[{method:'GET',path:'/v2/users/usr_123'},{method:'GET',path:'/v2/projects/proj_alpha'}]},null,2))}<p class="small-note">Design illustration only. A /batch route, idempotency store and batch execution are not implemented in the playground.</p>`)}
      ${section('webhook-setup','Let the important things find you.',`<p>In the proposed service, register an HTTPS receiver, subscribe to needed events and keep the signing secret server-side. Acknowledge with 2xx quickly, then process asynchronously. This static page does not register endpoints or deliver webhooks.</p><ol class="prose-list"><li>Validate the signature against the exact raw body.</li><li>Reject timestamps older or newer than five minutes.</li><li>Deduplicate by event ID before applying side effects.</li><li>Reply promptly, and queue heavier work.</li></ol>`,'WEBHOOKS')}
      ${section('webhook-events','Subscribe to the work that matters.',`${table(['Event','Available','Meaning'],[['user.created','v1, v2','A user was created.'],['project.created','v1, v2','A project was created.'],['task.updated','v1, v2','A task changed.'],...(version==='2.1'?[['task.completed','v2.1','A task entered completed status.']]:[]),['comment.created','v1, v2','A new comment was added.'],['file.created','v1, v2','File metadata became available.']])}<p>Proposed retry schedule: initial attempt, then 1 minute, 5 minutes and 30 minutes after failures. Delivery is at-least-once; event IDs must be deduplicated. After the final failure, manual redelivery would be needed. No delivery scheduler runs here.</p>`)}
      ${section('webhook-payloads','Small payloads. Useful context.',`${code('webhook-payload',webhookPayload())}<p>Use the top-level event ID for deduplication. Event data includes the resource identity, while authoritative state should be fetched after verification in a real service.</p>`)}
      ${section('webhook-security','Trust the signature, not the sender.',`<p>Sign <code>timestamp + "." + raw_body</code> with HMAC-SHA256. Header format: <code>t=UNIX_SECONDS,v1=HEX_SIGNATURE</code>. A timing-safe comparison and a five-minute timestamp window protect the illustrative receiver.</p>${code('webhook-node',`import { createHmac, timingSafeEqual } from 'node:crypto';\n\nexport function verify(rawBody, header, secret, now = Date.now()) {\n  const match = /^t=(\\d{10}),v1=([a-f0-9]{64})$/.exec(header);\n  if (!match || Math.abs(now / 1000 - Number(match[1])) > 300) return false;\n  const expected = createHmac('sha256', secret)\n    .update(match[1] + '.' + rawBody).digest();\n  const supplied = Buffer.from(match[2], 'hex');\n  return supplied.length === expected.length && timingSafeEqual(supplied, expected);\n}`,'JavaScript')}<div class="webhook-demo"><span class="local-test-label">${icon('fingerprint')}LOCAL SIGNATURE LAB</span><label for="webhook-secret">Public demo secret</label><input id="webhook-secret" value="whsec_demo_local" maxlength="80" autocomplete="off" spellcheck="false"><label for="webhook-body">Exact raw payload</label><textarea id="webhook-body" rows="6" maxlength="10000" spellcheck="false">${escape(webhookPayload())}</textarea><label for="webhook-signature">Signature header</label><textarea id="webhook-signature" rows="2" maxlength="120" spellcheck="false" placeholder="Generate a fresh sample signature below"></textarea><div><button class="outline-button" id="sign-webhook">Sign this sample</button><button class="orange-button" id="verify-webhook">Verify signature ${icon('check')}</button></div><p id="webhook-status" role="status">Web Crypto verifies HMAC in your browser. Public whsec_demo_ secrets only.</p></div>`)}
      ${sdkSection('sdk-javascript','JavaScript','npm install undici',`import { fetch } from 'undici';\nconst response = await fetch('https://api.example.com${R.prefix(version)}/users/usr_123', {\n  headers: { Authorization: 'Bearer YOUR_API_KEY' }\n});\nconsole.log(await response.json());`,'https://github.com/nodejs/undici','https://undici.nodejs.org/')}
      ${sdkSection('sdk-python','Python','python -m pip install requests',`import requests\nresponse = requests.get(\n    "https://api.example.com${R.prefix(version)}/users/usr_123",\n    headers={"Authorization": "Bearer YOUR_API_KEY"}, timeout=30\n)\nresponse.raise_for_status()\nprint(response.json())`,'https://github.com/psf/requests','https://requests.readthedocs.io/')}
      ${sdkSection('sdk-ruby','Ruby','gem install faraday',`require 'faraday'\nresponse = Faraday.get('https://api.example.com${R.prefix(version)}/users/usr_123') do |request|\n  request.headers['Authorization'] = 'Bearer YOUR_API_KEY'\nend\nputs response.status, response.body`,'https://github.com/lostisland/faraday','https://lostisland.github.io/faraday/')}
      ${sdkSection('sdk-go','Go','go version\n# net/http is included in the Go standard library.',E.requestCode(R.endpoints[1],'Go',version),'https://github.com/golang/go','https://pkg.go.dev/net/http')}
      ${sdkSection('sdk-php','PHP','composer require guzzlehttp/guzzle',`<?php\nrequire 'vendor/autoload.php';\n$client = new GuzzleHttp\\Client(['timeout' => 30]);\n$response = $client->get('https://api.example.com${R.prefix(version)}/users/usr_123', [\n    'headers' => ['Authorization' => 'Bearer YOUR_API_KEY']\n]);\necho $response->getBody();`,'https://github.com/guzzle/guzzle','https://docs.guzzlephp.org/')}
      ${section('changelog','A thoughtful step forward.',`<div class="change-entry"><span>v2.1 <b>LATEST CONCEPT</b></span><h3>A little more context.</h3><p>Adds include=projects to a single user, task.completed events and the proposed batch contract. The local playground implements include; batch remains illustrative.</p></div><div class="change-entry"><span>v2.0 <b class="breaking">BREAKING FROM v1</b></span><h3>Names that leave less to guess.</h3><p>Rename full_name to name; replace page pagination with cursor + next_cursor. Update serializers and pagination loops before switching the path from /v1 to /v2. v2.0 rejects include.</p></div><div class="change-entry"><span>v1.x <b>LEGACY EXAMPLE</b></span><h3>A reference for the way here.</h3><p>Page-based lists and full_name remain available as a documentation example. No real retirement date has been announced for this fictional API.</p></div>`)}
      <footer class="support-footer"><span class="support-icon">${icon('messages-square')}</span><h2>A good question is a good start.</h2><p>Need help? This concept has no staffed support inbox or official community.</p><div><a href="https://stackoverflow.com/questions/tagged/rest" target="_blank" rel="noopener noreferrer">REST questions on Stack Overflow ${icon('arrow-up-right')}</a><button id="support-notes">Support & sample contact ${icon('arrow-up-right')}</button><button id="footer-status">Demo status ${icon('arrow-up-right')}</button></div><button class="text-button" id="copy-context">Copy safe support context ${icon('copy')}</button><div class="docs-copyright"><span>orbit / API Reference</span><span>Fictional platform. Real curiosity.</span></div></footer>`;
    renderCodes();bindWebhook();observeSections();
  }
  function currentEndpoint() {return R.endpoints.find((endpoint) => endpoint.id===selected);}
  function readOptions() {
    let body;
    try {body=JSON.parse($('request-body')?.value || 'null');} catch {body=null;}
    return {id:$('resource-id')?.value || '',include:$('include-projects')?.value || '',limit:$('page-limit')?.value ?? 2,page:$('page-number')?.value ?? 1,cursor:$('page-cursor')?.value || '',role:$('role-filter')?.value || 'all',body};
  }
  function renderCodes() {
    document.querySelectorAll('[data-language]').forEach((button) => {button.setAttribute('aria-pressed',button.dataset.language===language);});
    document.querySelectorAll('[data-request-code]').forEach((element,index) => {const endpoint=R.endpoints.find((item) => item.id===element.dataset.requestCode);element.innerHTML=code(`example-${index}`,E.requestCode(endpoint,language,version),language);});
    $('playground-languages').innerHTML=languageTabs(true);
    $('playground-code').innerHTML=code('live-request',E.requestCode(currentEndpoint(),language,version,readOptions()),language);
  }
  function cancelRequest() {requestRun++;clearTimeout(requestTimer);$('execute').disabled=false;$('execute').innerHTML=`${icon('play')}Send test request <kbd>LOCAL</kbd>`;}
  function renderPlayground() {
    cancelRequest();
    const endpoint=currentEndpoint();
    $('endpoint-select').value=selected;$('request-method').textContent=endpoint.method;$('request-method').className=`method ${endpoint.method.toLowerCase()}`;
    $('request-path').textContent=R.prefix(version)+endpoint.path;
    $('request-inputs').innerHTML=`${endpoint.path.includes('{id}')?`<label for="resource-id">RESOURCE ID</label><input id="resource-id" value="${endpoint.sampleId}" maxlength="40" autocomplete="off" spellcheck="false">`:''}${endpoint.id==='users-get' && version==='2.1'?'<label for="include-projects">INCLUDE</label><select id="include-projects"><option value="">None</option><option value="projects">projects</option></select>':''}${endpoint.id==='users-list'?`<div class="two-fields"><div><label for="page-limit">PAGE SIZE</label><input id="page-limit" type="number" min="1" max="100" step="1" value="2"></div><div><label for="role-filter">ROLE</label><select id="role-filter"><option value="all">All roles</option><option value="admin">admin</option><option value="member">member</option></select></div></div>${version==='1.x'?'<label for="page-number">PAGE NUMBER</label><input id="page-number" type="number" min="1" max="100000" step="1" value="1">':'<label for="page-cursor">CURSOR</label><input id="page-cursor" placeholder="Empty for the first page" maxlength="80" autocomplete="off">'}<button class="next-page-button" id="next-page" type="button" hidden>Next page ${icon('arrow-right')}</button>`:''}${['POST','PUT'].includes(endpoint.method)?`<label for="request-body">JSON BODY</label><textarea id="request-body" rows="6" maxlength="10000" spellcheck="false">${escape(JSON.stringify(E.bodyFor(endpoint,version),null,2))}</textarea>`:''}`;
    $('response-status').textContent='Ready when you are';$('response-status').dataset.error='false';$('request-status').textContent='No HTTP request will be sent.';
    $('live-response').innerHTML=`<div class="empty-response">${icon('braces')}<p>A good place to start.</p><span>Send a test request to see the response.</span></div>`;$('response-headers').innerHTML='<p>Headers appear after a request.</p>';
    renderCodes();
  }
  function chooseEndpoint(id,scroll=true) {
    if (!R.endpoints.some((endpoint) => endpoint.id===id)) return;
    selected=id;$('response-scenario').value='success';renderPlayground();
    if (scroll && matchMedia('(max-width:1100px)').matches) $('playground').scrollIntoView({behavior:'instant'});
    $('endpoint-select').focus({preventScroll:true});
  }
  $('endpoint-select').innerHTML=R.endpoints.map((endpoint) => `<option value="${endpoint.id}">${endpoint.method} ${endpoint.path}</option>`).join('');
  $('endpoint-select').onchange=() => chooseEndpoint($('endpoint-select').value,false);
  $('request-inputs').addEventListener('input',() => {
    cancelRequest();
    if ($('next-page')) $('next-page').hidden=true;
    $('request-status').textContent='Inputs changed. Send again to update the response.';
    renderCodes();
  });
  $('request-form').onsubmit=(event) => {
    event.preventDefault();cancelRequest();
    if (!$('demo-key').reportValidity()) {$('request-status').textContent='Use demo_local or a generated demo_ key. Real credentials are not supported.';return;}
    const options=readOptions(), endpoint=currentEndpoint(), capturedVersion=version, run=requestRun, start=performance.now();
    const request={...options,version:capturedVersion,endpoint:selected,key:$('demo-key').value,scenario:$('response-scenario').value};
    $('execute').disabled=true;$('execute').innerHTML=`${icon('loader-circle')}Running locally…`;
    $('request-status').textContent='Simulating a request in memory. No network activity.';
    requestTimer=setTimeout(() => {
      if (run!==requestRun) return;
      const response=sandbox.run(request), duration=Math.round(performance.now()-start);
      $('response-status').textContent=`${response.status} · ${duration} ms local`;$('response-status').dataset.error=String(response.status>=400);
      $('live-response').innerHTML=response.status===204?'<p class="no-content">204 No Content — resource removed from this sandbox.</p>':code('live-response-json',JSON.stringify(response.body,null,2));
      $('response-headers').innerHTML=code('live-response-headers',Object.entries(response.headers).map(([name,value]) => `${name}: ${value}`).join('\n'),'HTTP');
      $('request-status').textContent='Completed locally. No HTTP request or credential was sent.';
      $('execute').disabled=false;$('execute').innerHTML=`${icon('play')}Send test request <kbd>LOCAL</kbd>`;
      if (endpoint.id==='users-list' && response.status===200) {
        const pagination=response.body.pagination, more=capturedVersion==='1.x'?pagination.page*pagination.per_page<pagination.total:pagination.has_more;
        const button=$('next-page');button.hidden=!more;button.onclick=() => {
          if (capturedVersion==='1.x') $('page-number').value=pagination.page+1;else $('page-cursor').value=pagination.next_cursor;
          renderCodes();$('request-form').requestSubmit();
        };
      }
    },120);
  };
  $('demo-key').oninput=() => {cancelRequest();$('request-status').textContent='Demo key changed. It is not stored or included in copied examples.';};
  $('response-scenario').onchange=() => {cancelRequest();$('request-status').textContent='Scenario changed. Send again to see the new response.';};
  $('show-key').onclick=() => {
    const visible=$('demo-key').type==='password';$('demo-key').type=visible?'text':'password';$('show-key').setAttribute('aria-pressed',visible);$('show-key').setAttribute('aria-label',visible?'Hide demo key':'Show demo key');
  };
  $('reset-sandbox').onclick=() => {sandbox=R.createSandbox();renderPlayground();toast('Sandbox data and rate window reset. Demo key retained in memory.');};
  $('api-version').onchange=() => {
    version=$('api-version').value;document.querySelector('.sidebar-version').textContent=`v${version}`;document.title=`Orbit API Reference · v${version}`;
    renderMain();renderPlayground();toast(`Documentation and sandbox switched to v${version}.`);
  };
  $('docs-nav').innerHTML=`<a class="playground-nav" href="#playground">${icon('terminal')}Request playground ${icon('arrow-up-right')}</a>`+groups.map(([group,name,items]) => `<details open><summary>${icon(name)}${group}${icon('chevron-down')}</summary><div>${items.map(([id,label]) => `<a href="#${id}" data-nav="${id}"${id==='introduction'?' class="active"':''}>${label}${id==='users'?'<span>5</span>':''}</a>`).join('')}</div></details>`).join('');
  function menu(open) {
    $('sidebar').classList.toggle('open',open);$('sidebar-scrim').hidden=!open;$('mobile-menu').setAttribute('aria-expanded',open);$('mobile-menu').setAttribute('aria-label',open?'Close documentation navigation':'Open documentation navigation');
  }
  $('mobile-menu').onclick=() => menu(!$('sidebar').classList.contains('open'));$('sidebar-scrim').onclick=() => {menu(false);$('mobile-menu').focus();};
  $('docs-nav').onclick=(event) => {
    const link=event.target.closest('a');
    if (!link) return;
    const wasOpen=$('sidebar').classList.contains('open');
    menu(false);
    if (wasOpen) {
      event.preventDefault();
      location.hash=link.hash;
      const heading=$(link.hash.slice(1))?.querySelector('h1,h2');
      if (heading) {heading.tabIndex=-1;heading.focus({preventScroll:true});}
    }
  };
  function observeSections() {
    observer?.disconnect();
    observer=new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) document.querySelectorAll('[data-nav]').forEach((link) => {const active=link.dataset.nav===entry.target.id;link.classList.toggle('active',active);if (active) link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    },{rootMargin:'-90px 0px -65% 0px'});
    document.querySelectorAll('.documentation>section').forEach((element) => observer.observe(element));
  }
  function search() {
    const query=$('docs-search').value.trim().toLowerCase();
    searchMatches=searchIndex.filter((entry) => `${entry.label} ${entry.group} ${descriptions[entry.id] || ''}`.toLowerCase().includes(query));
    searchSelection=0;$('search-count').textContent=`${searchMatches.length} ${searchMatches.length===1?'section':'sections'}${query?' found':' to explore'}`;
    $('search-results').innerHTML=searchMatches.length?searchMatches.map((entry,index) => `<a href="#${entry.id}" data-search-index="${index}"${index===0?' class="selected"':''}><span>${icon('file-text')}<strong>${entry.label}</strong><small>${entry.group}</small></span>${icon('arrow-up-right')}</a>`).join(''):'<p class="no-search-results">No matching sections. Try “authentication”, “cursor” or “webhook”.</p>';
  }
  function openSearch() {menu(false);$('search-dialog').showModal();$('docs-search').value='';search();$('docs-search').focus();}
  function goSearch(index) {
    const entry=searchMatches[index];if (!entry) return;$('search-dialog').close();location.hash=entry.id;const heading=$(entry.id).querySelector('h1,h2');heading.tabIndex=-1;heading.focus({preventScroll:true});$(entry.id).scrollIntoView({behavior:'instant'});
  }
  $('open-search').onclick=openSearch;$('docs-search').oninput=search;
  $('search-results').onclick=(event) => {const link=event.target.closest('[data-search-index]');if (link) {event.preventDefault();goSearch(Number(link.dataset.searchIndex));}};
  $('search-dialog').onkeydown=(event) => {
    if (['ArrowDown','ArrowUp'].includes(event.key) && searchMatches.length) {
      event.preventDefault();searchSelection=(searchSelection+(event.key==='ArrowDown'?1:searchMatches.length-1))%searchMatches.length;
      document.querySelectorAll('[data-search-index]').forEach((link) => {link.classList.toggle('selected',Number(link.dataset.searchIndex)===searchSelection);});
      document.querySelector(`[data-search-index="${searchSelection}"]`).scrollIntoView({block:'nearest'});
    }
    if (event.key==='Enter' && event.target===$('docs-search')) {event.preventDefault();goSearch(searchSelection);}
  };
  document.addEventListener('keydown',(event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase()==='k') {event.preventDefault();if (!$('search-dialog').open && !document.querySelector('dialog[open]')) openSearch();}
    if (event.key==='Escape') {
      const dialog=document.querySelector('dialog[open]');
      if (dialog) {event.preventDefault();dialog.close();}
      menu(false);
    }
    if (event.key==='Tab' && $('sidebar').classList.contains('open') && matchMedia('(max-width:800px)').matches) {
      const items=[$('mobile-menu'),...$('sidebar').querySelectorAll('a,summary,button')].filter((el) => el.getClientRects().length);
      const first=items[0],last=items.at(-1);
      if (event.shiftKey && document.activeElement===first) {event.preventDefault();last.focus();}
      if (!event.shiftKey && document.activeElement===last) {event.preventDefault();first.focus();}
    }
  });
  function theme(value) {
    document.documentElement.dataset.theme=value;$('theme-toggle').setAttribute('aria-pressed',value==='dark');$('theme-toggle').setAttribute('aria-label',`Switch to ${value==='dark'?'light':'dark'} mode`);
    $('theme-toggle').innerHTML=icon(value==='dark'?'sun':'moon');
  }
  try {const saved=localStorage.getItem('orbit-docs-theme-v1');if (['light','dark'].includes(saved)) theme(saved);}catch {}
  $('theme-toggle').onclick=() => {const value=document.documentElement.dataset.theme==='dark'?'light':'dark';theme(value);try {localStorage.setItem('orbit-docs-theme-v1',value);}catch {toast('Theme changed for this tab. Browser storage is unavailable.');}};
  function openKey() {$('generated-key').hidden=true;$('new-key').value='';$('key-dialog').showModal();}
  $('generate-key').onclick=() => {
    const bytes=crypto.getRandomValues(new Uint8Array(12));$('new-key').value=`demo_${[...bytes].map((byte) => byte.toString(16).padStart(2,'0')).join('')}`;$('generated-key').hidden=false;
  };
  $('use-key').onclick=() => {$('demo-key').value=$('new-key').value;cancelRequest();$('key-dialog').close();$('playground').scrollIntoView({behavior:'instant'});toast('Public demo key applied. It stays in this page only.');};
  $('key-dialog').addEventListener('close',() => {$('new-key').value='';$('generated-key').hidden=true;});
  function information(title,content) {$('info-title').textContent=title;$('info-content').innerHTML=content;$('info-dialog').showModal();}
  function statusInfo() {information('Operational. In this tab.',`<p>The local simulator is available while this page is loaded. This is not a real-time monitor of an external API.</p><p>Sample endpoints: ${R.endpoints.length}. In-memory CRUD, cursor/page navigation, forced errors and a 60-request rate window are active. Reset sandbox restores fixtures.</p>`);}
  $('status-button').onclick=statusInfo;
  async function copySnippet(id,button) {
    const source=snippets.get(id);
    try {await navigator.clipboard.writeText(source);toast('Code copied. Example credentials remain placeholders.');}
    catch {
      const pre=button?.closest('.code-block')?.querySelector('pre');
      if (pre) {const range=document.createRange();range.selectNodeContents(pre);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);pre.focus();}
      else {information('Your safe support context',`<p>Copy this local context manually. Credentials and business data are excluded.</p><textarea id="support-context-text" rows="8" readonly aria-label="Safe support context">${escape(source)}</textarea>`);$('support-context-text').select();}
      toast('Clipboard unavailable. Select or copy the example text manually.');
    }
  }
  document.body.addEventListener('click',(event) => {
    const copied=event.target.closest('[data-copy]');if (copied) copySnippet(copied.dataset.copy,copied);
    const requested=event.target.closest('[data-try]');if (requested) chooseEndpoint(requested.dataset.try);
    const languageButton=event.target.closest('[data-language]');if (languageButton) {language=languageButton.dataset.language;renderCodes();}
    if (event.target.closest('[data-open-key]')) openKey();
    const closed=event.target.closest('[data-close]');if (closed) $(closed.dataset.close).close();
    if (event.target.closest('#footer-status')) statusInfo();
    if (event.target.closest('#support-notes')) information('A useful place to ask.',`<p>There is no staffed Orbit support team. <strong>developers@example.com</strong> is a reserved example address, not a working support channel.</p><p>Use the REST tag on Stack Overflow for general questions, or copy a safe support context for your own team. That context excludes keys, request bodies and response data.</p>`);
    if (event.target.closest('#copy-context')) {snippets.set('support-context',`Orbit fictional API reference\nDocumentation version: ${version}\nEndpoint: ${selected}\nLanguage: ${language}\nResponse status: ${$('response-status').textContent}\nLocal simulation only. Credentials and user data excluded.`);copySnippet('support-context');}
  });
  function bindWebhook() {
    const changed=() => {webhookRun++;$('webhook-status').textContent='Sample changed. Sign or verify the exact current values.';};
    ['webhook-secret','webhook-body','webhook-signature'].forEach((id) => {$(id).oninput=changed;});
    async function cryptoKey(secret) {
      return crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);
    }
    $('sign-webhook').onclick=async () => {
      const run=++webhookRun,secret=$('webhook-secret').value,raw=$('webhook-body').value,timestamp=String(Math.floor(Date.now()/1000));
      if (!/^whsec_demo_[a-z0-9_]{1,60}$/.test(secret)) {$('webhook-status').textContent='Use a public whsec_demo_ secret only.';return;}
      try {
        const signature=await crypto.subtle.sign('HMAC',await cryptoKey(secret),new TextEncoder().encode(`${timestamp}.${raw}`));
        if (run!==webhookRun) return;
        $('webhook-signature').value=`t=${timestamp},v1=${[...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2,'0')).join('')}`;
        $('webhook-status').textContent='Fresh sample signature generated locally. Verify it, then edit the raw payload to see tamper detection.';
      }catch {if (run===webhookRun) $('webhook-status').textContent='Web Crypto is unavailable in this browser context. Use HTTPS or localhost.';}
    };
    $('verify-webhook').onclick=async () => {
      const run=++webhookRun,secret=$('webhook-secret').value,raw=$('webhook-body').value,header=$('webhook-signature').value;
      const match=/^t=(\d{10}),v1=([a-f0-9]{64})$/.exec(header);
      if (!/^whsec_demo_[a-z0-9_]{1,60}$/.test(secret)) {$('webhook-status').textContent='Use a public whsec_demo_ secret only.';return;}
      if (!match || Math.abs(Date.now()/1000-Number(match[1]))>300) {$('webhook-status').textContent='Invalid signature format or timestamp outside the five-minute window.';return;}
      try {
        const signature=Uint8Array.from(match[2].match(/../g),(byte) => parseInt(byte,16));
        const verified=await crypto.subtle.verify('HMAC',await cryptoKey(secret),signature,new TextEncoder().encode(`${match[1]}.${raw}`));
        if (run===webhookRun) $('webhook-status').textContent=verified?'Signature valid. Exact raw body and timestamp verified locally.':'Signature mismatch. Body or secret differs from the signed sample.';
      }catch {if (run===webhookRun) $('webhook-status').textContent='Verification could not run. Web Crypto requires a supported secure context.';}
    };
  }
  renderMain();renderPlayground();
  if (location.hash) setTimeout(() => {try {document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({behavior:'instant'});}catch {}},0);
})();
