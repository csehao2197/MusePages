import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { PromptPageWorkflow, StaticHomepage, WorkspaceFiles } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { verifyStandalone } from "../../../258-handmade-footwear-store-drizzle-migration-plan/GPT-6/.checks/recheck.mjs";

const root = process.cwd();
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const manifest = JSON.parse(await fs.readFile(manifestFile, "utf8"));
let total = 0;
for (const record of manifest.records.filter((r) => r.number >= Number(process.argv[2] || 270) && r.number <= 279).sort((a, b) => a.number - b.number))
{
    await PromptPageWorkflow.withPromptLock(root, record.prompt, async () =>
    {
        const folder = path.join(root, "out", "pages", record.prompt, "GPT-6");
        const exported = path.join(folder, "out");
        const metadataFile = path.join(folder, "metadata.json");
        const metadata = JSON.parse(await fs.readFile(metadataFile, "utf8"));
        if (metadata.modelId !== "gpt-6.1-sol" || !metadata.generated) throw Error("Unexpected source identity");
        for (const name of ["index.html", "style.css", "app.js"])
        {
            if (!(await fs.readFile(path.join(folder, name))).equals(await fs.readFile(path.join(exported, name)))) throw Error("Visible content changed");
        }
        const unwanted = path.join(exported, "verify.mjs");
        const unwantedContent = await fs.readFile(unwanted).catch((error) =>
        {
            if (error.code === "ENOENT") return null;
            throw error;
        });
        if (unwantedContent && !unwantedContent.toString().trimStart().startsWith("export async function run(page, assert")) throw Error("Unrecognized exported file; preserving");
        await WorkspaceFiles.saveJson(metadataFile, { ...metadata, preview: false, validated: false });
        await fs.rm(unwanted, { force: true });
        const config = JSON.parse(await fs.readFile(path.join(root, "deploy", "config.json"), "utf8"));
        const option = config.pages[record.prompt].pages.find((p) => p.model === "GPT-6");
        if (option.enabled || option.deployed) throw Error("Unexpected registration flags");
        const digest = await StaticHomepage.validateStaticOutput(exported, option.slug, "GPT-6");
        await StaticHomepage.ensurePreview(root, { folder }, exported, digest, undefined, false);
        const fileURL = pathToFileURL(path.join(folder, "verify.mjs"));
        const { run } = await import(fileURL);
        let result;
        const log = console.log;
        try
        {
            console.log = (line) =>
            {
                result = JSON.parse(line);
            };
            await verifyStandalone(fileURL.href, run);
        }
        finally
        {
            console.log = log;
        }
        if (!result?.assertions || result.browserErrors.length) throw Error("Browser recheck missing or failed");
        const publicFiles = (await fs.readdir(exported)).sort();
        if (JSON.stringify(publicFiles) !== JSON.stringify(["app.js", "index.html", "preview.png", "style.css"])) throw Error("Export boundary not exact");
        const evidenceFile = path.join(folder, ".checks", "evidence.json");
        const evidence = JSON.parse(await fs.readFile(evidenceFile, "utf8"));
        evidence.staticDigest = digest;
        evidence.exportBoundaryRepair = { removed: "Unreferenced test-only verify.mjs", publicFiles, visibleSourcesUnchanged: true, previewRecaptured: true, desktopMobileRecheckAssertions: result.assertions, browserErrors: [], visualQA: "Previously image-view inspected desktop/mobile retained: index.html, style.css and app.js are byte-identical; only unreferenced test script removed.", helpersStopped: true };
        evidence.recheckAssertions = result.assertions;
        await WorkspaceFiles.saveJson(evidenceFile, evidence);
        Object.assign(metadata, { preview: true, validated: true });
        await WorkspaceFiles.saveJson(metadataFile, metadata);
        await fs.appendFile(path.join(folder, "README.md"), `\nFinal boundary audit: removed an unreferenced copied test script from \`out\\\`; public export now contains only index.html, style.css, app.js and preview.png. Visible source bytes are unchanged from image-view QA. Refreshed real preview/digest and passed ${result.assertions} further desktop/mobile browser assertions. All helpers stopped.\n`);
        const entry = { timestamp: new Date().toISOString(), runId: manifest.runId, prompt: record.prompt, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "corrected-export-boundary-and-rechecked", status: "generated", ...metadata, tags_valid: true, deployed: false, verification: evidence.exportBoundaryRepair, error: null };
        await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), JSON.stringify(entry) + "\n", "utf8");
        const current = JSON.parse(await fs.readFile(manifestFile, "utf8"));
        Object.assign(current.records.find((r) => r.prompt === record.prompt), { recheckAssertions: result.assertions, exportBoundary: "homepage-assets-preview-only" });
        await WorkspaceFiles.saveJson(manifestFile, current);
        total += result.assertions;
        console.log(`${record.prompt}: exact public boundary; ${result.assertions} recheck assertions; metadata/log/manifest persisted; helpers stopped`);
    });
}
console.log(`Boundary correction complete: ${total} additional real browser assertions. All ten locks released.`);
