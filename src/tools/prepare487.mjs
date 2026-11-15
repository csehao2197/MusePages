import fs from "node:fs/promises";
import path from "node:path";
import { WorkspaceFiles as Files } from "../workflows/script/render-prompt-page.mjs";
const folder = path.resolve(process.argv[2]);
const prompt = path.basename(path.dirname(folder));
const details = await Files.json(path.join(folder, ".details.json"));
const source = JSON.parse(await fs.readFile("src\\manifest.json", "utf8")).find((item) => item.filename.startsWith(prompt + "\\"));
await Files.saveText(path.join(folder, "README.md"), `# ${details.title}

Input: \`data\\prompts\\${source.filename}\` and \`src\\workflows\\AI Agent\\DESIGN.md\`.
Actual generator: \`gpt-6.1-sol\`; public label: \`GPT-6\`.

Standalone HTML/CSS/JavaScript static adaptation; no framework build was run. ${details.features}

Deviations and limitations: ${details.limitations} Original local SVG/CSS artwork replaces third-party media with unverified usage rights; locally available system fonts replace remote fonts. No environment variables or runtime backend.

Source: this directory. Independent static export: \`out\\\`. Eventual public path: \`pages/${details.slug}/GPT-6/index.html\`; registration is disabled and undeployed.

From repository root, run/verify: \`node src\\tools\\page-qa487.mjs out\\pages\\${prompt}\\GPT-6\`. Reusable browser assertions: \`.checks\\verify.mjs\`; actual evidence: \`.checks\\qa.json\`, \`desktop.png\`, \`mobile.png\`. Browser checks cover 1200×900 and 390×844, public-subpath loading, meaningful interactions, console/resource/HTTP errors and horizontal overflow. Both screenshots require actual visual review before registration. Workflow source/static validation, real 1200×900 preview capture and stage results are recorded independently in metadata and the append-only run log.

Prompt provenance: [${source.title}](${source.source_url}), ${source.license}. Original authors retain their rights; see exported \`NOTICE\` and \`LICENSE\`. Prompt licensing does not license referenced third-party media.
`);
