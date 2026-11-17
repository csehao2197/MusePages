# Assets

No photographs, third-party images, copied anatomy plates or real ECG recordings. SVG artwork is generated from the prompt's specified coordinates; the favicon is hand-written and the waveform is mathematical.

| Asset/path | Source/author | License |
| --- | --- | --- |
| `assets\gsap.min.js`, `assets\ScrollTrigger.min.js` | GSAP 3.14.2; GreenSock/Webflow; https://gsap.com | GSAP Standard No Charge License; `assets\LICENSE-gsap.txt`; original file notices retained |
| `assets\icons.js` (Play, Pause, ChevronLeft, ChevronRight, Plus) | Individual icon nodes from installed lucide-react 1.61.0; Lucide contributors; https://lucide.dev | ISC / applicable Feather MIT notices in `assets\LICENSE-lucide.txt` |
| `assets\gloock.woff2` | @fontsource/gloock 5.2.7 Latin 400; Duarte Pinto / Google; https://fontsource.org/fonts/gloock | OFL-1.1, `assets\LICENSE-gloock.txt` |
| `assets\hanken.woff2` | @fontsource-variable/hanken-grotesk 5.2.8 Latin weight variable; Hanken Grotesk Project Authors; https://fontsource.org/fonts/hanken-grotesk | OFL-1.1, `assets\LICENSE-hanken.txt` |
| `assets\martian.woff2` | @fontsource-variable/martian-mono 5.2.6 Latin weight variable; Martian Mono Project / Evil Martians; https://fontsource.org/fonts/martian-mono | OFL-1.1, `assets\LICENSE-martian.txt` |
| `assets\favicon.svg`; inline anatomical SVGs | This adaptation, derived from VibeFather's specified geometric/text prompt | Prompt-derived material CC BY-NC 4.0 |

Only these runtime assets and their licenses enter `out\`. Package manifests, dependency directories, private QA, Markdown source documents and generation records stay outside the public export.
