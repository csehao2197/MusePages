# Asset inventory

All arena geometry, balls, reflections, number discs, seams, contact particles, CSS backing circles, interface SVG symbols and `public\favicon.svg` are original, code-drawn work for this implementation. There are no third-party illustrations or image-generation assets.

Local font files (also present under static `out\fonts`):

| Files under `public\fonts` | Fontsource source | Original authors | License |
| --- | --- | --- | --- |
| `fredoka-latin-500-normal.woff2`, `fredoka-latin-600-normal.woff2` | https://www.npmjs.com/package/@fontsource/fredoka v5.2.7 | Milena Brandao; package copyright notice Google Inc. retained | OFL-1.1, `public\licenses\fredoka-OFL.txt` |
| `dm-sans-latin-400-normal.woff2`, `dm-sans-latin-500-normal.woff2`, `dm-sans-latin-700-normal.woff2` | https://www.npmjs.com/package/@fontsource/dm-sans v5.2.8 | Colophon Foundry; DM Sans Project Authors notice retained | OFL-1.1, `public\licenses\dm-sans-OFL.txt` |

Font binaries and their exact notices are reused from existing local Fontsource packages, without modification. `src\styles.css` declares only these Latin normal weights with relative WOFF2 URLs. No remote stylesheet or font request occurs. Public license copies reside in `out\licenses`. Prompt attribution and the noncommercial provenance notice are retained separately in `README.md` and `LICENSE`; no CC BY-NC artwork or third-party implementation is imported.
