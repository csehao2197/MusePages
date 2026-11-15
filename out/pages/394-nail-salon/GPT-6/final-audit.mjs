import { promises as fs } from "node:fs";
import path from "node:path";
import http from "node:http";
import { createHash } from "node:crypto";
import { chromium } from "@playwright/test";
import { StaticHomepage } from "../../../../src/workflows/script/render-prompt-page.mjs";

const root = process.cwd();
const ids = ["394-nail-salon", "395-newsletter-landing-page-undercurrent", "396-nightclub", "397-nonprofit-organization", "398-notary", "399-nutritionist", "400-online-course", "401-optician", "403-padel-club", "404-paintball"];
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const read = (file) => fs.readFile(file, "utf8");
const json = async (file) => JSON.parse(await read(file));
const hash = (value) => createHash("sha256").update(value).digest("hex");
const exists = async (file) => Boolean(await fs.stat(file).catch(() => null));
const config = await json(path.join(root, "deploy", "config.json"));
const manifest = await json(manifestFile);
const logs = (await read(path.join(root, "logs", "render-prompt-pages-ai.log"))).trim().split(/\r?\n/).map((line) => JSON.parse(line));
const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
const browser = await chromium.launch({ headless: true });
const results = [];
try
{
    for (const id of ids)
    {
        const checks = [];
        const check = (condition, name) =>
        {
            if (!condition) throw Error(`${id}: ${name}`);
            checks.push(name);
        };
        const folder = path.join(root, "out", "pages", id, "GPT-6");
        const out = path.join(folder, "out");
        const metadata = await json(path.join(folder, "metadata.json"));
        const qa = await json(path.join(folder, ".checks", "qa.json"));
        const entry = manifest.records.find((record) => record.prompt === id);
        const latest = logs.filter((record) => record.prompt === id).at(-1);
        const options = config.pages[id]?.pages;
        const option = options?.find((record) => record.model === "GPT-6");
        check(metadata.modelId === "gpt-6.1-sol", "actual generating model");
        check(["generated", "validated", "preview", "config_added"].every((key) => metadata[key] === true), "metadata stages complete");
        check(metadata.tags.length > 0 && metadata.tags.every((tag) => tag === tag.trim() && tag.length > 2) && new Set(metadata.tags).size === metadata.tags.length, "nonempty meaningful unique tags");
        check(metadata.staticDir === "out", "independent export directory");
        const original = await read(path.join(root, "data", "prompts", id, `${id}.md`));
        check((await read(path.join(folder, ".generation-input.sha256"))).trim() === hash(JSON.stringify([original, design])), "exact input and full DESIGN fingerprint");
        const digest = await StaticHomepage.validateStaticOutput(out, option.slug, "GPT-6");
        const previewRecord = (await read(path.join(folder, ".generation-preview.sha256"))).trim().split(" ");
        check(previewRecord[0] === digest, "static digest matches preview record");
        const preview = await fs.readFile(path.join(out, "preview.png"));
        check(previewRecord[1] === hash(preview), "real preview digest matches");
        check(preview.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" && preview.readUInt32BE(16) === 1200 && preview.readUInt32BE(20) === 900, "preview is 1200 by 900 PNG");
        for (const file of ["index.html", "style.css", "app.js"])
        {
            check(hash(await fs.readFile(path.join(folder, file))) === hash(await fs.readFile(path.join(out, file))), `source and exported ${file} identical`);
        }
        check((await fs.readdir(out)).every((name) => ["index.html", "style.css", "app.js", "preview.png"].includes(name) || /^[a-z-]+\.svg$/.test(name)), "export contains only homepage assets and preview");
        check(options.filter((record) => record.model === "GPT-6").length === 1, "unique registered GPT-6 option");
        check(option.enabled === false && option.deployed === false, "new result disabled and undeployed");
        check(option.staticDir === "out" && option.slug === id.replace(/^\d+-/, "") && !/^\d+-/.test(option.title), "public unnumbered path and static registration");
        check(entry.status === "generated" && entry.modelId === metadata.modelId && entry.assertions === qa.assertions && entry.visualQA === true, "manifest reflects actual evidence");
        check(latest.status === "generated" && latest.runId === manifest.runId && latest.assertions === qa.assertions && latest.tags_nonempty === true, "append-only generation log matches evidence");
        check((await read(path.join(folder, ".checks", "visual-approved"))).trim().length > 50, "actual image-view evaluation recorded");
        for (const [file, width] of [["desktop.png", 1200], ["mobile.png", 390]])
        {
            const image = await fs.readFile(path.join(folder, ".checks", file));
            check(image.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" && image.readUInt32BE(16) === width && image.readUInt32BE(20) >= 844, `${file} full-page evidence dimensions`);
        }
        check(!await exists(path.join(root, "out", ".generation-locks", `${id}.lock`)), "prompt lock released");
        const prefix = `/pages/${option.slug}/GPT-6/`;
        const server = http.createServer(async (req, res) =>
        {
            try
            {
                const url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
                if (!url.startsWith(prefix)) throw Error("Outside path");
                const file = path.resolve(out, url.slice(prefix.length) || "index.html");
                if (!file.startsWith(`${out}${path.sep}`)) throw Error("Outside export");
                const body = await fs.readFile(file);
                const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png" };
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
        try
        {
            for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
            {
                const errors = [];
                const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
                page.on("pageerror", (error) => errors.push(error.message));
                page.on("console", (message) =>
                {
                    if (message.type() === "error") errors.push(message.text());
                });
                page.on("requestfailed", (request) => errors.push(request.url()));
                page.on("response", (response) =>
                {
                    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
                });
                const response = await page.goto(`http://127.0.0.1:${server.address().port}${prefix}index.html`);
                await page.waitForLoadState("networkidle");
                check(response.status() === 200, `${viewport.width}: public static subpath HTTP 200`);
                check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${viewport.width}: no horizontal overflow`);
                check(errors.length === 0, `${viewport.width}: no console, JavaScript, network or HTTP errors`);
                check(await page.evaluate(() => [...document.querySelectorAll("a[href^='#']")].every((link) => document.getElementById(link.hash.slice(1)))), `${viewport.width}: every internal navigation target exists`);
                check(await page.evaluate(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0 && image.hasAttribute("alt"))), `${viewport.width}: every image loaded with alt attribute`);
                check(await page.evaluate(() =>
                {
                    const ids = [...document.querySelectorAll("[id]")].map((element) => element.id);
                    return new Set(ids).size === ids.length;
                }), `${viewport.width}: unique DOM identifiers`);
                await page.close();
            }
        }
        finally
        {
            await new Promise((resolve) => server.close(resolve));
        }
        const result = { prompt: id, assertions: checks.length, checks, pageAssertions: qa.assertions, registrationChecks: 3, visualImagesViewed: 2, helperCleanup: true };
        await fs.writeFile(path.join(folder, ".checks", "final-audit.json"), `${JSON.stringify(result, null, 4)}\n`);
        entry.finalAuditChecks = checks.length;
        entry.helperCleanup = true;
        await fs.appendFile(path.join(folder, "README.md"), `\nFinal audit: ${checks.length} additional fingerprint, export, registration, evidence, console/resource, navigation and responsive checks passed; prompt lock released.\n`);
        await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify({ timestamp: new Date().toISOString(), runId: manifest.runId, prompt: id, display_model_name: "GPT-6", modelId: metadata.modelId, output: path.relative(root, folder), action: "final-audit", status: "generated", ...metadata, tags_nonempty: true, pageAssertions: qa.assertions, registrationChecks: 3, finalAuditChecks: checks.length, visualQA: true, helperCleanup: true, deployed: false, limits: "No builds, installs, dist, publication or commits" })}\n`, "utf8");
        const next = `${manifestFile}.${process.pid}.next`;
        await fs.writeFile(next, `${JSON.stringify(manifest, null, 4)}\n`);
        await fs.rename(next, manifestFile);
        results.push({ prompt: id, browser: qa.assertions, registration: 3, finalAudit: checks.length, imagesViewed: 2 });
    }
}
finally
{
    await browser.close();
}
console.log(JSON.stringify({ results, totalBrowser: results.reduce((sum, item) => sum + item.browser, 0), totalRegistration: results.length * 3, totalFinalAudit: results.reduce((sum, item) => sum + item.finalAudit, 0), imagesViewed: results.length * 2, stoppedAfter: "404-paintball" }, null, 4));
