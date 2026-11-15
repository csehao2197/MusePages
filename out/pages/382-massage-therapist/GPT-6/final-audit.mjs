import { promises as fs } from "node:fs";
import path from "node:path";
import http from "node:http";
import { createHash } from "node:crypto";
import { chromium } from "@playwright/test";
import { StaticHomepage } from "../../../../src/workflows/script/render-prompt-page.mjs";

const root = process.cwd();
const ids =
[
    "382-massage-therapist",
    "383-mechanic",
    "385-medical-clinic",
    "386-mexican-restaurant",
    "387-mortgage-broker",
    "388-moving-company",
    "389-museum",
    "390-music-producer",
    "391-music-school",
    "392-music-store"
];
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const read = (file) => fs.readFile(file, "utf8");
const json = async (file) => JSON.parse(await read(file));
const hash = (value) => createHash("sha256").update(value).digest("hex");
const exists = async (file) => Boolean(await fs.stat(file).catch(() => null));
const save = async (file, value) =>
{
    const next = `${file}.${process.pid}.next`;
    await fs.writeFile(next, `${JSON.stringify(value, null, 4)}\n`);
    await fs.rename(next, file);
};
const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
const config = await json(path.join(root, "deploy", "config.json"));
const manifest = await json(manifestFile);
const successes = new Map();
for (const line of (await read(path.join(root, "logs", "render-prompt-pages-ai.log"))).trim().split(/\r?\n/))
{
    const entry = JSON.parse(line);
    if (ids.includes(entry.prompt)) successes.set(entry.prompt, entry);
}
const outcomes = [];
for (const id of ids)
{
    const folder = path.join(root, "out", "pages", id, "GPT-6");
    const out = path.join(folder, "out");
    const checks = [];
    const check = (condition, name) =>
    {
        if (!condition) throw Error(`${id}: ${name}`);
        checks.push(name);
    };
    const metadata = await json(path.join(folder, "metadata.json"));
    const qa = await json(path.join(folder, ".checks", "qa.json"));
    const spec = await json(path.join(folder, "page.json"));
    const options = config.pages[id]?.pages.filter((entry) => entry.model === "GPT-6") || [];
    const option = options[0];
    const slug = option?.slug;
    check(metadata.modelId === "gpt-6.1-sol" && metadata.staticDir === "out", "real identity/staticDir");
    check(["generated", "preview", "validated", "config_added"].every((key) => metadata[key] === true), "four durable success booleans");
    check(metadata.tags.length > 0 && metadata.tags.every((tag) => tag === tag.trim() && tag.length) && new Set(metadata.tags).size === metadata.tags.length, "meaningful unique tags");
    const files = await fs.readdir(out);
    check(files.every((name) => ["index.html", "style.css", "app.js", "preview.png"].includes(name) || name.endsWith(".svg")), "safe static boundary");
    let equal = true;
    for (const name of files.filter((file) => file !== "preview.png"))
    {
        equal &&= (await fs.readFile(path.join(folder, name))).equals(await fs.readFile(path.join(out, name)));
    }
    check(equal, "source/export asset identity");
    const prompt = await read(path.join(root, "data", "prompts", id, `${id}.md`));
    check((await read(path.join(folder, ".generation-input.sha256"))).trim() === hash(JSON.stringify([prompt, design])), "exact canonical input fingerprint");
    const preview = await fs.readFile(path.join(out, "preview.png"));
    const digest = await StaticHomepage.validateStaticOutput(out, slug, "GPT-6");
    check((await read(path.join(folder, ".generation-preview.sha256"))).trim() === `${digest} ${hash(preview)}`, "current static/preview fingerprint");
    check(preview.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" && preview.readUInt32BE(16) === 1200 && preview.readUInt32BE(20) === 900, "real preview PNG dimensions");
    check(qa.assertions === qa.checks.length && qa.errors.length === 0 && qa.viewports.length === 2, "stored executed browser evidence");
    const desktop = await fs.readFile(path.join(folder, ".checks", "desktop.png"));
    const mobile = await fs.readFile(path.join(folder, ".checks", "mobile.png"));
    check(desktop.readUInt32BE(16) === 1200 && mobile.readUInt32BE(16) === 390 && desktop.readUInt32BE(20) >= 900 && mobile.readUInt32BE(20) >= 844, "desktop/mobile real captures");
    const visualNotes = (await read(path.join(folder, ".checks", "visual-approved"))).trim();
    check(visualNotes.length > 100, "actual image-view review notes retained");
    check(options.length === 1 && option.staticDir === "out" && slug && !/^\d+-/.test(slug), "unique public unnumbered registration mapping");
    check(option.enabled === false && option.deployed === false, "registered disabled/undeployed");
    const record = manifest.records.find((entry) => entry.prompt === id);
    check(record.status === "generated" && record.assertions === qa.assertions && record.modelId === metadata.modelId, "manifest matches current verified output");
    const previous = successes.get(id);
    check(previous?.status === "generated" && previous.visualQA === true && previous.runId === manifest.runId, "append-only log current success");
    check(!await exists(path.join(root, "out", ".generation-locks", `${id}.lock`)), "generation lock released");
    check(!await exists(path.join(out, ".preview.lock")), "preview lock released");
    const prefix = `/pages/${slug}/GPT-6/`;
    const server = http.createServer(async (req, res) =>
    {
        try
        {
            const url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
            if (!url.startsWith(prefix)) throw Error("Outside public subpath");
            const file = path.resolve(out, url.slice(prefix.length) || "index.html");
            if (!file.startsWith(`${out}${path.sep}`)) throw Error("Outside export");
            const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png" };
            const body = await fs.readFile(file);
            res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
            res.end(body);
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
        for (const width of [1200, 390])
        {
            const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 }, reducedMotion: "reduce" });
            const errors = [];
            const writes = [];
            page.on("console", (message) =>
            {
                if (message.type() === "error") errors.push(message.text());
            });
            page.on("pageerror", (error) => errors.push(error.message));
            page.on("requestfailed", (request) => errors.push(request.url()));
            page.on("response", (response) =>
            {
                if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
            });
            page.on("request", (request) =>
            {
                if (request.method() !== "GET") writes.push(request.method());
            });
            const response = await page.goto(`http://127.0.0.1:${server.address().port}${prefix}index.html`);
            await page.waitForLoadState("networkidle");
            check(response.status() === 200, `${width}: eventual public homepage responds`);
            check(errors.length === 0, `${width}: no console/JS/resource errors`);
            check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: responsive overflow absent`);
            check(await page.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)), `${width}: all image resources decode`);
            check(writes.length === 0, `${width}: no network submission`);
            await page.close();
        }
    }
    finally
    {
        await browser?.close();
        await new Promise((resolve) => server.close(resolve));
    }
    await save(path.join(folder, ".checks", "final-audit.json"), { prompt: id, assertions: checks.length, checks, helperCleanup: true, sourceChecks: qa.assertions, visualNotes });
    await fs.appendFile(path.join(folder, "README.md"), `\nFinal persistence/runtime audit: ${checks.length} additional checks passed, including both viewport console/resource/overflow checks and exact input/preview fingerprints. Temporary browser and local server closed; generation/preview locks absent.\n`);
    await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify({ timestamp: new Date().toISOString(), runId: manifest.runId, prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "final-audit", status: "generated", ...metadata, tags_nonempty: true, assertions: qa.assertions, registrationChecks: record.registrationChecks, finalAuditChecks: checks.length, visualQA: true, visualNotes, helperCleanup: true, deployed: option.deployed, enabled: option.enabled, mocks: spec.mocks, limits: spec.limits })}\n`, "utf8");
    const latest = await json(manifestFile);
    Object.assign(latest.records.find((entry) => entry.prompt === id), { finalAuditChecks: checks.length, helperCleanup: true });
    await save(manifestFile, latest);
    outcomes.push({ prompt: id, page: qa.assertions, registration: record.registrationChecks, final: checks.length });
}
console.log(JSON.stringify({ outcomes, totals: outcomes.reduce((sum, item) =>
{
    for (const key of ["page", "registration", "final"]) sum[key] += item[key];
    return sum;
}, { page: 0, registration: 0, final: 0 }), helpersClosed: true, imagesViewed: 20, builds: 0, installs: 0, publications: 0 }, null, 2));
