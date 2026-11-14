(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // [name, title, dept, fun fact, look: skin, hair, style, top, glasses, beard]
  const TEAM = [
    ["Sofia Reyes", "Senior Designer", "Design", "Can identify any typeface in under 3 seconds", [2, 0, "long", 0, 0, 0]],
    ["James Wright", "Frontend Engineer", "Engineering", "Built his first website at age 11", [0, 3, "short", 2, 1, 0]],
    ["Aiko Tanaka", "Motion Designer", "Design", "Collects vintage synthesizers", [7, 0, "bob", 1, 0, 0]],
    ["Liam O'Brien", "Backend Engineer", "Engineering", "Former professional chess player", [0, 7, "side", 3, 0, 1]],
    ["Nina Petrova", "UX Researcher", "Design", "Has interviewed 500+ users this year", [0, 4, "bun", 6, 1, 0]],
    ["Carlos Mendez", "Project Manager", "Operations", "Fluent in 4 languages", [3, 0, "short", 4, 0, 1]],
    ["Zara Ahmed", "Brand Strategist", "Strategy", "Published author on brand psychology", [4, 0, "wrap", 1, 0, 0]],
    ["Tom Fischer", "DevOps Engineer", "Engineering", "Homebrews beer and deploys on Fridays", [0, 4, "buzz", 5, 0, 1]],
    ["Mateo Silva", "Product Designer", "Design", "Sketches every idea on paper first", [3, 1, "curly", 3, 0, 0]],
    ["Kwame Mensah", "Staff Engineer", "Engineering", "Runs a weekly Rust study group", [6, 0, "buzz", 0, 1, 1]],
    ["Isabel Moreno", "Content Strategist", "Strategy", "Writes microcopy in three languages", [2, 2, "long", 8, 0, 0]],
    ["Chloe Martin", "People & Culture Lead", "Operations", "Plans every retreat down to the playlist", [0, 3, "bob", 9, 0, 0]],
    ["Hana Lee", "Visual Designer", "Design", "Paints a tiny watercolor every morning", [7, 0, "long", 6, 0, 0]],
    ["Yuki Sato", "iOS Engineer", "Engineering", "Has shipped 14 apps to the App Store", [7, 6, "short", 7, 1, 0]],
    ["Noah Becker", "Product Strategist", "Strategy", "Ran a pop-up bakery for a summer", [1, 3, "side", 2, 0, 0]],
    ["Ethan Brooks", "Finance Lead", "Operations", "Keeps the open-salary spreadsheet spotless", [5, 0, "buzz", 4, 1, 0]],
    ["Olu Adeyemi", "Illustrator", "Design", "Illustrated two children's books", [6, 0, "curly", 1, 0, 1]],
    ["Ana Costa", "Frontend Engineer", "Engineering", "Animates CSS for fun on weekends", [2, 1, "bun", 0, 0, 0]],
    ["Amara Diallo", "Data Analyst", "Strategy", "Turns any dataset into a story", [6, 0, "wrap", 3, 1, 0]],
    ["Maya Singh", "Studio Coordinator", "Operations", "Knows every courier in Lisbon by name", [4, 0, "long", 5, 0, 0]],
    ["Freya Larsen", "Design Systems Lead", "Design", "Maintains 400+ components without breaking a sweat", [0, 4, "side", 7, 1, 0]],
    ["Ben Carter", "Full-Stack Engineer", "Engineering", "Ultra-marathon runner", [1, 2, "short", 8, 0, 0]],
    ["Leila Haddad", "QA Engineer", "Engineering", "Has found bugs in three browsers' devtools", [3, 0, "bob", 2, 0, 0]],
    ["Ravi Patel", "UI Designer", "Design", "Makes a mean masala chai for crit days", [4, 0, "side", 9, 1, 0]],
    ["Dmitri Volkov", "Creative Technologist", "Engineering", "Builds generative art with shaders", [0, 5, "short", 1, 0, 1]],
    ["Grace Liu", "Android Engineer", "Engineering", "Speedcubes in under 15 seconds", [7, 0, "bun", 3, 0, 0]],
    ["Elena Rossi", "Brand Designer", "Design", "Keeps a library of 2,000 matchbooks", [1, 3, "long", 4, 0, 0]],
    ["Sam Okoro", "Platform Engineer", "Engineering", "DJs at the quarterly retreat", [5, 0, "buzz", 6, 0, 0]],
    ["Rachel Kim", "CEO & Co-Founder", "Operations", "Former design lead at Spotify", [7, 0, "bob", 4, 0, 0]],
    ["Marcus Chen", "CTO & Co-Founder", "Engineering", "Maintains three open-source libraries", [7, 0, "short", 7, 1, 0]],
    ["Priya Sharma", "Creative Director", "Design", "3x Webby winner", [3, 0, "long", 1, 0, 0]],
    ["David Okafor", "Head of Strategy", "Strategy", "Ex-McKinsey consultant turned designer whisperer", [6, 0, "buzz", 0, 1, 1]],
  ];
  const person = (look, bg) => ({ skin: look[0], hair: look[1], hairStyle: look[2], top: look[3], glasses: !!look[4], beard: !!look[5], bg });
  const byName = Object.fromEntries(TEAM.map((m, i) => [m[0], person(m[4], i % 8)]));

  const LEADERS = [
    ["Rachel Kim", "CEO & Co-Founder", "Former design lead at Spotify. Believes every pixel should have a purpose.", [["in", "LinkedIn", "https://www.linkedin.com/"], ["x-logo", "Twitter", "https://x.com/"]]],
    ["Marcus Chen", "CTO & Co-Founder", "Full-stack architect with 15 years shipping products at scale. Open-source advocate.", [["in", "LinkedIn", "https://www.linkedin.com/"], ["github", "GitHub", "https://github.com/"]]],
    ["Priya Sharma", "Creative Director", "Award-winning designer. 3x Webby winner. Obsessed with motion and micro-interactions.", [["in", "LinkedIn", "https://www.linkedin.com/"], ["dribbble", "Dribbble", "https://dribbble.com/"]]],
    ["David Okafor", "Head of Strategy", "Ex-McKinsey. Turns business problems into design opportunities.", [["in", "LinkedIn", "https://www.linkedin.com/"], ["x-logo", "Twitter", "https://x.com/"]]],
  ];
  $("[data-leaders]").innerHTML = LEADERS.map(([n, t, bio, links]) => `
    <article class="leader">
      <div class="lead-photo">${window.Art.portrait({ ...byName[n], bg: 0 }, `Illustrated portrait of ${n}`, "circle")}</div>
      <h3>${esc(n)}</h3><p class="role">${esc(t)}</p><p class="bio">${esc(bio)}</p>
      <div class="socials">${links.map(([i, l, u]) => `<a href="${u}" target="_blank" rel="noopener" aria-label="${esc(n)} on ${l}">${icon(`i-${i}`)}</a>`).join("")}</div>
    </article>`).join("");
  $$("[data-avatar]").forEach((el) => { el.innerHTML = window.Art.portrait(byName[el.dataset.avatar], `Portrait of ${el.dataset.avatar}`, "circle"); });

  // ---------- crew grid ----------
  const DEPTS = ["All", "Design", "Engineering", "Strategy", "Operations"];
  let dept = "All", expanded = false;
  const LIMIT = 12;
  $("[data-pills]").innerHTML = DEPTS.map((d) => { const n = d === "All" ? TEAM.length : TEAM.filter((m) => m[2] === d).length; return `<button class="pill${d === "All" ? " on" : ""}" type="button" aria-pressed="${d === "All"}" data-dept="${d}">${d} <span>(${n})</span></button>`; }).join("");
  const crew = $("[data-crew]"), more = $("[data-more]");
  function renderCrew() {
    const list = TEAM.filter((m) => dept === "All" || m[2] === dept);
    const show = expanded || dept !== "All" ? list : list.slice(0, LIMIT);
    crew.innerHTML = show.map(([n, t, d, fact], i) => `
      <article class="mate" data-dept="${d}">
        <div class="mate-photo">${window.Art.portrait(byName[n], `Illustrated portrait of ${n}`)}
          <div class="mate-social"><a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="${esc(n)} on LinkedIn">${icon("i-in")}</a><a href="${d === "Engineering" ? "https://github.com/" : "https://dribbble.com/"}" target="_blank" rel="noopener" aria-label="${esc(n)} on ${d === "Engineering" ? "GitHub" : "Dribbble"}">${icon(d === "Engineering" ? "i-github" : "i-dribbble")}</a></div>
        </div>
        <div class="mate-body"><h3>${esc(n)}</h3><p class="role">${esc(t)}</p><p class="fact">“${esc(fact)}”</p></div>
      </article>`).join("");
    crew.classList.remove("fade"); void crew.offsetWidth; crew.classList.add("fade");
    more.parentElement.hidden = dept !== "All" || expanded;
  }
  $("[data-pills]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-dept]"); if (!b) return;
    dept = b.dataset.dept;
    $$(".pill").forEach((p) => { const on = p === b; p.classList.toggle("on", on); p.setAttribute("aria-pressed", String(on)); });
    b.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    renderCrew();
  });
  more.addEventListener("click", () => { expanded = true; renderCrew(); crew.children[LIMIT]?.querySelector("a")?.focus({ preventScroll: true }); });
  renderCrew();

  // ---------- scenes ----------
  $("[data-group]").innerHTML = window.Art.group();
  $$("[data-scene]").forEach((el) => { el.innerHTML = window.Art.scene(el.dataset.scene); });

  // ---------- jobs ----------
  const JOBS = [
    ["Senior Product Designer", "Design", "Remote (US/EU)", "Full-time", "Lead end-to-end product design for SaaS clients, from discovery workshops to polished, shippable UI."],
    ["Full-Stack Engineer (Next.js)", "Engineering", "Remote", "Full-time", "Build fast, accessible web products with Next.js, TypeScript and Postgres alongside our designers."],
    ["Content Strategist", "Strategy", "Remote (US)", "Full-time", "Shape voice, information architecture and microcopy that make complex products feel simple."],
    ["Design Intern — Summer 2026", "Design", "New York or Remote", "Internship", "A paid 12-week internship pairing you with a senior mentor on real client work."],
  ];
  const deptColor = { Design: "orange", Engineering: "purple", Strategy: "blue" };
  $("[data-jobs]").innerHTML = JOBS.map(([t, d, loc, type], i) => `
    <li class="job"><button type="button" class="job-btn" data-apply="${i}">
      <span class="job-title">${esc(t)}</span>
      <span class="dept ${deptColor[d]}">${d}</span>
      <span class="job-meta">${icon("i-pin")}${esc(loc)}</span>
      <span class="job-meta">${icon("i-clock")}${esc(type)}</span>
      <span class="job-go">${icon("i-arrow")}</span>
    </button></li>`).join("");

  // ---------- dialog ----------
  const dlg = $("[data-dlg]"), form = $("[data-form]");
  let mode = null;
  function openDialog(key) {
    mode = key; form.reset(); $("[data-done]").hidden = true; $("[data-err]").textContent = "";
    if (key === "project") {
      $("[data-dlg-kicker]").textContent = "New project"; $("[data-dlg-title]").textContent = "Start a Project";
      $("[data-dlg-desc]").innerHTML = "<p>Tell us what you're building. A strategist replies within two business days.</p>";
      $("[data-link-field]").firstChild.textContent = "Company website"; $("[data-submit]").textContent = "Send brief";
    } else if (key === "open") {
      $("[data-dlg-kicker]").textContent = "Open application"; $("[data-dlg-title]").textContent = "Introduce yourself";
      $("[data-dlg-desc]").innerHTML = "<p>We're always open to meeting exceptional people. Send your portfolio and a note about what excites you.</p>";
      $("[data-link-field]").firstChild.textContent = "Portfolio or LinkedIn"; $("[data-submit]").textContent = "Send application";
    } else {
      const [t, d, loc, type, desc] = JOBS[+key];
      $("[data-dlg-kicker]").textContent = `${d} · ${loc} · ${type}`; $("[data-dlg-title]").textContent = t;
      $("[data-dlg-desc]").innerHTML = `<p>${esc(desc)}</p><ul><li>Four-day week and $2,500 learning budget</li><li>Equity after year one</li><li>Quarterly team retreats</li></ul>`;
      $("[data-link-field]").firstChild.textContent = "Portfolio or LinkedIn"; $("[data-submit]").textContent = "Apply for this role";
    }
    dlg.showModal();
  }
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-apply]"); if (b) openDialog(b.dataset.apply); });
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = form.elements, miss = [];
    if (!f.name.value.trim()) miss.push("your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim())) miss.push("a valid email");
    if (f.link.value.trim() && !/^https?:\/\/\S+\.\S+/.test(f.link.value.trim())) miss.push("a full link starting with https://");
    if (miss.length) { $("[data-err]").textContent = `Please add ${miss.join(", ")}.`; return; }
    $("[data-err]").textContent = "";
    const first = f.name.value.trim().split(/\s+/)[0];
    $("[data-done-text]").textContent = mode === "project" ? `Thanks, ${first}. Your brief is with our strategy team. (Demo: nothing was sent.)` : `Thanks, ${first}. Your application for ${mode === "open" ? "an open role" : JOBS[+mode][0]} is in. (Demo: nothing was sent.)`;
    $("[data-done]").hidden = false;
  });

  // ---------- nav ----------
  const menu = $("[data-menu]"), mbtn = $("[data-menu-btn]");
  const closeMenu = () => { menu.hidden = true; mbtn.setAttribute("aria-expanded", "false"); mbtn.innerHTML = icon("i-menu"); };
  mbtn.addEventListener("click", () => { const open = menu.hidden; menu.hidden = !open; mbtn.setAttribute("aria-expanded", String(open)); mbtn.innerHTML = icon(open ? "i-close" : "i-menu"); });
  $$("a", menu).forEach((a) => a.addEventListener("click", closeMenu));
  addEventListener("scroll", () => $("[data-nav]").classList.toggle("scrolled", scrollY > 8), { passive: true });
  const toast = $("[data-toast]"); let tt;
  document.addEventListener("click", (e) => { const s = e.target.closest("[data-soon]"); if (!s) return; e.preventDefault(); closeMenu(); toast.textContent = `${s.dataset.soon} is part of the full site; this demo is the Team page.`; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3200); });

  window.MuseMosaic = { team: TEAM.length, shown: () => $$(".mate").length, dept: () => dept };
})();
