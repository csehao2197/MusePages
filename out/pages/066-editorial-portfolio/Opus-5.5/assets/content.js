// Site content (single source for the page and assets/resume.pdf). Fictional person and projects.
(function (root) {
  root.CONTENT = {
    name: "Mara Ellison",
    title: "Frontend Engineer & UI Craftsman",
    location: "Copenhagen, Denmark",
    email: "hello@maraellison.example",
    phone: "+45 00 00 00 00",
    summary: "Frontend engineer with 8 years of experience building design systems and fast, accessible product interfaces in React and TypeScript.",
    skills: [
      ["Languages", ["TypeScript", "JavaScript (ES2024)", "HTML", "CSS / Sass", "GraphQL"]],
      ["Frameworks", ["React", "Next.js", "Remix", "Vue 3", "Framer Motion"]],
      ["Craft", ["Design systems", "Accessibility (WCAG 2.2)", "Motion design", "Performance tuning", "Data visualization"]],
      ["Tools", ["Figma", "Storybook", "Playwright", "Vitest", "GitHub Actions"]]
    ],
    experience: [
      ["2022 — Now", "Staff Frontend Engineer", "Northlight", "Leads the Atlas design system used by 9 product teams."],
      ["2019 — 2022", "Senior Frontend Engineer", "Meridian Commerce", "Rebuilt checkout; cut abandonment by 31%."],
      ["2017 — 2019", "Frontend Engineer", "Tidepool Labs", "Built real-time ocean data dashboards in D3."],
      ["2016 — 2017", "UI Developer", "Studio Fjord", "Crafted interactive campaign sites for cultural clients."]
    ],
    projects: [
      { id: "atlas", size: "lead", title: "Atlas Design System", kicker: "Design systems", year: "2023–2026", desc: "A themeable component library and documentation site that unified nine product teams.",
        tags: ["React", "TypeScript", "Storybook", "CSS custom properties"],
        context: "Northlight's products had drifted into four button styles and three date pickers. Every new feature re-solved the same UI problems, and accessibility bugs kept resurfacing.",
        approach: "I led a team of three engineers and two designers. We audited 1,400 screens, defined design tokens, built 64 components with keyboard support baked in, and wrote documentation with live, editable examples.",
        outcome: [["9", "teams adopted Atlas"], ["-42%", "UI code per feature"], ["0", "critical a11y issues in last audit"]],
        links: [["Live docs", "live"], ["GitHub", "gh"]] },
      { id: "meridian", size: "tall", title: "Meridian Checkout", kicker: "E-commerce", year: "2021", desc: "A rebuilt mobile-first checkout that made buying faster and calmer.",
        tags: ["Next.js", "React", "Edge functions", "A/B testing"],
        context: "Meridian's checkout had seven steps and took 4.2 seconds to become interactive on mobile. Most abandonments happened on the shipping step.",
        approach: "Paired with a product designer to collapse the flow into one adaptive page. I moved rendering to the edge, deferred non-critical scripts and added address autocomplete with full keyboard support.",
        outcome: [["-31%", "checkout abandonment"], ["1.1s", "time to interactive"], ["+18%", "mobile conversion"]],
        links: [["Case write-up", "live"]] },
      { id: "tidepool", size: "wide", title: "Tidepool Analytics", kicker: "Data visualization", year: "2018", desc: "Real-time dashboards that helped marine scientists spot temperature anomalies.",
        tags: ["D3", "TypeScript", "WebSockets", "Canvas"],
        context: "Researchers were downloading CSVs every morning to check 300 coastal sensors. Anomalies were often found days late.",
        approach: "Designed a streaming dashboard with linked small multiples. I switched dense charts to Canvas rendering and added screen-reader summaries for every chart.",
        outcome: [["300", "sensors streamed live"], ["60fps", "with 50K points"], ["2 days → 2 min", "time to spot anomalies"]],
        links: [["Live demo", "live"], ["GitHub", "gh"]] },
      { id: "wayfinder", size: "std", title: "Wayfinder", kicker: "Accessibility", year: "2017", desc: "An accessible museum guide with audio descriptions and step-free routes.",
        tags: ["Vue", "PWA", "Web Audio", "ARIA"],
        context: "A national museum wanted a guide that worked for blind and low-vision visitors, not only as an afterthought.",
        approach: "Co-designed with six visually impaired testers. I built an offline-first PWA with large touch targets, audio-first navigation and high-contrast themes.",
        outcome: [["4.9", "average visitor rating"], ["38%", "of sessions use audio mode"], ["AA", "WCAG conformance"]],
        links: [["GitHub", "gh"]] }
    ],
    education: "B.Sc. Interaction Design (2016)",
    speaking: "Talks: \"Design tokens that scale\" (Nordic Frontend Meetup, 2024), \"Charts everyone can read\" (Copenhagen Accessibility Night, 2023)"
  };
})(typeof window !== "undefined" ? window : globalThis);
