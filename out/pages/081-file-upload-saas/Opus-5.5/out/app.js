(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rid = (n = 10) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b % 57]).join("");
  const KEY = "du-v1", SKEY = "du-session";
  const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* full */ } }, del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } } };
  const view = $("[data-view]");

  /* ---------- "Drive" blob store (IndexedDB, memory fallback) ---------- */
  const mem = new Map();
  const vault = {
    db: null,
    open() { if (!("indexedDB" in window)) return Promise.resolve(null); return (this.db ||= new Promise((res) => { try { const r = indexedDB.open("driveuploader", 1); r.onupgradeneeded = () => r.result.createObjectStore("files"); r.onsuccess = () => res(r.result); r.onerror = () => res(null); } catch { res(null); } })); },
    async tx(mode, fn) { const d = await this.open(); if (!d) return fn(null); return new Promise((res, rej) => { const t = d.transaction("files", mode), s = t.objectStore("files"); let out; const req = fn(s); if (req) req.onsuccess = () => (out = req.result); t.oncomplete = () => res(out); t.onerror = () => rej(t.error); }); },
    async put(k, blob) { const d = await this.open(); if (!d) { mem.set(k, blob); return; } return this.tx("readwrite", (s) => s.put(blob, k)); },
    async get(k) { const d = await this.open(); if (!d) return mem.get(k); return this.tx("readonly", (s) => s.get(k)); },
    async del(k) { const d = await this.open(); if (!d) { mem.delete(k); return; } return this.tx("readwrite", (s) => s.delete(k)); },
  };

  /* ---------- auth helpers ---------- */
  async function hashPw(pw, salt) {
    const data = new TextEncoder().encode(`${salt}:${pw}`);
    if (crypto.subtle) { let h = data; for (let i = 0; i < 1000; i++) h = new Uint8Array(await crypto.subtle.digest("SHA-256", h)); return [...h].map((b) => b.toString(16).padStart(2, "0")).join(""); }
    let x = 2166136261; for (const b of data) x = Math.imul(x ^ b, 16777619) >>> 0; return `fnv-${x.toString(16)}`;
  }
  const strength = (pw) => [pw.length >= 8, /[A-Z]/.test(pw) && /[a-z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw), pw.length >= 12].filter(Boolean).length;
  const fmtSize = (b) => (b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : b < 1073741824 ? `${(b / 1048576).toFixed(1)} MB` : `${(b / 1073741824).toFixed(2)} GB`);
  const fmtDate = (t) => new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const fmtDT = (t) => new Date(t).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  const kind = (m, n = "") => /^image\//.test(m) ? "img" : /^video\/|^audio\//.test(m) ? "vid" : /sheet|csv|excel/.test(m) || /\.(csv|xlsx?)$/i.test(n) ? "sheet" : /zip|compressed|tar|rar|7z/.test(m) ? "zip" : /pdf|word|text|document|json|markdown|presentation/.test(m) || /\.(md|txt|docx?|pdf)$/i.test(n) ? "doc" : "other";
  const KI = { img: "i-image", vid: "i-film", sheet: "i-sheet", zip: "i-archive", doc: "i-doc", other: "i-file" };
  const ficon = (u) => `<span class="ficon ${kind(u.mimeType, u.originalName)}" aria-hidden="true">${icon(KI[kind(u.mimeType, u.originalName)])}</span>`;

  /* ---------- data ---------- */
  let db = ls.get(KEY, null);
  async function seed() {
    const now = Date.now(), DAY = 864e5;
    const mk = async (id, name, email, pw, role, created) => { const salt = rid(12); return { id, name, email, salt, hash: await hashPw(pw, salt), role, disabled: false, created }; };
    const users = [await mk("u_admin", "Alex Morgan", "admin@driveuploader.example", "admin-demo-2026", "admin", now - 60 * DAY), await mk("u_priya", "Priya Shah", "priya@studio.example", "priya-demo-2026", "user", now - 21 * DAY), await mk("u_tom", "Tom Becker", "tom@field.example", "tom-demo-2026", "user", now - 9 * DAY)];
    const files = [
      ["u_priya", "Brand moodboard", "moodboard.svg", "image/svg+xml", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect width="400" height="250" fill="#f7f7f4"/><rect x="20" y="20" width="170" height="210" rx="16" fill="#047857"/><rect x="210" y="20" width="170" height="100" rx="16" fill="#fde68a"/><rect x="210" y="130" width="80" height="100" rx="16" fill="#111827"/><circle cx="335" cy="180" r="45" fill="#f472b6"/></svg>`, 9 * DAY],
      ["u_priya", "Q3 invoice list", "invoices-q3.csv", "text/csv", "invoice,client,amount,status\nINV-1041,Juniper Legal,1200.00,paid\nINV-1042,Orchard Schools,860.00,paid\nINV-1043,Northgate,2450.00,due\n", 5 * DAY],
      ["u_priya", "Meeting notes 11 Nov", "notes-2026-11-11.md", "text/markdown", "# Kickoff\n\n- Agree on file naming\n- Upload final assets by Friday\n- Priya owns the moodboard\n", DAY],
      ["u_tom", "Site survey photos (index)", "survey-index.txt", "text/plain", "Site survey, Plot 14\n01 north wall\n02 roof access\n03 drainage\n", 3 * DAY],
    ];
    const uploads = [];
    for (const [userId, title, originalName, mimeType, body, ago] of files) {
      const blob = new Blob([body], { type: mimeType }), id = `up_${rid(8)}`, driveFileId = `1${rid(27)}`;
      await vault.put(id, blob);
      uploads.push({ id, userId, title, originalName, mimeType, size: blob.size, driveFileId, driveFolderId: `fld_${userId}`, driveViewLink: `https://drive.google.com/file/d/${driveFileId}/view`, status: "UPLOADED", createdAt: now - ago, updatedAt: now - ago });
    }
    return { users, uploads, settings: { maxSizeMB: 250, dailyLimit: 20, folderId: "1DuRootFolder_8Hq2", connected: true, connectedAs: "admin@driveuploader.example", connectedAt: now - 60 * DAY }, attempts: {} };
  }
  const save = () => ls.set(KEY, db);
  let session = ls.get(SKEY, null);
  const me = () => (session ? db.users.find((u) => u.id === session.userId && !u.disabled) : null);
  const isAdmin = () => me()?.role === "admin";
  const userName = (id) => db.users.find((u) => u.id === id)?.name || "Deleted user";
  const myUploads = () => db.uploads.filter((u) => u.userId === me()?.id);
  const folderPath = (uid) => `DriveUploader/Users/${uid}/`;

  /* ---------- router ---------- */
  const PUBLIC = ["", "signup", "login", "forgot", "terms", "privacy"];
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean), r = parts[0] || "";
    if (!PUBLIC.includes(r) && !me()) { pendingRoute = location.hash; location.replace("#/login"); return; }
    if (r !== "login" && r !== "signup" && r !== "forgot") pendingRoute = "";
    if ((r === "login" || r === "signup") && me()) { location.replace(isAdmin() ? "#/admin" : "#/dashboard"); return; }
    if (r === "admin" && !isAdmin()) { view.innerHTML = `<div class="wrap dash"><div class="card empty">${icon("i-lock")}<h1 style="font-size:24px">Admins only</h1><p>Your account can't open the admin panel.</p><a class="btn" href="#/dashboard">Back to my uploads</a></div></div>`; nav(); return; }
    nav(r);
    const R = { "": landing, signup, login, forgot, terms: () => legal("terms"), privacy: () => legal("privacy"), dashboard: () => (parts[1] === "upload" ? upload() : parts[1] === "uploads" ? detail(parts[2]) : dashboard()), admin: () => admin(parts[1] || "overview") };
    (R[r] || landing)();
  }
  let pendingRoute = "";
  addEventListener("hashchange", () => { stopUpload(); route(); view.focus({ preventScroll: true }); scrollTo({ top: 0, behavior: "instant" }); });
  function nav(r = "") {
    const u = me();
    $("[data-nav]").innerHTML = u ? `<a href="#/dashboard" ${r === "dashboard" ? 'aria-current="page"' : ""}>My uploads</a>${u.role === "admin" ? `<a href="#/admin" ${r === "admin" ? 'aria-current="page"' : ""}>Admin</a>` : ""}<span class="muted hide-m" style="font-size:14px;margin:0 6px">${esc(u.name)}</span><button type="button" class="ib" data-logout aria-label="Log out">${icon("i-logout")}</button>`
      : `<a href="#/login" class="hide-s" ${r === "login" ? 'aria-current="page"' : ""}>Log in</a><a class="btn sm" href="#/signup">Sign up free</a>`;
  }

  /* ---------- public pages ---------- */
  function landing() {
    document.title = "DriveUploader — An Upload Portal That Stores Everything in Your Google Drive";
    view.innerHTML = `<section class="wrap hero"><div><p class="kicker">${icon("i-drive")}Files land in your Google Drive</p><h1>Your upload portal. <mark>Your Drive.</mark></h1><p class="lead">Give clients, students or teammates one simple page to upload any file with a title. They manage their own uploads; every file is stored in your Google Drive, neatly foldered per person.</p><div class="acts"><a class="btn green" href="#/signup">${icon("i-upload")}Create a free account</a><a class="btn ghost" href="#/login">Log in</a></div></div>
      <div class="flowart" aria-hidden="true"><div class="fcard fc1"><span class="ic ficon img">${icon("i-image")}</span><b>Brand moodboard</b><span>moodboard.png · 2.4 MB</span><div class="bar"><i style="width:100%"></i></div></div><div class="fcard fc2"><span class="ic ficon sheet">${icon("i-sheet")}</span><b>Q3 invoice list</b><span>invoices-q3.csv · 18 KB</span><div class="bar"><i style="width:64%"></i></div></div><div class="fcard fc3"><span class="ic ficon doc">${icon("i-doc")}</span><b>Signed contract</b><span>contract.pdf · 412 KB</span><div class="bar"><i style="width:28%"></i></div></div><div class="dfolder">${icon("i-folder")}<b>DriveUploader</b><span>/Users/{userId}/ · one folder per person</span></div></div></section>
      <section class="wrap sec" aria-labelledby="how-h"><p class="eyebrow">How it works</p><h2 id="how-h">Three steps for them. Zero storage bills for you.</h2><div class="steps"><div class="step"><span class="n">01</span><h3>Sign up</h3><p>Name, email and a password. They land straight in their own dashboard.</p></div><div class="step"><span class="n">02</span><h3>Upload with a title</h3><p>Drag a file in, give it a clear title and watch the progress bar. Any file type.</p></div><div class="step"><span class="n">03</span><h3>Manage it</h3><p>View, download, rename, replace or delete, but only their own files.</p></div></div></section>
      <section class="band" style="margin-top:88px" aria-labelledby="sec-h"><div class="wrap"><p class="eyebrow">Built safe by default</p><h2 id="sec-h">Your Drive tokens never leave the server.</h2><div class="feats"><div>${icon("i-lock")}<h3>Server-side Drive access</h3><p>Uploads stream through the API to your Drive. No Google tokens in the browser.</p></div><div>${icon("i-shield")}<h3>Owner-only access</h3><p>Every file request checks ownership. People can't see each other's uploads.</p></div><div>${icon("i-folder")}<h3>Folder per user</h3><p>Files go to <code style="color:#fde68a">DriveUploader/Users/{userId}/</code>, so audits and clean-ups are easy.</p></div><div>${icon("i-gear")}<h3>Limits you control</h3><p>Set max file size and daily uploads from the admin panel.</p></div><div>${icon("i-users")}<h3>Admin overview</h3><p>See every upload, filter by person, disable accounts that misbehave.</p></div><div>${icon("i-refresh")}<h3>Safe deletes</h3><p>If Drive can't delete right away, the file is marked pending and retried.</p></div></div></div></section>
      <section class="wrap sec" aria-labelledby="faq-h"><p class="eyebrow">FAQ</p><h2 id="faq-h">Good questions</h2><div class="faq"><details><summary>Which file types are allowed?</summary><p>All of them. Admins can still cap the file size (250 MB by default) and the number of uploads per day.</p></details><details><summary>Can uploaders see my Drive?</summary><p>No. They only see the files they uploaded, inside this portal. Drive access stays on the server with your connected account.</p></details><details><summary>What happens when someone deletes a file?</summary><p>The file is removed from your Drive and from the database. If Drive is unreachable, it's marked “deletion pending” and retried.</p></details><details><summary>Can I rename files after upload?</summary><p>Yes. Change the title anytime, or replace the file itself while keeping the same entry.</p></details></div>
        <div class="cta"><h2>Set up a tidy upload page in the next five minutes.</h2><a class="btn" href="#/signup">Get started</a></div></section>`;
  }
  function authShell(title, sub, inner) { view.innerHTML = `<div class="auth"><div class="card"><h1>${title}</h1><p class="sub">${sub}</p>${inner}</div></div>`; }
  function signup() {
    document.title = "Sign up — DriveUploader";
    authShell("Create your account", "Upload files and manage them in one place.", `<form class="form" data-signup novalidate><label class="fld">Full name<input name="name" autocomplete="name" required></label><label class="fld">Email<input name="email" type="email" autocomplete="email" required></label><label class="fld">Password <small>At least 8 characters, with letters and a number.</small><input name="pw" type="password" autocomplete="new-password" required></label><div class="strength" aria-hidden="true"><i data-str></i></div><label class="fld" style="display:flex;gap:10px;align-items:flex-start;font-weight:400;font-size:14px"><input type="checkbox" name="terms" style="width:18px;height:18px;min-height:0;margin-top:3px;accent-color:var(--green)"> <span>I agree to the <a href="#/terms">Terms</a> and <a href="#/privacy">Privacy policy</a>.</span></label><p class="err" data-err role="alert"></p><button class="btn green full" type="submit">Create account</button></form><p class="alt">Already have an account? <a href="#/login">Log in</a></p>`);
    const f = $("[data-signup]");
    f.pw.addEventListener("input", () => { const s = strength(f.pw.value), bar = $("[data-str]"); bar.style.width = `${s * 20}%`; bar.style.background = ["#b91c1c", "#b91c1c", "#d97706", "#ca8a04", "#059669", "#047857"][s]; });
    f.addEventListener("submit", async (e) => {
      e.preventDefault(); const name = f.name.value.trim(), email = f.email.value.trim().toLowerCase(), pw = f.pw.value, err = $("[data-err]");
      $$("input", f).forEach((i) => i.removeAttribute("aria-invalid"));
      const bad = (el, m) => { el.setAttribute("aria-invalid", "true"); el.focus(); err.textContent = m; };
      if (name.length < 2) return bad(f.name, "Please enter your name.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad(f.email, "Please enter a valid email address.");
      if (db.users.some((u) => u.email === email)) return bad(f.email, "An account with this email already exists. Try logging in.");
      if (pw.length < 8 || !/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return bad(f.pw, "Use at least 8 characters with letters and a number.");
      if (!f.terms.checked) { err.textContent = "Please accept the Terms and Privacy policy."; return; }
      const salt = rid(12), u = { id: `u_${rid(8)}`, name, email, salt, hash: await hashPw(pw, salt), role: "user", disabled: false, created: Date.now() };
      db.users.push(u); save(); startSession(u); toast(`Welcome, ${name.split(" ")[0]}`); location.hash = "#/dashboard";
    });
  }
  function login() {
    document.title = "Log in — DriveUploader";
    authShell("Welcome back", "Log in to manage your uploads.", `<form class="form" data-login novalidate><label class="fld">Email<input name="email" type="email" autocomplete="username" required></label><label class="fld">Password<input name="pw" type="password" autocomplete="current-password" required></label><p class="err" data-err role="alert"></p><button class="btn full" type="submit">Log in</button><a href="#/forgot" style="font-size:14px;color:var(--green);font-weight:600;justify-self:start;min-height:32px;display:inline-flex;align-items:center">Forgot password?</a></form><p class="alt">New here? <a href="#/signup">Create an account</a></p>
      <div class="demo"><p>Demo accounts (stored in this browser):</p><button type="button" class="btn ghost sm" data-fill="priya">Fill demo user</button><button type="button" class="btn ghost sm" data-fill="admin">Fill demo admin</button></div>`);
    const f = $("[data-login]");
    $$("[data-fill]").forEach((b) => b.addEventListener("click", () => { const a = b.dataset.fill === "admin"; f.email.value = a ? "admin@driveuploader.example" : "priya@studio.example"; f.pw.value = a ? "admin-demo-2026" : "priya-demo-2026"; }));
    f.addEventListener("submit", async (e) => {
      e.preventDefault(); const email = f.email.value.trim().toLowerCase(), err = $("[data-err]"), now = Date.now(), a = (db.attempts[email] ||= { n: 0, until: 0 });
      if (a.until > now) { err.textContent = `Too many attempts. Try again in ${Math.ceil((a.until - now) / 1000)}s.`; return; }
      const u = db.users.find((x) => x.email === email);
      if (!u || (await hashPw(f.pw.value, u.salt)) !== u.hash) { a.n++; if (a.n >= 5) { a.until = now + 30000; a.n = 0; err.textContent = "Too many failed attempts. Login is locked for 30 seconds."; } else err.textContent = `Email or password is incorrect.${a.n >= 3 ? ` ${5 - a.n} attempt${5 - a.n === 1 ? "" : "s"} left.` : ""}`; save(); return; }
      if (u.disabled) { err.textContent = "This account has been disabled. Contact the site admin."; return; }
      delete db.attempts[email]; save(); startSession(u); toast(`Logged in as ${u.name}`);
      location.hash = pendingRoute && !/login|signup/.test(pendingRoute) ? pendingRoute : u.role === "admin" ? "#/admin" : "#/dashboard"; pendingRoute = "";
    });
  }
  function forgot() {
    document.title = "Reset password — DriveUploader";
    authShell("Reset your password", "We'll send a reset code to your email.", `<form class="form" data-forgot novalidate><label class="fld">Email<input name="email" type="email" autocomplete="email" required></label><p class="err" data-err role="alert"></p><button class="btn full" type="submit">Send reset code</button></form><form class="form" data-reset hidden novalidate style="margin-top:16px"><p class="ok" data-codeinfo></p><label class="fld">Reset code<input name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6"></label><label class="fld">New password<input name="pw" type="password" autocomplete="new-password"></label><p class="err" data-err2 role="alert"></p><button class="btn green full" type="submit">Set new password</button></form><p class="alt"><a href="#/login">Back to log in</a></p>`);
    let code = "", email = "";
    $("[data-forgot]").addEventListener("submit", (e) => { e.preventDefault(); email = e.target.email.value.trim().toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $("[data-err]").textContent = "Please enter a valid email address."; return; } $("[data-err]").textContent = ""; code = String(100000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 900000)); $("[data-reset]").hidden = false; $("[data-codeinfo]").textContent = `If an account exists for ${email}, a code was sent. Demo mode: your code is ${code}.`; $("[data-reset]").code.focus(); });
    $("[data-reset]").addEventListener("submit", async (e) => { e.preventDefault(); const f = e.target, err = $("[data-err2]"); if (f.code.value.trim() !== code) { err.textContent = "That code doesn't match."; return; } if (f.pw.value.length < 8 || !/[A-Za-z]/.test(f.pw.value) || !/\d/.test(f.pw.value)) { err.textContent = "Use at least 8 characters with letters and a number."; return; } const u = db.users.find((x) => x.email === email); if (u) { u.salt = rid(12); u.hash = await hashPw(f.pw.value, u.salt); save(); } toast("Password updated. You can log in now"); location.hash = "#/login"; });
  }
  function legal(which) {
    const t = which === "terms";
    document.title = `${t ? "Terms" : "Privacy"} — DriveUploader`;
    view.innerHTML = `<article class="legal"><h1>${t ? "Terms of use" : "Privacy policy"}</h1><p class="muted">Sample text for this demo, last updated 1 November 2026.</p>${t ? `<h2>Your uploads</h2><p>You keep ownership of everything you upload. You confirm you have the right to share it and that it doesn't break the law or anyone's rights.</p><h2>Acceptable use</h2><ul><li>No malware, spam or illegal content.</li><li>Respect the file size and daily upload limits.</li><li>Don't try to access other people's files.</li></ul><h2>Accounts</h2><p>The site owner may disable accounts that break these terms. You can delete your uploads at any time.</p>` : `<h2>What we store</h2><p>Your name, email, a salted password hash and details of each upload: title, file name, type, size and dates. Files are stored in the site owner's Google Drive in a folder for your account.</p><h2>Who can see your files</h2><p>You and the site's administrators. Other users can't.</p><h2>Deleting your data</h2><p>Deleting an upload removes the file from Drive and its record from the database. Ask the site owner to delete your account.</p>`}</article>`;
  }
  function startSession(u) { session = { userId: u.id, at: Date.now() }; ls.set(SKEY, session); }

  /* ---------- dashboard ---------- */
  let ui = { q: "", type: "all", sort: "new", layout: ls.get("du-layout", "table") };
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return +d; };
  function dashboard() {
    const u = me(), list = myUploads(), total = list.reduce((s, x) => s + x.size, 0), todayN = list.filter((x) => x.createdAt >= today()).length, lim = db.settings.dailyLimit;
    document.title = "My uploads — DriveUploader";
    view.innerHTML = `<div class="wrap dash"><div class="dh"><div><h1>My uploads</h1><p>Hi ${esc(u.name.split(" ")[0])}. Everything here is stored in <span class="mono">${esc(folderPath(u.id))}</span></p></div><a class="btn green" href="#/dashboard/upload">${icon("i-upload")}Upload new</a></div>
      <div class="stats"><div class="stat"><span>Files</span><b data-nfiles>${list.length}</b></div><div class="stat"><span>Total size</span><b>${fmtSize(total)}</b></div><div class="stat"><span>Uploaded today</span><b>${todayN} / ${lim}</b><div class="meter"><i style="width:${Math.min(100, (todayN / lim) * 100)}%"></i></div></div><div class="stat"><span>Max file size</span><b>${db.settings.maxSizeMB} MB</b><small>Any file type</small></div></div>
      <div class="tools"><label class="search">${icon("i-search")}<span class="sr">Search uploads</span><input type="search" data-q placeholder="Search by title or file name" value="${esc(ui.q)}"></label>
        <label class="sr" for="tf">File type</label><select id="tf" class="sel" data-type>${[["all", "All types"], ["img", "Images"], ["doc", "Documents"], ["sheet", "Spreadsheets"], ["vid", "Audio & video"], ["zip", "Archives"], ["other", "Other"]].map(([v, l]) => `<option value="${v}" ${ui.type === v ? "selected" : ""}>${l}</option>`).join("")}</select>
        <label class="sr" for="so">Sort</label><select id="so" class="sel" data-sort>${[["new", "Newest first"], ["old", "Oldest first"], ["title", "Title A–Z"], ["size", "Largest first"]].map(([v, l]) => `<option value="${v}" ${ui.sort === v ? "selected" : ""}>${l}</option>`).join("")}</select>
        <div class="seg" role="group" aria-label="Layout"><button type="button" data-layout="table" aria-pressed="${ui.layout === "table"}" aria-label="Table view">${icon("i-list")}</button><button type="button" data-layout="grid" aria-pressed="${ui.layout === "grid"}" aria-label="Grid view">${icon("i-grid")}</button></div></div>
      <div data-list></div></div>`;
    renderList();
  }
  function filtered(list) {
    const q = ui.q.toLowerCase();
    return list.filter((x) => (!q || x.title.toLowerCase().includes(q) || x.originalName.toLowerCase().includes(q)) && (ui.type === "all" || kind(x.mimeType, x.originalName) === ui.type))
      .sort({ new: (a, b) => b.createdAt - a.createdAt, old: (a, b) => a.createdAt - b.createdAt, title: (a, b) => a.title.localeCompare(b.title), size: (a, b) => b.size - a.size }[ui.sort]);
  }
  const statusChip = (s) => (s === "UPLOADED" ? `<span class="chip up">${icon("i-check")}Uploaded</span>` : s === "DELETING" ? `<span class="chip del">Deletion pending</span>` : `<span class="chip fail">Failed</span>`);
  const rowActs = (x) => `<div class="acts-row"><a class="ib" href="#/dashboard/uploads/${x.id}" aria-label="View ${esc(x.title)}">${icon("i-eye")}</a><button type="button" class="ib" data-dl="${x.id}" aria-label="Download ${esc(x.title)}">${icon("i-download")}</button><button type="button" class="ib" data-edit="${x.id}" aria-label="Edit title of ${esc(x.title)}">${icon("i-pen")}</button><button type="button" class="ib red" data-del="${x.id}" aria-label="Delete ${esc(x.title)}">${icon("i-trash")}</button></div>`;
  const thumbs = new Map();
  async function renderList() {
    const box = $("[data-list]"); if (!box) return;
    const all = myUploads(), list = filtered(all);
    if (!all.length) { box.innerHTML = `<div class="card empty">${icon("i-upload")}<h2 style="font-size:22px">No uploads yet</h2><p>Your files will appear here after you upload them.</p><a class="btn green" href="#/dashboard/upload">Upload your first file</a></div>`; return; }
    if (!list.length) { box.innerHTML = `<div class="card empty">${icon("i-search")}<p>No uploads match your search or filter.</p></div>`; return; }
    if (ui.layout === "grid") {
      box.innerHTML = `<div class="grid" data-gridview>${list.map((x) => `<article class="gcard" data-row="${x.id}"><div class="gthumb" data-thumb="${x.id}">${ficon(x)}</div><div class="gbody"><a href="#/dashboard/uploads/${x.id}">${esc(x.title)}</a><small>${esc(x.originalName)} · ${fmtSize(x.size)}</small><small>${fmtDate(x.createdAt)}</small></div>${rowActs(x)}</article>`).join("")}</div>`;
      for (const x of list) if (kind(x.mimeType) === "img") { const b = await vault.get(x.id); if (b) { const url = thumbs.get(x.id) || URL.createObjectURL(b); thumbs.set(x.id, url); const t = $(`[data-thumb="${x.id}"]`); if (t) t.innerHTML = `<img src="${url}" alt="">`; } }
      return;
    }
    box.innerHTML = `<div class="tablebox"><table><caption class="sr">Your uploads</caption><thead><tr><th>Title</th><th class="hide-m">Type</th><th class="n">Size</th><th class="hide-m">Uploaded</th><th class="hide-m">Status</th><th class="n"><span class="sr">Actions</span></th></tr></thead><tbody>${list.map((x) => `<tr data-row="${x.id}"><td><div class="tt">${ficon(x)}<div><a href="#/dashboard/uploads/${x.id}">${esc(x.title)}</a><small>${esc(x.originalName)}</small></div></div></td><td class="hide-m"><span class="mono">${esc(x.mimeType || "unknown")}</span></td><td class="n">${fmtSize(x.size)}</td><td class="hide-m">${fmtDT(x.createdAt)}</td><td class="hide-m">${statusChip(x.status)}</td><td>${rowActs(x)}</td></tr>`).join("")}</tbody></table></div>`;
  }

  /* ---------- upload ---------- */
  let job = null;
  function upload() {
    const u = me(), todayN = myUploads().filter((x) => x.createdAt >= today()).length, left = db.settings.dailyLimit - todayN;
    document.title = "Upload — DriveUploader";
    view.innerHTML = `<div class="wrap dash"><a class="btn ghost sm" href="#/dashboard" style="margin-bottom:16px">${icon("i-back")}My uploads</a><div class="dh"><div><h1>Upload a file</h1><p>Any file type up to ${db.settings.maxSizeMB} MB. ${left} upload${left === 1 ? "" : "s"} left today.</p></div></div>
      <div class="upl"><form class="card form" data-upform novalidate><label class="fld">Title <small>Required. Shown in your dashboard.</small><input name="title" maxlength="120" placeholder="e.g. Signed contract, final version" required></label>
        <div class="drop" data-drop>${icon("i-upload").replace('class="i"', 'class="i big"')}<b>Drag a file here</b><p>or click to choose from your device</p><span class="btn ghost sm" aria-hidden="true">Choose file</span><input type="file" name="file" data-file aria-label="Choose file"><div data-picked></div></div>
        <div class="prog" data-prog hidden><div class="track" role="progressbar" aria-label="Upload progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div><div class="row"><span data-ptext>Starting…</span><span data-pspeed></span></div></div>
        <p class="err" data-err role="alert"></p>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn green" type="submit" data-go ${left <= 0 ? "disabled" : ""}>${icon("i-upload")}Upload</button><button type="button" class="btn ghost" data-cancel hidden>Cancel upload</button></div></form>
        <aside class="side-info"><div class="card"><h2>Where it goes</h2><div class="path">${icon("i-folder")}<span class="mono" style="color:inherit">${esc(folderPath(u.id))}</span></div><p class="muted" style="font-size:14px;margin:10px 0 0">Stored in the site owner's Google Drive. Only you and admins can see it here.</p></div><div class="card"><h2>Tips</h2><ul><li>Use a title people can search for later.</li><li>You can replace the file later and keep the same entry.</li><li>Large files take longer. Keep this tab open until it finishes.</li></ul></div></aside></div></div>`;
    const f = $("[data-upform]"), drop = $("[data-drop]"), fileIn = $("[data-file]");
    let file = null;
    const pick = (fl) => { if (!fl) return; file = fl; $("[data-err]").textContent = ""; $("[data-picked]").innerHTML = `<div class="picked">${ficon({ mimeType: fl.type, originalName: fl.name })}<div class="grow"><b>${esc(fl.name)}</b><small>${fmtSize(fl.size)} · ${esc(fl.type || "unknown type")}</small></div><button type="button" class="ib" data-unpick aria-label="Remove file">${icon("i-x")}</button></div>`; if (!f.title.value.trim()) f.title.value = fl.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/^\w/, (c) => c.toUpperCase()); };
    fileIn.addEventListener("change", () => pick(fileIn.files[0]));
    ["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("over"); }));
    ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove("over"); if (t === "drop") pick(e.dataTransfer.files[0]); }));
    drop.addEventListener("click", (e) => { if (e.target.closest("[data-unpick]")) { e.preventDefault(); file = null; fileIn.value = ""; $("[data-picked]").innerHTML = ""; } });
    f.addEventListener("submit", async (e) => {
      e.preventDefault(); const err = $("[data-err]"), title = f.title.value.trim();
      if (!title) { err.textContent = "Please add a title."; f.title.focus(); return; }
      if (!file) { err.textContent = "Please choose a file to upload."; return; }
      if (file.size > db.settings.maxSizeMB * 1048576) { err.textContent = `This file is ${fmtSize(file.size)}. The limit is ${db.settings.maxSizeMB} MB.`; return; }
      if (myUploads().filter((x) => x.createdAt >= today()).length >= db.settings.dailyLimit) { err.textContent = `You've reached today's limit of ${db.settings.dailyLimit} uploads.`; return; }
      err.textContent = "";
      const res = await transfer(file); if (!res) return;
      const id = `up_${rid(8)}`, driveFileId = `1${rid(27)}`, now = Date.now();
      try { await vault.put(id, file); } catch { err.textContent = "Couldn't store the file. Your browser storage may be full."; resetProg(); return; }
      db.uploads.push({ id, userId: me().id, title, originalName: file.name, mimeType: file.type || "application/octet-stream", size: file.size, driveFileId, driveFolderId: `fld_${me().id}`, driveViewLink: `https://drive.google.com/file/d/${driveFileId}/view`, status: "UPLOADED", createdAt: now, updatedAt: now });
      save(); toast(`Uploaded “${title}”`); location.hash = "#/dashboard";
    });
  }
  function resetProg() { const p = $("[data-prog]"); if (p) p.hidden = true; const g = $("[data-go]"); if (g) g.disabled = false; const c = $("[data-cancel]"); if (c) c.hidden = true; }
  function transfer(file, scope = document) {
    return new Promise((resolve) => {
      const prog = $("[data-prog]", scope), bar = $(".track i", prog), track = $(".track", prog), txt = $("[data-ptext]", prog), spd = $("[data-pspeed]", prog), go = $("[data-go]", scope), cancel = $("[data-cancel]", scope);
      prog.hidden = false; go.disabled = true; cancel.hidden = false;
      const dur = Math.min(6000, 1200 + file.size / 400000), t0 = performance.now();
      job = { cancel() { cancelAnimationFrame(job.raf); resetProg(); toast("Upload cancelled", true); resolve(null); job = null; } };
      cancel.onclick = () => job?.cancel();
      const tick = () => { const p = Math.min(1, (performance.now() - t0) / dur), done = Math.round(file.size * p); bar.style.width = `${p * 100}%`; track.setAttribute("aria-valuenow", Math.round(p * 100)); txt.textContent = p < 1 ? `Uploading to Drive… ${Math.round(p * 100)}%` : "Finishing…"; spd.textContent = `${fmtSize(done)} of ${fmtSize(file.size)}`; if (p < 1) job.raf = requestAnimationFrame(tick); else { job = null; cancel.hidden = true; resolve(true); } };
      job.raf = requestAnimationFrame(tick);
    });
  }
  function stopUpload() { if (job) { cancelAnimationFrame(job.raf); job = null; } }

  /* ---------- detail ---------- */
  let previewUrl = "";
  async function detail(id) {
    const x = db.uploads.find((u) => u.id === id);
    if (!x || (x.userId !== me().id && !isAdmin())) { view.innerHTML = `<div class="wrap dash"><div class="card empty">${icon("i-file")}<h1 style="font-size:24px">File not found</h1><p>It may have been deleted, or it belongs to someone else.</p><a class="btn" href="#/dashboard">Back to my uploads</a></div></div>`; document.title = "Not found — DriveUploader"; return; }
    document.title = `${x.title} — DriveUploader`;
    const owner = x.userId === me().id;
    view.innerHTML = `<div class="wrap dash"><a class="btn ghost sm" href="${owner ? "#/dashboard" : "#/admin/uploads"}" style="margin-bottom:16px">${icon("i-back")}${owner ? "My uploads" : "All uploads"}</a>
      <form class="titleedit" data-titleform><label class="sr" for="tin">Title</label><input id="tin" value="${esc(x.title)}" maxlength="120"><button class="btn sm" type="submit">Save title</button></form><p class="muted" style="margin:4px 0 20px">${esc(x.originalName)} · ${fmtSize(x.size)}${owner ? "" : ` · uploaded by ${esc(userName(x.userId))}`}</p>
      <div class="detail"><div class="preview" data-preview><p class="muted">Loading preview…</p></div>
        <aside class="side-info"><div class="card"><dl class="meta"><dt>Status</dt><dd>${statusChip(x.status)}</dd><dt>Type</dt><dd class="mono">${esc(x.mimeType)}</dd><dt>Size</dt><dd>${fmtSize(x.size)} (${x.size.toLocaleString()} bytes)</dd><dt>Uploaded</dt><dd>${fmtDT(x.createdAt)}</dd><dt>Updated</dt><dd>${fmtDT(x.updatedAt)}</dd><dt>Drive file ID</dt><dd class="mono">${esc(x.driveFileId)}</dd><dt>Folder</dt><dd class="mono">${esc(folderPath(x.userId))}</dd></dl></div>
          <div class="card" style="display:grid;gap:10px"><button type="button" class="btn full" data-dl="${x.id}">${icon("i-download")}Download</button>
            <form data-replace class="form" novalidate style="gap:10px"><label class="btn ghost full" style="position:relative;overflow:hidden">${icon("i-refresh")}Replace file<input type="file" data-repfile style="position:absolute;inset:0;opacity:0;cursor:pointer" aria-label="Choose a replacement file"></label><div class="prog" data-prog hidden><div class="track" role="progressbar" aria-label="Replace progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div><div class="row"><span data-ptext></span><span data-pspeed></span></div></div><button type="button" data-go hidden></button><button type="button" class="btn ghost sm" data-cancel hidden>Cancel</button><p class="err" data-rerr role="alert"></p></form>
            <button type="button" class="btn danger full" data-del="${x.id}">${icon("i-trash")}Delete</button></div></aside></div></div>`;
    $("[data-titleform]").addEventListener("submit", (e) => { e.preventDefault(); const v = $("#tin").value.trim(); if (!v) { toast("Title can't be empty", true); $("#tin").value = x.title; return; } x.title = v; x.updatedAt = Date.now(); save(); document.title = `${v} — DriveUploader`; toast("Title updated (Drive file renamed too)"); });
    $("[data-repfile]").addEventListener("change", async (e) => {
      const fl = e.target.files[0]; if (!fl) return; const err = $("[data-rerr]");
      if (fl.size > db.settings.maxSizeMB * 1048576) { err.textContent = `That file is larger than ${db.settings.maxSizeMB} MB.`; return; }
      err.textContent = ""; const ok = await transfer(fl, $("[data-replace]")); if (!ok) return;
      await vault.put(x.id, fl); Object.assign(x, { originalName: fl.name, mimeType: fl.type || "application/octet-stream", size: fl.size, updatedAt: Date.now() }); save(); thumbs.delete(x.id); toast("File replaced"); detail(x.id);
    });
    const b = await vault.get(x.id), pv = $("[data-preview]"); if (!pv) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl); previewUrl = "";
    if (!b) { pv.innerHTML = `<div class="noprev">${ficon(x)}<p>The file content isn't available in this browser.</p></div>`; return; }
    const k = kind(x.mimeType, x.originalName);
    if (/^(text\/|application\/json)/.test(x.mimeType) || /\.(md|txt|csv|json)$/i.test(x.originalName)) { const t = await b.slice(0, 20000).text(); pv.innerHTML = `<pre data-text>${esc(t)}${b.size > 20000 ? "\n…" : ""}</pre>`; return; }
    previewUrl = URL.createObjectURL(b);
    if (k === "img") pv.innerHTML = `<img src="${previewUrl}" alt="Preview of ${esc(x.title)}">`;
    else if (/pdf/.test(x.mimeType)) pv.innerHTML = `<iframe src="${previewUrl}" title="PDF preview of ${esc(x.title)}"></iframe>`;
    else if (/^video\//.test(x.mimeType)) pv.innerHTML = `<video src="${previewUrl}" controls></video>`;
    else if (/^audio\//.test(x.mimeType)) pv.innerHTML = `<audio src="${previewUrl}" controls></audio>`;
    else pv.innerHTML = `<div class="noprev">${ficon(x)}<p>No preview for this file type. Download it to open.</p></div>`;
  }

  /* ---------- admin ---------- */
  function admin(tab) {
    document.title = "Admin — DriveUploader";
    const s = db.settings, total = db.uploads.reduce((a, x) => a + x.size, 0);
    const tabs = [["overview", "Overview", "i-gear"], ["users", "Users", "i-users"], ["uploads", "All uploads", "i-file"]];
    let inner = "";
    if (tab === "overview") inner = `<div class="stats"><div class="stat"><span>Users</span><b>${db.users.length}</b><small>${db.users.filter((u) => u.disabled).length} disabled</small></div><div class="stat"><span>Uploads</span><b>${db.uploads.length}</b></div><div class="stat"><span>Storage used</span><b>${fmtSize(total)}</b></div><div class="stat"><span>Today</span><b>${db.uploads.filter((x) => x.createdAt >= today()).length}</b><small>uploads</small></div></div>
      <div class="card" style="margin-bottom:16px"><div class="drivecard"><span class="dlogo">${icon("i-drive")}</span><div class="grow"><h2 style="font-size:19px">Google Drive</h2><p class="muted" style="margin:2px 0 0;font-size:14.5px">${s.connected ? `Connected as <b>${esc(s.connectedAs)}</b> · root folder <span class="mono">${esc(s.folderId)}</span>` : "Not connected. Uploads will fail until Drive is connected."}</p></div>${s.connected ? `<span class="chip up">${icon("i-check")}Connected</span><button type="button" class="btn ghost sm" data-drive="off">Disconnect</button>` : `<button type="button" class="btn green sm" data-drive="on">Connect Drive</button>`}</div></div>
      <form class="card form" data-settings novalidate><h2 style="font-size:19px">Upload settings</h2><div class="two"><label class="fld">Max file size (MB)<input name="max" type="number" min="1" max="5120" value="${s.maxSizeMB}"></label><label class="fld">Uploads per user per day<input name="daily" type="number" min="1" max="1000" value="${s.dailyLimit}"></label></div><label class="fld">Destination folder ID <small>Each user gets a subfolder: DriveUploader/Users/{userId}/</small><input name="folder" value="${esc(s.folderId)}" spellcheck="false"></label><p class="err" data-err role="alert"></p><button class="btn" type="submit" style="justify-self:start">Save settings</button></form>`;
    else if (tab === "users") inner = `<div class="tablebox"><table><caption class="sr">Users</caption><thead><tr><th>User</th><th class="hide-m">Joined</th><th class="n">Uploads</th><th>Status</th><th class="n"><span class="sr">Actions</span></th></tr></thead><tbody>${db.users.map((u) => `<tr data-user="${u.id}"><td><div class="tt" style="min-width:180px"><span class="ficon other" aria-hidden="true">${icon("i-user")}</span><div><b>${esc(u.name)}</b>${u.role === "admin" ? ` <span class="chip admin">Admin</span>` : ""}<small>${esc(u.email)}</small></div></div></td><td class="hide-m">${fmtDate(u.created)}</td><td class="n"><a href="#/admin/uploads" data-filteruser="${u.id}">${db.uploads.filter((x) => x.userId === u.id).length}</a></td><td>${u.disabled ? `<span class="chip off">Disabled</span>` : `<span class="chip up">Active</span>`}</td><td class="n">${u.id === me().id ? `<span class="muted" style="font-size:13px">You</span>` : `<button type="button" class="btn ${u.disabled ? "ghost" : "danger"} sm" data-toggleuser="${u.id}">${u.disabled ? "Enable" : "Disable"}</button>`}</td></tr>`).join("")}</tbody></table></div>`;
    else { const f = adminFilter; const list = db.uploads.filter((x) => !f || x.userId === f).sort((a, b) => b.createdAt - a.createdAt); inner = `<div class="tools"><label class="sr" for="uf">Filter by user</label><select id="uf" class="sel" data-ufilter><option value="">All users</option>${db.users.map((u) => `<option value="${u.id}" ${f === u.id ? "selected" : ""}>${esc(u.name)}</option>`).join("")}</select><span class="muted">${list.length} upload${list.length === 1 ? "" : "s"}</span></div>${list.length ? `<div class="tablebox"><table><caption class="sr">All uploads</caption><thead><tr><th>Title</th><th>Owner</th><th class="n">Size</th><th class="hide-m">Uploaded</th><th class="n"><span class="sr">Actions</span></th></tr></thead><tbody>${list.map((x) => `<tr data-row="${x.id}"><td><div class="tt">${ficon(x)}<div><a href="#/dashboard/uploads/${x.id}">${esc(x.title)}</a><small>${esc(x.originalName)}</small></div></div></td><td>${esc(userName(x.userId))}</td><td class="n">${fmtSize(x.size)}</td><td class="hide-m">${fmtDT(x.createdAt)}</td><td><div class="acts-row"><button type="button" class="ib" data-dl="${x.id}" aria-label="Download ${esc(x.title)}">${icon("i-download")}</button><button type="button" class="ib red" data-del="${x.id}" aria-label="Delete ${esc(x.title)}">${icon("i-trash")}</button></div></td></tr>`).join("")}</tbody></table></div>` : `<div class="card empty">${icon("i-file")}<p>No uploads${f ? " for this user" : ""}.</p></div>`}`; }
    view.innerHTML = `<div class="wrap dash"><div class="dh"><div><h1>Admin</h1><p>Manage people, files and where uploads are stored.</p></div></div><nav class="atabs" aria-label="Admin sections">${tabs.map(([k, l, ic]) => `<a href="#/admin/${k}" ${tab === k ? 'aria-current="page"' : ""}>${icon(ic)}${l}</a>`).join("")}</nav>${inner}</div>`;
    const sf = $("[data-settings]");
    if (sf) sf.addEventListener("submit", (e) => { e.preventDefault(); const max = +sf.max.value, daily = +sf.daily.value, folder = sf.folder.value.trim(), err = $("[data-err]"); if (!(max >= 1 && max <= 5120)) { err.textContent = "Max file size must be between 1 and 5120 MB."; return; } if (!(daily >= 1 && daily <= 1000 && Number.isInteger(daily))) { err.textContent = "Daily uploads must be a whole number from 1 to 1000."; return; } if (!/^[\w-]{6,}$/.test(folder)) { err.textContent = "Folder ID should be at least 6 letters, numbers, - or _."; return; } err.textContent = ""; Object.assign(db.settings, { maxSizeMB: max, dailyLimit: daily, folderId: folder }); save(); toast("Settings saved"); });
  }
  let adminFilter = "";

  /* ---------- dialogs + shared actions ---------- */
  const dlg = $("[data-dlg]"), dlgIn = $("[data-dlgin]");
  function confirmDlg(title, body, okLabel, danger) { return new Promise((res) => { dlgIn.innerHTML = `<h2 id="dlg-h">${title}</h2><p>${body}</p><div class="dlg-acts"><button type="button" class="btn ghost" data-no>Cancel</button><button type="button" class="btn ${danger ? "danger" : ""}" data-yes>${okLabel}</button></div>`; dlg.showModal(); $("[data-no]", dlgIn).focus(); const done = (v) => { dlg.close(); res(v); }; $("[data-yes]", dlgIn).onclick = () => done(true); $("[data-no]", dlgIn).onclick = () => done(false); dlg.onclose = () => res(false); }); }
  function editDlg(x) { dlgIn.innerHTML = `<h2 id="dlg-h">Edit title</h2><form class="form" data-editform novalidate><label class="fld">Title<input name="t" value="${esc(x.title)}" maxlength="120"></label><p class="err" data-eerr role="alert"></p><div class="dlg-acts"><button type="button" class="btn ghost" data-no>Cancel</button><button class="btn" type="submit">Save</button></div></form>`; dlg.showModal(); const f = $("[data-editform]"); f.t.select(); $("[data-no]", dlgIn).onclick = () => dlg.close(); f.onsubmit = (e) => { e.preventDefault(); const v = f.t.value.trim(); if (!v) { $("[data-eerr]").textContent = "Title can't be empty."; return; } x.title = v; x.updatedAt = Date.now(); save(); dlg.close(); toast("Title updated"); renderList(); }; }
  async function download(x) { const b = await vault.get(x.id); if (!b) { toast("File content isn't available in this browser", true); return; } const url = URL.createObjectURL(b), a = document.createElement("a"); a.href = url; a.download = x.originalName; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000); toast(`Downloading ${x.originalName}`); }
  async function remove(x) {
    if (!(await confirmDlg("Delete this file?", `“${esc(x.title)}” will be removed from Google Drive and from your uploads. This can't be undone.`, "Delete", true))) return;
    x.status = "DELETING"; save();
    try { await vault.del(x.id); db.uploads = db.uploads.filter((u) => u !== x); thumbs.delete(x.id); save(); toast("File deleted"); } catch { toast("Drive delete failed. Marked as deletion pending", true); }
    if (/uploads\//.test(location.hash)) location.hash = x.userId === me().id ? "#/dashboard" : "#/admin/uploads"; else route();
  }
  view.addEventListener("click", async (e) => {
    const b = e.target.closest("button, a"); if (!b) return;
    const find = (id) => db.uploads.find((u) => u.id === id && (u.userId === me()?.id || isAdmin()));
    if (b.dataset.dl) { const x = find(b.dataset.dl); if (x) download(x); return; }
    if (b.dataset.edit) { const x = find(b.dataset.edit); if (x) editDlg(x); return; }
    if (b.dataset.del) { const x = find(b.dataset.del); if (x) remove(x); return; }
    if (b.dataset.layout) { ui.layout = b.dataset.layout; ls.set("du-layout", ui.layout); $$("[data-layout]").forEach((x) => x.setAttribute("aria-pressed", x === b)); renderList(); return; }
    if (b.dataset.toggleuser) { const u = db.users.find((x) => x.id === b.dataset.toggleuser); if (!u.disabled && !(await confirmDlg(`Disable ${esc(u.name)}?`, "They won't be able to log in. Their files stay in Drive.", "Disable", true))) return; u.disabled = !u.disabled; save(); toast(`${u.name} ${u.disabled ? "disabled" : "enabled"}`); route(); return; }
    if (b.dataset.filteruser) { adminFilter = b.dataset.filteruser; return; }
    if (b.dataset.drive) { if (b.dataset.drive === "off" && !(await confirmDlg("Disconnect Google Drive?", "New uploads will fail until you reconnect.", "Disconnect", true))) return; Object.assign(db.settings, b.dataset.drive === "on" ? { connected: true, connectedAt: Date.now() } : { connected: false }); save(); toast(b.dataset.drive === "on" ? "Drive connected (simulated consent)" : "Drive disconnected"); route(); }
  });
  view.addEventListener("input", (e) => { if (e.target.matches("[data-q]")) { ui.q = e.target.value; renderList(); } });
  view.addEventListener("change", (e) => { if (e.target.matches("[data-type]")) { ui.type = e.target.value; renderList(); } if (e.target.matches("[data-sort]")) { ui.sort = e.target.value; renderList(); } if (e.target.matches("[data-ufilter]")) { adminFilter = e.target.value; route(); } });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  document.addEventListener("click", (e) => { if (e.target.closest("[data-logout]")) { session = null; ls.del(SKEY); toast("Logged out"); location.hash = "#/"; } });

  let toastT; function toast(m, bad) { const box = $("[data-toasts]"); box.innerHTML = `<div class="toast${bad ? " bad" : ""}">${icon(bad ? "i-x" : "i-check")}${esc(m)}</div>`; clearTimeout(toastT); toastT = setTimeout(() => (box.innerHTML = ""), 2600); }

  window.__du = { get db() { return db; }, vault, me };
  (async () => { if (!db || !Array.isArray(db.users)) { db = await seed(); save(); } db.attempts ||= {}; route(); })();
})();
