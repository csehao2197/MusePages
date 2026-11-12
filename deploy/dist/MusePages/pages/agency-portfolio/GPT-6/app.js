/* Icons are locally vendored Lucide SVGs; no runtime library or network dependency. */
const projects = [
  {id:"solaris",title:"Solaris Rebrand",client:"Solaris Energy",categories:["Branding"],art:"solaris",year:"2026",line:"Making clean energy impossible to ignore.",challenge:"Give a regional solar installer a confident national identity without losing its approachable roots.",approach:"A solar-inspired visual system, plain-spoken messaging, and a faster, clearer path from curiosity to consultation.",results:["+340% qualified leads","+127% organic traffic","0.9s page load"]},
  {id:"bloom",title:"Bloom E-commerce",client:"Bloom Skincare",categories:["E-commerce","Web Design"],art:"bloom",year:"2026",line:"A little care goes a long way.",challenge:"Translate a considered skincare philosophy into a calm, intuitive shopping experience.",approach:"Ingredient-first storytelling, tactile packaging, and a frictionless mobile product discovery flow.",results:["+46% conversion","+28% basket value","A calmer checkout"]},
  {id:"nexus",title:"Nexus Dashboard",client:"Nexus Finance",categories:["Product Design"],art:"nexus",year:"2026",line:"Big financial pictures. Beautifully clear.",challenge:"Help finance teams understand complex, fragmented data at a glance.",approach:"A focused dark-mode dashboard, consistent data visualizations, and purposeful hierarchy across key workflows.",results:["6 core workflows","One design system","Clearer decisions"]},
  {id:"wander",title:"Wander App",client:"Wander Travel",categories:["Mobile Apps"],art:"wander",year:"2026",line:"Less planning. More getting lost.",challenge:"Make independent travel planning feel spontaneous rather than overwhelming.",approach:"Map-led discovery, curated local routes, and a lightweight itinerary that travels with you.",results:["Map-first discovery","24 local routes","Offline-ready concept"]},
  {id:"crest",title:"Crest Brewing",client:"Crest Craft Beer",categories:["Branding","Web Design"],art:"crest",year:"2025",line:"Crafted with a little more character.",challenge:"Bring a small brewery's distinctive local personality to a crowded market.",approach:"An earthy identity, bold editorial typography, and an inviting digital home for the brewing community.",results:["A complete identity","12 packaging formats","A digital taproom"]},
  {id:"pulse",title:"Pulse Fitness",client:"Pulse Gym",categories:["Digital Marketing","Web Design"],art:"pulse",year:"2025",line:"Find your next gear.",challenge:"Turn a neighborhood gym into a destination for people looking for a fresh start.",approach:"Movement-led art direction, energetic campaign messaging, and a focused trial-membership landing experience.",results:["+62% trial interest","3 campaign concepts","A stronger first step"]},
  {id:"arborist",title:"Arborist",client:"Arborist Consulting",categories:["Branding"],art:"arborist",year:"2026",line:"Growth, with good roots.",challenge:"Create a thoughtful identity for a consultancy working at the intersection of business and sustainability.",approach:"An organic geometric mark, disciplined green palette, and a flexible system that makes complex ideas approachable.",results:["One flexible system","18 brand assets","A fresh perspective"]},
  {id:"kindred",title:"Kindred",client:"Kindred Community",categories:["Web Design"],art:"kindred",year:"2025",line:"A place to find your people.",challenge:"Make a growing community platform feel personal from the very first visit.",approach:"Warm color fields, welcoming stories, and accessible navigation built around shared interests.",results:["A warmer welcome","8 community spaces","Better discovery"]},
  {id:"volt",title:"Volt EV",client:"Volt Motors",categories:["E-commerce","Branding"],art:"volt",year:"2026",line:"The future has a little more charge.",challenge:"Make choosing an electric vehicle feel exciting and easy to understand.",approach:"A technical yet human brand, editorial vehicle storytelling, and a guided configuration concept.",results:["4 trim concepts","A guided journey","A sharper identity"]},
  {id:"nourish",title:"Nourish",client:"Nourish Meal Kits",categories:["E-commerce"],art:"nourish",year:"2025",line:"Good food. Less fuss.",challenge:"Help busy households discover a better weeknight dinner routine.",approach:"An ingredient-rich visual language, simple meal browsing, and flexible subscription storytelling.",results:["32 recipe concepts","Clearer meal plans","A fresher experience"]},
  {id:"studiox",title:"StudioX",client:"StudioX Coworking",categories:["Web Design","Digital Marketing"],art:"studiox",year:"2026",line:"Room for your next big idea.",challenge:"Turn empty desks into a compelling proposition for independent creative teams.",approach:"Architectural art direction, clear membership options, and campaigns that celebrate the people behind the work.",results:["3 membership tiers","A focused campaign","Space to connect"]},
  {id:"clarity",title:"Clarity",client:"Clarity Health",categories:["Mobile Apps","Product Design"],art:"clarity",year:"2026",line:"A little clearer, every day.",challenge:"Make everyday wellbeing easier to understand without adding another complicated routine.",approach:"Calm health tracking screens, gentle daily check-ins, and patterns designed around small, achievable steps.",results:["5 daily check-ins","A calm design system","Human-first tracking"]},
  {id:"fieldwork",title:"Fieldwork Journal",client:"Fieldwork Outdoors",categories:["Branding","Web Design"],art:"fieldwork",year:"2025",line:"Stories from the outside."},
  {id:"form",title:"Form Objects",client:"Form Home",categories:["E-commerce"],art:"form",year:"2026",line:"Everyday objects. Extraordinary care."},
  {id:"ratio",title:"Ratio Analytics",client:"Ratio Labs",categories:["Product Design"],art:"ratio",year:"2025",line:"Find the signal."},
  {id:"alto",title:"Alto Audio",client:"Alto Sound",categories:["Branding"],art:"alto",year:"2026",line:"A new frequency."},
  {id:"common",title:"Common Ground",client:"Common Coffee",categories:["E-commerce","Branding"],art:"common",year:"2025",line:"Your daily meeting point."},
  {id:"orbit",title:"Orbit Learning",client:"Orbit Education",categories:["Mobile Apps","Product Design"],art:"orbit",year:"2026",line:"Keep your curiosity moving."},
  {id:"still",title:"Still Spaces",client:"Still Architecture",categories:["Web Design"],art:"still",year:"2025",line:"Make room for less."},
  {id:"tempo",title:"Tempo Running",client:"Tempo Athletics",categories:["Digital Marketing"],art:"tempo",year:"2026",line:"On your own terms."},
  {id:"pollen",title:"Pollen Market",client:"Pollen Flowers",categories:["E-commerce","Web Design"],art:"pollen",year:"2026",line:"A brighter everyday."},
  {id:"morrow",title:"Morrow Ventures",client:"Morrow Capital",categories:["Branding"],art:"morrow",year:"2025",line:"Invested in what comes next."},
  {id:"patch",title:"Patch Together",client:"Patch Collective",categories:["Mobile Apps"],art:"patch",year:"2026",line:"Small acts. Shared impact."},
  {id:"folio",title:"Folio Platform",client:"Folio Creative",categories:["Product Design","Digital Marketing"],art:"folio",year:"2025",line:"Give good work a home."}
];
let activeFilter = "All";
let activeView = "grid";
let activeCase = 0;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const icon = name => `<svg aria-hidden="true" width="20" height="20"><use href="assets/icons.svg#${name}"></use></svg>`;
function hydrateIcons(root = document) {
  $$("[data-icon]", root).forEach(node => { node.outerHTML = icon(node.dataset.icon); });
}
hydrateIcons();
function renderProjects() {
  const filtered = projects.filter(project => activeFilter === "All" || project.categories.includes(activeFilter));
  const card = project => `<article class="project-card"><button class="case-open" data-case="${project.id}" aria-label="View case study: ${project.title}"><div class="project-image"><img src="assets/${project.art}.svg" alt="${project.title} — ${project.line}" loading="lazy"><div class="overlay" aria-hidden="true"><strong>${project.title}</strong><span>${project.client}</span><em>${project.categories.join(" + ")}</em><b>View Case Study ${icon("arrow-up-right")}</b></div></div><div class="project-caption"><div><h3>${project.title}</h3><p>${project.categories.join(" / ")}</p></div><span>${project.year} ${icon("arrow-up-right")}</span></div></button></article>`;
  const first = activeFilter === "All" ? filtered.slice(0,6) : filtered;
  $("#projects-before").innerHTML = first.map(card).join("");
  $("#projects-after").innerHTML = activeFilter === "All" ? filtered.slice(6).map(card).join("") : "";
  $("#projects-after").hidden = activeFilter !== "All";
  $("#featured").hidden = activeFilter !== "All";
  $$(".project-grid").forEach(grid => grid.classList.toggle("list", activeView === "list"));
  $("#results-count").textContent = `Showing ${filtered.length} project${filtered.length === 1 ? "" : "s"}${activeFilter === "All" ? "" : ` · ${activeFilter}`}`;
}
renderProjects();
$$("[data-filter]").forEach(button => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  $$("[data-filter]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  renderProjects();
}));
$$("[data-view]").forEach(button => button.addEventListener("click", () => {
  activeView = button.dataset.view;
  $$("[data-view]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  renderProjects();
}));
const detail = $("#detail-dialog");
const inquiry = $("#project-dialog");
function openDetail(html) {
  $("#detail-content").innerHTML = html;
  if (!detail.open) detail.showModal();
  detail.scrollTop = 0;
}
function showCase(id) {
  activeCase = projects.findIndex(project => project.id === id);
  if (activeCase < 0) return;
  const project = projects[activeCase];
  const results = project.results || ["A distinct identity","A focused experience","A scalable system"];
  openDetail(`<span class="eyebrow">${project.client} / ${project.year}</span><h2 id="detail-title">${project.title}</h2><p>${project.line}</p><div class="dialog-tags">${project.categories.map(category => `<span>${category}</span>`).join("")}</div><img class="dialog-art" src="assets/${project.art}.svg" alt="${project.title} concept artwork"><h3>The challenge</h3><p>${project.challenge || `Build a distinctive, purposeful experience for ${project.client} that connects a clear business ambition with the people it serves.`}</p><h3>Our approach</h3><p>${project.approach || "Start with audience needs, sharpen the story, and bring it to life through an original visual direction and a considered digital experience."}</p><div class="case-facts">${results.map(result => `<div><strong>${result}</strong><span>Illustrative concept outcome</span></div>`).join("")}</div><p class="small-muted">Fictional client and project. All metrics are illustrative, not verified business outcomes. Artwork is original; project websites and apps are visual concepts, not separate live products.</p><div class="case-navigation"><button class="button outline" data-next-case="-1">${icon("arrow-left")} Previous project</button><button class="button dark" data-next-case="1">Next project ${icon("arrow-right")}</button></div>`);
}
const services = {
  branding: {title:"Brand Strategy & Identity",intro:"A clear point of view. A brand people can feel.",items:["Discovery and positioning workshops","Naming, messaging, and tone of voice","Visual identity, typography, and art direction","Brand guidelines and rollout toolkit"],note:"Together, we turn what makes you different into a system that works everywhere."},
  web: {title:"Web Design & Development",intro:"A beautiful first impression. An even better experience.",items:["Audience research and information architecture","Responsive user experience and interface design","Accessible component and design systems","Performance-minded front-end implementation"],note:"From the first sketch to the final interaction, every detail has a job to do."},
  marketing: {title:"Digital Marketing",intro:"Get noticed by the right people, for the right reasons.",items:["Search and content strategy","Paid campaign concepts and landing pages","Creative direction and channel storytelling","Measurement planning and continuous iteration"],note:"Build a growth plan around useful content and a consistent brand story."}
};
function showService(key) {
  const service = services[key];
  if (!service) return;
  openDetail(`<span class="eyebrow">Studio capabilities</span><h2 id="detail-title">${service.title}</h2><p>${service.intro}</p><ul class="info-list">${service.items.map(item => `<li>${item}</li>`).join("")}</ul><p>${service.note}</p><p class="small-muted">Concept service overview. Scope, pricing, and delivery would be agreed in a real engagement.</p><button class="button dark" data-project>Discuss a project ${icon("arrow-up-right")}</button>`);
}
const info = {
  process: `<h2 id="detail-title">Good work is a team sport.</h2><p>Our concept process keeps the right questions at the center.</p><ol class="info-list"><li><strong>Discover.</strong> Understand your audience, goals, and the real problem.</li><li><strong>Define.</strong> Agree a focused strategy and a shared measure of success.</li><li><strong>Design.</strong> Explore, prototype, test, and refine together.</li><li><strong>Deliver.</strong> Bring the details together and plan what comes next.</li></ol><button class="button dark" data-project>Start with a conversation ${icon("arrow-up-right")}</button>`,
  insights: `<span class="eyebrow">The studio journal / Concept edition</span><h2 id="detail-title">A little food for thought.</h2><article class="journal"><span>STRATEGY / 4 MIN READ</span><h3>A brand is a promise you keep.</h3><p>A useful identity does more than look distinctive. It gives a team a shared language, helps customers know what to expect, and makes everyday decisions a little easier. Start with the promise. Let the visuals make it tangible.</p></article><article class="journal"><span>DIGITAL / 3 MIN READ</span><h3>Make the next step obvious.</h3><p>The best digital experiences reduce uncertainty. Prioritize a clear hierarchy, honest labels, and feedback after every important action. Good design helps people move forward with confidence.</p></article><p class="small-muted">Original editorial notes written for this fictional studio.</p>`,
  careers: `<span class="eyebrow">Good people make good work.</span><h2 id="detail-title">Different minds.<br>Shared standards.</h2><p>We imagine a studio for curious strategists, thoughtful designers, and detail-obsessed makers.</p><h3>Current opportunities</h3><p>There are no real open positions. Forge & Co. is a fictional agency concept, and this page does not collect applications.</p><p>Explore the work and our process to get a sense of the studio we have in mind.</p>`,
  email: `<h2 id="detail-title">Let's keep it local.</h2><p>hello@forgeandco.com is an illustrative contact address for this fictional studio, not a verified inbox.</p><p>Use the project brief preview to try the inquiry experience. Nothing is emailed, submitted, or saved.</p><button class="button dark" data-project>Preview a project brief ${icon("arrow-up-right")}</button>`
};
document.addEventListener("click", event => {
  const caseButton = event.target.closest("[data-case]");
  const service = event.target.closest("[data-service]");
  const information = event.target.closest("[data-info]");
  if (caseButton) showCase(caseButton.dataset.case);
  if (event.target.closest("[data-next-case]")) {
    const step = Number(event.target.closest("[data-next-case]").dataset.nextCase);
    showCase(projects[(activeCase + step + projects.length) % projects.length].id);
  }
  if (service) { event.preventDefault(); showService(service.dataset.service); }
  if (information) {
    const key = information.dataset.info;
    openDetail(key === "social" ? `<h2 id="detail-title">${information.dataset.network} / Studio concept</h2><p>Forge & Co. does not have a verified ${information.dataset.network} account in this demo. No external profile is opened.</p><p>All portfolio work can be explored right here, without leaving the page.</p>` : info[key]);
  }
  if (event.target.closest("[data-project]")) { detail.close(); inquiry.showModal(); }
  if (event.target.closest(".close-dialog")) event.target.closest("dialog").close();
});
$$("dialog").forEach(dialog => {
  dialog.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;
    const focusable = $$("button,a[href],input,select,textarea",dialog).filter(node => !node.disabled && node.getClientRects().length);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (dialog === inquiry) { $("#project-form").reset(); $("#project-form").hidden = false; $("#brief-preview").hidden = true; $("#brief-output").replaceChildren(); $("#form-error").textContent = ""; $$("[aria-invalid]", dialog).forEach(input => input.removeAttribute("aria-invalid")); }
  });
});
$("#project-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const fields = ["name","email","service","brief"].map(name => form.elements.namedItem(name));
  fields.forEach(input => { input.value = input.value.trim(); input.removeAttribute("aria-invalid"); });
  const invalid = fields.find(input => !input.checkValidity() || !input.value || (input.name === "brief" && input.value.replace(/\s/g,"").length < 20));
  if (invalid) {
    invalid.setAttribute("aria-invalid","true");
    $("#form-error").textContent = invalid.name === "brief" ? "Tell us a little more: use at least 20 non-whitespace characters." : `Please enter a valid ${invalid.name === "service" ? "service selection" : invalid.name}.`;
    invalid.focus();
    return;
  }
  $("#form-error").textContent = "";
  const output = $("#brief-output");
  output.replaceChildren();
  ["Name","Email","Service","Project"].forEach((label,index) => {
    const line = document.createElement("p");
    const title = document.createElement("strong");
    title.textContent = `${label}: `;
    line.append(title,document.createTextNode(fields[index].value));
    output.append(line);
  });
  form.hidden = true;
  $("#brief-preview").hidden = false;
  $("#edit-brief").focus();
});
$("#edit-brief").addEventListener("click", () => { $("#project-form").hidden = false; $("#brief-preview").hidden = true; $("#project-form input").focus(); });
const menu = $(".menu-button");
menu.addEventListener("click", () => {
  const expanded = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded",String(expanded));
  menu.setAttribute("aria-label", expanded ? "Close menu" : "Open menu");
  $("#navigation").classList.toggle("open", expanded);
});
$("#navigation").addEventListener("click", event => { if (event.target.closest("a,button")) { menu.setAttribute("aria-expanded","false"); menu.setAttribute("aria-label","Open menu"); $("#navigation").classList.remove("open"); } });
document.addEventListener("keydown", event => { if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") menu.click(); });
const brands = ["solaris","bloom","NEXUS","wander","CREST","PULSE","arborist","kindred","VOLT","nourish","StudioX","clarity","Fieldwork","FORM","alto","ORBIT"];
function logoRow(names) { return [...names,...names].map((name,index) => `<span ${index >= names.length ? 'aria-hidden="true"' : ""}>${name}</span>`).join(""); }
$("#logos-one").innerHTML = logoRow(brands);
$("#logos-two").innerHTML = logoRow([...brands.slice(8),...brands.slice(0,8)]);
$("#logos-two").setAttribute("aria-hidden","true");
$("#marquee-toggle").addEventListener("click", event => {
  const button = event.currentTarget;
  const paused = button.getAttribute("aria-pressed") !== "true";
  $(".marquee").classList.toggle("paused",paused);
  button.setAttribute("aria-pressed",String(paused));
  button.setAttribute("aria-label",paused ? "Play client logos" : "Pause client logos");
  button.innerHTML = icon(paused ? "play" : "pause");
});
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  observer.unobserve(entry.target);
  const node = entry.target;
  if (reducedMotion.matches) return;
  const target = Number(node.dataset.count);
  const decimals = String(target).includes(".") ? 1 : 0;
  const start = performance.now();
  const tick = now => {
    const progress = Math.min((now-start)/1000,1);
    const value = (target*(1-Math.pow(1-progress,3))).toFixed(decimals);
    node.textContent = `${node.dataset.prefix || ""}${value}${node.dataset.suffix || ""}`;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}),{threshold:.6});
$$("[data-count]").forEach(node => observer.observe(node));
