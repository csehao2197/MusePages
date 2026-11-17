# FRAME — Video streaming platform

- Actual generator: `gpt-6.1-sol`; public label: `GPT-6`.
- Input: `data\prompts\628-video-streaming-platform\628-video-streaming-platform.md`.
- Design: `src\workflows\AI Agent\DESIGN.md`.
- Prompt: [Video streaming platform, KingLeoJr](https://github.com/KingLeoJr/awesome-vibe-coding-prompt-code-templates/blob/677d1cfd76b8c1479767c662d130fc68df17027a/Video%20Streaming%20Platform), copyright 2025, MIT. Full notices are in `LICENSE.txt`.
- Source: this directory's `index.html`, `style.css`, `app.js`, and `assets\`. Static export: `out\`.
- Public path: `/pages/video-streaming-platform/GPT-6/index.html`.

## Direction and features

Independent editorial cinema: near-black, warm illustrated landscapes, acid-lime accents, deliberate typography, responsive layouts. All site copy is English. The fictional catalog contains six real, locally playable, original eight-second silent canvas animations (VP8 WebM, 640 × 360). Each has its own original SVG artwork. No commercial film, third-party footage, remote image, font, or media service is used.

Play/pause, seeking, keyboard playback and seeking, playback speed, fullscreen where supported, next film, persisted viewing progress, continue watching, watchlist, title/mood/genre search suggestions, genre filters, local ratings, profile settings, and a G-only display filter work in the browser. Artwork and films are authored specifically for this page and released under MIT. Lucide/Feather icon notices are included.

## Scope and limitations

This is the authorized static homepage adaptation, not the original prompt's entire production platform. Plain HTML/CSS/JavaScript and a custom-controlled native player replace Next.js SSR, React, Styled Components, Redux, and Video.js to run independently without builds. Auth0, Stripe, Algolia, FFmpeg/HLS adaptive streaming, Elasticsearch/Kibana, AI recommendations/moderation/search, CMS uploads, CDN, DRM, chat, watch parties, real live streams, downloads, scene editing, ads, VR, multi-angle content, and backend licensing/scheduling/analytics are not connected or claimed.

The catalog is fictional; its actual clips are short animated samples, not feature films. Clips have no sound or dialogue; audio/subtitle selection is not offered. Playback is fixed-resolution WebM rather than adaptive media. The G-only setting is a display filter, not secure parental authorization. Jamie is a local example profile, not an authenticated user. Data is stored only in this browser; no device sync, real subscriptions, payments, or personal data collection occurs. Announcements are sample content. Unavailable features are omitted rather than represented as functional services.

## Running and validation

From the repository root, serve only this page's `out\` through the existing `startPreviewServer` helper in `src\workflows\script\generate-preview.mjs`, or use the existing preview CLI:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\628-video-streaming-platform\GPT-6\out
node out\pages\628-video-streaming-platform\GPT-6\.checks\qa.mjs
```

The preview CLI captures and closes its own server. No build, environment variables, installation, or runtime backend is required. Private `.checks\prepare.mjs` retains original media authorship logic; it is a one-time generation record and must not be rerun over completed source. `.checks\qa.mjs` is repeatable against the existing static page. QA records are private in `.checks\qa.json`; desktop/mobile images are `.checks\desktop.png` and `.checks\mobile.png`. Final preview is `out\preview.png`; input and static/preview digests remain outside public output.

Validation: 18 QA groups passed using installed Playwright Chromium at 1200 × 900 (DPR 1) and 390 × 844. All six local films decoded at 640 × 360, played, paused, and sought successfully. Keyboard controls, next film, persisted progress/watchlist/ratings, search suggestions, genre filters, G-only settings, empty states, mobile touch interactions, and dialog sizing passed. There were no HTTP/resource/request/console/page errors or horizontal overflow before or after interactions. Blob-backed media makes seeking work on static servers without range support.

Both actual `.checks\desktop.png` and `.checks\mobile.png` were opened and visually reviewed: consistent lime/olive hierarchy, legible hero contrast, balanced landscape composition, aligned film cards, and unclipped two-column mobile layout. The 1200 × 900 first-screen preview is produced by `StaticHomepage.ensurePreview`; static and image digests are verified. Exact evidence is in `.checks\qa.json` and the coordinator's private report. Registration is disabled and undeployed; no collection build or publishing is performed.
