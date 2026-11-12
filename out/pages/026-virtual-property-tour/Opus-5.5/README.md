# 2148 Larkspur Lane virtual tour

- **Original prompt**: `data/prompts/026-virtual-property-tour/026-virtual-property-tour.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/art.js` (panoramas and illustrations), `assets/qr.js` (QR encoder); browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/virtual-property-tour/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

**Viewer and controls**
- Full-screen 360° viewer for six rooms on two levels:
  - drag, pinch and wheel zoom
  - fullscreen, zoom buttons, auto-rotate and reset
  - gyroscope look-around, with a permission request and a fallback message
  - a Cardboard-style stereo VR view
- Header overlay with price and stats, Schedule Tour, Save (stored locally) and Share. Exit Tour goes to a listing summary below the viewer.

**Navigation and hotspots**
- Room strip with the current room highlighted, fade/zoom transitions, and a "Loading Kitchen…" status.
- Floor-plan overlay with level tabs, a room-type legend and a view-direction cone. The mini map can be clicked and toggled.
- Navigation hotspots enter the next room facing away from the door you came through.
- Pulsing hotspots:
  - **Info:** hardwood floors, built-in shelving, HVAC 2023 and more.
  - **Navigation.**
  - **Video:** opens a clip.
  - **Link:** external resources from ENERGY STAR and the FCC broadband map.
- Popovers close when you click elsewhere or press Esc.

**Information panels**
- Slide-out room panel: dimensions, features, a per-room photo gallery, notes ("Recently renovated") and a text description.
- Property details sidebar with collapsible sections: overview, features, schools, taxes, HOA and agent.

**Tour modes and tools**
- **Guided tour:** auto-plays room by room with play/pause and skip. Narration audio uses the browser's speech synthesis (off by default), with a transcript.
- **Measure:** click two points for an approximate distance.
- **"Will my couch fit?":** checks a couch against the room's open walls and draws a diagram.
- **Before/after slider:** kitchen renovation, and staged vs. empty.
- **Media gallery:** 13 photos, plus simulated video walkthrough, drone and neighborhood clips.
- **Compare:** two synced viewers side by side against a comparable home.

**Sharing and scheduling**
- **Share:** copy link, embed code, email to a friend, native share where available, and a QR code from the bundled encoder.
- **Persistent schedule CTA:** date and time slots, a contact form, and a "Request More Info" alternative.

**Mobile**
- Bottom navigation bar, rooms dock, tools sheet and bottom-sheet panels.
- Touch drag and pinch; portrait and landscape layouts.

**Accessibility**
- Keyboard controls: arrows, ± zoom, Page Up/Down rooms, R, 0, F, M and Esc.
- A live region describes the view for screen readers, and every room has a text alternative.
- Settings for high contrast, reduced motion (also follows the OS setting), view announcements and ambient music (Web Audio, off by default).

**Loading**
- Progress indicator with a blurred low-res preview and a bandwidth note (Network Information API when available). Other rooms are prepared in the background.

## Mocks and limitations

**Images and media**
- Panoramas are original **cylindrical** SVG renderings (360° horizontally, limited pitch), not photographic equirectangular images.
- There is no professional photography, video, drone footage, audio narration file or real WebXR session. The VR mode is a split-screen stereo view.
- Videos are animated illustrations.

**Behaviour**
- Distances are approximate: angular span × room perimeter, plus height from the ceiling.
- Couch fit uses the listed wall lengths with 6" side clearance and a 3 ft walkway.
- Speech narration depends on the browser's voices.
- Gyroscope, fullscreen and screen-orientation lock depend on device and browser support.

**Content and demos**
- Invented to complete the brief: the address, agent, schools, taxes, HOA, room dimensions and the comparable home (37 Aspen Court).
- Scheduling and info requests are local demos; nothing is sent.

## Run and verify

Serve `out/` from any static server (relative URLs; deep links like `#room=kitchen` work). From the repo root, `node out/pages/026-virtual-property-tour/Opus-5.5/page.test.mjs` runs 13 Playwright checks at 1440×900 and 390×844 (touch):

- header and loader
- drag, wheel, keyboard and reset
- hotspots and room navigation, including entry direction and the URL hash
- room panel, floor plan and mini map
- guided tour
- measuring and couch fit
- before/after, media and video
- compare sync
- share, including a full QR decode with standard format bits, zero Reed–Solomon syndromes and a byte-for-byte URL match
- save and scheduling
- accessibility toggles and live descriptions
- Exit Tour and Resume
- mobile layout and the 44px touch-target minimum
- no runtime, resource or non-GET request errors

Desktop and mobile screenshots were reviewed visually.
