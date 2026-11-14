# Lentera Cinema — web profile & portofolio

- **Original prompt**: `data/prompts/073-creative-photography-video-studio/073-creative-photography-video-studio.md` (PRD, in Indonesian), combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript, one page in Indonesian (`lang="id"`), no build
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/scenes.js` (original cinematic SVG silhouette scenes); browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/creative-photography-video-studio/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Implementation notes

- **Missing `design.md`:** the PRD points to a `design.md` that is **not included** with the prompt (only the PRD exists in `data/prompts/073-…`). The design therefore follows the PRD's own summary: dark mode, DM Sans geometric font, gold accent, card grids and subtle motion.
- **Inspired by, not copied from, Artlist.io:** the PRD asks for a "100% similar" copy of Artlist.io's UI. This build uses the same *genre* of design (dark, cinematic, card-grid) but doesn't copy that site's branding, layout or assets.
- **Static instead of Next.js:** the PRD suggests Next.js and Tailwind. A dependency-free static page was built because installing and building aren't authorized.
- **Single page:** the PRD's pages (Beranda, Portofolio, Layanan & Paket, Tentang Kami, Kontak) are sections of one page reached from the menu.

## Features

- **Hero:** a cinematic reel cycling four scenes with a slow Ken Burns pan (static with reduced motion). Includes headline, stats and WhatsApp/portfolio CTAs.
- **Service categories:** Yearbook, Wedding Organizer, Foto Graduation and Video Graduation, each with a starting price. Clicking a category opens its package tab.
- **Portfolio:** 12 works (photo and video) with a category filter and a dense editorial grid. The lightbox shows client, location, year and duration, with prev/next (buttons and arrow keys), focus return, a "Mau yang seperti ini" WhatsApp link and a **simulated video preview** (play/pause with progress).
- **Packages and prices:** tabs per category (keyboard arrows), 3 packages each with description, inclusions and IDR price, and a popular badge. **"Pilih Paket"** opens WhatsApp with a message naming the package and price.
- **More sections:** testimonials, a single-open FAQ, About, and Contact (info plus a quick form that validates the name and opens a prefilled WhatsApp chat).
- **Persistent CTA:** a floating WhatsApp button (a compact 60px round button on mobile).
- **Mobile-first:** hamburger menu, horizontally scrolling filters and tabs, and 44px+ touch targets.

## Mocks and limitations

- **WhatsApp number not set:** `WA_NUMBER` in `app.js` is empty, so links open `wa.me/?text=…` (WhatsApp asks which chat to use). Set the business number (`62…`) to send messages straight to the studio.
- **Illustrations, not real work:** portfolio "photos" are original SVG illustrations, and videos are simulated previews (no real footage or embeds). Clients, testimonials, stats and prices are sample data.
- **Placeholder links:** the Instagram link is a placeholder, and the email uses an `.example` domain.

## Run and verify

From the repo root, `node out/pages/073-creative-photography-video-studio/Opus-5.5/page.test.mjs` runs 6 Playwright checks:

- language, theme, hero reel, categories, persistent CTA and sections
- portfolio filter, lightbox details, navigation and video preview
- package tabs, prices and WhatsApp messages
- FAQ and quick-form WhatsApp message
- reduced motion
- mobile layout, menu, FAB and 44px targets
- no runtime or request errors

The suite passed 3 consecutive runs. Desktop and mobile screenshots were reviewed visually.
