# LaunchCode Academy — coding bootcamp homepage

- **Original prompt**: `data/prompts/042-coding-bootcamp/042-coding-bootcamp.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js`
  - `assets/art.js`: SVG classroom and portraits
  - `build/syllabus.mjs`: writes the three `assets/syllabus-*.pdf` files
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/coding-bootcamp/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Header:** dismissible indigo announcement bar. Sticky nav that gains a shadow on scroll, with a mobile dropdown and a sticky "Apply Now" bar.
- **Hero:** split hero with an illustrated classroom (three students at laptops), two CTAs and a trust row.
- **Outcomes band:** dark band with count-up stats. The "audited outcomes report" link opens a summary dialog.
- **Program cards:** three cards with blue, green and purple top borders and a hover lift.
  - "Learn More" opens program details with a real downloadable sample syllabus PDF and an Apply button.
  - "Compare All Programs" opens a comparison table that includes upfront and monthly pricing.
- **How it works:** dotted horizontal timeline with numbered circles and icons (vertical on mobile).
- **Testimonials and partners:**
  - four testimonials with portraits and employer names
  - an auto-scrolling "Our Graduates Work At" marquee that pauses on hover; grayscale names colorize on hover
- **Financing:** three options recalculated for the selected program (upfront −$1,000, 12 × 0% monthly, ISA "Most popular").
- **Info sessions:** three event cards with date blocks and a registration dialog; registered cards update.
- **FAQ:** eight-question accordion with +/− icons.
- **Final CTA:** indigo-to-purple gradient with "Apply Now — It's Free", opening an application form with validation and confirmation.
- **Footer:** four columns, socials, accreditation badges and three syllabus download links.

## Mocks and limitations

- **Invented brand:** the bootcamp, its outcomes figures, graduates, quotes and the phone number are fictional sample content, and the footer says so. The name comes from the brief; it isn't affiliated with any real organization using a similar name.
- **Employer names:**
  - Google, Amazon, Shopify, Stripe, Capital One, IBM, Deloitte and Accenture come from the brief
  - they appear as plain-text wordmarks, not official logos, with a note saying so
- **Dates:** the brief's dates (Summer 2026 cohort starting June 15, info sessions in March) are kept as written, although they have passed.
- **Images:** the classroom illustration and portraits are original SVG, not photos.
- **Demos:**
  - applications and registrations send nothing
  - the outcomes report is a sample summary
  - the syllabi are labelled samples
  - blog, press and similar pages show a notice

## Run and verify

From the repo root, `node out/pages/042-coding-bootcamp/Opus-5.5/page.test.mjs` runs 7 Playwright checks:

- announcement, nav and hero
- count-up outcomes and the report
- program cards, PDF and compare table
- timeline, testimonials and marquee
- financing, event registration and FAQ
- the apply flow and footer downloads
- mobile layout, sticky bar and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
