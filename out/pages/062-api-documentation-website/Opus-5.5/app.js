(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, v); } catch { /* unavailable */ } } };
  const HOST = "https://api.tasklane.example";
  let VERSION = "2.1";
  const vp = () => (VERSION === "1" ? "/v1" : "/v2");
  let KEY = store.get("tl-key", "") || "YOUR_API_KEY";
  let LANG = store.get("tl-lang", "curl");
  const LANGS = [["curl", "cURL"], ["js", "JavaScript"], ["python", "Python"], ["ruby", "Ruby"], ["go", "Go"], ["php", "PHP"]];

  /* ---------- syntax highlighting (small tokenizer) ---------- */
  const KW = {
    js: "const let var await async function return if else new import from export try catch throw for of",
    python: "import from def return if else for in with as try except raise None True False print",
    ruby: "require def end do if else return nil true false puts",
    go: "package import func return if err nil defer var := for range",
    php: "use require new return echo function if else null true false",
    bash: "curl export",
    json: "true false null"
  };
  function hl(code, lang) {
    const kw = new Set((KW[lang] || "").split(" "));
    const re = lang === "json"
      ? /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\b\d+(?:\.\d+)?\b)|\b(true|false|null)\b/g
      : /((?<![:\w])\/\/[^\n]*|(?<![\w&$'"])#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`[^`]*`)|(\b\d+(?:\.\d+)?\b)|(\$?[A-Za-z_][\w]*)(\s*\()?|(-[A-Za-z]\b|--[a-z-]+)/g;
    let out = "", last = 0, m;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index)); last = re.lastIndex;
      if (lang === "json") {
        if (m[1]) out += m[2] ? `<span class="t-p">${esc(m[1])}</span>${m[2]}` : `<span class="t-s">${esc(m[1])}</span>`;
        else if (m[3]) out += `<span class="t-n">${m[3]}</span>`; else out += `<span class="t-k">${m[4]}</span>`;
        continue;
      }
      if (m[1]) { const isHashComment = m[1][0] === "#" && !["python", "ruby", "bash"].includes(lang); out += isHashComment ? esc(m[1]) : `<span class="t-c">${esc(m[1])}</span>`; }
      else if (m[2]) out += `<span class="t-s">${esc(m[2])}</span>`;
      else if (m[3]) out += `<span class="t-n">${m[3]}</span>`;
      else if (m[4]) { const w = m[4]; out += kw.has(w) ? `<span class="t-k">${w}</span>` : m[5] ? `<span class="t-f">${esc(w)}</span>` : esc(w); if (m[5]) out += m[5]; }
      else if (m[6]) out += `<span class="t-b">${m[6]}</span>`;
    }
    return out + esc(code.slice(last));
  }
  const codeBlock = (code, lang, label) => `<div class="cb"><div class="cb-h"><span class="lbl">${label}</span><button class="copy" type="button" data-copy>${icon("i-copy")}Copy</button></div><pre><code data-lang="${lang}">${hl(code, lang)}</code></pre></div>`;

  /* ---------- API spec ---------- */
  const USER = { id: "usr_123", email: "ada@example.com", name: "Ada Lovelace", role: "admin", created_at: "2024-01-15T10:30:00Z" };
  const EP = [
    { id: "list-users", res: "users", m: "GET", path: "/users", t: "List users", d: "Returns a paginated list of users in your workspace, newest first.", q: [["limit", "integer", false, "Results per page, 1–100 (default 20).", "20"], ["cursor", "string", false, "Cursor from a previous response's next_cursor.", ""], ["role", "string", false, "Filter by role: admin, member or guest.", ""]], resp: () => ({ data: [USER, { ...USER, id: "usr_124", email: "grace@example.com", name: "Grace Hopper", role: "member" }], has_more: true, next_cursor: "cur_9f2c" }) },
    { id: "get-user", res: "users", m: "GET", path: "/users/{id}", t: "Retrieve a user", d: "Retrieve a user by ID.", p: [["id", "string", true, "The user's unique ID.", "usr_123"]], q: [["include", "string", false, "Related resources to include, e.g. projects.", ""]], resp: () => USER, fields: [["id", "string", "Unique identifier, prefixed usr_."], ["email", "string", "Primary email address."], ["name", "string", "Display name."], ["role", "string", "admin, member or guest."], ["created_at", "timestamp", "ISO 8601 creation time (UTC)."]] },
    { id: "create-user", res: "users", m: "POST", path: "/users", t: "Create a user", d: "Invites a user to your workspace. An invitation email is sent automatically.", b: { email: "linus@example.com", name: "Linus Ng", role: "member" }, breq: ["email"], resp: (b) => ({ ...USER, id: "usr_901", ...b, created_at: "2026-11-12T09:00:00Z" }), status: 201 },
    { id: "update-user", res: "users", m: "PUT", path: "/users/{id}", t: "Update a user", d: "Updates the specified user. Omitted fields are left unchanged.", p: [["id", "string", true, "The user's unique ID.", "usr_123"]], b: { role: "member" }, resp: (b) => ({ ...USER, ...b }) },
    { id: "delete-user", res: "users", m: "DELETE", path: "/users/{id}", t: "Delete a user", d: "Removes the user from your workspace. Their tasks are reassigned to the workspace owner.", p: [["id", "string", true, "The user's unique ID.", "usr_124"]], resp: () => null, status: 204 },
    { id: "list-projects", res: "projects", m: "GET", path: "/projects", t: "List projects", d: "Returns projects you have access to.", q: [["status", "string", false, "active or archived.", "active"], ["limit", "integer", false, "Results per page, 1–100.", "20"]], resp: () => ({ data: [{ id: "prj_42", name: "Website relaunch", status: "active", owner_id: "usr_123" }], has_more: false, next_cursor: null }) },
    { id: "create-project", res: "projects", m: "POST", path: "/projects", t: "Create a project", d: "Creates a new project.", b: { name: "Q1 roadmap", description: "Planning for Q1" }, breq: ["name"], resp: (b) => ({ id: "prj_77", status: "active", owner_id: "usr_123", ...b }), status: 201 },
    { id: "list-tasks", res: "tasks", m: "GET", path: "/projects/{project_id}/tasks", t: "List tasks", d: "Lists tasks in a project. Supports filtering by status and assignee.", p: [["project_id", "string", true, "The project ID.", "prj_42"]], q: [["status", "string", false, "todo, in_progress or done.", ""], ["assignee_id", "string", false, "Only tasks assigned to this user.", ""]], resp: () => ({ data: [{ id: "tsk_1", title: "Draft homepage copy", status: "in_progress", assignee_id: "usr_123", due_on: "2026-12-01" }], has_more: false, next_cursor: null }) },
    { id: "update-task", res: "tasks", m: "PUT", path: "/tasks/{id}", t: "Update a task", d: "Updates a task's title, status, assignee or due date.", p: [["id", "string", true, "The task ID.", "tsk_1"]], b: { status: "done" }, resp: (b) => ({ id: "tsk_1", title: "Draft homepage copy", status: "in_progress", assignee_id: "usr_123", due_on: "2026-12-01", ...b }) },
    { id: "create-comment", res: "comments", m: "POST", path: "/tasks/{task_id}/comments", t: "Create a comment", d: "Adds a comment to a task. Supports @mentions with user IDs.", p: [["task_id", "string", true, "The task ID.", "tsk_1"]], b: { body: "Looks great — shipping today!" }, breq: ["body"], resp: (b) => ({ id: "cmt_5", task_id: "tsk_1", author_id: "usr_123", ...b, created_at: "2026-11-12T09:00:00Z" }), status: 201 },
    { id: "upload-file", res: "files", m: "POST", path: "/files", t: "Upload a file", d: "Uploads a file (multipart/form-data, max 100 MB) and optionally attaches it to a task.", b: { task_id: "tsk_1", filename: "brief.pdf" }, breq: ["filename"], resp: (b) => ({ id: "fil_3", size: 248133, content_type: "application/pdf", url: "https://files.tasklane.example/fil_3", ...b }), status: 201 }
  ];
  const RES = { users: ["Users", "Users are members of your workspace. Each user has a role that controls access."], projects: ["Projects", "Projects group tasks, files and members."], tasks: ["Tasks", "Tasks are the units of work inside a project."], comments: ["Comments", "Comments let collaborators discuss a task."], files: ["Files", "Files can be uploaded and attached to tasks."] };

  /* ---------- code generators ---------- */
  function build(ep, vals = {}) {
    let path = ep.path; (ep.p || []).forEach(([n, , , , ex]) => (path = path.replace(`{${n}}`, encodeURIComponent(vals[n] ?? ex))));
    const qs = (ep.q || []).map(([n, , , , ex]) => [n, vals[n] ?? ex]).filter(([, v]) => v !== "" && v != null);
    const url = `${HOST}${vp()}${path}${qs.length ? "?" + qs.map(([n, v]) => `${n}=${encodeURIComponent(v)}`).join("&") : ""}`;
    const body = ep.b ? (vals.__body ?? JSON.stringify(ep.b, null, 2)) : null;
    return { url, body, key: vals.__key || KEY };
  }
  function snippet(ep, lang, vals) {
    const { url, body, key } = build(ep, vals), M = ep.m, ind = (s, n) => s.split("\n").map((l, i) => (i ? " ".repeat(n) + l : l)).join("\n");
    switch (lang) {
      case "curl": return `curl -X ${M} "${url}" \\\n  -H "Authorization: Bearer ${key}"${body ? ` \\\n  -H "Content-Type: application/json" \\\n  -d '${body.replace(/\n\s*/g, " ")}'` : ""}`;
      case "js": return `const response = await fetch('${url}', {\n  method: '${M}',\n  headers: {\n    'Authorization': 'Bearer ${key}'${body ? ",\n    'Content-Type': 'application/json'" : ""}\n  }${body ? `,\n  body: JSON.stringify(${ind(body, 2)})` : ""}\n});\n${M === "DELETE" ? "console.log(response.status); // 204" : "const data = await response.json();\nconsole.log(data);"}`;
      case "python": return `import requests\n\nresponse = requests.${M.toLowerCase()}(\n    "${url}",\n    headers={"Authorization": "Bearer ${key}"},${body ? `\n    json=${ind(body.replace(/\btrue\b/g, "True").replace(/\bfalse\b/g, "False").replace(/\bnull\b/g, "None"), 4)},` : ""}\n)\n${M === "DELETE" ? "print(response.status_code)  # 204" : "print(response.json())"}`;
      case "ruby": return `require "net/http"\nrequire "json"\n\nuri = URI("${url}")\nreq = Net::HTTP::${M[0] + M.slice(1).toLowerCase()}.new(uri)\nreq["Authorization"] = "Bearer ${key}"${body ? `\nreq["Content-Type"] = "application/json"\nreq.body = ${JSON.stringify(JSON.parse(body))}.to_json` : ""}\n\nres = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |http| http.request(req) }\nputs res.body`;
      case "go": return `package main\n\nimport (\n  "fmt"\n  "io"\n  "net/http"${body ? '\n  "strings"' : ""}\n)\n\nfunc main() {\n  ${body ? `payload := strings.NewReader(\`${body.replace(/\n\s*/g, " ")}\`)\n  req, _ := http.NewRequest("${M}", "${url}", payload)\n  req.Header.Set("Content-Type", "application/json")` : `req, _ := http.NewRequest("${M}", "${url}", nil)`}\n  req.Header.Set("Authorization", "Bearer ${key}")\n\n  res, err := http.DefaultClient.Do(req)\n  if err != nil {\n    panic(err)\n  }\n  defer res.Body.Close()\n  data, _ := io.ReadAll(res.Body)\n  fmt.Println(res.StatusCode, string(data))\n}`;
      case "php": return `<?php\nrequire 'vendor/autoload.php';\n\n$client = new GuzzleHttp\\Client();\n$response = $client->request('${M}', '${url}', [\n  'headers' => ['Authorization' => 'Bearer ${key}'],${body ? `\n  'json' => ${phpArr(JSON.parse(body), 2)},` : ""}\n]);\n\necho $response->getBody();`;
    }
  }
  function phpArr(o, n) { const pad = " ".repeat(n + 2); return "[\n" + Object.entries(o).map(([k, v]) => `${pad}'${k}' => ${typeof v === "string" ? `'${v}'` : JSON.stringify(v)}`).join(",\n") + `\n${" ".repeat(n)}]`; }
  const langOf = (l) => (l === "curl" ? "bash" : l);
  function tabsBlock(ep, id) {
    return `<div class="cb" data-tabs-for="${id}"><div class="cb-h"><div class="tabs" role="tablist" aria-label="Code language">${LANGS.map(([k, l]) => `<button type="button" role="tab" aria-selected="${k === LANG}" data-lang-tab="${k}">${l}</button>`).join("")}</div><button class="copy" type="button" data-copy>${icon("i-copy")}Copy</button></div><pre><code data-lang="${langOf(LANG)}" data-snip="${id}">${hl(snippet(ep, LANG), langOf(LANG))}</code></pre></div>`;
  }
  const jsonBlock = (obj, status, label = "Response") => `<details class="resp" open><summary><span class="st${status >= 400 ? " e" : ""}">${status}</span>${label}${icon("i-chev")}</summary><pre><code data-lang="json">${obj === null ? '<span class="t-c">(no content)</span>' : hl(JSON.stringify(obj, null, 2), "json")}</code></pre></details>`;
  const paramTable = (rows, title) => rows && rows.length ? `<h3>${title}</h3><div class="tbl"><table><thead><tr><th>Parameter</th><th>Type</th><th>Required</th><th>Description</th></tr></thead><tbody>${rows.map(([n, t, r, d]) => `<tr><td><code>${n}</code></td><td>${t}</td><td>${r ? '<span class="req">Yes</span>' : '<span class="opt">No</span>'}</td><td>${d}</td></tr>`).join("")}</tbody></table></div>` : "";

  /* ---------- static sections ---------- */
  const ERRORS = [[400, "Bad Request", "Invalid parameters"], [401, "Unauthorized", "Invalid API key"], [403, "Forbidden", "Key lacks permission for this resource"], [404, "Not Found", "Resource doesn't exist"], [409, "Conflict", "Resource already exists"], [429, "Rate Limited", "Too many requests"], [500, "Server Error", "Something went wrong"]];
  const sec = (id, prose, code = "") => `<section class="sec" id="${id}" data-anchor="${id}"><div class="prose">${prose}</div><div class="code">${code}</div></section>`;
  function staticSections() {
    const b = `${HOST}${vp()}`;
    return [
      sec("introduction", `<h1>API Reference</h1><p class="lead">The Tasklane API is a REST API for managing users, projects, tasks, comments and files. It uses JSON request and response bodies, standard HTTP verbs and status codes, and bearer-token authentication.</p><p>Base URL: <code>${b}</code></p><div class="cards"><a class="card" href="#quick-start"><b>Quick Start</b><span>Make your first request in 2 minutes</span></a><a class="card" href="#authentication"><b>Authentication</b><span>API keys and OAuth 2.0</span></a><a class="card" href="#users"><b>Core resources</b><span>Users, projects, tasks, comments, files</span></a><a class="card" href="#webhooks-setup"><b>Webhooks</b><span>Get notified about changes</span></a></div>`, codeBlock(`${b}`, "bash", "Base URL")),
      sec("quick-start", `<h2>Quick Start</h2><p>Get up and running in three steps:</p><ol class="steps"><li><span><b>Get your API key.</b> Click <em>Get API Key</em> in the header to create a test key (it starts with <code>tl_test_</code>).</span></li><li><span><b>Make your first request.</b> Run the cURL example to list the users in your workspace.</span></li><li><span><b>Explore the API.</b> Every endpoint has a <em>Try it</em> panel and copy-ready examples in six languages.</span></li></ol>`, codeBlock(`curl -X GET "${b}/users" \\\n  -H "Authorization: Bearer ${KEY}"`, "bash", "cURL") + jsonBlock(EP[0].resp(), 200, "Response preview").replace(" open", "")),
      sec("authentication", `<h2>Authentication</h2><p>Authenticate by sending your API key as a bearer token in the <code>Authorization</code> header. Test keys (<code>tl_test_…</code>) only touch sandbox data; live keys (<code>tl_live_…</code>) act on real workspaces.</p><h3>OAuth 2.0</h3><p>Apps acting on behalf of other users should use the authorization code flow: redirect to <code>/oauth/authorize</code>, exchange the code at <code>/oauth/token</code>, then send the access token as a bearer token.</p><h3>Token refresh</h3><p>Access tokens expire after 1 hour. Post the <code>refresh_token</code> to <code>/oauth/token</code> with <code>grant_type=refresh_token</code> to get a new one.</p><h3>Security best practices</h3><ul><li>Never embed keys in client-side code or commit them to source control.</li><li>Use environment variables and rotate keys every 90 days.</li><li>Create separate restricted keys per service.</li></ul>`, tabsBlock(EP[1], "auth") + codeBlock(`Authorization: Bearer ${KEY}\nContent-Type: application/json\nTasklane-Version: ${VERSION === "1" ? "1.9" : VERSION}`, "bash", "Example headers")),
      sec("versioning", `<h2>Versioning</h2><p>The major version is part of the URL (<code>/v2</code>). Minor versions add fields and endpoints without breaking changes; pin a minor version with the <code>Tasklane-Version</code> header. You're viewing <b>${VERSION === "1" ? "v1.x" : "v" + VERSION}</b>.</p>${VERSION === "1" ? '<div class="note warn">v1 is deprecated and will be retired on June 30, 2027. See the migration guide in the changelog.</div>' : ""}`, codeBlock(`curl "${b}/users" \\\n  -H "Authorization: Bearer ${KEY}" \\\n  -H "Tasklane-Version: ${VERSION === "1" ? "1.9" : VERSION}"`, "bash", "Pin a version")),
      sec("errors", `<h2>Errors</h2><p>Tasklane uses conventional HTTP status codes. Errors return a JSON body with a machine-readable <code>code</code> and a human-readable <code>message</code>.</p><div class="tbl"><table><thead><tr><th>Code</th><th>Name</th><th>Description</th></tr></thead><tbody>${ERRORS.map(([c, n, d]) => `<tr><td><code>${c}</code></td><td>${n}</td><td>${d}</td></tr>`).join("")}</tbody></table></div>`, jsonBlock({ error: { code: "invalid_parameter", message: "limit must be between 1 and 100", param: "limit", request_id: "req_7Hk2" } }, 400, "Error response format")),
      sec("rate-limits", `<h2>Rate Limits</h2><div class="tbl"><table><thead><tr><th>Plan</th><th>Requests / minute</th><th>Burst</th></tr></thead><tbody><tr><td>Free</td><td>60</td><td>10</td></tr><tr><td>Team</td><td>600</td><td>50</td></tr><tr><td>Enterprise</td><td>3,000</td><td>200</td></tr></tbody></table></div><p>Every response includes the headers on the right. When you exceed the limit you'll get <code>429</code> with a <code>Retry-After</code> header.</p><h3>Best practices</h3><ul><li>Back off exponentially and honor <code>Retry-After</code>.</li><li>Use webhooks instead of polling.</li><li>Batch writes with <a href="#batch-operations">batch operations</a>.</li></ul>`, codeBlock(`X-RateLimit-Limit: 600\nX-RateLimit-Remaining: 587\nX-RateLimit-Reset: 1762938060\nRetry-After: 12   # only on 429`, "bash", "Rate limit headers") + codeBlock(`async function withRetry(fn, tries = 5) {\n  for (let i = 0; i < tries; i++) {\n    const res = await fn();\n    if (res.status !== 429) return res;\n    const wait = Number(res.headers.get('Retry-After') || 2 ** i);\n    await new Promise((r) => setTimeout(r, wait * 1000));\n  }\n  throw new Error('Rate limited');\n}`, "js", "Handling 429s")),
      sec("pagination", `<h2>Pagination</h2><p>List endpoints use cursor-based pagination. Pass <code>limit</code> (1–100, default 20) and, for later pages, the <code>next_cursor</code> from the previous response as <code>cursor</code>. When <code>has_more</code> is false you've reached the end.</p>`, codeBlock(`curl "${b}/users?limit=2&cursor=cur_9f2c" \\\n  -H "Authorization: Bearer ${KEY}"`, "bash", "Next page") + jsonBlock({ data: ["…"], has_more: true, next_cursor: "cur_a71d" }, 200)),
      sec("filtering", `<h2>Filtering</h2><p>Most list endpoints accept field filters as query parameters, such as <code>status=active</code>. Use <code>created_after</code> and <code>created_before</code> with ISO 8601 timestamps, and comma-separate values to match any, as in <code>status=todo,in_progress</code>.</p>`, codeBlock(`curl "${b}/projects/prj_42/tasks?status=todo,in_progress&assignee_id=usr_123" \\\n  -H "Authorization: Bearer ${KEY}"`, "bash", "Filter tasks")),
      sec("batch-operations", `<h2>Batch Operations</h2><p>Send up to 50 operations in one request to <code>POST ${vp()}/batch</code>. Each operation runs independently and returns its own status.</p>`, codeBlock(JSON.stringify({ operations: [{ method: "PUT", path: `${vp()}/tasks/tsk_1`, body: { status: "done" } }, { method: "POST", path: `${vp()}/tasks/tsk_1/comments`, body: { body: "Done!" } }] }, null, 2), "json", "Batch request body"))
    ].join("");
  }
  function resourceSections() {
    return Object.entries(RES).map(([k, [name, d]]) => {
      const eps = EP.filter((e) => e.res === k);
      return sec(k, `<h2>${name}</h2><p>${d}</p><div class="tbl"><table><thead><tr><th>Endpoint</th><th></th></tr></thead><tbody>${eps.map((e) => `<tr><td><span class="m ${e.m}">${e.m}</span> <code>${vp()}${e.path}</code></td><td><a href="#${e.id}">${e.t}</a></td></tr>`).join("")}</tbody></table></div>`) + eps.map(endpointSection).join("");
    }).join("");
  }
  function endpointSection(e) {
    const st = e.status || 200;
    const fields = e.fields ? `<h3>Response fields</h3><div class="tbl"><table><thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead><tbody>${e.fields.map(([n, t, d]) => `<tr><td><code>${n}</code></td><td>${t}</td><td>${d}</td></tr>`).join("")}</tbody></table></div>` : "";
    const body = e.b ? `<h3>Body parameters</h3><div class="tbl"><table><thead><tr><th>Field</th><th>Type</th><th>Required</th></tr></thead><tbody>${Object.keys(e.b).concat(e.breq ? e.breq.filter((x) => !(x in e.b)) : []).map((n) => `<tr><td><code>${n}</code></td><td>string</td><td>${(e.breq || []).includes(n) ? '<span class="req">Yes</span>' : '<span class="opt">No</span>'}</td></tr>`).join("")}</tbody></table></div>` : "";
    return sec(e.id, `<div class="ep-h"><span class="m ${e.m}">${e.m}</span><span class="path">${vp()}${e.path}</span></div><h2>${e.t}</h2><p>${e.d}</p>${paramTable(e.p, "Path parameters")}${paramTable(e.q, "Query parameters")}${body}${fields}<button class="btn try" type="button" aria-expanded="false" data-try="${e.id}">${icon("i-play")}Try it</button><div class="pg" hidden data-pg="${e.id}"></div>`, tabsBlock(e, e.id) + jsonBlock(e.resp(e.b || {}), st));
  }
  const EVENTS = ["user.created", "user.updated", "user.deleted", "project.created", "project.archived", "task.created", "task.updated", "task.completed", "task.deleted", "comment.created", "file.uploaded"];
  function webhookSections() {
    return [
      sec("webhooks-setup", `<h2>Webhooks</h2><p>Webhooks push events to your server as they happen. Register an HTTPS endpoint in <em>Settings → Developers → Webhooks</em> or via the API, then respond with any <code>2xx</code> status within 10 seconds.</p><h3>Retry policy</h3><p>Failed deliveries are retried with exponential backoff for up to 3 days (8 attempts: 1m, 5m, 30m, 2h, 6h, 12h, 24h, 48h). After that the endpoint is disabled and admins are emailed.</p><h3>Testing locally</h3><p>Use the CLI to forward events to localhost and to trigger test events.</p>`, codeBlock(`tasklane login\ntasklane webhooks listen --forward-to localhost:3000/webhooks\n\n# in another terminal\ntasklane webhooks trigger task.completed`, "bash", "Tasklane CLI")),
      sec("webhooks-events", `<h2>Events</h2><p>Subscribe to any of these event types:</p><ul class="events">${EVENTS.map((e) => `<li><code>${e}</code></li>`).join("")}</ul>`),
      sec("webhooks-payloads", `<h2>Payloads</h2><p>Every delivery is a JSON <code>POST</code> with the event type, a unique ID (use it to ignore duplicates) and the affected object.</p>`, jsonBlock({ id: "evt_1F3a", type: "task.completed", created_at: "2026-11-12T09:41:00Z", data: { object: { id: "tsk_1", title: "Draft homepage copy", status: "done" } } }, 200, "POST to your endpoint")),
      sec("webhooks-security", `<h2>Security</h2><p>Each request includes a <code>Tasklane-Signature</code> header: an HMAC-SHA256 of the timestamp and raw body using your endpoint secret. Verify it, and reject events older than 5 minutes to prevent replays.</p>`, codeBlock(`import crypto from 'node:crypto';\n\nexport function verify(req, secret) {\n  const [t, sig] = req.headers['tasklane-signature'].split(',');\n  const expected = crypto\n    .createHmac('sha256', secret)\n    .update(\`\${t}.\${req.rawBody}\`)\n    .digest('hex');\n  const fresh = Date.now() / 1000 - Number(t) < 300;\n  return fresh && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));\n}`, "js", "Verify signatures (Node.js)"))
    ].join("");
  }
  const SDKS = [["javascript", "JavaScript", "npm install @tasklane/node", `import Tasklane from '@tasklane/node';\n\nconst tl = new Tasklane(process.env.TASKLANE_KEY);\nconst users = await tl.users.list({ limit: 10 });`, "js"], ["python", "Python", "pip install tasklane", `import tasklane\n\nclient = tasklane.Client(api_key="${KEY}")\nusers = client.users.list(limit=10)`, "python"], ["ruby", "Ruby", "gem install tasklane", `require "tasklane"\n\nclient = Tasklane::Client.new(api_key: ENV["TASKLANE_KEY"])\nusers = client.users.list(limit: 10)`, "ruby"], ["go", "Go", "go get github.com/tasklane/tasklane-go", `client := tasklane.NewClient(os.Getenv("TASKLANE_KEY"))\nusers, err := client.Users.List(ctx, &tasklane.ListParams{Limit: 10})`, "go"], ["php", "PHP", "composer require tasklane/tasklane-php", `$client = new \\Tasklane\\Client(getenv('TASKLANE_KEY'));\n$users = $client->users->all(['limit' => 10]);`, "php"]];
  function sdkSections() {
    return `<section class="sec" id="sdks" data-anchor="sdks"><div class="prose"><h2>SDKs &amp; Libraries</h2><p>Official libraries handle authentication, retries, pagination and typed responses.</p></div><div class="code"></div></section>` + SDKS.map(([id, n, inst, ex, l]) => sec(`sdk-${id}`, `<h3 style="margin-top:0">${n}</h3><p>Install the ${n} library, then create a client with your API key.</p><p><button class="btn-o" type="button" data-repo="${n}">${icon("i-gh")}GitHub repo</button> <button class="btn-o" type="button" data-repo="${n} docs">${icon("i-book")}Library docs</button></p>`, codeBlock(inst, "bash", "Install") + codeBlock(ex, l, "Quick example"))).join("");
  }
  function changelogSection() {
    return sec("changelog", `<h2>Changelog</h2><div class="chg"><h3>v2.1 <span class="badge new">New</span><time>October 7, 2026</time></h3><ul><li>Added <a href="#batch-operations">batch operations</a> (<code>POST /v2/batch</code>).</li><li>Tasks gain <code>due_on</code> and <code>assignee_id</code> filters.</li></ul></div><div class="chg"><h3>v2.0 <span class="badge br">Breaking</span><time>March 3, 2026</time></h3><ul><li>Offset pagination replaced by cursors (<code>page</code> → <code>cursor</code>).</li><li><code>user.full_name</code> renamed to <code>name</code>.</li><li>Errors now use a nested <code>error</code> object.</li></ul><p><b>Migration guide:</b> replace <code>page=N</code> loops with <code>next_cursor</code> loops, rename <code>full_name</code>, and read <code>error.message</code>.</p></div><div class="chg"><h3>v1.x <span class="badge dep">Deprecated</span><time>Retires June 30, 2027</time></h3><p>v1 still works but receives security fixes only. Requests return a <code>Deprecation</code> header.</p></div>`);
  }
  function supportSection() {
    return `<section class="support" id="support" data-anchor="support"><h2>Need help?</h2><a href="#support" data-soon="Developer community">${icon("i-users")}<span><b>Developer community</b><small>Ask questions and share projects</small></span></a><a href="https://stackoverflow.com/questions/tagged/tasklane" target="_blank" rel="noopener">${icon("i-so")}<span><b>Stack Overflow</b><small>Tag: tasklane</small></span></a><a href="mailto:api-support@tasklane.example">${icon("i-mail")}<span><b>Support email</b><small>api-support@tasklane.example</small></span></a><a href="#support" data-statuspage>${icon("i-activity")}<span><b>Status page</b><small>All systems operational</small></span></a></section><footer class="foot"><p>© 2026 Tasklane</p><p>Demo documentation: Tasklane, its API and SDKs are fictional. The playground runs a simulated sandbox in your browser and makes no network requests.</p></footer>`;
  }

  /* ---------- navigation ---------- */
  const NAV = [
    ["Getting Started", [["introduction", "Introduction"], ["authentication", "Authentication"], ["rate-limits", "Rate Limits"], ["errors", "Errors"], ["versioning", "Versioning"]]],
    ["Core Resources", [["users", "Users"], ["projects", "Projects"], ["tasks", "Tasks"], ["comments", "Comments"], ["files", "Files"]]],
    ["Webhooks", [["webhooks-setup", "Setup"], ["webhooks-events", "Events"], ["webhooks-payloads", "Payloads"], ["webhooks-security", "Security"]]],
    ["SDKs & Libraries", [["sdk-javascript", "JavaScript"], ["sdk-python", "Python"], ["sdk-ruby", "Ruby"], ["sdk-go", "Go"], ["sdk-php", "PHP"]]],
    ["Guides", [["quick-start", "Quick Start"], ["pagination", "Pagination"], ["filtering", "Filtering"], ["batch-operations", "Batch Operations"]]],
    ["Reference", [["changelog", "Changelog"], ["support", "Support"]]]
  ];
  function renderNav() {
    $("[data-nav]").innerHTML = NAV.map(([g, items], gi) => `<div class="grp" data-grp="${gi}"><button type="button" aria-expanded="true" aria-controls="grp-${gi}">${g}${icon("i-chev")}</button><ul id="grp-${gi}">${items.map(([id, l]) => `<li><a href="#${id}" data-link="${id}">${l}</a></li>${g === "Core Resources" ? EP.filter((e) => e.res === id).map((e) => `<li><a href="#${e.id}" data-link="${e.id}" style="padding-left:18px"><span class="m ${e.m}">${e.m === "DELETE" ? "DEL" : e.m}</span>${e.t}</a></li>`).join("") : ""}`).join("")}</ul></div>`).join("");
  }
  $("[data-nav]").addEventListener("click", (e) => {
    const b = e.target.closest(".grp > button"); if (b) { const g = b.parentElement; const c = g.classList.toggle("closed"); b.setAttribute("aria-expanded", !c); return; }
    if (e.target.closest("a")) closeSide();
  });

  /* ---------- render all ---------- */
  function renderAll() {
    const y = scrollY;
    $("[data-content]").innerHTML = staticSections() + resourceSections() + webhookSections() + sdkSections() + changelogSection() + supportSection();
    renderNav(); spy(); scrollTo(0, y);
  }

  /* ---------- tabs + copy ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-lang-tab]");
    if (t) {
      LANG = t.dataset.langTab; store.set("tl-lang", LANG);
      $$("[data-tabs-for]").forEach((cb) => { const id = cb.dataset.tabsFor, ep = id === "auth" ? EP[1] : EP.find((x) => x.id === id); $$("[data-lang-tab]", cb).forEach((b) => b.setAttribute("aria-selected", b.dataset.langTab === LANG)); const c = $("code", cb); c.dataset.lang = langOf(LANG); c.innerHTML = hl(snippet(ep, LANG, pgVals(id)), langOf(LANG)); });
      return;
    }
    const c = e.target.closest("[data-copy]");
    if (c) {
      const code = c.closest(".cb").querySelector("code").textContent;
      const done = () => { c.classList.add("ok"); c.innerHTML = `${icon("i-check")}Copied`; setTimeout(() => { c.classList.remove("ok"); c.innerHTML = `${icon("i-copy")}Copy`; }, 1500); };
      try { navigator.clipboard.writeText(code).then(done, () => toast("Copy blocked — select the code and press Ctrl/Cmd+C")); } catch { toast("Copy blocked — select the code and press Ctrl/Cmd+C"); }
    }
  });

  /* ---------- playground (simulated sandbox) ---------- */
  const DB = { usr_123: USER, usr_124: { ...USER, id: "usr_124", email: "grace@example.com", name: "Grace Hopper", role: "member" }, prj_42: true, tsk_1: true };
  const calls = [];
  function pgVals(id) { const p = $(`[data-pg="${id}"]`); if (!p || p.hidden || !p.innerHTML) return {}; const v = {}; $$("[data-pf]", p).forEach((i) => (v[i.dataset.pf] = i.value)); return v; }
  function openPg(id) {
    const e = EP.find((x) => x.id === id), p = $(`[data-pg="${id}"]`);
    p.innerHTML = `<h4>Try it — sandbox</h4><p class="sub">Simulated responses generated in your browser. Use a test key (tl_test_…).</p><label>API key<input data-pf="__key" value="${esc(KEY === "YOUR_API_KEY" ? "tl_test_demo" : KEY)}" autocomplete="off" spellcheck="false"></label>${(e.p || []).map(([n, , , , ex]) => `<label>${n}<input data-pf="${n}" value="${esc(ex)}"></label>`).join("")}${(e.q || []).map(([n, , , , ex]) => `<label>${n}<input data-pf="${n}" value="${esc(ex)}" placeholder="optional"></label>`).join("")}${e.b ? `<label>body<textarea data-pf="__body" spellcheck="false">${esc(JSON.stringify(e.b, null, 2))}</textarea></label>` : ""}<div class="row"><button class="btn" type="button" data-send="${id}">${icon("i-play")}Send request</button><button class="btn-o" type="button" data-reset="${id}">Reset</button></div><div class="pg-out" data-out="${id}" aria-live="polite"></div>`;
    $$("[data-pf]", p).forEach((i) => i.addEventListener("input", () => refreshSnip(id)));
  }
  function refreshSnip(id) { const e = EP.find((x) => x.id === id); const c = $(`[data-snip="${id}"]`); if (c) c.innerHTML = hl(snippet(e, LANG, pgVals(id)), langOf(LANG)); }
  function simulate(e, v) {
    const now = Date.now(); while (calls.length && now - calls[0] > 60000) calls.shift(); calls.push(now);
    const remaining = 20 - calls.length;
    const hdrs = { "X-RateLimit-Limit": "20 (sandbox)", "X-RateLimit-Remaining": String(Math.max(0, remaining)), "Tasklane-Version": VERSION === "1" ? "1.9" : VERSION };
    const err = (s, code, message, extra = {}) => ({ status: s, headers: hdrs, body: { error: { code, message, ...extra, request_id: `req_${Math.random().toString(36).slice(2, 6)}` } } });
    if (remaining < 0) return err(429, "rate_limited", "Sandbox limit is 20 requests per minute.", {});
    if (!/^tl_test_\w+/.test(v.__key || "")) return err(401, "invalid_api_key", (v.__key || "").startsWith("tl_live_") ? "Live keys can't be used in the sandbox." : "No valid test API key provided.");
    for (const [n, , req] of e.p || []) { if (req && !v[n]) return err(400, "missing_parameter", `${n} is required`, { param: n }); }
    const idv = v.id ?? v.project_id ?? v.task_id;
    if (idv !== undefined && !DB[idv] && !(e.m === "POST")) return err(404, "resource_missing", `No such ${e.res.replace(/s$/, "")}: ${idv}`, { param: Object.keys(v).find((k) => v[k] === idv) });
    if (v.limit && !(Number(v.limit) >= 1 && Number(v.limit) <= 100)) return err(400, "invalid_parameter", "limit must be between 1 and 100", { param: "limit" });
    let body = {};
    if (e.b) { try { body = JSON.parse(v.__body || "{}"); } catch (x) { return err(400, "invalid_json", `Request body is not valid JSON: ${x.message}`); } for (const r of e.breq || []) if (!body[r]) return err(400, "missing_parameter", `${r} is required`, { param: r }); }
    if (e.m === "DELETE") { delete DB[idv]; return { status: 204, headers: hdrs, body: null }; }
    let out = e.resp(body);
    if (e.id === "get-user" && DB[idv] && DB[idv] !== true) out = DB[idv];
    if (e.id === "update-user" && DB[idv]) { DB[idv] = { ...(DB[idv] === true ? USER : DB[idv]), ...body }; out = DB[idv]; }
    if (e.id === "create-user") { out = { ...out, id: `usr_${Math.floor(200 + Math.random() * 700)}` }; DB[out.id] = out; }
    if (e.id === "list-users") { const all = Object.values(DB).filter((x) => x && x.email).filter((u) => !v.role || u.role === v.role); out = { data: all.slice(0, Number(v.limit || 20)), has_more: all.length > Number(v.limit || 20), next_cursor: all.length > Number(v.limit || 20) ? "cur_9f2c" : null }; }
    return { status: e.status || 200, headers: hdrs, body: out };
  }
  document.addEventListener("click", (ev) => {
    const t = ev.target.closest("[data-try]");
    if (t) { const id = t.dataset.try, p = $(`[data-pg="${id}"]`), open = p.hidden; p.hidden = !open; t.setAttribute("aria-expanded", open); if (open) { openPg(id); refreshSnip(id); $("input", p).focus(); } else refreshSnip(id); return; }
    const s = ev.target.closest("[data-send]");
    if (s) {
      const id = s.dataset.send, e = EP.find((x) => x.id === id), v = pgVals(id), out = $(`[data-out="${id}"]`);
      out.innerHTML = `<p class="sub">Sending ${e.m} ${esc(build(e, v).url)}…</p>`; s.disabled = true;
      setTimeout(() => {
        const r = simulate(e, v), ms = 80 + Math.floor(Math.random() * 120);
        out.innerHTML = `<div class="cb"><div class="cb-h"><span class="lbl"><span class="st${r.status >= 400 ? " e" : ""}">${r.status}</span> · ${ms} ms · simulated</span><button class="copy" type="button" data-copy>${icon("i-copy")}Copy</button></div><pre><code data-lang="json">${Object.entries(r.headers).map(([k, x]) => `<span class="t-c">${k}: ${esc(x)}</span>`).join("\n")}\n\n${r.body === null ? '<span class="t-c">(no content)</span>' : hl(JSON.stringify(r.body, null, 2), "json")}</code></pre></div>`;
        s.disabled = false;
      }, 250);
      return;
    }
    const rs = ev.target.closest("[data-reset]"); if (rs) { openPg(rs.dataset.reset); refreshSnip(rs.dataset.reset); return; }
    const repo = ev.target.closest("[data-repo]"); if (repo) { toast(`${repo.dataset.repo}: Tasklane is fictional, so this link isn't live in the demo.`); return; }
    const so = ev.target.closest("[data-soon]"); if (so) { ev.preventDefault(); toast(`${so.dataset.soon} — not part of this demo.`); return; }
    const st = ev.target.closest("[data-status], [data-statuspage]"); if (st) { ev.preventDefault(); statusDlg(); }
  });

  /* ---------- API key ---------- */
  function newKey() { const a = new Uint8Array(18); (crypto.getRandomValues ? crypto.getRandomValues(a) : a.forEach((_, i) => (a[i] = Math.random() * 256))); return "tl_test_" + [...a].map((b) => "abcdefghijklmnopqrstuvwxyz0123456789"[b % 36]).join(""); }
  $("[data-getkey]").addEventListener("click", () => {
    const k = KEY.startsWith("tl_test_") ? KEY : newKey();
    openDlg(`<h3>Your test API key</h3><p>Use this key with the sandbox. It works only in this demo and is stored in your browser.</p><div class="keybox"><input readonly value="${k}" aria-label="API key" data-keyval><button class="btn" type="button" data-copykey>${icon("i-copy")}<span>Copy</span></button></div><p class="note">Live keys (<code>tl_live_…</code>) are created in your dashboard and shown once. Keep them secret.</p><button class="btn" type="button" data-usekey>Use in examples &amp; playground</button>`);
    $("[data-copykey]", body).addEventListener("click", () => { try { navigator.clipboard.writeText(k).then(() => toast("Key copied"), () => { $("[data-keyval]", body).select(); }); } catch { $("[data-keyval]", body).select(); } });
    $("[data-usekey]", body).addEventListener("click", () => { KEY = k; store.set("tl-key", k); dlg.close(); renderAll(); toast("Examples now use your test key"); });
  });
  function statusDlg() { openDlg(`<h3>API Status: Operational</h3><ul class="svc">${[["REST API", "99.99%"], ["Webhooks", "99.98%"], ["OAuth", "100%"], ["File uploads", "99.97%"]].map(([n, u]) => `<li>${n}<span><b>Operational</b> · ${u} (90 days)</span></li>`).join("")}</ul><p class="sub" style="font-size:13px;color:var(--muted)">Sample status data for this demo.</p>`); }

  /* ---------- version ---------- */
  $("[data-version]").addEventListener("change", (e) => {
    VERSION = e.target.value; renderAll();
    const bn = $("[data-ver-banner]");
    if (VERSION === "2.1") bn.hidden = true;
    else { bn.hidden = false; bn.innerHTML = `You're viewing ${VERSION === "1" ? "deprecated <b>v1.x</b>" : "<b>v2.0</b>"} docs. <button type="button" data-latest>Switch to v2.1 (latest)</button>`; $("[data-latest]", bn).addEventListener("click", () => { $("[data-version]").value = "2.1"; $("[data-version]").dispatchEvent(new Event("change")); }); }
    toast(`Showing API ${VERSION === "1" ? "v1.x" : "v" + VERSION}`);
  });

  /* ---------- theme ---------- */
  const tb = $("[data-theme-btn]");
  const syncTheme = () => { const d = document.documentElement.dataset.theme === "dark"; tb.innerHTML = icon(d ? "i-sun" : "i-moon"); tb.setAttribute("aria-label", d ? "Switch to light mode" : "Switch to dark mode"); };
  tb.addEventListener("click", () => { const d = document.documentElement.dataset.theme === "dark"; if (d) delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = "dark"; store.set("tl-theme", d ? "light" : "dark"); syncTheme(); });
  syncTheme();

  /* ---------- search ---------- */
  const q = $("[data-q]"), res = $("[data-res]");
  let hits = [], act = -1;
  function index() {
    const items = [];
    NAV.forEach(([g, list]) => list.forEach(([id, l]) => items.push({ id, t: l, g, kw: "" })));
    EP.forEach((e) => items.push({ id: e.id, t: `${e.t}`, g: `${e.m} ${vp()}${e.path}`, kw: `${e.d} ${e.path} ${(e.q || []).map((x) => x[0]).join(" ")}` }));
    EVENTS.forEach((ev) => items.push({ id: "webhooks-events", t: ev, g: "Webhook event", kw: "" }));
    ERRORS.forEach(([c, n]) => items.push({ id: "errors", t: `${c} ${n}`, g: "Error code", kw: "" }));
    return items;
  }
  function renderSearch() {
    const s = q.value.trim().toLowerCase();
    if (!s) { res.hidden = true; q.setAttribute("aria-expanded", "false"); return; }
    hits = index().filter((x) => `${x.t} ${x.g} ${x.kw}`.toLowerCase().includes(s)).slice(0, 10);
    const mk = (t) => { const i = t.toLowerCase().indexOf(s); return i < 0 ? esc(t) : `${esc(t.slice(0, i))}<mark>${esc(t.slice(i, i + s.length))}</mark>${esc(t.slice(i + s.length))}`; };
    res.innerHTML = hits.length ? hits.map((h, i) => `<li role="option"><a href="#${h.id}" class="${i === act ? "act" : ""}" data-hit="${i}">${mk(h.t)}<small>${mk(h.g)}</small></a></li>`).join("") : `<li class="none">No results for “${esc(q.value.trim())}”</li>`;
    res.hidden = false; q.setAttribute("aria-expanded", "true");
  }
  q.addEventListener("input", () => { act = -1; renderSearch(); });
  q.addEventListener("keydown", (e) => {
    if (res.hidden) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); act = (act + (e.key === "ArrowDown" ? 1 : -1) + hits.length) % hits.length; renderSearch(); }
    if (e.key === "Enter" && hits.length) { e.preventDefault(); go(hits[Math.max(0, act)].id); }
    if (e.key === "Escape") { res.hidden = true; q.blur(); }
  });
  res.addEventListener("click", (e) => { const a = e.target.closest("[data-hit]"); if (!a) return; e.preventDefault(); go(hits[a.dataset.hit].id); });
  function go(id) { res.hidden = true; q.value = ""; q.setAttribute("aria-expanded", "false"); const el = document.getElementById(id); if (el) { el.scrollIntoView(); history.replaceState(null, "", `#${id}`); } }
  document.addEventListener("click", (e) => { if (!e.target.closest("[data-search]")) res.hidden = true; });
  document.addEventListener("keydown", (e) => { if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName) && !dlg.open) { e.preventDefault(); q.focus(); } if (e.key === "Escape") closeSide(); });

  /* ---------- scroll spy ---------- */
  let spyIO;
  function spy() {
    if (spyIO) spyIO.disconnect();
    if (!("IntersectionObserver" in window)) return;
    spyIO = new IntersectionObserver((es) => {
      const vis = es.filter((x) => x.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (!vis) return;
      const id = vis.target.dataset.anchor;
      $$("[data-link]").forEach((a) => { const on = a.dataset.link === id; a.classList.toggle("on", on); if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
    }, { rootMargin: "-70px 0px -65% 0px" });
    $$("[data-anchor]").forEach((s) => spyIO.observe(s));
  }

  /* ---------- mobile sidebar ---------- */
  const side = $("[data-side]"), scrim = $("[data-scrim]"), burger = $("[data-burger]");
  function closeSide() { if (!side.classList.contains("open")) return; side.classList.remove("open"); scrim.hidden = true; burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open navigation"); }
  burger.addEventListener("click", () => { const open = !side.classList.contains("open"); side.classList.toggle("open", open); scrim.hidden = !open; burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Close navigation" : "Open navigation"); if (open) $("a", side).focus(); });
  scrim.addEventListener("click", closeSide);

  /* ---------- dialog + toast ---------- */
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  function openDlg(html) { body.innerHTML = html; if (!dlg.open) dlg.showModal(); const f = $(".btn, input", body); (f || $("[data-close]")).focus(); }
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => (body.innerHTML = ""));
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 2800); }

  renderAll();
  if (location.hash) { const el = document.getElementById(location.hash.slice(1)); if (el) el.scrollIntoView(); }
})();
