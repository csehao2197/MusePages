(() => {
  const menu = document.querySelector("#mobile-menu");
  const toggle = document.querySelector(".menu-toggle");
  toggle.addEventListener("click", () => { menu.showModal(); toggle.setAttribute("aria-expanded", "true"); });
  document.querySelector("[data-close-menu]").addEventListener("click", () => menu.close());
  menu.addEventListener("close", () => toggle.setAttribute("aria-expanded", "false"));
  menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => menu.close()));
  menu.addEventListener("click", event => { if (event.target === menu && event.offsetX < 0) menu.close(); });

  const information = {
    blog: ["Notes from the studio", "This fictional studio's editorial archive is outside this homepage demo. Explore the process and FAQ for our approach to building SaaS products."],
    mobile: ["Mobile product design", "The concept studio offers mobile product strategy and interface design. This static demo includes no app-development service or active sales team."],
    industries: ["Built for SaaS teams", "Illustrative specialisms: B2B software, workflow tools, and digital health. The projects and outcomes on this page are fictional examples."],
    about: ["A shared ambition", "Frameshift is an original fictional digital product agency concept. This homepage demonstrates a collaborative four-phase process; it does not represent an operating business."],
    careers: ["Small team. Thoughtful work.", "There are no real vacancies or applications in this fictional studio demo. No applicant information is collected."],
    social: ["Keep the conversation here", "Social profiles are not connected in this independent concept. No external website or third-party tracking is opened."],
    privacy: ["Your information stays here", "All interactions are local to this page. No information is submitted, stored, tracked, or shared. The newsletter preview clears your email after validation. Refreshing resets the demo."],
    terms: ["About this concept", "All service claims, quotes, pricing, metrics, rankings, and bookings are illustrative, not a binding offer. Named third-party brands belong to their owners and imply no endorsement. The process PDF is a local demo summary."]
  };
  const info = document.querySelector("#info-dialog");
  [menu, info].forEach(dialog => dialog.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;
    const stops = [...dialog.querySelectorAll("a[href],button:not(:disabled),input:not(:disabled)")].filter(node => node.getClientRects().length);
    const first = stops[0], last = stops.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }));
  document.querySelectorAll("[data-info]").forEach(button => button.addEventListener("click", () => {
    if (menu.open) menu.close();
    const [title, body] = information[button.dataset.info];
    document.querySelector("#info-title").textContent = title;
    document.querySelector("#info-body").textContent = body;
    info.showModal();
  }));
  [".dialog-close", "#info-done"].forEach(selector => document.querySelector(selector).addEventListener("click", () => info.close()));

  const phaseLinks = [...document.querySelectorAll(".phase-link")];
  const sections = phaseLinks.map(link => document.querySelector(link.hash));
  const updatePhase = () => {
    let active = sections[0].id;
    for (const section of sections) if (section.getBoundingClientRect().top <= innerHeight * .42) active = section.id;
    phaseLinks.forEach(link => {
      const current = link.hash === `#${active}`;
      link.classList.toggle("current", current);
      if (current) link.setAttribute("aria-current", "step"); else link.removeAttribute("aria-current");
    });
  };
  addEventListener("scroll", updatePhase, { passive: true });
  updatePhase();
  document.querySelectorAll(".faq-list details").forEach(detail => detail.addEventListener("toggle", () => {
    if (detail.open) document.querySelectorAll(".faq-list details").forEach(other => { if (other !== detail) other.open = false; });
  }));

  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const firstMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  let monthOffset = 0, selectedDate = "", selectedTime = "";
  const calendar = document.querySelector("#calendar");
  const slots = document.querySelector("#slots");
  const confirm = document.querySelector("#confirm-call");
  const status = document.querySelector("#booking-status");
  const longDate = date => new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
  function resetChoice() {
    selectedDate = ""; selectedTime = ""; slots.replaceChildren();
    confirm.disabled = true; confirm.textContent = "Choose a date & time";
    status.textContent = "Local preview only · No calendar connection"; status.classList.remove("confirmed");
    document.querySelector(".calendar-help").textContent = "Select an available weekday to see times.";
  }
  function renderCalendar() {
    resetChoice(); calendar.replaceChildren();
    const month = new Date(Date.UTC(firstMonth.getUTCFullYear(), firstMonth.getUTCMonth() + monthOffset, 1));
    document.querySelector("#month-label").textContent = new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" }).format(month);
    document.querySelector("#prev-month").disabled = monthOffset === 0;
    document.querySelector("#next-month").disabled = monthOffset === 11;
    const offset = (month.getUTCDay() + 6) % 7;
    for (let i = 0; i < offset; i++) { const spacer = document.createElement("span"); spacer.setAttribute("aria-hidden", "true"); calendar.append(spacer); }
    const days = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate();
    for (let day = 1; day <= days; day++) {
      const date = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), day));
      const value = date.toISOString().slice(0, 10);
      const button = document.createElement("button");
      button.type = "button"; button.className = "day"; button.textContent = String(day);
      button.disabled = date <= today || [0, 6].includes(date.getUTCDay());
      button.dataset.date = value;
      button.setAttribute("aria-label", `${longDate(value)}${button.disabled ? ", unavailable" : ", available"}`);
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        resetChoice(); selectedDate = value;
        calendar.querySelectorAll(".day").forEach(other => { other.classList.toggle("selected", other === button); other.setAttribute("aria-pressed", String(other === button)); });
        document.querySelector(".calendar-help").textContent = `${longDate(value)} · UTC`;
        for (const time of ["09:00", "11:00", "14:30"]) {
          const slot = document.createElement("button");
          slot.className = "slot"; slot.textContent = time; slot.type = "button"; slot.setAttribute("aria-pressed", "false");
          slot.addEventListener("click", () => {
            selectedTime = time;
            slots.querySelectorAll("button").forEach(other => other.setAttribute("aria-pressed", String(other === slot)));
            confirm.disabled = false; confirm.textContent = "Preview discovery call";
            status.textContent = "Local preview only · No calendar connection"; status.classList.remove("confirmed");
          });
          slots.append(slot);
        }
      });
      calendar.append(button);
    }
  }
  document.querySelector("#prev-month").addEventListener("click", () => { if (monthOffset > 0) { monthOffset--; renderCalendar(); } });
  document.querySelector("#next-month").addEventListener("click", () => { if (monthOffset < 11) { monthOffset++; renderCalendar(); } });
  confirm.addEventListener("click", () => {
    if (!selectedDate || !selectedTime) return;
    status.textContent = `Demo call preview: ${longDate(selectedDate)} at ${selectedTime} UTC, 30 minutes. Nothing has been booked or sent.`;
    status.classList.add("confirmed"); confirm.textContent = "Preview ready — not booked";
  });
  renderCalendar();

  document.querySelector("#newsletter").addEventListener("submit", event => {
    event.preventDefault();
    const email = document.querySelector("#email");
    const message = document.querySelector("#email-status");
    const value = email.value.trim();
    email.value = value;
    if (!value || !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(value) || !email.checkValidity()) {
      email.setAttribute("aria-invalid", "true"); message.className = "error";
      message.textContent = "Enter a valid email address for a local preview."; email.focus(); return;
    }
    email.removeAttribute("aria-invalid"); email.value = ""; message.className = "success";
    message.textContent = "Demo complete. Email cleared; no subscription or message was sent.";
  });
  document.querySelector("#email").addEventListener("input", event => event.target.removeAttribute("aria-invalid"));

  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const stats = document.querySelector(".stats");
  if (!motion.matches) {
    const counter = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      counter.disconnect();
      const start = performance.now();
      const elements = [...stats.querySelectorAll("[data-count]")];
      function frame(time) {
        const progress = motion.matches ? 1 : Math.min((time - start) / 1100, 1);
        elements.forEach(element => {
          const total = Number(element.dataset.count);
          const value = total * (1 - (1 - progress) ** 3);
          element.textContent = `${total % 1 ? value.toFixed(1) : Math.round(value)}${element.dataset.suffix}`;
        });
        if (progress < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }, { threshold: .35 });
    counter.observe(stats);
  }
})();
