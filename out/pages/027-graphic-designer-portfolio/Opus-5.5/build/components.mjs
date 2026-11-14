// Reusable HTML components (pure functions returning HTML strings), rendered at build time by generate.mjs.
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ic = (n) => `<svg class="i" aria-hidden="true"><use href="#i-${n}"/></svg>`;
export const slugify = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const SIZES = { wide: [1600, 900], tall: [1200, 1500], std: [1200, 900] };
const isPlaceholder = (s) => /^Placeholder/i.test(s);

export const ICONS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></symbol>
  <symbol id="i-left" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></symbol>
  <symbol id="i-file" viewBox="0 0 24 24"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M12 18v-6M9 15l3 3 3-3"/></symbol>
  <symbol id="i-quote" viewBox="0 0 24 24"><path d="M10 11H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v6c0 2-1 3.5-3 4M19 11h-4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v6c0 2-1 3.5-3 4"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol>
  <symbol id="i-alert" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></symbol>
  <symbol id="i-pause" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></symbol>
  <symbol id="i-play" viewBox="0 0 24 24"><path d="m7 4 13 8-13 8z"/></symbol>
</svg>`;

export function Head({ title, description, canonical, image, prefix, jsonld, type = "website", accent }) {
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F6F4EF">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="${prefix}styles.css">
<style>:root{--accent:${accent}}</style>
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, "\\u003c")}</script>
</head>`;
}

export function SampleBanner(prefix) {
  return `<div class="sample" role="note"><p><b>Sample portfolio.</b> Names, projects and copy are placeholders for a template preview — see the <a href="${prefix}checklist/">pre-launch checklist</a>.</p></div>`;
}

export function Header(site, prefix, home) {
  const h = (id) => (home ? `#${id}` : `${prefix}index.html#${id}`);
  const links = [["work", "Work"], ["about", "About"], ["services", "Services"], ["process", "Process"], ["contact", "Contact"]];
  return `<header class="hdr" data-hdr>
  <div class="wrap hdr-row">
    <a class="wordmark" href="${home ? "#top" : `${prefix}index.html`}" aria-label="${esc(site.name)} — home">${esc(site.name)}<span aria-hidden="true">.</span></a>
    <nav class="nav" aria-label="Primary"><ul>${links.map(([id, n]) => `<li><a href="${h(id)}">${n}</a></li>`).join("")}</ul></nav>
    <a class="btn btn-accent cta" href="${h("contact")}" data-start>Start a project</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mmenu" data-menu-btn><span class="sr-only">Menu</span>${ic("menu")}</button>
  </div>
  <nav class="mmenu" id="mmenu" aria-label="Mobile" hidden data-menu><ul>${links.map(([id, n]) => `<li><a href="${h(id)}">${n}</a></li>`).join("")}<li><a class="btn btn-accent" href="${h("contact")}">Start a project</a></li></ul></nav>
</header>`;
}

export function Img(src, [w, h], alt, { eager = false, cls = "" } = {}) {
  return `<img${cls ? ` class="${cls}"` : ""} src="${src}" width="${w}" height="${h}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
}

export function Hero(site, pair, prefix) {
  const slides = pair.map((p, i) => `<figure class="hero-slide${i ? "" : " on"}" data-slide="${i}"${i ? ' aria-hidden="true"' : ""}>
      <a class="hero-img" href="${prefix}work/${p.slug}/" tabindex="${i ? "-1" : "0"}"><picture><source media="(max-width: 700px)" srcset="${prefix}assets/img/${p.slug}-crop.svg" width="900" height="900">${Img(`${prefix}assets/img/${p.hero[0]}`, p.hero[1], p.hero[2], { eager: i === 0 })}</picture></a>
      <figcaption><b>${esc(p.name)}</b><span>${esc(p.disciplines.join(" · "))} · ${p.year}</span><span class="hero-out">${esc(p.summary)}</span></figcaption>
    </figure>`).join("");
  return `<section class="hero" id="top" aria-labelledby="hero-h">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">${esc(site.role)}</p>
      <h1 id="hero-h">Identity systems and packaging for <em>independent food, drink and culture</em>.</h1>
      <p class="lede">${esc(site.positioning)}</p>
      <div class="ctas"><a class="btn btn-ink btn-lg" href="#work">View selected work</a><a class="btn btn-ghost btn-lg" href="#contact" data-start>Start a project</a></div>
      <p class="avail"><span class="dot" aria-hidden="true"></span>${esc(site.availability)} · ${ic("pin")}${esc(site.location)} · ${esc(site.timezone)}</p>
    </div>
    <div class="hero-feature" aria-roledescription="carousel" aria-label="Featured projects" data-hero>
      ${slides}
      <div class="hero-ctrl"><p class="sr-only" aria-live="polite" data-hero-live></p>${pair.map((p, i) => `<button type="button" class="hero-dot" aria-label="Show ${esc(p.name)}" aria-pressed="${i === 0}" data-goto="${i}"></button>`).join("")}<button type="button" class="hero-pause" aria-label="Pause rotation" data-hero-pause>${ic("pause")}</button></div>
    </div>
  </div>
</section>`;
}

export function ProjectFilter(filters, projects) {
  const count = (f) => projects.filter((p) => p.disciplines.includes(f)).length;
  return `<div class="filters" role="group" aria-label="Filter projects by discipline" data-filters>
    <button type="button" aria-pressed="true" data-filter="all">All <span>${projects.length}</span></button>
    ${filters.map((f) => `<button type="button" aria-pressed="false" data-filter="${slugify(f)}">${esc(f)} <span>${count(f)}</span></button>`).join("")}
  </div><p class="sr-only" aria-live="polite" data-filter-status></p>`;
}

export function ProjectCard(p, prefix) {
  const meta = `<p class="pc-meta"><span>${p.self ? "Self-initiated" : esc(p.client)}</span><span>${esc(p.disciplines.join(", "))} · ${p.year}</span></p>`;
  const body = `<div class="pc-img">${Img(`${prefix}assets/img/${p.slug}.svg`, SIZES[p.size], p.alt)}</div><div class="pc-body"><h3>${esc(p.name)}</h3>${meta}<p class="pc-sum">${esc(p.summary)}</p>${p.case ? `<span class="pc-more">Read case study ${ic("arrow")}</span>` : `<span class="pc-soon">Case study in preparation</span>`}</div>`;
  return `<li class="pc pc-${p.size}" data-tags="${p.disciplines.map(slugify).join(" ")}">${p.case ? `<a class="pc-link" href="${prefix}work/${p.slug}/">${body}</a>` : `<article class="pc-link static" tabindex="0" aria-label="${esc(p.name)} — case study in preparation">${body}</article>`}</li>`;
}

export function Testimonial(t, context) {
  if (t) return `<figure class="quote"><blockquote>${esc(t.quote)}</blockquote><figcaption><b>${esc(t.name)}</b>${esc(t.role)}, ${esc(t.company)}</figcaption></figure>`;
  return `<figure class="quote placeholder" aria-label="Testimonial placeholder"><p class="ph-tag">${ic("alert")}Testimonial placeholder</p><blockquote>Add a real quote from a client about ${esc(context)}. Do not publish invented praise.</blockquote><figcaption><b>[Client name]</b>[Role], [Company]</figcaption></figure>`;
}

export function ServicesGrid(services) {
  return `<ul class="services">${services.map((s, i) => `<li class="svc">
    <p class="svc-n">0${i + 1}</p><h3>${esc(s.name)}</h3>
    <dl><div><dt>Ideal fit</dt><dd>${esc(s.fit)}</dd></div><div><dt>Typical deliverables</dt><dd><ul class="ticks">${s.deliverables.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></dd></div><div><dt>Engagement</dt><dd>${esc(s.shape)}</dd></div></dl>
    <a class="svc-next" href="#contact" data-service="${esc(s.name)}">${esc(s.next)} ${ic("arrow")}</a>
    ${i === 1 ? Testimonial(s.testimonial, "a packaging project") : ""}
  </li>`).join("")}</ul><p class="note">Pricing is scoped per project after a discovery call; no fixed prices are published.</p>`;
}

export function Process(stages) {
  return `<ol class="process">${stages.map((s, i) => `<li><p class="pr-n">${i + 1}</p><h3>${esc(s.name)}</h3><ul>${s.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><p class="expect"><b>What to expect:</b> ${esc(s.expect)}</p></li>`).join("")}</ol>`;
}

export function InquiryForm(site, filters) {
  const opt = (arr) => arr.map((o) => `<option>${esc(o)}</option>`).join("");
  return `<form class="inquiry" data-inquiry action="mailto:${site.email}" method="post" enctype="text/plain" novalidate>
  <div class="err-summary" data-err-summary role="alert" tabindex="-1" hidden></div>
  <div class="g2">
    <div class="f"><label for="f-name">Name <span aria-hidden="true">*</span></label><input id="f-name" name="name" autocomplete="name" required aria-describedby="e-name"><p class="ferr" id="e-name"></p></div>
    <div class="f"><label for="f-email">Email <span aria-hidden="true">*</span></label><input id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="e-email"><p class="ferr" id="e-email"></p></div>
    <div class="f"><label for="f-company">Company or organization</label><input id="f-company" name="company" autocomplete="organization"></div>
    <div class="f"><label for="f-site">Website</label><input id="f-site" name="website" type="url" inputmode="url" placeholder="https://" aria-describedby="e-site"><p class="ferr" id="e-site"></p></div>
  </div>
  <div class="f"><label for="f-type">Project type <span aria-hidden="true">*</span></label><select id="f-type" name="type" required aria-describedby="e-type"><option value="">Choose one</option>${opt([...filters.map((f) => (f === "Digital" ? "Digital & launch assets" : f)), "Something else"])}</select><p class="ferr" id="e-type"></p></div>
  <div class="f"><label for="f-summary">Project summary <span aria-hidden="true">*</span></label><textarea id="f-summary" name="summary" rows="5" required aria-describedby="h-summary e-summary"></textarea><p class="hint" id="h-summary">What are you making, who is it for, and what does success look like? (At least 40 characters.)</p><p class="ferr" id="e-summary"></p></div>
  <div class="g3">
    <div class="f"><label for="f-time">Desired timeline</label><select id="f-time" name="timeline">${opt(["Flexible", "Within 1 month", "1–3 months", "3–6 months", "6+ months"])}</select></div>
    <div class="f"><label for="f-budget">Budget range</label><select id="f-budget" name="budget">${opt(["Not sure yet", "Under €5k", "€5k–€15k", "€15k–€30k", "€30k+"])}</select></div>
    <div class="f"><label for="f-found">How did you find me?</label><select id="f-found" name="found">${opt(["Referral", "Instagram", "Behance", "Search", "Saw a project in the wild", "Other"])}</select></div>
  </div>
  <div class="f check"><input id="f-consent" name="consent" type="checkbox" required aria-describedby="h-consent e-consent"><label for="f-consent">I agree that ${esc(site.name)} may store these details to reply to my inquiry.</label></div>
  <p class="hint" id="h-consent">Your details are used only to respond to this inquiry and are deleted after 12 months if we don't work together. Nothing is shared with third parties.</p><p class="ferr" id="e-consent"></p>
  <div class="submit-row"><button class="btn btn-accent btn-lg" type="submit" data-submit><span class="spin" aria-hidden="true"></span><span data-submit-label>Send inquiry</span></button><p class="alt">Prefer email? <a href="mailto:${site.email}">${site.email}</a></p></div>
  <p class="resp">${esc(site.responseTime)}</p>
</form>
<div class="state ok" data-ok hidden tabindex="-1">${ic("check")}<div><h3>Thanks — your inquiry is in.</h3><p data-ok-text></p></div></div>
<div class="state bad" data-bad hidden tabindex="-1">${ic("alert")}<div><h3>Your inquiry didn't send.</h3><p>Check your connection and try again, or email <a href="mailto:${site.email}">${site.email}</a> directly. Your answers are still in the form.</p><button class="btn btn-ghost" type="button" data-retry>Try again</button></div></div>`;
}

export function Footer(site, prefix) {
  return `<footer class="footer">
  <div class="wrap foot">
    <div><p class="wordmark sm">${esc(site.name)}<span aria-hidden="true">.</span></p><p>${esc(site.role)} · ${esc(site.location)}</p><p><a href="mailto:${site.email}">${site.email}</a></p></div>
    <ul class="social">${site.social.map(([n, u]) => `<li><a href="${u}" rel="me noopener" target="_blank">${n}</a></li>`).join("")}</ul>
    <div class="accent-pick" role="group" aria-label="Preview accent colour"><p>Preview accent</p>${site.accents.map(([n, c]) => `<button type="button" data-accent="${c}" aria-pressed="${c === site.accent}" style="--sw:${c}"><span class="sr-only">${n}</span></button>`).join("")}</div>
  </div>
  <div class="wrap foot-b"><p>© 2026 ${esc(site.name)} (sample). Sample artwork drawn for this template.</p><p><a href="${prefix}checklist/">Pre-launch checklist</a> · <a href="${prefix}sitemap.xml">Sitemap</a></p></div>
</footer>`;
}

export function CaseStudyHeader(p) {
  const c = p.case;
  return `<header class="cs-head wrap">
    <p class="crumbs"><a href="../../index.html#work">Work</a> / <span aria-current="page">${esc(p.name)}</span></p>
    <p class="eyebrow">${esc(p.disciplines.join(" · "))} · ${p.year}</p>
    <h1>${esc(p.name)}</h1>
    <p class="lede">${esc(p.summary)}</p>
    <dl class="facts">
      <div><dt>Client</dt><dd>${esc(p.client)}</dd></div><div><dt>Industry</dt><dd>${esc(c.industry)}</dd></div><div><dt>Year</dt><dd>${p.year}</dd></div>
      <div><dt>Role</dt><dd>${esc(c.role)}</dd></div><div><dt>Collaborators</dt><dd>${c.collaborators.map((x) => (isPlaceholder(x) ? `<span class="phx">${esc(x)}</span>` : esc(x))).join("<br>")}</dd></div><div><dt>Deliverables</dt><dd>${c.deliverables.map(esc).join("<br>")}</dd></div>
    </dl>
  </header>`;
}

export function ImageSequence(p, items, from = 0, to = items.length) {
  return `<div class="seq">${items.slice(from, to).map(([k, cap]) => `<figure class="seq-item${k === "rejected" ? " rejected" : ""}">${Img(`../../assets/img/${p.slug}-${k}.svg`, [1600, 1000], `${p.name}: ${cap}`)}<figcaption>${esc(cap)}</figcaption></figure>`).join("")}</div>`;
}
