# Mosaic Studio — team page

- **Original prompt**: `data/prompts/033-creative-agency-team/033-creative-agency-team.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js`
  - `assets/art.js`: illustrated portraits and scenes
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/creative-agency-team/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** sticky nav (not in the brief) with "Team" active and a hiring CTA; mobile dropdown.
- **Hero:** warm hero with a wide illustrated team "group photo" and three stat badges overlapping its bottom edge. On mobile the badges stack below the image.
- **Leadership:** four cards with 120px circular portraits in an orange ring and bios. On hover the card tints to #FFF7ED, the portrait scales and a warm overlay appears.
- **Meet the Crew:**
  - all 32 members, with filters that match the brief's counts: Design 10, Engineering 12, Strategy 5, Operations 5
  - square portraits, roles and fun facts
  - hover lift with a social-link overlay
  - "View all 32 team members" expands the first 12
- **How We Work:** three values and a four-scene collage (horizontal scroll on mobile).
- **Why People Stay:** six benefit cards with alternating orange and purple left borders.
- **Join the Studio:** four job rows (full-width cards on mobile). Each opens a role dialog with an application form, URL validation and a success state. "Send Open Application" and "Start a Project" use the same dialog.
- **Testimonial:** on lilac, with an avatar.
- **Numbers:** six stats on peach in 48px orange numerals.
- **Tool stack:** three columns of chips with colored header underlines.
- **Footer:** dark CTA.

## Mocks and limitations

- **People:**
  - The brief names 12 people; 20 more fictional members were added to reach 32 with the stated department counts.
  - All portraits, the group photo and the collage are original vector illustrations, not photos.
  - The footer says people and figures are illustrative.
  - Ex-employer mentions (Spotify, McKinsey) come from the brief.
- **Jobs:** the role "Design Intern — Summer 2026" is kept as written, although that date has passed.
- **Demos:** applications and briefs send nothing. Social links point to platform home pages. Work and Services show a notice.
- **Fonts:** General Sans loads from the Fontshare CDN and Inter from Google Fonts, with system fallbacks.

## Run and verify

From the repo root, `node out/pages/033-creative-agency-team/Opus-5.5/page.test.mjs` runs 7 Playwright checks:

- hero and badge overlap
- leadership cards and hover
- crew counts, filters, expand and hover socials
- values, collage and perks
- jobs and the application dialog
- quote, numbers, stack and footer CTA
- mobile layout and touch targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
