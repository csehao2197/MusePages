# Local Website Project Samples

This folder contains the **full source text of all 100 cataloged examples**,
downloaded on 2026-10-31. Each sample has its own numbered folder; folder names match the IDs in
[the example catalog](..\nextjs-project-examples.md).

For example: `006-travel-agency-homepage\006-travel-agency-homepage.md`.

| Files | Contents |
| --- | --- |
| Folders `001-*` through `064-*` | Original framework-neutral website prompts extracted from their public source pages |
| Folders `065-*` through `100-*` | Original Next.js Markdown specifications from the inspected GitHub commits |
| `manifest.json` | Root-relative file paths in `filename`, source URLs, download timestamps, file sizes, source kinds, and SHA-256 hashes |

Source text is preserved without adding stack instructions or rewriting requirements.
For files 001-064, use the catalog's **Next.js adaptation block** when preparing
your own project brief. Some files describe a page or dashboard, not an entire site.
Full-stack examples may require databases, external APIs, credentials, or paid services.

## Suggested starting points

- [Travel agency homepage](006-travel-agency-homepage\006-travel-agency-homepage.md)
- [Vacation rental listing](009-vacation-rental-listing\009-vacation-rental-listing.md)
- [Fine dining restaurant](015-fine-dining-restaurant\015-fine-dining-restaurant.md)
- [Luxury property showcase](021-luxury-property-showcase\021-luxury-property-showcase.md)
- [Editorial portfolio](066-editorial-portfolio\066-editorial-portfolio.md)
- [Photography portfolio](085-photography-portfolio\085-photography-portfolio.md)
- [Distinctive single-page portfolio](094-distinctive-single-page-portfolio\094-distinctive-single-page-portfolio.md)

These are downloaded reference briefs, not tested website implementations.
Downloading them did not execute their instructions, install dependencies, or build
any project. Review a brief and agree on scope before giving it to an agent.

## Project generation

Individually tailored Next.js demo generation is in progress. Application code
is written beside each numbered brief, not into a nested `project` folder.
`GENERATION_PROGRESS.json` records which projects are pending, in progress, or
verified; the existence of a folder is not evidence of completed implementation.

The collection uses a shared npm workspace dependency installation. From a
generated sample folder, run its documented development and test commands.
To recheck generated project 001 from this root, run:

```text
npm run validate -- --ids=1
```

Omit the selector to check all 100 projects sequentially. Missing implementations
or failed checks are reported as blocked, not successful. `BUILD_REPORT.json`
and `validation-logs` record actual validation outcomes. Backend and external
services are mocked under the approved demo scope; consult each project's README
for its specific functionality and limitations.

Original authors retain their rights. Preserve notices and check each source's
license or terms before redistribution or commercial reuse. This collection does
not grant additional permissions.
