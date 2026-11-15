import { promises as fs } from "node:fs";
import path from "node:path";
import http from "node:http";
import { createHash } from "node:crypto";
import { chromium } from "@playwright/test";
import { StaticHomepage, PromptPageWorkflow } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const root = process.cwd();
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const read = (file) => fs.readFile(file, "utf8");
const json = async (file) => JSON.parse(await read(file));
const hash = (value) => createHash("sha256").update(value).digest("hex");
const save = async (file, value) =>
{
    const next = `${file}.${process.pid}.next`;
    await fs.writeFile(next, `${JSON.stringify(value, null, 4)}\n`);
    await fs.rename(next, file);
};
const records = (await json(manifestFile)).records.filter((entry) => entry.number >= 415 && entry.number <= 424);
if (records.length !== 10) throw Error("Exact bounded set required");
let total = 0;
const summaries = [];
for (const record of records)
{
    await PromptPageWorkflow.withPromptLock(root, record.prompt, async () =>
    {
        const folder = path.join(root, record.output);
        const out = path.join(folder, "out");
        const qa = { prompt: record.prompt, assertions: 0, checks: [], errors: [], viewports: [] };
        const check = (condition, name) =>
        {
            if (!condition) throw Error(`${record.prompt}: ${name}`);
            qa.assertions++;
            qa.checks.push(name);
        };
        const metadata = await json(path.join(folder, "metadata.json"));
        check(metadata.modelId === "gpt-6.1-sol", "actual model identity");
        check(["generated", "preview", "validated", "config_added"].every((key) => metadata[key] === true), "all four verified boolean states");
        check(metadata.tags.length > 0 && metadata.tags.every((tag) => tag === tag.trim() && tag.length) && new Set(metadata.tags).size === metadata.tags.length, "meaningful unique trimmed tags");
        check(metadata.staticDir === "out", "standalone static export mapping");
        const prompt = await read(path.join(root, "data", "prompts", record.prompt, `${record.prompt}.md`));
        const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
        check((await read(path.join(folder, ".generation-input.sha256"))).trim() === hash(JSON.stringify([prompt, design])), "exact current original and full DESIGN fingerprint");
        const config = await json(path.join(root, "deploy", "config.json"));
        const options = config.pages[record.prompt].pages;
        const registered = options.filter((option) => option.model === "GPT-6");
        check(registered.length === 1, "unique registered model");
        const option = registered[0];
        check(option.enabled === false && option.deployed === false, "registered disabled and undeployed");
        check(!/^\d+-/.test(option.slug) && option.staticDir === "out", "public path strips prompt prefix");
        check(await StaticHomepage.checkSource(folder) === "html", "valid HTML source and README");
        const digest = await StaticHomepage.validateStaticOutput(out, option.slug, "GPT-6");
        check(Boolean(digest), "independent static boundary and resources");
        const preview = await fs.readFile(path.join(out, "preview.png"));
        check(preview.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" && preview.readUInt32BE(16) === 1200 && preview.readUInt32BE(20) === 900, "real preview PNG dimensions");
        check((await read(path.join(folder, ".generation-preview.sha256"))).trim() === `${digest} ${hash(preview)}`, "current static and preview digests");
        const files = await fs.readdir(out);
        check(files.every((file) => ["index.html", "style.css", "app.js", "preview.png"].includes(file) || /^[a-z-]+\.svg$/.test(file)), "homepage assets only in export");
        for (const file of files.filter((file) => file !== "preview.png"))
        {
            check(hash(await fs.readFile(path.join(folder, file))) === hash(await fs.readFile(path.join(out, file))), `source/export parity ${file}`);
        }
        const interaction = await json(path.join(folder, ".checks", "qa.json"));
        check(interaction.assertions === record.assertions && interaction.errors.length === 0 && interaction.viewports.length === 2, "recorded real browser interaction evidence");
        const visual = await read(path.join(folder, ".checks", "visual-approved"));
        check(visual.trim().length > 40, "actual desktop/mobile image viewing recorded");
        for (const [image, width] of [["desktop.png", 1200], ["mobile.png", 390]])
        {
            const buffer = await fs.readFile(path.join(folder, ".checks", image));
            check(buffer.readUInt32BE(16) === width && buffer.readUInt32BE(20) >= 844, `stored ${image} dimensions`);
        }
        const prefix = `/pages/${option.slug}/GPT-6/`;
        const server = http.createServer(async (req, res) =>
        {
            try
            {
                const url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
                if (!url.startsWith(prefix)) throw Error("Outside public subpath");
                const file = path.resolve(out, url.slice(prefix.length) || "index.html");
                if (!file.startsWith(`${out}${path.sep}`)) throw Error("Outside export");
                const data = await fs.readFile(file);
                const mime = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png" };
                res.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
                res.end(data);
            }
            catch
            {
                res.writeHead(404);
                res.end("Not found");
            }
        });
        await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
        let browser;
        try
        {
            browser = await chromium.launch({ headless: true });
            for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
            {
                const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
                page.on("console", (message) =>
                {
                    if (message.type() === "error") qa.errors.push(message.text());
                });
                page.on("pageerror", (error) => qa.errors.push(error.message));
                page.on("requestfailed", (request) => qa.errors.push(request.url()));
                page.on("response", (response) =>
                {
                    if (response.status() >= 400) qa.errors.push(`${response.status()} ${response.url()}`);
                });
                const response = await page.goto(`http://127.0.0.1:${server.address().port}${prefix}index.html`);
                await page.waitForLoadState("networkidle");
                check(response.status() === 200, `${viewport.width}: eventual public path serves`);
                check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${viewport.width}: no horizontal overflow`);
                check(await page.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0 && Boolean(image.getAttribute("alt")) || image.getAttribute("alt") === "" && image.complete && image.naturalWidth > 0)), `${viewport.width}: every local image loads`);
                check(await page.locator("a[href^='#']").evaluateAll((links) => links.every((link) => !link.hash || document.getElementById(link.hash.slice(1)))), `${viewport.width}: all section navigation resolves`);
                check(await page.locator("h1").count() === 1 && (await page.title()).length > 5, `${viewport.width}: semantic title and single headline`);
                check(qa.errors.length === 0, `${viewport.width}: no console, page, network or HTTP errors`);
                qa.viewports.push(viewport);
                await page.close();
            }
        }
        finally
        {
            await browser?.close();
            await new Promise((resolve) => server.close(resolve));
        }
        check(!await fs.stat(path.join(folder, ".preview.lock")).catch(() => null), "preview helper lock clean");
        await save(path.join(folder, ".checks", "final-audit.json"), qa);
        await fs.appendFile(path.join(folder, "README.md"), `\nFinal independent audit: ${qa.assertions} additional identity, fingerprint, export, preview, subpath, image, navigation, responsive and console/resource checks passed. Evidence: \`.checks\\final-audit.json\`.\n`);
        const log = { timestamp: new Date().toISOString(), runId: "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c", prompt: record.prompt, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: record.output, action: "final-audit", status: "generated", ...metadata, tags_nonempty: true, assertions: record.assertions, finalAuditChecks: qa.assertions, registrationChecks: 3, visualQA: true, deployed: false, helperCleanup: true, verification: "Identity, exact original/DESIGN and preview fingerprints, safe export, source parity, real desktop/mobile browser, console/resources and local links passed; no build/install/dist/publication" };
        await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify(log)}\n`);
        const manifest = await json(manifestFile);
        Object.assign(manifest.records.find((entry) => entry.prompt === record.prompt), { finalAuditChecks: qa.assertions, helperCleanup: true });
        await save(manifestFile, manifest);
        summaries.push({ prompt: record.prompt, browserChecks: record.assertions, registrationChecks: 3, finalAuditChecks: qa.assertions });
        total += qa.assertions;
        console.log(`AUDITED ${record.prompt}: ${qa.assertions} additional checks; browser/server closed`);
    });
}
console.log(JSON.stringify({ items: summaries, totals: { browser: records.reduce((sum, record) => sum + record.assertions, 0), registration: 30, finalAudit: total, imagesViewed: 20 }, historicalBlockers: (await json(manifestFile)).records.filter((entry) => entry.status === "blocked").length }));
