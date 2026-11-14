(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch { /* unavailable */ } } };
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const D = window.DATA, view = $("[data-view]");
  const badgeCls = ["", "pu", "mg"];
  const tags = (list) => `<div class="tags">${list.map((t, i) => `<span class="badge ${badgeCls[i % 3]}">${esc(t)}</span>`).join("")}</div>`;
  const fmtDate = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  let cleanup = [];

  /* ---------- shared pieces ---------- */
  const projectCard = (p) => `<a class="card pcard" style="--c:${p.color}" href="#/projects/${p.slug}" data-project="${p.slug}"><div class="shot">${FX.screen(p, 0, `${p.name} dashboard screen`)}</div><div class="b"><span class="cats">${p.cat.join(" · ")} · ${p.year}</span><h3>${esc(p.name)}</h3><p>${esc(p.short)}</p>${tags(p.tags.slice(0, 3))}<span class="more">Read case study${icon("i-arrow")}</span></div></a>`;
  const ctaStrip = () => `<section class="sec"><div class="wrap"><div class="card" style="padding:40px;text-align:center"><p class="eyebrow">next_step</p><h2 style="font-size:clamp(28px,4vw,44px)">Have a project in mind? <span class="grad">Let's build it.</span></h2><div class="ctas" style="justify-content:center"><a class="btn" href="#/contact">Hire Me${icon("i-arrow")}</a><a class="btn-2" href="#/projects">View Work</a></div></div></div></section>`;

  /* ---------- views ---------- */
  const V = {};
  V.home = () => ({
    title: `${D.me.name} — ${D.me.role} | DevNexus`,
    desc: "DevNexus: the portfolio of Kai Navarro, a full-stack developer building fast, secure web platforms and trustworthy AI features.",
    html: `<div class="page">
      <section class="hero" aria-labelledby="hero-h"><canvas data-particles aria-hidden="true"></canvas>
        <div class="wrap hero-in">
          <span class="status">${esc(D.me.available)}</span>
          <h1 id="hero-h">Hi, I'm <span class="grad">${esc(D.me.name)}</span></h1>
          <p class="role">${esc(D.me.role)}</p>
          <p class="type" aria-live="off"><span class="sr-type" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">${esc(D.taglines.join(" "))}</span><span aria-hidden="true" data-type></span><span class="caret" aria-hidden="true"></span></p>
          <div class="ctas"><a class="btn" href="#/contact">Hire Me${icon("i-arrow")}</a><a class="btn-2" href="#/projects">View Work</a></div>
          <ul class="stats" aria-label="Quick stats">${D.stats.map(([n, l]) => `<li class="card"><b data-count="${parseInt(n, 10)}" data-suffix="${n.replace(/\d+/, "")}">${n}</b><span>${l}</span></li>`).join("")}</ul>
        </div></section>
      <section class="sec" aria-labelledby="feat-h"><div class="wrap"><div class="sec-h"><div><p class="eyebrow">featured_work</p><h2 id="feat-h">Featured projects</h2></div><a class="btn-2" href="#/projects">All projects${icon("i-arrow")}</a></div><div class="pgrid reveal">${D.projects.slice(0, 3).map(projectCard).join("")}</div></div></section>
      <section class="sec" aria-labelledby="sk-h"><div class="wrap split"><div class="reveal"><p class="eyebrow">skills</p><h2 id="sk-h">A full-stack toolkit, from pixels to pipelines.</h2><p class="lead">Drag the sphere to explore. I pick boring, proven tools for the core and save the shiny ones for where they matter.</p><ul class="hl">${[["i-zap", "React & Next.js"], ["i-cpu", "Node, Go & Rust"], ["i-shield", "Security & crypto"], ["i-users", "AI & RAG systems"]].map(([i, t]) => `<li class="card">${icon(i)}${t}</li>`).join("")}</ul><p style="margin-top:22px"><a class="btn-2" href="#/skills">Explore all skills${icon("i-arrow")}</a></p></div>
        <div class="sphere" data-sphere tabindex="0" role="img" aria-label="Interactive skill sphere: ${Object.values(D.skills).flat().map((s) => s[0]).join(", ")}. Use arrow keys or drag to rotate."></div></div></section>
      <section class="sec" aria-labelledby="t-h"><div class="wrap"><p class="eyebrow">testimonials</p><h2 id="t-h" style="margin-bottom:32px">Kind words</h2><div class="tgrid reveal">${D.testimonials.map(([q, n, r]) => `<figure class="card tcard">${icon("i-quote")}<blockquote>${esc(q)}</blockquote><figcaption><b>${esc(n)}</b>${esc(r)}</figcaption></figure>`).join("")}</div></div></section>
      ${ctaStrip()}</div>`,
    mount() {
      const pf = FX.particles($("[data-particles]")); pf.start(); cleanup.push(() => pf.stop());
      const sp = FX.sphere($("[data-sphere]"), Object.values(D.skills).flat().map((s) => s[0].split(" / ")[0])); cleanup.push(() => sp.stop());
      typewriter($("[data-type]"));
      $$("[data-count]").forEach((el) => countUp(el));
    }
  });
  V.about = () => ({
    title: `About — ${D.me.name} | DevNexus`, desc: "Kai Navarro's story, experience, education and core strengths.",
    html: `<div class="page"><section class="wrap phead"><p class="eyebrow">about</p><h1>Engineer by training, <span class="grad">builder by habit.</span></h1></section>
      <section class="sec" style="padding-top:24px"><div class="wrap story"><div class="reveal"><p>I wrote my first program on a hand-me-down laptop to automate homework, and I've been chasing that feeling of making computers do useful work ever since.</p><p>Over eight years I've moved between newsrooms, agencies, a security startup and an AI-commerce lab. The common thread is shipping things that are fast, safe and pleasant to use, then measuring whether they actually helped.</p><p>Today I lead a platform team, mentor engineers and still write code every day. Off the clock you'll find me climbing, tinkering with generative art, or rewriting my dotfiles for the fifth time.</p><p><button class="btn" type="button" data-cv>${icon("i-dl")}Download CV</button></p></div>
        <div><h2 style="font-size:28px;margin-bottom:24px">Experience</h2><ol class="tl" data-tl>${D.experience.map(([t, r, co, d]) => `<li><time>${t}</time><h3>${esc(r)}</h3><p class="co">${esc(co)}</p><p>${esc(d)}</p></li>`).join("")}</ol></div></div></section>
      <section class="sec" style="padding-top:0"><div class="wrap"><h2 style="font-size:28px;margin-bottom:20px">Education</h2><ul class="edu reveal">${D.education.map(([t, d, s]) => `<li class="card"><time>${t}</time><b>${esc(d)}</b><span>${esc(s)}</span></li>`).join("")}</ul></div></section>
      <section class="sec" style="padding-top:0"><div class="wrap"><h2 style="font-size:28px;margin-bottom:20px">Core strengths</h2><ul class="str reveal">${D.strengths.map(([i, t, d]) => `<li class="card">${icon(i)}<h3>${t}</h3><p>${d}</p></li>`).join("")}</ul></div></section>${ctaStrip()}</div>`,
    mount() { const tl = $("[data-tl]"); requestAnimationFrame(() => setTimeout(() => tl.classList.add("in"), 60)); }
  });
  const CATS = ["All", "Web", "Mobile", "AI", "Full-stack"];
  let pFilter = "All";
  V.projects = () => ({
    title: `Projects — ${D.me.name} | DevNexus`, desc: "Selected projects: e-commerce, security, analytics, AI and mobile.",
    html: `<div class="page"><section class="wrap phead"><p class="eyebrow">projects</p><h1>Things I've <span class="grad">built &amp; shipped.</span></h1><p class="lead">Six projects across web, mobile and AI. Each card opens a full case study.</p></section>
      <section class="sec" style="padding-top:24px"><div class="wrap"><div class="sec-h" style="margin-bottom:24px"><div class="filters" role="group" aria-label="Filter projects" data-filters>${CATS.map((c) => `<button type="button" aria-pressed="${c === pFilter}" data-cat="${c}">${c}</button>`).join("")}</div><p class="count" style="margin:0;color:var(--muted2);font:13px var(--mono)" aria-live="polite" data-count-p></p></div><div class="pgrid" data-plist></div></div></section></div>`,
    mount() {
      const draw = () => { const list = D.projects.filter((p) => pFilter === "All" || p.cat.includes(pFilter)); $("[data-plist]").innerHTML = list.map(projectCard).join(""); $("[data-count-p]").textContent = `${list.length} project${list.length === 1 ? "" : "s"}`; $$("[data-cat]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.cat === pFilter)); };
      $("[data-filters]").addEventListener("click", (e) => { const b = e.target.closest("[data-cat]"); if (b) { pFilter = b.dataset.cat; draw(); } });
      draw();
    }
  });
  V.case = (slug) => {
    const i = D.projects.findIndex((p) => p.slug === slug); if (i < 0) return V.notfound();
    const p = D.projects[i], prev = D.projects[(i + D.projects.length - 1) % D.projects.length], next = D.projects[(i + 1) % D.projects.length];
    return {
      title: `${p.name} case study — ${D.me.name} | DevNexus`, desc: `${p.name}: ${p.short} Problem, architecture, challenges and results.`,
      html: `<div class="page"><section class="wrap phead"><a class="back" href="#/projects">${icon("i-back")}All projects</a>
        <div class="cs-hero" style="margin-top:16px"><div><p class="eyebrow">case_study / ${p.year}</p><h1>${esc(p.name)}</h1><p class="lead">${esc(p.short)}</p>${tags(p.tags)}<div class="cs-links" style="margin-top:24px"><a class="btn" href="#/projects/${p.slug}" data-soon="${p.name} live demo">${icon("i-ext")}Live demo</a><a class="btn-2" href="#/projects/${p.slug}" data-soon="${p.name} on GitHub">${icon("i-gh")}GitHub</a></div></div><div class="shot">${FX.screen(p, 0, `${p.name} main screen`)}</div></div></section>
        <section class="sec" style="padding-top:40px"><div class="wrap" style="display:grid;gap:22px">
          <div class="cs-grid"><div class="card"><h2>Problem</h2><p style="margin:0">${esc(p.problem)}</p></div><div class="card"><h2>Objectives</h2><ul class="obj">${p.objectives.map((o) => `<li>${icon("i-check")}<span>${esc(o)}</span></li>`).join("")}</ul></div></div>
          <div class="card arch"><h2>Architecture</h2><div class="flow" role="list" aria-label="Request flow">${p.arch.map(([n, t], k) => `${k ? `<span class="arrow" aria-hidden="true">${icon("i-arrow")}</span>` : ""}<div class="node" role="listitem"><b>${esc(n)}</b><span>${esc(t)}</span></div>`).join("")}</div></div>
          <div class="card" style="padding:26px"><h2 style="font-size:24px;margin-bottom:16px">Challenges &amp; solutions</h2><div class="chal">${p.challenges.map(([c, s]) => `<div><b>${esc(c)}</b><p>${esc(s)}</p></div>`).join("")}</div></div>
          <div class="results"><h2>Results</h2><ul class="kpis">${p.results.map(([v, l]) => `<li class="card"><b class="grad">${esc(v)}</b><span>${esc(l)}</span></li>`).join("")}</ul></div>
          <div class="gallery"><h2>Screens</h2><div class="gal">${[0, 1, 2].map((v) => `<button type="button" data-shot="${v}" aria-label="Open ${["overview", "detail", "mobile"][v]} screen">${FX.screen(p, v, `${p.name} ${["overview", "detail", "mobile"][v]} screen`)}</button>`).join("")}</div></div>
          <nav class="pn" aria-label="More projects"><a href="#/projects/${prev.slug}">${icon("i-back")}${esc(prev.name)}</a><a href="#/projects/${next.slug}">${esc(next.name)}${icon("i-arrow")}</a></nav>
        </div></section></div>`,
      mount() {
        const names = ["Overview", "Detail", "Mobile"];
        const show = (v) => { openDlg(`<div class="lb">${FX.screen(p, v, `${p.name} ${names[v]} screen, enlarged`)}<div class="lb-f"><button class="icon-btn" type="button" aria-label="Previous screen" data-lb="${(v + 2) % 3}">${icon("i-left")}</button><p id="dlg-title">${esc(p.name)} · ${names[v]} (${v + 1}/3)</p><button class="icon-btn" type="button" aria-label="Next screen" data-lb="${(v + 1) % 3}">${icon("i-right")}</button></div></div>`); };
        $(".gal").addEventListener("click", (e) => { const b = e.target.closest("[data-shot]"); if (b) show(+b.dataset.shot); });
        const onLb = (e) => { const b = e.target.closest("[data-lb]"); if (b) show(+b.dataset.lb); };
        const onKey = (e) => { if (!dlg.open || !$(".lb", dlg)) return; const cur = +$("#dlg-title").textContent.match(/\((\d)\/3\)/)[1] - 1; if (e.key === "ArrowRight") show((cur + 1) % 3); if (e.key === "ArrowLeft") show((cur + 2) % 3); };
        dlg.addEventListener("click", onLb); document.addEventListener("keydown", onKey);
        cleanup.push(() => { dlg.removeEventListener("click", onLb); document.removeEventListener("keydown", onKey); });
      }
    };
  };
  let skTab = "Frontend";
  V.skills = () => ({
    title: `Skills — ${D.me.name} | DevNexus`, desc: "Frontend, backend, DevOps and tooling skills with proficiency levels.",
    html: `<div class="page"><section class="wrap phead"><p class="eyebrow">skills</p><h1>Skills &amp; <span class="grad">proficiency.</span></h1><p class="lead">Self-assessed against shipped production work, not tutorials.</p></section>
      <section class="sec" style="padding-top:24px"><div class="wrap"><div class="tabs" role="tablist" aria-label="Skill categories" data-tabs>${Object.keys(D.skills).map((k) => `<button type="button" role="tab" id="tab-${k}" aria-controls="panel" aria-selected="${k === skTab}" tabindex="${k === skTab ? 0 : -1}" data-tab="${k}">${k}</button>`).join("")}</div>
      <div class="skwrap" id="panel" role="tabpanel" data-panel></div></div></section>${ctaStrip()}</div>`,
    mount() {
      const C = 2 * Math.PI * 42;
      const draw = () => {
        const list = D.skills[skTab];
        $("[data-panel]").setAttribute("aria-labelledby", `tab-${skTab}`);
        $("[data-panel]").innerHTML = `<ul class="card bars">${list.map(([n, v]) => `<li><span>${esc(n)}<b>${v}%</b></span><div class="bar" role="progressbar" aria-label="${esc(n)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${v}"><i data-w="${v}"></i></div></li>`).join("")}</ul>
          <div class="card radials">${list.slice(0, 4).map(([n, v], k) => `<div class="rad"><svg viewBox="0 0 100 100" role="img" aria-label="${esc(n)} ${v}%"><circle cx="50" cy="50" r="42" fill="none" stroke="var(--glass-b)" stroke-width="8"/><circle class="ring" cx="50" cy="50" r="42" fill="none" stroke="${["var(--cy)", "var(--pu)", "var(--mg)", "var(--cy)"][k]}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}" transform="rotate(-90 50 50)" data-v="${v}"/><text x="50" y="56" text-anchor="middle" font-family="Outfit, sans-serif" font-size="20" font-weight="700" fill="var(--ink)">${v}%</text></svg><b>${esc(n)}</b></div>`).join("")}</div>`;
        $$("[data-tab]").forEach((b) => { const on = b.dataset.tab === skTab; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
        requestAnimationFrame(() => requestAnimationFrame(() => { $$("[data-w]").forEach((i) => (i.style.width = i.dataset.w + "%")); $$(".ring").forEach((r) => r.setAttribute("stroke-dashoffset", (C * (1 - r.dataset.v / 100)).toFixed(1))); }));
      };
      const tabs = $("[data-tabs]"), keys = Object.keys(D.skills);
      tabs.addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) { skTab = b.dataset.tab; draw(); } });
      tabs.addEventListener("keydown", (e) => { const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return; e.preventDefault(); skTab = keys[(keys.indexOf(skTab) + d + keys.length) % keys.length]; draw(); $(`[data-tab="${skTab}"]`).focus(); });
      draw();
    }
  });
  let bCat = "All";
  V.blog = () => ({
    title: `Blog — ${D.me.name} | DevNexus`, desc: "Writing on React architecture, AI integration, web security and performance.",
    html: `<div class="page"><section class="wrap phead"><p class="eyebrow">blog</p><h1>Notes from <span class="grad">the terminal.</span></h1><p class="lead">Long-form write-ups of things I learned the hard way.</p></section>
      <section class="sec" style="padding-top:24px"><div class="wrap"><div class="filters" role="group" aria-label="Filter posts by category" data-bcats style="margin-bottom:24px">${["All", ...new Set(D.posts.map((p) => p.cat))].map((c) => `<button type="button" aria-pressed="${c === bCat}" data-bcat="${c}">${c}</button>`).join("")}</div><div class="posts" data-posts></div></div></section></div>`,
    mount() {
      const draw = () => { $("[data-posts]").innerHTML = D.posts.filter((p) => bCat === "All" || p.cat === bCat).map((p) => `<a class="card post" href="#/blog/${p.slug}"><div class="m"><span class="badge">${p.cat}</span><span>${fmtDate(p.date)}</span><span>${icon("i-clock")}${p.min} min read</span></div><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p><span class="more">Read article${icon("i-arrow")}</span></a>`).join(""); $$("[data-bcat]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.bcat === bCat)); };
      $("[data-bcats]").addEventListener("click", (e) => { const b = e.target.closest("[data-bcat]"); if (b) { bCat = b.dataset.bcat; draw(); } });
      draw();
    }
  });
  function hl(code) {
    const KW = new Set("const let var function return if else await async import export from new type interface for of in".split(" "));
    let out = "", last = 0, m; const re = /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`[^`]*`)|(\b\d[\d_.]*\b)|([A-Za-z_$][\w$]*)(\s*\()?/g;
    while ((m = re.exec(code))) { out += esc(code.slice(last, m.index)); last = re.lastIndex; if (m[1]) out += `<span class="c">${esc(m[1])}</span>`; else if (m[2]) out += `<span class="s">${esc(m[2])}</span>`; else if (m[3]) out += `<span class="n">${m[3]}</span>`; else { out += KW.has(m[4]) ? `<span class="k">${m[4]}</span>` : m[5] ? `<span class="f">${m[4]}</span>` : m[4]; if (m[5]) out += m[5]; } }
    return out + esc(code.slice(last));
  }
  V.post = (slug) => {
    const p = D.posts.find((x) => x.slug === slug); if (!p) return V.notfound();
    return {
      title: `${p.title} — DevNexus Blog`, desc: p.excerpt,
      html: `<div class="page"><section class="wrap phead article"><a class="back" href="#/blog">${icon("i-back")}All posts</a><div class="post" style="padding:0;margin-top:16px"><div class="m"><span class="badge">${p.cat}</span><span>${fmtDate(p.date)}</span><span>${icon("i-clock")}${p.min} min read</span></div></div><h1 style="margin-top:16px;font-size:clamp(34px,5vw,56px)">${esc(p.title)}</h1><p class="lead">${esc(p.excerpt)}</p>
        ${p.body.map((b) => `<p>${esc(b)}</p>`).join("")}<div class="code"><div class="code-h"><span>${p.code[0]}</span><button class="copy" type="button" data-copy>Copy</button></div><pre><code>${hl(p.code[1])}</code></pre></div><p style="color:var(--muted2);font-size:15px">This is an excerpt for the demo portfolio; the full article isn't included.</p></section></div>`,
      mount() { $("[data-copy]").addEventListener("click", (e) => { const b = e.currentTarget; const done = () => { b.textContent = "Copied"; setTimeout(() => (b.textContent = "Copy"), 1500); toast("Code copied", "ok"); }; try { navigator.clipboard.writeText(p.code[1]).then(done, () => toast("Copy blocked: select the code manually")); } catch { toast("Copy blocked: select the code manually"); } }); }
    };
  };
  /* contact with schema validation (Zod-like) */
  const schema = {
    name: (v) => (v.trim().length < 2 ? "Name must be at least 2 characters" : v.length > 60 ? "Name is too long" : ""),
    email: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "Enter a valid email address" : ""),
    subject: (v) => (v.trim().length < 4 ? "Subject must be at least 4 characters" : ""),
    message: (v) => (v.trim().length < 20 ? `Message must be at least 20 characters (${v.trim().length}/20)` : v.length > 1000 ? "Message must be under 1000 characters" : "")
  };
  V.contact = () => ({
    title: `Contact — ${D.me.name} | DevNexus`, desc: "Start a project or role conversation with Kai Navarro.",
    html: `<div class="page"><section class="wrap phead"><p class="eyebrow">contact</p><h1>Let's build <span class="grad">something great.</span></h1><p class="lead">Tell me about your project or role. I reply within one business day.</p></section>
      <section class="sec" style="padding-top:24px"><div class="wrap contact">
        <form class="card cform" novalidate data-form>${[["name", "Name", "text", "name"], ["email", "Email", "email", "email"], ["subject", "Subject", "text", "off"]].map(([n, l, t, ac]) => `<div class="field" data-f="${n}"><label for="f-${n}">${l}</label><input id="f-${n}" name="${n}" type="${t}" autocomplete="${ac}" aria-describedby="e-${n}"><p class="err" id="e-${n}"></p></div>`).join("")}
          <div class="field" data-f="message"><label for="f-message">Message</label><textarea id="f-message" name="message" maxlength="1000" aria-describedby="e-message c-message" placeholder="What are you building, and how can I help?"></textarea><span class="cnt" id="c-message" data-cnt>0 / 1000</span><p class="err" id="e-message"></p></div>
          <button class="btn submit" type="submit" data-submit><span>Send message</span>${icon("i-send")}</button></form>
        <aside class="side"><div class="card"><h3>Availability</h3><p><span class="status" style="font-size:12px">${esc(D.me.available)}</span></p></div><div class="card"><h3>Location</h3><p>${icon("i-pin")}${esc(D.me.location)}</p></div><div class="card"><h3>Email</h3><p><a href="mailto:${D.me.email}">${D.me.email}</a></p></div><div class="card"><h3>Elsewhere</h3><ul class="soc"><li><a href="#/contact" data-soon="GitHub" aria-label="GitHub">${icon("i-gh")}</a></li><li><a href="#/contact" data-soon="LinkedIn" aria-label="LinkedIn">${icon("i-in")}</a></li><li><a href="#/contact" data-soon="Twitter / X" aria-label="Twitter / X">${icon("i-x")}</a></li></ul></div></aside>
      </div></section></div>`,
    mount() {
      const f = $("[data-form]"), touched = new Set();
      const check = (n) => { const el = f.elements[n], msg = schema[n](el.value), box = $(`[data-f="${n}"]`); box.classList.toggle("bad", !!msg); box.classList.toggle("good", !msg); el.toggleAttribute("aria-invalid", !!msg); $(`#e-${n}`).innerHTML = msg ? `${icon("i-alert")}${esc(msg)}` : ""; return !msg; };
      Object.keys(schema).forEach((n) => { const el = f.elements[n]; el.addEventListener("blur", () => { if (el.value) touched.add(n); if (touched.has(n)) check(n); }); el.addEventListener("input", () => { if (touched.has(n)) check(n); }); });
      f.elements.message.addEventListener("input", (e) => ($("[data-cnt]").textContent = `${e.target.value.length} / 1000`));
      f.addEventListener("submit", (e) => {
        e.preventDefault(); Object.keys(schema).forEach((n) => touched.add(n));
        const bad = Object.keys(schema).filter((n) => !check(n));
        if (bad.length) { f.elements[bad[0]].focus(); toast(`Please fix ${bad.length} field${bad.length > 1 ? "s" : ""}`); return; }
        const b = $("[data-submit]"); b.classList.add("sending"); b.setAttribute("aria-busy", "true");
        setTimeout(() => { b.classList.remove("sending"); b.classList.add("sent"); b.removeAttribute("aria-busy"); $("span", b).textContent = "Message sent!"; $("use", b).setAttribute("href", "#i-check"); toast(`Thanks, ${f.elements.name.value.trim().split(" ")[0]}! This demo doesn't send messages; email ${D.me.email} instead.`, "ok"); f.reset(); touched.clear(); $$(".field", f).forEach((x) => x.classList.remove("good", "bad")); $("[data-cnt]").textContent = "0 / 1000"; setTimeout(() => { b.classList.remove("sent"); $("span", b).textContent = "Send message"; $("use", b).setAttribute("href", "#i-send"); }, 3000); }, reduce() ? 50 : 1100);
      });
    }
  });
  V.notfound = () => ({ title: "Not found — DevNexus", desc: "Page not found.", html: `<div class="page"><section class="wrap phead"><p class="eyebrow">404</p><h1>That route doesn't exist.</h1><p class="lead"><a class="btn" href="#/">Go home${icon("i-arrow")}</a></p></section></div>` });

  /* ---------- router ---------- */
  function parse() {
    const h = location.hash;
    if (!h || h === "#" || h === "#/") return ["home"];
    if (!h.startsWith("#/")) return null;
    const [a, b] = h.slice(2).split("/");
    if (a === "projects" && b) return ["case", b];
    if (a === "blog" && b) return ["post", b];
    return V[a] && !["case", "post", "notfound"].includes(a) ? [a] : ["notfound"];
  }
  let first = true;
  function route() {
    const r = parse(); if (!r) { const t = document.getElementById(location.hash.slice(1)); if (t) t.focus(); return; }
    const render = () => {
      cleanup.forEach((f) => f()); cleanup = [];
      const v = V[r[0]](r[1]);
      view.innerHTML = v.html; view.classList.remove("leaving");
      document.title = v.title; $('meta[name="description"]').setAttribute("content", v.desc); $('meta[property="og:title"]').setAttribute("content", v.title); $('meta[property="og:description"]').setAttribute("content", v.desc);
      const top = r[0] === "case" ? "projects" : r[0] === "post" ? "blog" : r[0];
      $$("[data-route]").forEach((a) => (a.dataset.route === top ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
      scrollTo({ top: 0, behavior: "instant" });
      if (v.mount) v.mount();
      observeReveals();
      if (!first) view.focus({ preventScroll: true });
      first = false; view.dataset.route = r.join("/");
    };
    if (first || reduce()) render(); else { view.classList.add("leaving"); setTimeout(render, 170); }
    menu(false);
  }
  addEventListener("hashchange", route);

  /* ---------- helpers ---------- */
  function observeReveals() {
    const els = $$(".reveal", view);
    if (reduce() || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((e) => io.observe(e)); cleanup.push(() => io.disconnect());
  }
  function typewriter(el) {
    if (reduce()) { el.textContent = D.taglines[0]; return; }
    let i = 0, j = 0, del = false, timer;
    const tick = () => { const w = D.taglines[i]; j += del ? -1 : 1; el.textContent = w.slice(0, j); let d = del ? 28 : 55; if (!del && j === w.length) { del = true; d = 1800; } else if (del && j === 0) { del = false; i = (i + 1) % D.taglines.length; d = 300; } timer = setTimeout(tick, d); };
    tick(); cleanup.push(() => clearTimeout(timer));
  }
  function countUp(el) {
    const to = +el.dataset.count, suf = el.dataset.suffix; if (reduce()) return;
    const t0 = performance.now(); let raf; const run = (t) => { const k = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) raf = requestAnimationFrame(run); };
    raf = requestAnimationFrame(run); cleanup.push(() => cancelAnimationFrame(raf));
  }
  const dlg = $("[data-dlg]"), dbody = $("[data-dlg-body]");
  function openDlg(html) { dbody.innerHTML = html; if (!dlg.open) dlg.showModal(); }
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => { if (!dlg.open) dbody.innerHTML = ""; });
  function toast(msg, kind = "") { const t = document.createElement("div"); t.className = `toast ${kind}`; t.innerHTML = `${icon(kind === "ok" ? "i-check" : "i-alert")}<span>${esc(msg)}</span>`; $("[data-toasts]").append(t); setTimeout(() => t.remove(), 4200); }

  /* CV: one-page PDF built in the browser */
  function pdf(lines) {
    const t = (s) => s.replace(/[—–]/g, "-").replace(/→/g, "->").replace(/[^\x20-\x7E]/g, "").replace(/[\\()]/g, (c) => "\\" + c);
    let y = 750, st = "BT\n"; lines.forEach(([s, size, gap = 6]) => { st += `/F${size > 12 ? 2 : 1} ${size} Tf 1 0 0 1 56 ${y} Tm (${t(s)}) Tj\n`; y -= size + gap; }); st += "ET";
    const objs = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 6 0 R >> >> /Contents 5 0 R >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", `<< /Length ${st.length} >>\nstream\n${st}\nendstream`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"];
    let out = "%PDF-1.4\n"; const off = []; objs.forEach((o, i) => { off.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const x = out.length; return out + `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${off.map((n) => String(n).padStart(10, "0") + " 00000 n \n").join("")}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-cv]")) {
      const L = [[D.me.name, 24, 6], [`${D.me.role} | ${D.me.location} | ${D.me.email}`, 10, 18], ["Experience", 14, 8]];
      D.experience.forEach(([t, r, c, d]) => { L.push([`${r}, ${c} (${t})`, 11, 4]); L.push([`  ${d}`, 9.5, 8]); });
      L.push(["Education", 14, 8]); D.education.forEach(([t, d, s]) => L.push([`${d}, ${s} (${t})`, 10, 6]));
      L.push(["", 4], ["Skills", 14, 8]); Object.entries(D.skills).forEach(([k, v]) => L.push([`${k}: ${v.map((s) => s[0]).join(", ")}`, 10, 6]));
      L.push(["", 4], ["Selected projects", 14, 8]); D.projects.forEach((p) => L.push([`${p.name}: ${p.short}`, 9.5, 6]));
      L.push(["", 10], ["Sample CV for a fictional developer (DevNexus demo).", 8]);
      const url = URL.createObjectURL(new Blob([pdf(L)], { type: "application/pdf" })), a = document.createElement("a");
      a.href = url; a.download = "kai-navarro-cv.pdf"; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
      toast("CV downloaded: kai-navarro-cv.pdf", "ok"); return;
    }
    const s = e.target.closest("[data-soon]"); if (s) { e.preventDefault(); toast(`${s.dataset.soon}: placeholder link in this demo portfolio.`); }
  });

  /* ---------- nav, theme, loader ---------- */
  const nav = $("[data-nav]"), links = $("[data-links]"), burger = $("[data-burger]"), tb = $("[data-theme-btn]");
  addEventListener("scroll", () => nav.classList.toggle("solid", scrollY > 8), { passive: true });
  function menu(open) { links.classList.toggle("open", open); burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu"); $("use", burger).setAttribute("href", open ? "#i-close" : "#i-menu"); }
  burger.addEventListener("click", () => menu(!links.classList.contains("open")));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && links.classList.contains("open")) { menu(false); burger.focus(); } });
  const syncTheme = () => { const light = document.documentElement.dataset.theme === "light"; $("use", tb).setAttribute("href", light ? "#i-moon" : "#i-sun"); tb.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme"); $('meta[name="theme-color"]').setAttribute("content", light ? "#f6f7fb" : "#0a0a0f"); };
  tb.addEventListener("click", () => { const light = document.documentElement.dataset.theme !== "light"; document.documentElement.dataset.theme = light ? "light" : "dark"; store.set("dn-theme", light ? "light" : "dark"); syncTheme(); });
  syncTheme();
  const loader = $("[data-loader]");
  setTimeout(() => loader.classList.add("done"), reduce() ? 0 : 650);

  route();
})();
