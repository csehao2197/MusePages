(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = () => Math.random().toString(36).slice(2, 10);
  const KEY = "lumen-v1";
  const ls = { get(d) { try { const v = localStorage.getItem(KEY); return v ? JSON.parse(v) : d; } catch { return d; } }, set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* full */ } } };
  const ss = { get(k) { try { return sessionStorage.getItem(k) || ""; } catch { return ""; } }, set(k, v) { try { if (v) sessionStorage.setItem(k, v); else sessionStorage.removeItem(k); } catch { /* ignore */ } } };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- demo assistant (local stand-in for Gemini) ---------- */
  const KB = [
    { re: /closure/i, topic: "closures", a: "A **closure** is a function that remembers the variables from the scope where it was created, even after that scope has finished running.\n\n```js\nfunction makeCounter() {\n  let count = 0; // private to the closure\n  return () => ++count;\n}\nconst next = makeCounter();\nnext(); // 1\nnext(); // 2\n```\n\n### Why it matters\n- **Private state** without classes\n- **Callbacks** that still see the values they need\n- **Factories** like `makeCounter` above", more: "A classic gotcha: closures capture *variables*, not values. With `var` in a loop, every callback sees the final value:\n\n```js\nfor (var i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 3, 3, 3\nfor (let i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 0, 1, 2\n```\n\n`let` creates a fresh binding per iteration, so each closure gets its own `i`." },
    { re: /recurs/i, topic: "recursion", a: "**Recursion** is when a function solves a problem by calling itself on a smaller piece of it. Every recursive function needs:\n\n1. A **base case** that stops the calls\n2. A **recursive step** that moves toward the base case\n\n```python\ndef factorial(n):\n    if n <= 1:          # base case\n        return 1\n    return n * factorial(n - 1)\n```", more: "Deep recursion can overflow the call stack. For very large inputs, rewrite it as a loop or use an explicit stack. Memoization helps when the same sub-problems repeat, as in Fibonacci." },
    { re: /\b(rest|http method|api endpoint)/i, topic: "REST", a: "A **REST API** exposes resources at URLs and uses HTTP methods to act on them:\n\n- `GET /posts` lists posts\n- `POST /posts` creates one\n- `PATCH /posts/42` updates part of post 42\n- `DELETE /posts/42` removes it\n\nResponses use status codes: **200** OK, **201** Created, **400** bad input, **401** not signed in, **404** not found, **429** too many requests.", more: "Good REST design: plural nouns for collections, no verbs in paths, consistent error JSON like `{ \"error\": \"message\" }`, and pagination with `?limit=` and `?cursor=` instead of returning everything." },
    { re: /app router|next\.?js/i, topic: "Next.js App Router", a: "The **Next.js App Router** builds routes from folders in `app/`:\n\n- `app/page.tsx` is `/`\n- `app/chat/page.tsx` is `/chat`\n- `app/api/chat/route.ts` is an API endpoint (export `POST`)\n- `layout.tsx` wraps the pages below it\n\nComponents are **Server Components** by default; add `\"use client\"` for state, effects and event handlers.", more: "A chat endpoint in the App Router looks like this:\n\n```js\n// app/api/chat/route.ts\nexport async function POST(req) {\n  const { message, history } = await req.json();\n  const reply = await callModel(message, history);\n  return Response.json({ message: reply, role: \"assistant\" });\n}\n```\n\nKeep the API key in `.env.local` and read it on the server only." },
    { re: /generic/i, topic: "TypeScript generics", a: "**Generics** let a function or type work with many types while keeping them connected:\n\n```js\nfunction first<T>(items: T[]): T | undefined {\n  return items[0];\n}\nfirst([1, 2, 3]);     // number\nfirst([\"a\", \"b\"]);    // string\n```\n\nThe `T` is a type parameter, filled in from the argument.", more: "Constrain a generic with `extends` when you need certain properties:\n\n```js\nfunction longest<T extends { length: number }>(a: T, b: T): T {\n  return a.length >= b.length ? a : b;\n}\n```" },
    { re: /grid|flexbox|flex box/i, topic: "CSS Grid vs Flexbox", a: "**Flexbox** lays things out in one direction (a row *or* a column). **Grid** lays things out in two (rows *and* columns).\n\n- Navigation bar, button group, centering one thing: **Flexbox**\n- Page layout, card galleries, dashboards: **Grid**\n\n```css\n.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }\n```", more: "They combine well: use Grid for the page skeleton and Flexbox inside each component. `minmax(0, 1fr)` stops long content from stretching grid columns." },
    { re: /rate limit/i, topic: "rate limiting", a: "**Rate limiting** caps how many requests a client can make in a time window, protecting your API and your model budget.\n\n- **Fixed window**: count per minute; simple, bursty at edges\n- **Sliding window**: smoother, slightly more bookkeeping\n- **Token bucket**: allows short bursts, then a steady rate\n\nReturn **429 Too Many Requests** with a `Retry-After` header so clients can back off.", more: "In a single Node process an in-memory `Map` of timestamps works. Across several servers, keep counters in Redis so every instance sees the same totals." },
    { re: /big.?o|time complexity/i, topic: "Big-O", a: "**Big-O** describes how running time grows as input grows:\n\n- `O(1)` constant: array index lookup\n- `O(log n)`: binary search\n- `O(n)`: one loop over the data\n- `O(n log n)`: good sorting algorithms\n- `O(n²)`: a loop inside a loop", more: "Big-O ignores constants, so an `O(n)` loop that does heavy work can still be slower than an `O(n log n)` one for small inputs. Measure when it matters." },
    { re: /rebase|merge/i, topic: "git rebase vs merge", a: "Both combine branches:\n\n- **Merge** keeps history as it happened and adds a merge commit.\n- **Rebase** replays your commits on top of the target, giving a straight line.\n\nRule of thumb: rebase your *own* local branch to tidy it; merge shared branches. Never rebase commits others have already pulled.", more: "Interactive rebase can squash \"fix typo\" commits before you open a pull request. If a rebase goes wrong, `git rebase --abort` returns you to where you started." },
    { re: /useeffect|react hook|hooks/i, topic: "React useEffect", a: "`useEffect` runs side effects after React renders: fetching, subscriptions, timers.\n\n```js\nuseEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id); // cleanup\n}, []); // run once on mount\n```\n\nThe dependency array controls when it re-runs.", more: "Many effects aren't needed: derive values during render instead of syncing them with `useEffect`, and handle user actions in event handlers. Effects are for syncing with things *outside* React." },
  ];
  const CODE = [
    { re: /reverse.*string|string.*reverse/i, js: "```js\nconst reverse = (s) => [...s].reverse().join(\"\");\nreverse(\"hello\"); // \"olleh\"\n```\n\nSpreading into an array (`[...s]`) handles emoji and other multi-unit characters better than `split(\"\")`.", py: "```python\ndef reverse(s: str) -> str:\n    return s[::-1]\n\nreverse(\"hello\")  # 'olleh'\n```\n\nThe slice `[::-1]` walks the string backwards." },
    { re: /fizz ?buzz/i, js: "```js\nfor (let i = 1; i <= 15; i++) {\n  const out = (i % 3 ? \"\" : \"Fizz\") + (i % 5 ? \"\" : \"Buzz\");\n  console.log(out || i);\n}\n```", py: "```python\nfor i in range(1, 16):\n    out = (\"\" if i % 3 else \"Fizz\") + (\"\" if i % 5 else \"Buzz\")\n    print(out or i)\n```" },
    { re: /debounce/i, js: "```js\nfunction debounce(fn, wait = 300) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), wait);\n  };\n}\n\nconst onSearch = debounce((q) => fetchResults(q), 250);\n```\n\nEach call resets the timer, so `fn` runs only after typing pauses for `wait` ms.", py: "```python\nimport threading\n\ndef debounce(wait):\n    def deco(fn):\n        timer = None\n        def wrapped(*a, **k):\n            nonlocal timer\n            if timer: timer.cancel()\n            timer = threading.Timer(wait, fn, a, k)\n            timer.start()\n        return wrapped\n    return deco\n```" },
    { re: /fetch.*json|call an api|http request/i, js: "```js\nasync function getJSON(url) {\n  const res = await fetch(url);\n  if (!res.ok) throw new Error(`HTTP ${res.status}`);\n  return res.json();\n}\n```\n\nAlways check `res.ok`: `fetch` only rejects on network failures, not on 404 or 500.", py: "```python\nimport requests\n\ndef get_json(url):\n    r = requests.get(url, timeout=10)\n    r.raise_for_status()\n    return r.json()\n```" },
    { re: /sort.*(array|list).*object|sort by/i, js: "```js\nconst people = [{ name: \"Ana\", age: 31 }, { name: \"Ben\", age: 25 }];\npeople.sort((a, b) => a.age - b.age);          // by number\npeople.sort((a, b) => a.name.localeCompare(b.name)); // by text\n```", py: "```python\npeople = [{\"name\": \"Ana\", \"age\": 31}, {\"name\": \"Ben\", \"age\": 25}]\npeople.sort(key=lambda p: p[\"age\"])\n```" },
  ];
  const JOKES = ["Why do programmers prefer dark mode? Because light attracts bugs.", "There are 10 kinds of people: those who understand binary and those who don't.", "I told my computer I needed a break, and it said: \"No problem, I'll go to sleep.\""];
  function calc(expr) {
    const pct = expr.match(/^\s*([\d.]+)\s*%\s*of\s*([\d.]+)\s*$/i); if (pct) return (+pct[1] / 100) * +pct[2];
    if (!/^[\d\s+\-*/().%^]+$/.test(expr) || !/\d/.test(expr) || !/[+\-*/%^]/.test(expr)) return null;
    try { const v = Function(`"use strict";return (${expr.replace(/\^/g, "**")})`)(); return typeof v === "number" && isFinite(v) ? v : null; } catch { return null; }
  }
  function demoReply(history, text) {
    const t = text.trim(), l = t.toLowerCase(), last = [...history].reverse().find((m) => m.role === "assistant" && m.topic);
    const mathQ = t.replace(/^(what('?s| is)|calculate|compute)\s+/i, "").replace(/[?=]\s*$/, "");
    const v = calc(mathQ); if (v != null) return { text: `**${mathQ.trim()} = ${+v.toFixed(10)}**` };
    if (/^(hi|hey|hello|yo|good (morning|evening|afternoon))\b/.test(l)) return { text: "Hi! What are we working on today? I can explain a concept, write a small snippet, or do some quick math." };
    if (/^(thanks|thank you|thx|cheers)/.test(l)) return { text: "Anytime. Ask a follow-up whenever you like." };
    if (/what can you do|help|who are you/.test(l)) return { text: "I'm Lumen's **demo assistant**, running entirely in your browser. I can:\n\n- Explain topics like closures, recursion, REST APIs, the Next.js App Router, TypeScript generics, CSS Grid, rate limiting, Big-O, git rebase and React effects\n- Write snippets: reverse a string, FizzBuzz, debounce, fetching JSON, sorting objects (JavaScript or Python)\n- Do arithmetic like `(12.5 * 4) / 3` or `15% of 80`\n- Summarize text you paste after `summarize:`\n- Remember the topic, so “tell me more” works\n\nFor open-ended answers, add your Gemini API key in **Settings**." };
    if (/\b(time|date|day is it|today)\b/.test(l) && /what|which|tell/.test(l)) return { text: `It's **${new Date().toLocaleString(undefined, { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" })}** on your device.` };
    if (/joke/.test(l)) return { text: JOKES[history.length % JOKES.length] };
    const sum = t.match(/^(summari[sz]e|tl;?dr)[:\s]+([\s\S]{20,})/i);
    if (sum) { const body = sum[2].trim(), sents = body.split(/(?<=[.!?])\s+/), words = body.toLowerCase().match(/\b[a-z]{5,}\b/g) || [], freq = {}; words.forEach((w) => (freq[w] = (freq[w] || 0) + 1)); const keys = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([w]) => w); return { text: `### Summary\n${sents.slice(0, 2).join(" ")}\n\n**Key terms:** ${keys.map((k) => `\`${k}\``).join(", ") || "none found"}\n\n*${sents.length} sentence${sents.length === 1 ? "" : "s"}, ${body.split(/\s+/).length} words in the original.*` }; }
    if (/^(tell me more|more|go on|continue|explain (that )?(more|further)|another example|elaborate)/.test(l)) { if (last) { const k = KB.find((x) => x.topic === last.topic); if (k) return { text: k.more, topic: k.topic }; } return { text: "Happy to go deeper. What topic should I expand on?" }; }
    const code = CODE.find((c) => c.re.test(t)); if (code) return { text: `${/python/i.test(t) ? "Here's a Python version:" : "Here's a JavaScript version:"}\n\n${/python/i.test(t) ? code.py : code.js}` };
    const k = KB.find((x) => x.re.test(t)); if (k) return { text: k.a, topic: k.topic };
    return { text: `I'm in **demo mode**, so I can only answer a set of topics offline. I couldn't match “${t.length > 60 ? `${t.slice(0, 60)}…` : t}”.\n\nTry “explain closures”, “debounce in JavaScript”, “what is 18% of 250”, or ask “what can you do”. For full answers, add a Gemini API key in **Settings**.` };
  }

  /* ---------- markdown (escaped first: XSS-safe) ---------- */
  const KW = /\b(const|let|var|function|return|if|else|for|while|def|import|from|class|new|await|async|in|of|try|catch|throw|export|nonlocal|lambda|print|True|False|None|null|undefined|true|false)\b/;
  function hl(code, lang) {
    const re = new RegExp(`(${lang === "python" ? "#[^\\n]*" : "\\/\\/[^\\n]*"})|("(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*'|\`[^\`]*\`)|${KW.source}|\\b(\\d+(?:\\.\\d+)?)\\b`, "g");
    let out = "", i = 0, m;
    while ((m = re.exec(code))) { out += esc(code.slice(i, m.index)); const cls = m[1] ? "c" : m[2] ? "s" : m[3] ? "k" : "n"; out += `<span class="${cls}">${esc(m[0])}</span>`; i = m.index + m[0].length; if (!m[0].length) re.lastIndex++; }
    return out + esc(code.slice(i));
  }
  const inline = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  function md(src) {
    const out = [], lines = src.split("\n"); let i = 0;
    while (i < lines.length) {
      const l = lines[i];
      const f = l.match(/^```(\w*)/);
      if (f) { const body = []; i++; while (i < lines.length && !lines[i].startsWith("```")) body.push(lines[i++]); i++; const lang = { py: "python", js: "javascript" }[f[1]] || f[1] || "text"; out.push(`<div class="pre"><div class="pre-h"><span>${esc(lang)}</span><button type="button" class="ib" style="width:32px;height:32px" data-copycode aria-label="Copy code">${icon("i-copy")}</button></div><pre><code>${hl(body.join("\n"), lang)}</code></pre></div>`); continue; }
      if (!l.trim()) { i++; continue; }
      if (l.startsWith("### ")) { out.push(`<h3>${inline(l.slice(4))}</h3>`); i++; continue; }
      if (/^[-*] /.test(l)) { const b = []; while (i < lines.length && /^[-*] /.test(lines[i])) b.push(lines[i++].slice(2)); out.push(`<ul>${b.map((x) => `<li>${inline(x)}</li>`).join("")}</ul>`); continue; }
      if (/^\d+\. /.test(l)) { const b = []; while (i < lines.length && /^\d+\. /.test(lines[i])) b.push(lines[i++].replace(/^\d+\. /, "")); out.push(`<ol>${b.map((x) => `<li>${inline(x)}</li>`).join("")}</ol>`); continue; }
      const b = []; while (i < lines.length && lines[i].trim() && !/^(```|### |[-*] |\d+\. )/.test(lines[i])) b.push(lines[i++]); out.push(`<p>${b.map(inline).join("<br>")}</p>`);
    }
    return out.join("");
  }

  /* ---------- state ---------- */
  const seed = () => {
    const now = Date.now(), mk = (title, ago, q) => { const r = demoReply([], q); return { id: uid(), title, created: now - ago, updated: now - ago, msgs: [{ role: "user", content: q, at: now - ago }, { role: "assistant", content: r.text, topic: r.topic, at: now - ago + 2400 }] }; };
    return { convs: [mk("Explain closures in JavaScript", 864e5 + 3600e3, "Explain closures in JavaScript"), mk("Debounce helper", 3 * 864e5, "Write a debounce function"), mk("Grid or flexbox?", 9 * 864e5, "When should I use CSS grid vs flexbox?")], settings: { engine: "demo", model: "gemini-2.0-flash", temp: 0.7, ctx: 20 } };
  };
  let db = ls.get(null); if (!db || !Array.isArray(db.convs)) db = seed();
  db.settings ||= { engine: "demo", model: "gemini-2.0-flash", temp: 0.7, ctx: 20 };
  const save = () => ls.set(db);
  let cur = null, busy = false, abort = null, simNext = "";
  const stamps = [];
  const log = $("[data-log]"), input = $("[data-input]"), sendBtn = $("[data-send]"), stopBtn = $("[data-stop]");

  /* ---------- rendering ---------- */
  const fmtTime = (t) => new Date(t).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const SUGS = [["i-book", "Explain closures", "with a short example"], ["i-code", "Write a debounce function", "in JavaScript"], ["i-calc", "What is 18% of 250?", "quick math"], ["i-pen", "What can you do?", "see everything the demo knows"]];
  function msgHTML(m, idx) {
    if (m.role === "user") return `<div class="msg user" data-i="${idx}"><span class="av" aria-hidden="true">You</span><div><div class="bubble">${esc(m.content)}</div><div class="meta"><time datetime="${new Date(m.at).toISOString()}" title="${new Date(m.at).toLocaleString()}">${fmtTime(m.at)}</time></div></div></div>`;
    if (m.role === "error") return `<div class="msg ai err" data-i="${idx}"><span class="av" aria-hidden="true"></span><div><div class="bubble" role="alert"><b>${esc(m.title)}</b><br>${esc(m.content)}<br><button type="button" class="retry" data-retry>${icon("i-retry")}Try again</button></div><div class="meta"><time>${fmtTime(m.at)}</time></div></div></div>`;
    return `<div class="msg ai" data-i="${idx}"><span class="av" aria-hidden="true"></span><div style="min-width:0"><div class="bubble md">${md(m.content)}${m.stopped ? `<p style="color:var(--dim);font-size:13px">Stopped.</p>` : ""}</div><div class="meta"><time datetime="${new Date(m.at).toISOString()}" title="${new Date(m.at).toLocaleString()}">${fmtTime(m.at)}</time>${m.engine ? `<span>· ${esc(m.engine)}</span>` : ""}<button type="button" data-copy="${idx}" aria-label="Copy response">${icon("i-copy")}Copy</button></div></div></div>`;
  }
  function renderLog() {
    if (!cur || !cur.msgs.length) {
      log.innerHTML = `<div class="welcome"><div class="orb" aria-hidden="true"></div><h2>What's on your mind?</h2><p>Ask a question, paste some code, or pick a starting point. ${db.settings.engine === "demo" ? "You're in demo mode. Add a Gemini key in Settings for open-ended answers." : `Connected to ${esc(db.settings.model)}.`}</p><div class="sugs">${SUGS.map(([ic, b, s]) => `<button type="button" class="sug" data-sug="${esc(b)}">${icon(ic)}<b>${esc(b)}</b><span>${esc(s)}</span></button>`).join("")}</div></div>`;
      return;
    }
    log.innerHTML = `<div class="col" data-col>${cur.msgs.map(msgHTML).join("")}</div>`;
    toBottom(true);
  }
  function groupOf(t) { const d = new Date(); d.setHours(0, 0, 0, 0); const day = 864e5; return t >= +d ? "Today" : t >= +d - day ? "Yesterday" : t >= +d - 7 * day ? "Previous 7 days" : "Older"; }
  function renderConvs() {
    const q = $("[data-search]").value.trim().toLowerCase();
    const list = db.convs.filter((c) => !q || c.title.toLowerCase().includes(q) || c.msgs.some((m) => m.content.toLowerCase().includes(q))).sort((a, b) => b.updated - a.updated);
    let html = "", g = "";
    list.forEach((c) => { const gg = groupOf(c.updated); if (gg !== g) { html += `<h2>${gg}</h2>`; g = gg; } html += `<div class="conv"><a href="#c/${c.id}" ${cur?.id === c.id ? 'aria-current="page"' : ""}>${icon("i-msg")}<span>${esc(c.title)}</span></a><button type="button" class="ib del" data-delconv="${c.id}" aria-label="Delete chat: ${esc(c.title)}">${icon("i-trash")}</button></div>`; });
    $("[data-convs]").innerHTML = html || `<p class="noconv">${q ? "No chats match your search." : "No chats yet."}</p>`;
  }
  function renderMode() { const s = db.settings, b = $("[data-modebadge]"); b.className = `mode${s.engine === "demo" ? " demo" : ""}`; b.innerHTML = `<i></i>${s.engine === "demo" ? "Demo assistant" : esc(s.model)}`; }
  function open(id) {
    stop(); cur = db.convs.find((c) => c.id === id) || null;
    $("[data-title]").textContent = cur ? cur.title : "New chat";
    document.title = cur ? `${cur.title} — Lumen` : "Lumen — Dark Mode AI Chat with Gemini";
    renderLog(); renderConvs(); closeSide(); updateSend();
  }
  function route() { const m = location.hash.match(/^#c\/(\w+)/); open(m ? m[1] : null); }
  addEventListener("hashchange", route);

  /* ---------- scrolling ---------- */
  const nearBottom = () => log.scrollHeight - log.scrollTop - log.clientHeight < 140;
  function toBottom(force) { if (force || nearBottom()) { log.style.scrollBehavior = "auto"; log.scrollTop = log.scrollHeight; log.style.scrollBehavior = ""; } }
  log.addEventListener("scroll", () => { $("[data-jump]").hidden = nearBottom() || !cur?.msgs.length; });
  $("[data-jump]").addEventListener("click", () => { log.scrollTo({ top: log.scrollHeight, behavior: reduce ? "auto" : "smooth" }); });

  /* ---------- composer ---------- */
  function autosize() { input.style.height = "auto"; input.style.height = `${Math.min(120, input.scrollHeight)}px`; }
  function updateSend() {
    sendBtn.disabled = busy || !input.value.trim(); input.disabled = busy; sendBtn.hidden = busy; stopBtn.hidden = !busy;
    const n = input.value.length, c = $("[data-count]"); c.textContent = n > 3000 ? `${n.toLocaleString()} / 4,000` : ""; c.className = n > 3800 ? "warn" : "";
  }
  input.addEventListener("input", () => { autosize(); updateSend(); });
  input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); submit(); } });
  $("[data-form]").addEventListener("submit", (e) => { e.preventDefault(); submit(); });
  function submit() { const text = input.value.trim(); if (!text || busy) return; input.value = ""; autosize(); send(text); }

  /* ---------- send / receive ---------- */
  const ERR = { network: ["Network error", "Couldn't reach the server. Check your connection and try again."], key: ["Invalid API key", "The Gemini API rejected the key. Check it in Settings, or switch to the demo assistant."], rate: ["Too many requests", "You're sending messages faster than the limit (15 per minute). Wait a moment and try again."], server: ["The model had a problem", "The API returned an error. Try again in a few seconds."], empty: ["No answer", "The model returned an empty response, possibly blocked by safety filters. Try rephrasing."] };
  function send(text, isRetry) {
    if (!cur) { cur = { id: uid(), title: text.replace(/\s+/g, " ").slice(0, 48) + (text.length > 48 ? "…" : ""), created: Date.now(), updated: Date.now(), msgs: [] }; db.convs.push(cur); history.replaceState(null, "", `#c/${cur.id}`); $("[data-title]").textContent = cur.title; document.title = `${cur.title} — Lumen`; renderLog(); }
    if (!isRetry) cur.msgs.push({ role: "user", content: text, at: Date.now() });
    cur.updated = Date.now(); save(); renderConvs();
    if (!$("[data-col]")) renderLog(); else if (!isRetry) $("[data-col]").insertAdjacentHTML("beforeend", msgHTML(cur.msgs.at(-1), cur.msgs.length - 1));
    busy = true; updateSend();
    $("[data-col]").insertAdjacentHTML("beforeend", `<div class="msg ai" data-pending><span class="av" aria-hidden="true"></span><div><div class="bubble"><span class="typing" role="status" aria-label="Lumen is thinking"><i></i><i></i><i></i></span></div></div></div>`);
    toBottom(true);
    const conv = cur, ctrl = new AbortController(); abort = ctrl;
    const ctx = conv.msgs.filter((m) => m.role !== "error").slice(-db.settings.ctx);
    const now = Date.now(); while (stamps.length && now - stamps[0] > 60000) stamps.shift();
    let job;
    if (!navigator.onLine || simNext === "network") job = delay(500, ctrl).then(() => { throw { kind: "network" }; });
    else if (simNext === "key") job = delay(500, ctrl).then(() => { throw { kind: "key" }; });
    else if (simNext === "rate" || stamps.length >= 15) job = delay(400, ctrl).then(() => { throw { kind: "rate" }; });
    else if (db.settings.engine === "gemini") job = gemini(ctx, ctrl.signal);
    else job = delay(600 + Math.min(900, text.length * 6), ctrl).then(() => demoReply(ctx.slice(0, -1), text));
    simNext = ""; stamps.push(now);
    job.then((r) => stream(conv, r, ctrl)).catch((e) => {
      if (ctrl.signal.aborted) return;
      if (e && e.kind === undefined) console.warn("Chat request failed:", e);
      const [title, content] = ERR[e?.kind] || ERR.server;
      conv.msgs.push({ role: "error", title, content, at: Date.now(), kind: e?.kind || "server" }); save(); finish(conv);
    });
  }
  const delay = (ms, ctrl) => new Promise((res, rej) => { const t = setTimeout(res, ms); ctrl.signal.addEventListener("abort", () => { clearTimeout(t); rej({ kind: "aborted" }); }); });
  async function gemini(ctx, signal) {
    const key = ss.get("lumen-key"); if (!key) throw { kind: "key" };
    const s = db.settings;
    let res;
    try {
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(s.model)}:generateContent`, { method: "POST", signal, headers: { "Content-Type": "application/json", "x-goog-api-key": key }, body: JSON.stringify({ contents: ctx.map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] })), generationConfig: { temperature: +s.temp, maxOutputTokens: 2048 } }) });
    } catch (e) { if (signal.aborted) throw e; throw { kind: "network" }; }
    if (!res.ok) { console.warn("Gemini API error", res.status); throw { kind: res.status === 429 ? "rate" : [400, 401, 403].includes(res.status) ? "key" : "server" }; }
    const j = await res.json(), text = j.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
    if (!text) throw { kind: "empty" };
    return { text };
  }
  function stream(conv, r, ctrl) {
    const pend = $("[data-pending]"), m = { role: "assistant", content: r.text, topic: r.topic, at: Date.now(), engine: db.settings.engine === "demo" ? "demo" : db.settings.model };
    if (!pend || conv !== cur || reduce) { conv.msgs.push(m); save(); finish(conv); return; }
    const bubble = $(".bubble", pend); let n = 0;
    const step = () => {
      if (ctrl.signal.aborted) { m.content = r.text.slice(0, n); m.stopped = true; conv.msgs.push(m); save(); finish(conv); return; }
      n = Math.min(r.text.length, n + Math.max(4, Math.round(r.text.length / 70)));
      bubble.classList.add("md"); bubble.innerHTML = md(r.text.slice(0, n)); bubble.lastElementChild?.classList.add("cursor"); toBottom();
      if (n < r.text.length) abort.timer = setTimeout(step, 18); else { conv.msgs.push(m); save(); finish(conv); }
    };
    abort.stepper = step; step();
  }
  function finish(conv) { busy = false; abort = null; conv.updated = Date.now(); save(); if (conv === cur) { renderLog(); input.focus(); } renderConvs(); updateSend(); }
  function stop() { if (!abort) return; const a = abort; clearTimeout(a.timer); a.abort(); if (a.stepper) a.stepper(); else { busy = false; abort = null; $("[data-pending]")?.remove(); updateSend(); } }
  stopBtn.addEventListener("click", stop);

  /* ---------- clicks ---------- */
  log.addEventListener("click", async (e) => {
    const s = e.target.closest("[data-sug]"); if (s) { send(s.dataset.sug); return; }
    const r = e.target.closest("[data-retry]"); if (r && !busy) { const i = +r.closest("[data-i]").dataset.i; cur.msgs.splice(i, 1); save(); renderLog(); const lastUser = [...cur.msgs].reverse().find((m) => m.role === "user"); if (lastUser) send(lastUser.content, true); return; }
    const c = e.target.closest("[data-copy]"), cc = e.target.closest("[data-copycode]");
    if (c || cc) { const text = c ? cur.msgs[+c.dataset.copy].content : cc.closest(".pre").querySelector("code").textContent; try { await navigator.clipboard.writeText(text); const b = c || cc; const old = b.innerHTML; b.innerHTML = c ? `${icon("i-check")}Copied` : icon("i-check"); setTimeout(() => (b.innerHTML = old), 1500); } catch { toast("Copy failed. Select the text instead"); } }
  });
  $("[data-new]").addEventListener("click", newChat);
  function newChat() { if (location.hash) location.hash = ""; else open(null); input.focus(); }
  $("[data-convs]").addEventListener("click", (e) => {
    const d = e.target.closest("[data-delconv]"); if (!d) return;
    const c = db.convs.find((x) => x.id === d.dataset.delconv); if (!confirm(`Delete “${c.title}”?`)) return;
    db.convs = db.convs.filter((x) => x !== c); save(); toast("Chat deleted");
    if (cur?.id === c.id) newChat(); else renderConvs();
  });
  $("[data-search]").addEventListener("input", renderConvs);

  /* ---------- sidebar (mobile) ---------- */
  const side = $("[data-side]"), scrim = $("[data-scrim]");
  function openSide() { side.classList.add("open"); scrim.hidden = false; $("[data-openside]").setAttribute("aria-expanded", "true"); $("[data-new]").focus(); }
  function closeSide() { if (!side.classList.contains("open")) return; side.classList.remove("open"); scrim.hidden = true; $("[data-openside]").setAttribute("aria-expanded", "false"); }
  $("[data-openside]").addEventListener("click", openSide);
  $("[data-closeside]").addEventListener("click", closeSide);
  scrim.addEventListener("click", closeSide);

  /* ---------- settings ---------- */
  const setDlg = $("[data-setdlg]"), sf = $("[data-setform]");
  function openSettings() {
    const s = db.settings; sf.engine.value = s.engine; sf.model.value = s.model; sf.temp.value = s.temp; $("[data-tempout]").textContent = s.temp; sf.ctx.value = String(s.ctx); sf.key.value = ss.get("lumen-key"); sf.sim.value = simNext; $("[data-seterr]").textContent = "";
    $("[data-gem]").hidden = s.engine !== "gemini"; setDlg.showModal();
  }
  $("[data-settings]").addEventListener("click", openSettings);
  sf.addEventListener("change", (e) => { if (e.target.name === "engine") $("[data-gem]").hidden = sf.engine.value !== "gemini"; });
  sf.temp.addEventListener("input", () => ($("[data-tempout]").textContent = sf.temp.value));
  sf.addEventListener("submit", (e) => {
    e.preventDefault();
    const engine = sf.engine.value, key = sf.key.value.trim();
    if (engine === "gemini" && !key) { $("[data-seterr]").textContent = "Enter your Gemini API key, or choose the demo assistant."; sf.key.focus(); return; }
    if (engine === "gemini" && !/^[\w-]{20,}$/.test(key)) { $("[data-seterr]").textContent = "That doesn't look like an API key (letters, numbers, - and _ only)."; return; }
    Object.assign(db.settings, { engine, model: sf.model.value, temp: +sf.temp.value, ctx: +sf.ctx.value }); ss.set("lumen-key", engine === "gemini" ? key : ""); simNext = sf.sim.value; save();
    setDlg.close(); renderMode(); if (!cur?.msgs.length) renderLog(); toast(simNext ? "Settings saved. The next message will simulate an error" : "Settings saved");
  });
  $("[data-clearall]").addEventListener("click", () => { if (!confirm("Delete all chats? This can't be undone.")) return; db.convs = []; save(); setDlg.close(); toast("All chats deleted"); newChat(); renderConvs(); });
  $$("[data-close]").forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));
  $$("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));
  const keyDlg = $("[data-keydlg]");
  $("[data-keys]").addEventListener("click", () => keyDlg.showModal());

  /* ---------- keyboard ---------- */
  document.addEventListener("keydown", (e) => {
    if ($$("dialog[open]").length) return;
    const typing = e.target.matches("input, textarea, select");
    if (e.key === "Escape") { if (busy) { e.preventDefault(); stop(); } else closeSide(); return; }
    if (e.altKey && (e.key === "n" || e.key === "N" || e.code === "KeyN")) { e.preventDefault(); newChat(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); if (matchMedia("(max-width: 860px)").matches) openSide(); $("[data-search]").focus(); return; }
    if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) { e.preventDefault(); const list = db.convs.slice().sort((a, b) => b.updated - a.updated), i = list.findIndex((c) => c.id === cur?.id), n = list[e.key === "ArrowUp" ? Math.max(0, i - 1) : Math.min(list.length - 1, i + 1)]; if (n) location.hash = `c/${n.id}`; return; }
    if (typing) return;
    if (e.key === "/") { e.preventDefault(); input.focus(); return; }
    if (e.key === "?") { e.preventDefault(); keyDlg.showModal(); }
  });

  /* ---------- online / offline ---------- */
  const net = () => ($("[data-offline]").hidden = navigator.onLine);
  addEventListener("online", () => { net(); toast("Back online"); });
  addEventListener("offline", net);

  let toastT; function toast(m) { const b = $("[data-toasts]"); b.innerHTML = `<div class="toast">${esc(m)}</div>`; clearTimeout(toastT); toastT = setTimeout(() => (b.innerHTML = ""), 2200); }
  window.__lumen = { resetLimit: () => (stamps.length = 0), get db() { return db; }, get cur() { return cur; }, demoReply, md };
  net(); renderMode(); route(); updateSend();
})();
