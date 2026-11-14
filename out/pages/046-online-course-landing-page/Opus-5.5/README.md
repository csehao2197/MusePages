# LearnCraft Academy — Full-Stack Bootcamp landing page

- **Original prompt**: `data/prompts/046-online-course-landing-page/046-online-course-landing-page.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/online-course-landing-page/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** sticky blurred nav with section links and an "Enroll Now $599" button.
- **Hero:** eyebrow, headline, two CTAs (enroll and free preview lesson), trust row, and a CSS laptop with a course dashboard mockup.
- **Logo bar:** six grayscale wordmarks that colorize on hover.
- **What you'll learn:** eight items with indigo checks.
- **Curriculum:** six-module accordion with topics and projects, "Expand all", and computed totals (54 lessons • 12 projects • 1 capstone).
- **Instructor, format, testimonials:** illustrated portrait, credentials, socials, three format cards and three student stories.
- **Pricing:** $599 one-time (Best Value) vs $219/month ($657 total), guarantee and secure-checkout note.
- **FAQ:** six questions, one open at a time.
- **Final CTA:** dark #1E1B4B section with a live countdown and cohort spots.
- **Dialogs:** a preview-lesson player with timed captions, and an enroll dialog with plan switching, validation and confirmation.
- **Mobile:** single column with a sticky bottom enroll bar after the hero, hidden over the final CTA.

## Mocks and limitations

- **Images:** the dashboard is HTML/CSS; the portrait and video frame are SVG illustrations. The preview "video" is a captioned demo player, not real video.
- **Dates:** the brief's April 14 date is kept; the countdown targets the next April 14 at 7 PM local time.
- **Demos:** checkout takes no payment and sends nothing; the "spots left" count is sample data.
- **Sample content:** instructor, graduates and employer names (Google, Shopify, Stripe, Vercel, Figma, Notion) are text wordmarks from the brief and **illustrative**; the footer says so. Social links go to the generic sites.

## Run and verify

From the repo root, `node out/pages/046-online-course-landing-page/Opus-5.5/page.test.mjs` runs 6 Playwright checks: nav, hero and logos; learn list and accordion; instructor, pricing and FAQ; preview and enroll dialogs; countdown; mobile layout, sticky bar and 44px targets, with no runtime or request errors. Desktop and mobile screenshots were reviewed visually.
