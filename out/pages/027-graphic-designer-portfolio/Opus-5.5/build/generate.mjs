// Pre-renders the portfolio from assets/data.js: homepage, case-study pages, checklist, sitemap, robots.txt,
// sample PDF, SVG artwork and social images. Run from this folder's parent:  node build/generate.mjs
import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as A from "./art.mjs";
import { Head, SampleBanner, Header, Hero, ProjectFilter, ProjectCard, ServicesGrid, Process, InquiryForm, Footer, CaseStudyHeader, ImageSequence, Testimonial, Img, ICONS, SIZES, esc, slugify } from "./components.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const D = createRequire(import.meta.url)("../assets/data.js");
const S = D.site, P = D.projects, CASES = P.filter((p) => p.case);
const put = async (rel, content) => { const f = path.join(root, rel); await mkdir(path.dirname(f), { recursive: true }); await writeFile(f, content); };
const abs = (p = "") => `${S.domain}/${p}`;

// ---------- artwork ----------
await rm(path.join(root, "assets/img"), { recursive: true, force: true });
for (const p of P) await put(`assets/img/${p.slug}.svg`, A.LEADS[p.slug](...SIZES[p.size]));
const crop = (svgStr, vb) => svgStr.replace(/viewBox="[^"]+" width="\d+" height="\d+"/, `viewBox="${vb}" width="900" height="900"`);
await put("assets/img/saltmarsh-oyster-co-crop.svg", crop(A.saltmarshLead(1600, 900), "0 0 900 900"));
await put("assets/img/lumen-film-festival-crop.svg", crop(A.lumenLead(1200, 1500), "0 180 1200 1200"));
for (const p of CASES) for (const [k] of p.case.sequence) await put(`assets/img/${p.slug}-${k}.svg`, A.SEQS[p.slug](k));
await put("assets/img/portrait.svg", A.portrait());

// ---------- sample capabilities PDF ----------
function pdf(lines) {
  const e = (s) => s.replace(/[–—]/g, "-").replace(/[’]/g, "'").replace(/·/g, "|").replace(/€/g, "EUR ").replace(/[\\()]/g, (x) => `\\${x}`).replace(/[^\x20-\x7E]/g, "-");
  let s = "BT\n", y = 750;
  for (const [f, size, t] of lines) { if (!f) { y -= 10; continue; } s += `/${f} ${size} Tf 1 0 0 1 56 ${y} Tm (${e(t)}) Tj\n`; y -= size + 8; }
  s += "ET";
  const objs = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>", `<< /Length ${s.length} >>\nstream\n${s}\nendstream`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"];
  let out = "%PDF-1.4\n"; const off = []; objs.forEach((o, i) => { off.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const x = out.length; out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${off.map((n) => `${String(n).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;
  return out;
}
await put("assets/iris-calder-capabilities-sample.pdf", pdf([["F2", 22, `${S.name} - Capabilities (SAMPLE)`], ["F1", 11, "Placeholder document for the template preview. Replace with the designer's real capabilities deck."], ["", 0, ""], ["F2", 14, "Positioning"], ["F1", 11, S.positioning.slice(0, 95)], ["F1", 11, S.positioning.slice(95)], ["", 0, ""], ["F2", 14, "Services"], ...D.services.map((s) => ["F1", 11, `- ${s.name}: ${s.shape}`]), ["", 0, ""], ["F2", 14, "Process"], ...D.process.map((s) => ["F1", 11, `- ${s.name}: ${s.items.join(", ")}`]), ["", 0, ""], ["F1", 11, `Contact: ${S.email} | ${S.location}`]]));

// ---------- shared bits ----------
const personLd = { "@type": "Person", "@id": abs("#person"), name: S.name, jobTitle: S.role, email: `mailto:${S.email}`, url: abs(), address: { "@type": "PostalAddress", addressLocality: "Lisbon", addressCountry: "PT" }, sameAs: S.social.map(([, u]) => u) };
const page = (head, body, prefix, script = true) => `<!doctype html>\n<html lang="en">\n${head}\n<body>\n${ICONS}\n<a class="skip" href="#main">Skip to content</a>\n${SampleBanner(prefix)}\n${body}\n${script ? `<script src="${prefix}app.js"></script>\n` : ""}</body>\n</html>\n`;

// ---------- homepage ----------
const pair = [{ ...P[0], hero: [`${P[0].slug}.svg`, SIZES.wide, P[0].alt] }, { ...P[1], hero: [`${P[1].slug}-posters.svg`, [1600, 1000], "Three Lumen Film Festival posters in yellow, magenta and cyan, each with oversized LUMEN lettering cut by beams of light."] }];
const home = page(Head({ title: `${S.name} — Brand identity & packaging designer in Lisbon (sample portfolio)`, description: "Sample portfolio template: brand identity systems, packaging and campaign art direction for independent food, drink and cultural organizations.", canonical: abs(), image: abs("assets/og/home.png"), prefix: "", accent: S.accent,
  jsonld: { "@context": "https://schema.org", "@graph": [personLd, { "@type": "ProfessionalService", name: `${S.name} Design Studio`, url: abs(), founder: { "@id": abs("#person") }, areaServed: "Worldwide", address: personLd.address, serviceType: D.services.map((s) => s.name), email: `mailto:${S.email}` }, { "@type": "WebSite", name: S.name, url: abs() }] } }),
`${Header(S, "", true)}
<main id="main">
${Hero(S, pair, "")}
<section class="intro wrap" aria-labelledby="intro-h"><h2 id="intro-h" class="sr-only">Introduction</h2><p>${esc(S.intro)}</p></section>

<section class="section" id="work" aria-labelledby="work-h">
  <div class="wrap">
    <div class="sec-head"><div><p class="eyebrow">Selected work</p><h2 id="work-h">Projects, 2023–2026</h2></div>${ProjectFilter(D.filters, P)}</div>
    <ul class="grid" data-grid>${P.map((p) => ProjectCard(p, "")).join("")}</ul>
    <p class="empty" data-empty hidden>No projects in this discipline yet.</p>
  </div>
</section>

<section class="section alt" id="services" aria-labelledby="svc-h">
  <div class="wrap"><div class="sec-head"><div><p class="eyebrow">Services</p><h2 id="svc-h">How we can work together</h2></div><p class="sec-sub">Four clearly scoped offers. Every project starts with a free 30-minute discovery call.</p></div>${ServicesGrid(D.services)}</div>
</section>

<section class="section" id="about" aria-labelledby="about-h">
  <div class="wrap about">
    <figure class="portrait">${Img("assets/img/portrait.svg", [900, 1100], `Illustrated portrait of ${S.name} at a studio desk with colour swatches pinned to the wall behind (placeholder for a real photo).`)}<figcaption>Placeholder portrait — replace with a real studio photo.</figcaption></figure>
    <div class="about-copy">
      <p class="eyebrow">About</p><h2 id="about-h">Hi, I'm Iris.</h2>
      <p>I spent eight years in packaging and branding studios before going independent (sample bio). I like brands that are made by real people: oyster farmers, bakers, festival programmers, editors. My job is to give them a system they can actually run — one that works on a cheap two-colour print and on a billboard.</p>
      <p>I work best embedded with small teams: a founder, a marketing lead, sometimes a copywriter and a printer. I bring in trusted collaborators for motion, photography and web development when a project needs them.</p>
      <div class="cred">
        <div><h3>Selected clients</h3><ul class="chips">${D.clients.map((c) => `<li class="phx">${esc(c)}</li>`).join("")}</ul></div>
        <div><h3>Recognition</h3><ul class="rec">${D.recognition.map(([k, v]) => `<li><b>${k}</b><span class="phx">${esc(v)}</span></li>`).join("")}</ul></div>
        <div><h3>Tools &amp; production</h3><ul class="ticks">${D.tools.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>
      </div>
      <a class="btn btn-ghost" href="assets/iris-calder-capabilities-sample.pdf" download>${'<svg class="i" aria-hidden="true"><use href="#i-file"/></svg>'}Capabilities deck (sample PDF)</a>
    </div>
  </div>
</section>

<section class="section alt" id="process" aria-labelledby="proc-h">
  <div class="wrap"><div class="sec-head"><div><p class="eyebrow">Process</p><h2 id="proc-h">Four stages, no surprises</h2></div><p class="sec-sub">Typical identity projects run 8–12 weeks. You'll always know what's next and when I need your feedback.</p></div>${Process(D.process)}</div>
</section>

<section class="section" id="contact" aria-labelledby="ct-h">
  <div class="wrap contact">
    <div class="contact-intro"><p class="eyebrow">Start a project</p><h2 id="ct-h">Tell me about your project</h2><p>Share a little context and I'll reply with questions, a rough timeline and the next step. ${esc(S.responseTime)}</p><p class="direct">${'<svg class="i" aria-hidden="true"><use href="#i-mail"/></svg>'}<a href="mailto:${S.email}">${S.email}</a></p><p class="avail sm"><span class="dot" aria-hidden="true"></span>${esc(S.availability)}</p></div>
    <div>${InquiryForm(S, D.filters)}</div>
  </div>
</section>
</main>
${Footer(S, "")}`, "");
await put("index.html", home);

// ---------- case studies ----------
for (let i = 0; i < CASES.length; i++) {
  const p = CASES[i], c = p.case, next = CASES[(i + 1) % CASES.length], url = abs(`work/${p.slug}/`);
  const proc = c.sequence.filter(([k]) => ["sketch", "rejected"].includes(k)), apps = c.sequence.filter(([k]) => !["sketch", "rejected"].includes(k));
  const type = p.disciplines[0];
  const body = `${Header(S, "../../", false)}
<main id="main" class="case">
${CaseStudyHeader(p)}
<figure class="cs-lead wrap">${Img(`../../assets/img/${p.slug}.svg`, SIZES[p.size], p.alt, { eager: true })}</figure>
<div class="wrap cs-body">
  <section aria-labelledby="ch-h"><h2 id="ch-h">The challenge</h2><p>${esc(c.challenge)}</p></section>
  <section aria-labelledby="au-h"><h2 id="au-h">Audience &amp; constraints</h2><p>${esc(c.audience)}</p><ul class="ticks">${c.constraints.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>
  <section aria-labelledby="di-h"><h2 id="di-h">Creative direction</h2><p>${esc(c.direction)}</p><h3>Key decisions</h3><ol class="decisions">${c.decisions.map((x) => `<li>${esc(x)}</li>`).join("")}</ol></section>
  <section aria-labelledby="sy-h" class="wide"><h2 id="sy-h">The system</h2>
    <dl class="sys"><div><dt>Typography</dt><dd>${esc(c.system.type)}</dd></div><div><dt>Logo behaviour</dt><dd>${esc(c.system.logo)}</dd></div><div><dt>Grid</dt><dd>${esc(c.system.grid)}</dd></div></dl>
    <ul class="swatches" aria-label="Colour palette">${c.system.colors.map(([n, h]) => `<li><span style="background:${h}"></span><b>${esc(n)}</b><code>${h}</code></li>`).join("")}</ul>
  </section>
  <section aria-labelledby="ap-h" class="wide"><h2 id="ap-h">Applications</h2>${ImageSequence(p, apps)}</section>
  <section aria-labelledby="pm-h" class="wide"><h2 id="pm-h">Process material</h2>${ImageSequence(p, proc)}</section>
  <section aria-labelledby="oc-h"><h2 id="oc-h">Outcome</h2><p class="phx block">${esc(c.outcome)}</p></section>
  <section aria-labelledby="tq-h"><h2 id="tq-h" class="sr-only">Client testimonial</h2>${Testimonial(c.quote, `the ${p.name} project`)}</section>
</div>
<aside class="wrap cs-cta" aria-label="Start a similar project"><div><p class="eyebrow">Planning something similar?</p><h2>Let's talk about your ${esc(type.toLowerCase())} project.</h2></div><a class="btn btn-accent btn-lg" href="../../index.html?type=${encodeURIComponent(type)}#contact">Start a project ${'<svg class="i" aria-hidden="true"><use href="#i-arrow"/></svg>'}</a></aside>
<nav class="wrap cs-next" aria-label="More case studies"><a href="../../index.html#work">${'<svg class="i" aria-hidden="true"><use href="#i-left"/></svg>'}All work</a><a class="nx" href="../${next.slug}/"><span>Next project</span><b>${esc(next.name)}</b>${'<svg class="i" aria-hidden="true"><use href="#i-arrow"/></svg>'}</a></nav>
</main>
${Footer(S, "../../")}`;
  await put(`work/${p.slug}/index.html`, page(Head({ title: `${p.name} — ${type} case study | ${S.name} (sample)`, description: `${p.summary} Case study: challenge, direction, system and applications.`, canonical: url, image: abs(`assets/og/${p.slug}.png`), prefix: "../../", type: "article", accent: S.accent,
    jsonld: { "@context": "https://schema.org", "@graph": [{ "@type": "CreativeWork", name: p.name, url, dateCreated: String(p.year), creator: { "@type": "Person", name: S.name, url: abs() }, about: p.disciplines, image: abs(`assets/og/${p.slug}.png`), description: p.summary }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Work", item: abs("#work") }, { "@type": "ListItem", position: 2, name: p.name, item: url }] }] } }), body, "../../"));
}

// ---------- checklist ----------
const items = [];
const add = (group, label, detail) => items.push({ group, label, detail });
add("Identity & contact", "Designer name, role and positioning statement", `Currently: “${S.name}”, “${S.role}”.`);
add("Identity & contact", "Location, timezone and availability note", `${S.location} · ${S.timezone} · ${S.availability}`);
add("Identity & contact", "Contact email and response-time promise", `${S.email} — ${S.responseTime}`);
add("Identity & contact", "Social profile links", S.social.map(([n]) => n).join(", ") + " — currently point to platform home pages.");
add("Identity & contact", "Accent colour from the designer's identity", `Currently ${S.accent} (site.accent in assets/data.js).`);
add("Identity & contact", "Production domain", `Replace ${S.domain} in canonical URLs, Open Graph tags, JSON-LD, sitemap.xml and robots.txt.`);
for (const p of P) {
  add(`Project · ${p.name}`, "Lead image + art-directed crop", `assets/img/${p.slug}.svg — alt: “${p.alt}”`);
  add(`Project · ${p.name}`, "Client, disciplines and year confirmed", `${p.client} · ${p.disciplines.join(", ")} · ${p.year}`);
  add(`Project · ${p.name}`, "One-sentence challenge/outcome approved by client", p.summary);
  if (p.case) {
    add(`Project · ${p.name}`, "Case-study facts", `Industry, role, collaborators (${p.case.collaborators.join("; ")}), deliverables.`);
    p.case.sequence.forEach(([k, cap]) => add(`Project · ${p.name}`, `Image: ${k}`, `assets/img/${p.slug}-${k}.svg — caption “${cap}”`));
    add(`Project · ${p.name}`, "Outcome or measurable result", p.case.outcome);
    add(`Project · ${p.name}`, "Client testimonial (real quote, name, role, company)", "Currently a labelled placeholder.");
    add(`Project · ${p.name}`, "Social sharing image", `assets/og/${p.slug}.png`);
  } else add(`Project · ${p.name}`, "Case study (optional)", "Card shows “Case study in preparation”.");
}
add("About & credibility", "Portrait or studio photo with descriptive alt text", "assets/img/portrait.svg (illustrated placeholder)");
add("About & credibility", "Biography (first person)", "Sample bio in the About section.");
D.clients.forEach((c) => add("About & credibility", "Client name", c));
D.recognition.forEach(([k, v]) => add("About & credibility", k, v));
add("About & credibility", "Capabilities deck / résumé PDF", "assets/iris-calder-capabilities-sample.pdf (sample)");
D.services.forEach((s) => add("Services", s.name, `Confirm fit, deliverables and engagement shape (${s.shape}).`));
add("Services", "Packaging testimonial", "Labelled placeholder in the Packaging service card.");
add("SEO & sharing", "Homepage social image", "assets/og/home.png");
add("SEO & sharing", "Titles and meta descriptions", "Homepage and each case-study page.");
add("Launch", "Inquiry form endpoint", "Connect the form to a real form service or inbox; the template only simulates sending.");
add("Launch", "Privacy note and data retention", "Confirm the 12-month retention statement with your own policy.");
const groups = [...new Set(items.map((x) => x.group))];
await put("checklist/index.html", page(Head({ title: `Pre-launch content checklist | ${S.name} (sample)`, description: "Every image, client fact, quote, link and result the designer must supply before launching the portfolio.", canonical: abs("checklist/"), image: abs("assets/og/home.png"), prefix: "../", accent: S.accent, jsonld: { "@context": "https://schema.org", "@type": "WebPage", name: "Pre-launch content checklist" } }),
  `${Header(S, "../", false)}<main id="main" class="wrap checklist"><p class="crumbs"><a href="../index.html">Home</a> / <span aria-current="page">Checklist</span></p><h1>Pre-launch content checklist</h1><p class="lede">Everything on this site is sample content. Replace each item below with real, client-approved material. Progress is saved in this browser only.</p><p class="progress" data-progress aria-live="polite"></p>
  ${groups.map((g) => `<section aria-labelledby="g-${slugify(g)}"><h2 id="g-${slugify(g)}">${esc(g)}</h2><ul class="cl">${items.map((x, i) => (x.group === g ? `<li><input type="checkbox" id="c${i}" data-cl="${i}"><label for="c${i}"><b>${esc(x.label)}</b><span>${esc(x.detail)}</span></label></li>` : "")).join("")}</ul></section>`).join("")}
  </main>${Footer(S, "../")}`, "../"));

// ---------- sitemap & robots ----------
const urls = ["", ...CASES.map((p) => `work/${p.slug}/`)];
await put("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Replace ${S.domain} with the production domain before launch. -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${abs(u)}</loc><changefreq>monthly</changefreq><priority>${u ? "0.8" : "1.0"}</priority></url>`).join("\n")}\n</urlset>\n`);
await put("robots.txt", `# Recommended robots.txt (place at the domain root). Replace the domain before launch.\nUser-agent: *\nAllow: /\nDisallow: /checklist/\n\nSitemap: ${abs("sitemap.xml")}\n`);

// ---------- social images (1200x630 PNG) via Playwright ----------
const { chromium } = await import(pathToFileURL(path.resolve(root, "../../../../node_modules/playwright/index.mjs")).href);
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1200, height: 630 } });
const og = async (name, title, sub, svgFile) => {
  const img = (await import("node:fs")).readFileSync(path.join(root, "assets/img", svgFile), "utf8");
  await pg.setContent(`<html><body style="margin:0;width:1200px;height:630px;display:grid;grid-template-columns:520px 1fr;background:#F6F4EF;font-family:Georgia,serif"><div style="padding:56px;display:flex;flex-direction:column;justify-content:space-between"><div style="font:600 22px Arial,sans-serif;color:${S.accent}">${esc(S.name)}.</div><div><div style="font-size:54px;line-height:1.05;color:#161616">${esc(title)}</div><div style="margin-top:18px;font:400 22px Arial,sans-serif;color:#555">${esc(sub)}</div></div><div style="font:600 14px Arial,sans-serif;color:#888;letter-spacing:2px">SAMPLE PORTFOLIO</div></div><div style="overflow:hidden">${img.replace(/width="\d+" height="\d+"/, 'width="100%" height="100%" preserveAspectRatio="xMidYMid slice"')}</div></body></html>`);
  await mkdir(path.join(root, "assets/og"), { recursive: true });
  await pg.screenshot({ path: path.join(root, `assets/og/${name}.png`) });
};
await og("home", "Identity & packaging for independent brands", S.role, "saltmarsh-oyster-co.svg");
for (const p of CASES) await og(p.slug, p.name, `${p.disciplines.join(" · ")} · ${p.year}`, `${p.slug}.svg`);
await b.close();
console.log(`generated: index.html, ${CASES.length} case studies, checklist (${items.length} items), sitemap.xml, robots.txt, ${P.length} leads, og images`);
