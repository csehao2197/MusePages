# Student design portfolio

- Inputs: `data\prompts\196-student-new-grad-portfolio\196-student-new-grad-portfolio.md` and `src\workflows\AI Agent\DESIGN.md`.
- Actual generator: `gpt-6.1-sol`; independent public label: `GPT-6`.
- Type/source: standalone `index.html`, original CSS/SVG artwork and accessible `sample-cv.txt`. Features: project filters, expandable case studies, mobile menu and locally validated demo contact form.
- Run: serve this folder with an existing static HTTP server. Validate from repository root: `node out\pages\196-student-new-grad-portfolio\GPT-6\.checks\verify.mjs`. Checks cover filters, cases, download, form, mobile navigation, overflow and browser/resource errors; evidence lives in `.checks`.
- Export: the independent homepage and browser resources are copied to `out\`. Expected public path: `pages/student-new-grad-portfolio/GPT-6/index.html`. Preview is a real 1200×900 browser capture. Registration is disabled by default; build and publication are separate.
- Mock/limits: illustrative identity and concept projects, not approved real work. Experience, dates, credentials, location and public contact await owner input. The CV is a labeled sample. The demo form sends and stores nothing; no response is promised. No backend or environment variables.
- Review checklist: desktop/mobile layout; visible keyboard focus; project disclosure/filter behavior; sample CV; honest contact feedback. Browser and visual results are recorded after execution.
