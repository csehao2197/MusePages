import { promises as fs } from "node:fs";
import path from "node:path";
import http from "node:http";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { StaticHomepage, PromptPageWorkflow } from "../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../src/workflows/script/deploy-site.mjs";

const root = process.cwd();
const allowed = ["436-restaurant", "437-retail-saas", "438-roofing-company", "440-saas-landing-page", "441-school", "442-security-company", "443-self-storage", "444-seo-agency", "445-shoe-store", "446-ski-school"];
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const runId = "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c";
const read = (file) => fs.readFile(file, "utf8");
const json = async (file) => JSON.parse(await read(file));
const exists = async (file) => Boolean(await fs.stat(file).catch(() => null));
const hash = (value) => createHash("sha256").update(value).digest("hex");
const save = async (file, value) =>
{
    const next = `${file}.${process.pid}.next`;
    await fs.writeFile(next, `${JSON.stringify(value, null, 4)}\n`);
    await fs.rename(next, file);
};

export async function audit(id, interaction)
{
    if (!allowed.includes(id)) throw Error("Outside batch");
    const folder = path.join(root, "out", "pages", id, "GPT-6");
    const out = path.join(folder, "out");
    const config = await json(path.join(root, "deploy", "config.json"));
    const slug = config.pages[id]?.pages?.[0]?.slug || id.replace(/^\d+-/, "");
    const prefix = `/pages/${slug}/GPT-6/`;
    const evidence = { prompt: id, assertions: 0, checks: [], errors: [], viewports: [] };
    const check = (condition, name) =>
    {
        if (!condition) throw Error(`Assertion failed: ${name}`);
        evidence.assertions++;
        evidence.checks.push(name);
    };
    await fs.mkdir(path.join(folder, ".checks"), { recursive: true });
    const server = http.createServer(async (req, res) =>
    {
        try
        {
            const url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
            if (!url.startsWith(prefix)) throw Error("Outside public subpath");
            const file = path.resolve(out, url.slice(prefix.length) || "index.html");
            if (!file.startsWith(`${out}${path.sep}`)) throw Error("Outside export");
            const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".txt": "text/plain" };
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
        for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
        {
            const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
            page.on("pageerror", (e) => evidence.errors.push(e.message));
            page.on("console", (message) =>
            {
                if (message.type() === "error") evidence.errors.push(message.text());
            });
            page.on("requestfailed", (r) => evidence.errors.push(r.url()));
            page.on("response", (r) =>
            {
                if (r.status() >= 400) evidence.errors.push(`${r.status()} ${r.url()}`);
            });
            const response = await page.goto(`http://127.0.0.1:${server.address().port}${prefix}index.html`);
            await page.waitForLoadState("networkidle");
            check(response.status() === 200, `${viewport.width}: public subpath served`);
            check(await page.locator("h1").count() === 1, `${viewport.width}: one meaningful headline`);
            check((await page.title()).length > 5, `${viewport.width}: browser title`);
            check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${viewport.width}: no horizontal overflow`);
            await interaction(page, check, viewport.width);
            check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${viewport.width}: no interaction overflow`);
            await page.reload();
            await page.waitForLoadState("networkidle");
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.screenshot({ path: path.join(folder, ".checks", `${viewport.width === 1200 ? "desktop" : "mobile"}.png`), fullPage: true });
            evidence.viewports.push(viewport);
            await page.close();
        }
        check(evidence.errors.length === 0, `no console, JavaScript, network or HTTP errors: ${evidence.errors.join("; ")}`);
        check((await fs.readdir(out)).every((name) => ["index.html", "style.css", "app.js", "products.js", "preview.png", "menu.txt"].includes(name) || name.endsWith(".svg")), "static export allowlist");
        return evidence;
    }
    finally
    {
        await save(path.join(folder, ".checks", "qa.json"), evidence);
        await browser?.close();
        await new Promise((resolve) => server.close(resolve));
    }
}

export async function run(id)
{
    if (!allowed.includes(id)) throw Error("Outside assigned range");
    const folder = path.join(root, "out", "pages", id, "GPT-6");
    await PromptPageWorkflow.withPromptLock(root, id, async () =>
    {
        const resume = process.argv.includes("--resume");
        const prepared = process.argv.includes("--prepared") && id === "445-shoe-store";
        if (!resume && (await exists(path.join(folder, "metadata.json")) || !prepared && await exists(path.join(folder, "index.html")))) throw Error("Existing source or metadata requires preservation review");
        if (resume)
        {
            const existing = await json(path.join(folder, "metadata.json"));
            const prompt = await read(path.join(root, "data", "prompts", id, `${id}.md`));
            const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
            if (existing.modelId !== "gpt-6.1-sol" || (await read(path.join(folder, ".generation-input.sha256"))).trim() !== hash(JSON.stringify([prompt, design]))) throw Error("Resume identity/input mismatch");
        }
        await fs.mkdir(path.join(folder, ".checks"), { recursive: true });
        console.log(`LOCKED ${id} pid=${process.pid}; waiting for source-ready`);
        const waitFor = async (name) =>
        {
            const start = Date.now();
            while (!await exists(path.join(folder, ".checks", name)))
            {
                if (Date.now() - start > 1200000) throw Error(`Timeout: ${name}`);
                await new Promise((resolve) => setTimeout(resolve, 600));
            }
        };
        let metadata;
        try
        {
            await waitFor("source-ready");
            const spec = await json(path.join(folder, "page.json"));
            if (!spec.tags?.length || new Set(spec.tags).size !== spec.tags.length || spec.tags.some((tag) => !tag.trim())) throw Error("Meaningful unique tags required");
            metadata = { modelId: "gpt-6.1-sol", tags: spec.tags, staticDir: "out", generated: false, preview: false, validated: false, config_added: false };
            await save(path.join(folder, "metadata.json"), metadata);
            const prompt = await read(path.join(root, "data", "prompts", id, `${id}.md`));
            const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
            const fingerprint = hash(JSON.stringify([prompt, design]));
            await fs.writeFile(path.join(folder, ".generation-input.sha256"), `${fingerprint}\n`);
            await StaticHomepage.checkSource(folder);
            const out = path.join(folder, "out");
            await fs.mkdir(out, { recursive: true });
            const assets = (await fs.readdir(folder)).filter((file) => ["index.html", "style.css", "app.js", "products.js", "menu.txt"].includes(file) || file.endsWith(".svg"));
            for (const file of assets) await fs.copyFile(path.join(folder, file), path.join(out, file));
            const config = await json(path.join(root, "deploy", "config.json"));
            const previous = config.pages[id]?.pages?.[0];
            const slug = previous?.slug || id.replace(/^\d+-/, "");
            const digest = await StaticHomepage.validateStaticOutput(out, slug, "GPT-6");
            metadata.generated = true;
            await save(path.join(folder, "metadata.json"), metadata);
            const verifier = await import(pathToFileURL(path.join(folder, "verify.mjs")));
            const qa = await verifier.verify();
            await StaticHomepage.ensurePreview(root, { folder }, out, digest, undefined, false);
            metadata.preview = true;
            await save(path.join(folder, "metadata.json"), metadata);
            console.log(`QA_READY ${id}: ${qa.assertions} assertions; inspect desktop/mobile PNGs`);
            await waitFor("visual-approved");
            const visual = (await read(path.join(folder, ".checks", "visual-approved"))).trim();
            if (visual.length < 50) throw Error("Actual visual inspection description required");
            metadata.validated = true;
            await save(path.join(folder, "metadata.json"), metadata);
            const before = await json(path.join(root, "deploy", "config.json"));
            await registerGeneratedPage(root, { prompt: id, model: "GPT-6", slug, title: previous?.title || spec.title, tags: spec.tags, staticDir: "out" });
            const after = await json(path.join(root, "deploy", "config.json"));
            const registered = after.pages[id]?.pages.find((entry) => entry.model === "GPT-6");
            if (!registered || registered.staticDir !== "out" || registered.enabled || registered.deployed) throw Error("Registration must exist disabled/undeployed");
            if (Object.entries(before.pages).some(([key, value]) => key !== id && JSON.stringify(value) !== JSON.stringify(after.pages[key]))) throw Error("Unrelated config changed");
            if (before.pages[id] && before.pages[id].pages.some((value, i) => JSON.stringify(value) !== JSON.stringify(after.pages[id].pages[i]))) throw Error("Existing options changed");
            const oldKeys = Object.keys(before.pages);
            if (JSON.stringify(Object.keys(after.pages).filter((key) => oldKeys.includes(key))) !== JSON.stringify(oldKeys)) throw Error("Config order changed");
            metadata.config_added = true;
            await save(path.join(folder, "metadata.json"), metadata);
            const final = { assertions: 0, checks: [] };
            const check = (condition, name) =>
            {
                if (!condition) throw Error(`Final audit: ${name}`);
                final.assertions++;
                final.checks.push(name);
            };
            check((await read(path.join(folder, ".generation-input.sha256"))).trim() === fingerprint, "exact input fingerprint");
            check(await StaticHomepage.validateStaticOutput(out, slug, "GPT-6") === digest, "export digest unchanged");
            const preview = await fs.readFile(path.join(out, "preview.png"));
            check(preview.readUInt32BE(16) === 1200 && preview.readUInt32BE(20) === 900, "preview dimensions");
            check((await read(path.join(folder, ".generation-preview.sha256"))).trim() === `${digest} ${hash(preview)}`, "preview digest");
            check(qa.errors.length === 0 && qa.viewports.length === 2, "clean browser evidence");
            for (const asset of assets) check((await fs.readFile(path.join(folder, asset))).equals(await fs.readFile(path.join(out, asset))), `source/export match ${asset}`);
            check(metadata.generated && metadata.preview && metadata.validated && metadata.config_added, "real completion booleans");
            check(metadata.modelId === "gpt-6.1-sol" && metadata.staticDir === "out", "identity and boundary");
            check(!/^\d+-/.test(slug) && !/^\d+-/.test(registered.title), "public names");
            check(registered.enabled === false && registered.deployed === false, "disabled undeployed");
            check(spec.tags.every((tag) => tag === tag.trim() && tag.length > 0), "tags trimmed nonempty");
            check((await read(path.join(folder, "README.md"))).includes("gpt-6.1-sol"), "truthful README identity");
            check(await exists(path.join(folder, ".checks", "desktop.png")) && await exists(path.join(folder, ".checks", "mobile.png")), "both captures persist");
            await save(path.join(folder, ".checks", "final-audit.json"), final);
            await fs.appendFile(path.join(folder, "README.md"), `\nVerified: ${qa.assertions} browser/export assertions, 3 registration/preservation checks, ${final.assertions} final-audit checks. Desktop 1200×900 and mobile 390×844 captures opened and inspected: ${visual} Evidence: \`.checks\`. Registered disabled/undeployed. No build, install, dist or publication.\n`);
            const record = { timestamp: new Date().toISOString(), runId, prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "generated", status: "generated", ...metadata, tags_nonempty: true, assertions: qa.assertions, registrationChecks: 3, finalAuditChecks: final.assertions, visualQA: true, visualNotes: visual, mocks: spec.mocks, limits: "Static browser demonstration; no backend, payment, real booking, email delivery or publication" };
            await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify(record)}\n`, "utf8");
            const manifest = await json(manifestFile);
            const entry = manifest.records.find((item) => item.prompt === id);
            if (!entry) throw Error("Manifest record absent");
            Object.assign(entry, { status: "generated", reason: "Static, browser and actual visual QA passed; registered disabled", ...metadata, assertions: qa.assertions, registrationChecks: 3, finalAuditChecks: final.assertions, visualQA: true, exportBoundary: "homepage-assets-preview-only" });
            await save(manifestFile, manifest);
            console.log(`COMPLETE ${id}: ${qa.assertions} browser + 3 registration + ${final.assertions} final audit; helpers closed, lock releasing`);
        }
        catch (error)
        {
            const record = { timestamp: new Date().toISOString(), runId, prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "retained", status: "failed", error: error.message, ...(metadata || {}) };
            await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify(record)}\n`, "utf8");
            const manifest = await json(manifestFile);
            Object.assign(manifest.records.find((item) => item.prompt === id), { status: "failed", reason: error.message, ...(metadata || {}) });
            await save(manifestFile, manifest);
            throw error;
        }
    });
}

