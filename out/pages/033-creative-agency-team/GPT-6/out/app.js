"use strict";
(() => {
  const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
  const crew = [
    ["Sofia Reyes","Senior Designer","Design","Can identify any typeface in under 3 seconds","sofia"],
    ["James Wright","Frontend Engineer","Engineering","Built his first website at age 11","james"],
    ["Aiko Tanaka","Motion Designer","Design","Collects vintage synthesizers","aiko"],
    ["Liam O'Brien","Backend Engineer","Engineering","Former professional chess player","liam"],
    ["Nina Petrova","UX Researcher","Design","Has interviewed 500+ users this year","nina"],
    ["Carlos Mendez","Project Manager","Operations","Fluent in 4 languages","carlos"],
    ["Zara Ahmed","Brand Strategist","Strategy","Published author on brand psychology","zara"],
    ["Tom Fischer","DevOps Engineer","Engineering","Homebrews beer and deploys on Fridays","tom"],
    ["Elena Rossi","Product Designer","Design","Sketches a new city every weekend","priya"],
    ["Noah Brooks","Design Systems Lead","Design","Thinks in components, cooks without recipes","marcus"],
    ["Mei Lin","Visual Designer","Design","Makes tiny ceramics in a very tiny studio","rachel"],
    ["Oliver Grant","Accessibility Designer","Design","Can name every bird in the garden","liam"],
    ["Amara Nwosu","Interaction Designer","Design","Finds inspiration in everyday choreography","zara"],
    ["Priya Sharma","Creative Director","Design","Obsessed with motion and micro-interactions","priya"],
    ["Lucas Silva","Full-Stack Engineer","Engineering","Maintains a very opinionated coffee setup","marcus"],
    ["Hana Park","Frontend Engineer","Engineering","Turns long walks into fresh ideas","aiko"],
    ["Ethan Cole","Backend Engineer","Engineering","Loves a good puzzle and a clean API","james"],
    ["Fatima Ali","QA Engineer","Engineering","Finds the edge case before the first coffee","nina"],
    ["Ben Turner","Platform Engineer","Engineering","Builds mechanical keyboards from scratch","liam"],
    ["Leila Haddad","Creative Developer","Engineering","Makes generative art after hours","sofia"],
    ["Sam Rivera","Mobile Engineer","Engineering","Knows the best taco spot in every city","carlos"],
    ["Yuki Sato","Frontend Engineer","Engineering","Runs a neighborhood film club","aiko"],
    ["Marcus Chen","CTO & Co-Founder","Engineering","An open-source advocate, on and off the clock","marcus"],
    ["David Okafor","Head of Strategy","Strategy","Turns business problems into creative possibilities","david"],
    ["Isabel Costa","Content Strategist","Strategy","Collects opening lines from favorite novels","rachel"],
    ["Theo Martin","Digital Strategist","Strategy","Never travels without a paper map","james"],
    ["Grace Mensah","Research Strategist","Strategy","Believes every good question starts a story","zara"],
    ["Rachel Kim","CEO & Co-Founder","Operations","Believes every pixel should have a purpose","rachel"],
    ["Alex Morgan","People & Culture Lead","Operations","Hosts the studio's fiercely friendly quiz","tom"],
    ["Maya Patel","Studio Operations","Operations","A spreadsheet enthusiast with a green thumb","priya"],
    ["Daniel Lee","Finance & Operations","Operations","Brings homemade bread to every retreat","marcus"],
    ["Chloe Dubois","Brand Designer","Design","Has a postcard collection from 30 countries","sofia"]
  ];
  let filter = "All";
  let expanded = false;
  const grid = document.querySelector("#team-grid");
  const expand = document.querySelector("#expand-team");
  function renderCrew() {
    const matches = crew.filter((person) => filter === "All" || person[2] === filter);
    const visible = filter === "All" && !expanded ? matches.slice(0, 8) : matches;
    grid.innerHTML = visible.map(([name, role, department, fact, photo]) => `<article class="team-card" data-department="${department}"><div class="team-image"><img src="assets/portrait-${photo}.jpg" width="420" height="420" loading="lazy" alt="Illustrative stock portrait for fictional ${name}"><div class="team-socials"><button data-profile="${name}|LinkedIn" aria-label="${name} LinkedIn demo">${icon("linkedin")}</button><button data-profile="${name}|${department === "Engineering" ? "GitHub" : "Portfolio"}" aria-label="${name} ${department === "Engineering" ? "GitHub" : "Portfolio"} demo">${icon(department === "Engineering" ? "github" : "arrow-up-right")}</button></div></div><div class="team-copy"><h3>${name}</h3><p class="role">${role}</p><p class="fact">${fact}</p></div></article>`).join("");
    expand.hidden = filter !== "All";
    expand.setAttribute("aria-expanded", String(expanded));
    expand.innerHTML = `${expanded ? "Show fewer team members" : "View all 32 team members"} ${icon(expanded ? "minus" : "plus")}`;
    document.querySelector("#team-status").textContent = `Showing ${visible.length} of ${matches.length} ${filter === "All" ? "team" : filter} members.`;
  }
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      expanded = false;
      document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      renderCrew();
    });
  });
  expand.addEventListener("click", () => {
    expanded = !expanded;
    renderCrew();
    if (!expanded) document.querySelector("#crew-title").scrollIntoView({ block: "start" });
  });
  renderCrew();

  const menuButton = document.querySelector(".menu-button");
  const navigation = document.querySelector("#navigation");
  function closeMenu() {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  }
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    navigation.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a,button")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuButton.focus();
    }
  });
  matchMedia("(min-width: 801px)").addEventListener("change", closeMenu);

  const dialog = document.querySelector("#studio-dialog");
  const title = document.querySelector("#dialog-title");
  const content = document.querySelector("#dialog-content");
  let opener = null;
  function openDialog(heading, html) {
    opener = document.activeElement;
    title.textContent = heading;
    content.innerHTML = html;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    dialog.scrollTop = 0;
  }
  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  document.addEventListener("keydown", (event) => {
    if (!dialog.open || event.key !== "Tab") return;
    const controls = [...dialog.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')]
      .filter((element) => element.getClientRects().length);
    const first = controls[0];
    const last = controls.at(-1);
    if (!dialog.contains(document.activeElement) || (event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
      event.preventDefault();
      (event.shiftKey ? last : first)?.focus();
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    content.replaceChildren();
    document.body.style.overflow = "";
    opener?.focus();
  });
  document.addEventListener("click", (event) => {
    const profile = event.target.closest("[data-profile]");
    if (profile) {
      const [person, platform] = profile.dataset.profile.split("|");
      openDialog("A human, not a hyperlink.", '<p id="profile-description"></p><p class="dialog-note">This person and biography are fictional. Social destinations are simulated locally; no real profile or employer is being represented.</p>');
      document.querySelector("#profile-description").textContent = `${person} · ${platform} profile preview`;
    }
  });

  const roles = [
    { title: "Senior Product Designer", category: "Design · Remote (US/EU) · Full-time", intro: "Shape thoughtful products from the first research question to the final interaction.", tasks: ["Lead discovery and product design with a small multidisciplinary team.", "Bring strong interaction, systems, and prototyping skills.", "Share a portfolio that explains your decisions, not just the pixels."] },
    { title: "Full-Stack Engineer (Next.js)", category: "Engineering · Remote · Full-time", intro: "Build resilient, accessible experiences with people who care about the details.", tasks: ["Work across React, Next.js, TypeScript, and Node.js.", "Collaborate early with design and strategy.", "Explain the trade-offs behind a recent product you've shipped."] },
    { title: "Content Strategist", category: "Strategy · Remote (US) · Full-time", intro: "Find the story, make the complex clear, and help brands sound like themselves.", tasks: ["Connect audience research to content and brand strategy.", "Create clear systems for voice, messaging, and editorial work.", "Bring a few writing samples and the thinking behind them."] },
    { title: "Design Intern — Summer 2026", category: "Design · New York or Remote · Internship · Archived example", intro: "An archived summer role preserved from the original concept. It is not accepting real applications.", tasks: ["Explore research, visual design, and prototyping with a mentor.", "Share a student or personal project you're proud of.", "This local demo shows an example application flow only."] }
  ];
  document.querySelectorAll("[data-job]").forEach((button) => button.addEventListener("click", () => {
    const role = roles[Number(button.dataset.job)];
    openDialog(role.title, `<p>${role.category}</p><p>${role.intro}</p><ul class="job-description">${role.tasks.map((task) => `<li>${task}</li>`).join("")}</ul><p class="dialog-note">Fictional position. This is a local demonstration, not a live recruiting service.</p><button class="button button-dark" id="role-apply">Preview an application ${icon("arrow-up-right")}</button>`);
    document.querySelector("#role-apply").addEventListener("click", () => showForm("application", role.title, true));
  }));
  const localNote = '<p class="dialog-note">Local preview only. Nothing is sent, saved, or uploaded. Please use made-up details. Closing this dialog clears your entries.</p>';
  function formMarkup(type, role) {
    const application = type === "application";
    return `${localNote}<form id="preview-form" novalidate><label>${application ? "Your name (example)" : "Project or studio name (example)"}<input name="name" required maxlength="80" autocomplete="off" placeholder="${application ? "Alex Example" : "A new idea"}"></label>${application ? '<label>Portfolio URL<input name="portfolio" type="url" required maxlength="300" autocomplete="off" placeholder="https://example.com/portfolio"></label>' : '<label>What are we making?<select name="project"><option>Digital product</option><option>Brand experience</option><option>Creative development</option><option>Something different</option></select></label>'}<label>${application ? "What excites you about this role?" : "Tell us a little about your idea"}<textarea name="note" required minlength="10" maxlength="1200" placeholder="A few thoughtful sentences…" autocomplete="off"></textarea></label><p class="form-error" id="form-error" role="alert"></p><button class="button button-dark" type="submit">Create local preview ${icon("arrow-up-right")}</button></form><section class="preview-result" id="preview-result" tabindex="-1" aria-labelledby="preview-title" hidden><h3 id="preview-title">Your local ${application ? "application" : "project"} preview</h3><p id="preview-role"></p><p id="preview-name"></p><p id="preview-link"></p><p id="preview-note"></p><p><strong>Preview only — not submitted.</strong> Nothing has been sent or saved.</p><button class="button button-outline" id="edit-preview">Edit preview</button></section>`;
  }
  function wireForm(type, role) {
    const form = document.querySelector("#preview-form");
    const error = document.querySelector("#form-error");
    const result = document.querySelector("#preview-result");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      error.textContent = "";
      const name = form.elements.name;
      const note = form.elements.note;
      const portfolio = form.elements.portfolio;
      let invalid = null;
      if (!name.value.trim()) { error.textContent = "Please enter an example name, not only spaces."; invalid = name; }
      else if (portfolio) {
        try {
          const url = new URL(portfolio.value.trim());
          if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw Error();
        } catch { error.textContent = "Please use a full http:// or https:// portfolio URL without credentials."; invalid = portfolio; }
      }
      if (!invalid && note.value.trim().length < 10) { error.textContent = "Please add at least 10 non-space characters about your idea."; invalid = note; }
      if (invalid) { invalid.focus(); return; }
      if (!form.checkValidity()) { form.reportValidity(); return; }
      document.querySelector("#preview-role").textContent = type === "application" ? `Role: ${role}` : `Project type: ${form.elements.project.value}`;
      document.querySelector("#preview-name").textContent = `Name: ${name.value.trim()}`;
      document.querySelector("#preview-link").textContent = portfolio ? `Portfolio: ${portfolio.value.trim()}` : "";
      document.querySelector("#preview-note").textContent = note.value.trim();
      form.hidden = true;
      result.hidden = false;
      result.focus();
    });
    document.querySelector("#edit-preview").addEventListener("click", () => {
      result.hidden = true;
      form.hidden = false;
      form.elements.name.focus();
    });
  }
  function showForm(type, role = "Open application", reuseDialog = false) {
    const heading = type === "application" ? role : "Let's make something matter.";
    if (reuseDialog) {
      title.textContent = heading;
      content.innerHTML = formMarkup(type, role);
      dialog.scrollTop = 0;
    } else openDialog(heading, formMarkup(type, role));
    wireForm(type, role);
    content.querySelector("input").focus();
  }
  document.querySelectorAll("[data-apply]").forEach((button) => button.addEventListener("click", () => showForm("application")));
  document.querySelectorAll("[data-project]").forEach((button) => button.addEventListener("click", () => showForm("project")));
  document.querySelectorAll("[data-work]").forEach((button) => button.addEventListener("click", () => {
    openDialog("A few things we could make.", '<p>Three fictional case studies, created to show the kind of cross-disciplinary work Mosaic might do. These are concepts, not commissioned client work.</p><article class="project-case"><h3>Fieldnotes</h3><p>A slower kind of travel platform. Strategy, identity, and a calm, accessible booking concept.</p></article><article class="project-case"><h3>Common Ground</h3><p>A digital home for a neighborhood arts collective. Brand storytelling meets a playful event experience.</p></article><article class="project-case"><h3>Orbit</h3><p>A collaborative planning tool. Research, a flexible design system, and an intuitive product prototype.</p></article><p class="dialog-note">Concept summaries only. No live products, performance claims, or client endorsements.</p><button class="button button-dark" id="work-project">Explore your idea '+icon("arrow-up-right")+'</button>');
    document.querySelector("#work-project").addEventListener("click", () => showForm("project", "", true));
  }));
})();
