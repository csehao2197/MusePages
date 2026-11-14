# Dreamio — bedtime story maker

- **Original prompt**: `data/prompts/077-bedtime-story-pwa/077-bedtime-story-pwa.md` (PRD), combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript app with hash routes, plus a web app manifest (`assets/manifest.webmanifest`, `assets/icon.svg`)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/bedtime-story-pwa/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Implementation choice

The PRD's stack (Next.js, Supabase, n8n, ChatGPT/Nano Banana images, ElevenLabs) can't run in a static collection, and installing or building isn't authorized. Each piece has a browser equivalent:

| PRD piece | Browser equivalent |
|---|---|
| ChatGPT story building | Local story composer: each idea becomes a page (noun phrase or clause templates plus setting-aware sentences), and "Finish story" adds a goodnight ending and a title |
| n8n image workflow | Deterministic SVG illustrations, one per page. The setting (sea, forest, sky, castle, hills, bedroom) and companion animal come from the page text. The same hero (pajamas, hair, skin) appears on every page. An optional child photo is cropped on-device and used as the hero's face |
| ElevenLabs voices | Browser speech synthesis: voice dropdown, three bedtime styles (rate and pitch) and an instructions field |
| Soundtrack files | Three procedural Web Audio tracks: music box, ocean, starlight pads |
| Supabase storage | `localStorage` (`dreamio-v1`, draft in `dreamio-draft`) |

## Features

- **Playlist:** sort by newest, oldest, favorites, child or most played; filter by child; favorites; a last-played card
- **Create:** chat interface with idea chips, typed or spoken ideas (Web Speech recognition where supported), hero picker, and a live draft that survives reload
- **Story page:** Create Images (with progress), look picker, photo upload/remove, Generate Voices with preview, and soundtrack selection
- **Player:**
  - slides cross-fade over 1.6s
  - subtitles toggle; music toggle and track switch
  - progress segments
  - with narration, slides auto-advance when each page finishes speaking; without it, pages are turned by hand (as in the PRD's initial version)
  - end screen with "Play again"
  - keyboard: ←/→, Space, C, M, Esc
- **Children profiles** with validation; demo reset

## Mocks and limitations

- **Simulated AI:** story text is assembled from templates, not written by an LLM. Pictures are generated vector art, not AI images.
- **No MP3 files:** narration plays live through device voices. Voice quality and availability depend on the browser; without speech support, pages advance on a reading-time timer.
- **Device-only storage:** no sync or sharing. The child photo never leaves the device.
- **No offline caching:** there is no service worker (offline mode is a PRD future enhancement), but the manifest allows installing to the home screen.

## Run and verify

From the repo root, `node out/pages/077-bedtime-story-pwa/Opus-5.5/page.test.mjs` runs 10 Playwright checks:

- home and playlist sort, filter and favorites
- chat creation, with the draft surviving reload, and finishing a story
- Create Images, including the photo
- Generate Voices and the soundtrack
- **narration-synced auto advance** (with a speech-synthesis stub)
- manual paging and keyboard
- children profiles
- delete and persistence
- mobile layout and 44px targets
- no runtime or request errors

The suite passed 3 consecutive runs. Desktop and mobile screenshots of the home, story, create and player screens were reviewed visually.
