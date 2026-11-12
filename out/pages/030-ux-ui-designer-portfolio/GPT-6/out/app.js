(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const drawer = $("#mobile-menu"), menu = $(".menu");
  menu.addEventListener("click", () => { drawer.showModal(); menu.setAttribute("aria-expanded", "true"); });
  $("[data-close-menu]").addEventListener("click", () => drawer.close());
  drawer.addEventListener("close", () => menu.setAttribute("aria-expanded", "false"));
  $$("nav a", drawer).forEach((link) => link.addEventListener("click", () => drawer.close()));
  drawer.addEventListener("click", (event) => {
    const r = drawer.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right) drawer.close();
  });
  matchMedia("(min-width: 601px)").addEventListener("change", (event) => { if (event.matches && drawer.open) drawer.close(); });
  const profile = $("#profile-dialog");
  $$("[data-profile]").forEach((button) => button.addEventListener("click", () => {
    $("#profile-title").textContent = `${button.dataset.profile} reference`;
    profile.showModal();
  }));
  $("#close-profile").addEventListener("click", () => profile.close());
  const projects = {
    calendar: {
      title: "Notion Calendar Redesign", category: "Product Design · Mobile · 2025", image: "calendar.svg",
      challenge: "A person with several calendars repeatedly changes context just to find a free hour. This independent concept asks how one mobile schedule might surface commitments without merging away workspace boundaries.",
      role: "Illustrative lead product designer · 8-week concept · mobile interaction and design systems.",
      discovery: "A proposed study would observe cross-workspace scheduling, ask participants to narrate conflicts, and compare the time needed to find a slot. No participant interviews were conducted for this demo.",
      definition: "The working hypothesis is that uncertainty about workspace and availability creates more friction than the event form itself. The primary journey is choose a workspace, find a slot, then capture one clear commitment.",
      design: "A high-contrast day strip stays above a readable chronological agenda. Workspace labels are visible before entry, and the shortest event form asks for one title rather than exposing every advanced field.",
      validation: "A future moderated test would measure successful conflict detection, completion time, and accidental workspace assignment. The headline 34% improvement is an illustrative target, not a study result.",
      tradeoff: "Keeping boundaries explicit adds one small selection step. It avoids silently publishing a personal appointment into a work calendar.",
      deliver: "Semantic event rows, visible workspace text, a clear empty state, and focus-return rules are specified together. The sketch below demonstrates adding events to separate local-only workspaces."
    },
    analytics: {
      title: "Stripe Dashboard Analytics", category: "Data Visualization · Web App · 2024", image: "analytics.svg",
      challenge: "The merchant reporting concept brings six scattered perspectives into one coherent surface. It explores how a small business could answer 'what changed?' without opening a different report for each question.",
      role: "Illustrative product designer · 10-week concept · information architecture and data visualization.",
      discovery: "A proposed audit would map the questions merchants ask each week and the reports needed to answer them. No merchant data or proprietary Stripe interfaces were accessed.",
      definition: "The concept prioritizes a small shared time window, a clearly labeled revenue number, and an immediate visual trend. Secondary details should explain a change rather than compete with the main story.",
      design: "One period control updates the summary and chart together. Direct text labels preserve meaning without relying on color, and a common baseline makes changes comparable.",
      validation: "A future study would measure report navigation count and comprehension of period comparisons. The 60%, 89%, and $2.4B figures are fictional scenario values, not verified business results.",
      tradeoff: "A consolidated overview reduces navigation but can oversimplify an investigation. The proposed system keeps detail views discoverable while giving the summary a single time context.",
      deliver: "A period-state contract defines how dates, totals, captions, and chart labels update atomically. The local sketch changes real illustrative datasets rather than only the selected button style."
    },
    plugins: {
      title: "Figma Plugin Manager", category: "UX Design · Desktop · 2024", image: "plugins.svg",
      challenge: "A busy designer should not need to remember which extension solved a past problem. This concept explores finding, evaluating, and managing a small tool collection in one predictable place.",
      role: "Illustrative UX designer · 6-week concept · discovery, state design and desktop interaction.",
      discovery: "A proposed inventory would identify recurring discovery terms, installation doubts, and update failures. Reviews and counts displayed in the original artwork are illustrative, not copied from real plugin listings.",
      definition: "The core journey has three stages: locate a relevant tool, understand its purpose, then confirm a reversible installation state. Search and an honest empty state are essential parts of that flow.",
      design: "Plain-language categories complement search. Tool descriptions remain visible next to stateful install buttons, and the sketch supports uninstalling so users retain control.",
      validation: "A future test would examine successful discovery and recovery from an unwanted install. The 3×, 52%, and 800K+ figures are example targets, not measured release outcomes.",
      tradeoff: "A small curated view is more legible than a dense marketplace, but could conceal niche tools. The proposed architecture combines categories with text search instead of ranking by popularity alone.",
      deliver: "Installed, available, and no-results states use text in addition to styling. The local sketch filters three original fictional tools and toggles their local installation states without contacting Figma."
    },
    health: {
      title: "HealthTrack Patient Portal", category: "Healthcare UX · Web + Mobile · 2023", image: "health.svg",
      challenge: "A patient may arrive stressed, distracted, or unfamiliar with clinical language. This fictional portal concept prioritizes finding the next appointment and understanding what happens after a selection.",
      role: "Illustrative product designer · 12-week concept · accessible flows and responsive components.",
      discovery: "A proposed research plan would include patients with varied digital confidence and assistive-technology needs. No patient interviews, medical records, diagnoses, or real care services are involved here.",
      definition: "Every booking choice should have a readable label and a review step. The concept separates 'review a slot' from 'confirm an appointment' so the consequence of each action stays explicit.",
      design: "Friendly plain-language headings, strong contrast, persistent field labels, and generous targets reduce ambiguity. Appointment times remain text, rather than only colored calendar marks.",
      validation: "WCAG 2.1 AA is a design goal, not an audit or certification. Future testing would include keyboard and screen-reader journeys. Ratings and missed-visit reductions are fictional targets.",
      tradeoff: "Adding a review step increases interaction length but can prevent costly accidental bookings. In this demo, nothing is booked; the resulting summary explicitly states that no appointment exists.",
      deliver: "The local sketch previews an illustrative visit type and slot. It accepts no identity, medical history, or payment information and never contacts a care provider."
    }
  };
  const dialog = $("#case-dialog"), tabs = $$('[role="tab"]', dialog);
  let opener = null, closingForNavigation = false;
  const paragraph = (parent, title, copy) => {
    const heading = document.createElement("h3"), text = document.createElement("p");
    heading.textContent = title; text.textContent = copy; parent.append(heading, text);
  };
  function selectTab(index) {
    tabs.forEach((tab, n) => {
      const selected = n === index;
      tab.setAttribute("aria-selected", String(selected)); tab.tabIndex = selected ? 0 : -1;
      $(`#${tab.getAttribute("aria-controls")}`).hidden = !selected;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(index));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectTab(next); tabs[next].focus(); }
    });
  });
  function openCase(key) {
    const project = projects[key]; if (!project) return;
    $("#case-title").textContent = project.title; $("#case-category").textContent = project.category;
    $("#case-image").src = `assets/${project.image}`; $("#case-image").alt = `${project.title}, original independent interface concept`;
    const overview = $("#case-overview"), approach = $("#case-approach");
    overview.replaceChildren(); approach.replaceChildren();
    paragraph(overview, "The challenge", project.challenge);
    paragraph(overview, "Role & scope", project.role);
    paragraph(overview, "What success would mean", project.validation);
    for (const [title, field] of [["Discover", "discovery"], ["Define", "definition"], ["Design", "design"], ["A deliberate tradeoff", "tradeoff"], ["Deliver & learn", "deliver"]]) paragraph(approach, title, project[field]);
    selectTab(0); renderPrototype(key);
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
  }
  $$(".case-link").forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault(); opener = link;
    history.pushState(null, "", link.getAttribute("href")); openCase(link.dataset.case);
  }));
  $("#close-case").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    if (dialog.open) { closingForNavigation = false; return; }
    if (!closingForNavigation && location.hash.startsWith("#case-")) history.replaceState(null, "", "#work");
    closingForNavigation = false; opener?.focus();
  });
  function followHash() {
    const key = location.hash.slice(6);
    if (location.hash.startsWith("#case-") && projects[key]) { opener = $(`[data-case="${key}"]`); openCase(key); }
    else if (dialog.open) { closingForNavigation = true; dialog.close(); }
  }
  addEventListener("popstate", followHash); addEventListener("hashchange", followHash); followHash();
  function renderPrototype(key) {
    const root = $("#prototype");
    root.replaceChildren();
    const surface = document.createElement("div"); surface.className = "prototype-surface"; root.append(surface);
    if (key === "calendar") {
      surface.innerHTML = '<h3>Make a little room.</h3><label>Workspace<select id="workspace"><option>Work</option><option>Personal</option></select></label><p class="prototype-note">Tuesday, June 9 · illustrative day</p><ul id="event-list"></ul><form id="event-form"><label>New event<input id="event-title" maxlength="80" required placeholder="Give this time a purpose"></label><button class="button" type="submit">Add to this workspace</button></form><p id="event-status" role="status"></p>';
      const events = { Work: ["09:00 · Design review", "14:00 · Team catch-up"], Personal: ["08:00 · A walk before work"] };
      const draw = () => {
        $("#event-list").replaceChildren(...events[$("#workspace").value].map((value) => { const li = document.createElement("li"); li.textContent = value; return li; }));
      };
      $("#workspace").addEventListener("change", () => { draw(); $("#event-status").textContent = ""; });
      $("#event-title").addEventListener("input", (event) => event.target.setCustomValidity(""));
      $("#event-form").addEventListener("submit", (event) => {
        event.preventDefault(); const input = $("#event-title"), value = input.value.trim();
        if (!value) { input.setCustomValidity("Please enter an event title."); input.reportValidity(); return; }
        events[$("#workspace").value].push(`Unscheduled · ${value}`); draw(); input.value = "";
        $("#event-status").textContent = "Added to this local sketch only. No calendar was updated.";
      }); draw();
    } else if (key === "analytics") {
      surface.innerHTML = '<h3>Your business, in perspective.</h3><div class="periods" aria-label="Reporting period"><button aria-pressed="true" data-period="week">Week</button><button aria-pressed="false" data-period="month">Month</button></div><p id="revenue" role="status"></p><div class="demo-bars" role="img"></div><p class="prototype-note">Original illustrative data, not live Stripe financial information.</p>';
      const periods = { week: { total: "$24,180", labels: ["Mon", "Tue", "Wed", "Thu", "Fri"], values: [39, 62, 48, 80, 68] }, month: { total: "$96,420", labels: ["W1", "W2", "W3", "W4"], values: [52, 70, 61, 93] } };
      const draw = (name) => {
        const period = periods[name]; $("#revenue").textContent = `${name === "week" ? "This week" : "This month"} · Illustrative revenue ${period.total}`;
        const bars = $(".demo-bars"); bars.replaceChildren(); bars.setAttribute("aria-label", period.labels.map((label, i) => `${label}: ${period.values[i]} relative units`).join("; "));
        period.labels.forEach((label, i) => { const bar = document.createElement("div"), caption = document.createElement("span"); bar.style.setProperty("--value", `${period.values[i]}%`); caption.textContent = label; bar.append(caption); bars.append(bar); });
        $$("[data-period]", surface).forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.period === name)));
      };
      $$("[data-period]", surface).forEach((button) => button.addEventListener("click", () => draw(button.dataset.period))); draw("week");
    } else if (key === "plugins") {
      surface.innerHTML = '<h3>A few very useful sidekicks.</h3><label>Find a tool<input id="plugin-search" type="search" placeholder="Try contrast or components"></label><ul id="plugin-list"></ul><p id="plugin-status" role="status"></p>';
      const tools = [{ name: "Contrast Notes", description: "Accessible color exploration", installed: false }, { name: "Component Garden", description: "A tidy component inventory", installed: false }, { name: "Copy Companion", description: "Clear interface writing", installed: false }];
      const draw = () => {
        const matches = tools.filter((tool) => `${tool.name} ${tool.description}`.toLowerCase().includes($("#plugin-search").value.trim().toLowerCase()));
        const list = $("#plugin-list"); list.replaceChildren();
        matches.forEach((tool) => {
          const li = document.createElement("li"), copy = document.createElement("div"), title = document.createElement("strong"), description = document.createElement("small"), button = document.createElement("button");
          li.className = "demo-plugin"; title.textContent = tool.name; description.textContent = tool.description; copy.append(title, description);
          button.type = "button"; button.textContent = tool.installed ? "Installed" : "Install"; button.setAttribute("aria-pressed", String(tool.installed)); button.setAttribute("aria-label", `${tool.installed ? "Uninstall" : "Install"} ${tool.name}`);
          button.addEventListener("click", () => {
            tool.installed = !tool.installed; draw();
            const replacement = $$("button", list).find((item) => item.getAttribute("aria-label").endsWith(tool.name));
            replacement?.focus(); $("#plugin-status").textContent = `${tool.name} ${tool.installed ? "installed" : "removed"} in this local sketch only.`;
          }); li.append(copy, button); list.append(li);
        });
        $("#plugin-status").textContent = matches.length ? `${matches.length} fictional tools` : "No tools match. Try a different search.";
      };
      $("#plugin-search").addEventListener("input", draw); draw();
    } else {
      surface.innerHTML = '<h3>A clearer next step.</h3><form id="visit-form"><label>Illustrative visit type<select id="visit-type"><option>Routine check-in</option><option>Follow-up conversation</option></select></label><label>Example slot<select id="visit-slot"><option>Tuesday, June 9 · 09:30</option><option>Wednesday, June 10 · 14:00</option></select></label><button class="button" type="submit">Review this example</button></form><p id="visit-status" role="status"></p>';
      $("#visit-form").addEventListener("submit", (event) => {
        event.preventDefault(); $("#visit-status").textContent = `${$("#visit-type").value} — ${$("#visit-slot").value}. Local review only: no appointment has been booked, and no provider was contacted.`;
      });
      $$("select", surface).forEach((input) => input.addEventListener("change", () => { $("#visit-status").textContent = ""; }));
    }
  }
  const form = $("#contact-form"), receipt = $("#receipt"), submit = $(".submit");
  let generation = 0;
  function invalidate() {
    generation++; receipt.hidden = true; $("#receipt-text").textContent = "";
    submit.disabled = false; submit.removeAttribute("aria-busy"); submit.firstChild.textContent = "Send Message ";
  }
  $$("input,textarea,select", form).forEach((field) => {
    field.addEventListener("input", () => { field.setCustomValidity(""); invalidate(); });
    field.addEventListener("change", invalidate);
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    for (const field of $$("input,textarea", form)) {
      field.value = field.value.trim();
      field.setCustomValidity(!field.value ? "Please enter a value, not just spaces." : field.name === "message" && field.value.length < 15 ? "Please add at least 15 characters about your project." : "");
    }
    if (!form.reportValidity()) return;
    const token = ++generation, data = new FormData(form);
    submit.disabled = true; submit.setAttribute("aria-busy", "true"); submit.firstChild.textContent = "Preparing preview… ";
    await new Promise((resolve) => setTimeout(resolve, 450));
    if (token !== generation) return;
    $("#receipt-text").textContent = `From: ${data.get("name")} (${data.get("email")})\nProject: ${data.get("type")}\n\n${data.get("message")}`;
    receipt.hidden = false; submit.disabled = false; submit.removeAttribute("aria-busy"); submit.firstChild.textContent = "Send Message ";
  });
  $("#clear-message").addEventListener("click", () => { form.reset(); $$("input,textarea", form).forEach((field) => field.setCustomValidity("")); invalidate(); $('[name="name"]', form).focus(); });
})();
