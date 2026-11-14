import
{
    watch
}
from "node:fs";
import
{
    randomUUID
}
from "node:crypto";
import
{
    copyFile,
    lstat,
    mkdir,
    mkdtemp,
    open,
    readFile,
    readdir,
    rename,
    rm,
    unlink,
    writeFile
}
from "node:fs/promises";
import path from "node:path";
import
{
    fileURLToPath
}
from "node:url";
import
{
    setTimeout as delay
}
from "node:timers/promises";
import
{
    PromptPageRenderer
}
from "./render-prompt-page.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const gitFiles = new Set([".git", ".gitignore", ".gitattributes"]);
const excludedDirectories = new Set(["node_modules", ".next", ".git"]);
const staticExtensions = new Set([
    ".html", ".css", ".js", ".mjs", ".json", ".png", ".jpg", ".jpeg", ".gif",
    ".svg", ".webp", ".avif", ".ico", ".woff", ".woff2", ".ttf", ".otf",
    ".eot", ".txt", ".xml", ".webmanifest", ".mp4", ".webm", ".mp3", ".wav", ".pdf",
]);

async function exists(file)
{
    try
    {
        await lstat(file);
        return true;
    }
    catch (error)
    {
        if (error.code === "ENOENT") return false;
        throw error;
    }
}

function checkName(name, label)
{
    if (typeof name !== "string" || !/^[a-z0-9][a-z0-9._-]*$/i.test(name) ||
        name.endsWith(".") || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(name))
    {
        throw Error(`Invalid ${label}: ${JSON.stringify(name)}`);
    }
}

async function directory(folder)
{
    const info = await lstat(folder);
    if (info.isSymbolicLink() || !info.isDirectory()) throw Error(`Expected a real directory: ${folder}`);
}

async function directories(folder)
{
    if (!await exists(folder)) return [];
    await directory(folder);
    const entries = await readdir(folder,
    {
        withFileTypes: true
    });
    for (const entry of entries)
    {
        if (entry.isSymbolicLink()) throw Error(`Symbolic links are not allowed: ${path.join(folder, entry.name)}`);
    }
    return entries.filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
        .map((entry) => entry.name).sort();
}

async function inputPrompts(workspace)
{
    const inputs = new Map();
    const base = path.join(workspace, "data", "prompts");
    await directory(path.join(workspace, "data"));
    for (const folder of await directories(base))
    {
        for (const name of await readdir(path.join(base, folder)))
        {
            if (!name.endsWith(".md") || /^(README|AGENTS|DESIGN)\.md$/i.test(name)) continue;
            const prompt = name.slice(0, -3);
            checkName(prompt, "prompt filename");
            const key = prompt.toLowerCase();
            if (inputs.has(key)) throw Error(`Duplicate prompt filename: ${prompt}`);
            const file = path.join(base, folder, name);
            if ((await lstat(file)).isSymbolicLink()) throw Error(`Prompt cannot be a symbolic link: ${file}`);
            inputs.set(key, file);
        }
    }
    return inputs;
}

function pageOptions(config)
{
    return Object.entries(config.pages).flatMap(([prompt, group]) =>
        group.pages.map((page) => (
        {
            ...page,
            prompt
        })));
}

function siteBaseUrl(value)
{
    let url;
    try
    {
        if (typeof value !== "string") throw Error();
        url = new URL(value);
        if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash)
        {
            throw Error();
        }
    }
    catch
    {
        throw Error("siteUrl must be an absolute HTTP(S) URL without credentials, query, or fragment");
    }
    if (!url.pathname.endsWith("/")) url.pathname += "/";
    return url;
}

function validateConfig(config)
{
    if (config?.version !== 2 || !config.pages || typeof config.pages !== "object" || Array.isArray(config.pages))
    {
        throw Error("Expected config version 2 and a pages object keyed by prompt filename");
    }
    if (Object.hasOwn(config, "siteUrl")) siteBaseUrl(config.siteUrl);
    const prompts = new Set();
    for (const [prompt, group] of Object.entries(config.pages))
    {
        checkName(prompt, "prompt filename");
        if (prompts.has(prompt.toLowerCase())) throw Error(`Duplicate prompt key: ${prompt}`);
        prompts.add(prompt.toLowerCase());
        if (!group || typeof group !== "object" || Array.isArray(group) || !Array.isArray(group.pages))
        {
            throw Error(`Expected a prompt object with a pages array for ${prompt}`);
        }
        if (Object.hasOwn(group, "weight") && !Number.isFinite(group.weight))
        {
            throw Error(`Expected a finite numeric weight for ${prompt}`);
        }
        for (const page of group.pages)
        {
            if (!page || typeof page !== "object" || Array.isArray(page) || Object.hasOwn(page, "prompt"))
            {
                throw Error(`Invalid model option for ${prompt}; prompt belongs in the pages key`);
            }
        }
    }
    const keys = new Set();
    for (const page of pageOptions(config))
    {
        checkName(page.prompt, "prompt");
        checkName(page.model, "model");
        checkName(page.slug, "public prompt slug");
        if (/^\d+-/.test(page.slug)) throw Error(`Public slug must not contain the prompt number: ${page.slug}`);
        if (typeof page.enabled !== "boolean" || (Object.hasOwn(page, "deployed") && typeof page.deployed !== "boolean") ||
            typeof page.title !== "string" || !page.title.trim() ||
            typeof page.staticDir !== "string" || !page.staticDir ||
            !Array.isArray(page.tags) || page.tags.some((tag) => typeof tag !== "string"))
        {
            throw Error(`Invalid deployment settings for ${page.prompt}/${page.model}`);
        }
        if (path.isAbsolute(page.staticDir) || page.staticDir.split(/[\\/]/).some((part) => part === ".." || !part))
        {
            throw Error(`staticDir must stay inside its model directory: ${page.staticDir}`);
        }
        const key = `${page.prompt}/${page.model}`.toLowerCase();
        if (keys.has(key)) throw Error(`Duplicate deployment option: ${key}`);
        keys.add(key);
    }
}

async function readConfig(file)
{
    const config = await exists(file) ? JSON.parse(await readFile(file, "utf8")) :
    {
        version: 2,
        pages:
        {}
    };
    if (config?.version === 1 && Array.isArray(config.pages))
    {
        const pages = new Map();
        for (const page of config.pages)
        {
            if (!page || typeof page !== "object") throw Error("Invalid legacy deployment option");
            checkName(page.prompt, "prompt filename");
            const
            {
                prompt,
                ...option
            } = page;
            if (!pages.has(prompt)) pages.set(prompt, []);
            pages.get(prompt).push(option);
        }
        config.version = 2;
        config.pages = Object.fromEntries(pages);
    }
    if (config?.version === 2 && config.pages && typeof config.pages === "object" && !Array.isArray(config.pages))
    {
        for (const [prompt, group] of Object.entries(config.pages))
        {
            if (Array.isArray(group)) config.pages[prompt] = {
                pages: group
            };
        }
    }
    validateConfig(config);
    for (const group of Object.values(config.pages))
    {
        if (!Object.hasOwn(group, "weight")) group.weight = 1;
        for (const page of group.pages)
        {
            if (!Object.hasOwn(page, "deployed")) page.deployed = false;
        }
    }
    return config;
}

async function writeConfig(workspace, config)
{
    const file = path.join(workspace, "deploy", "config.json");
    const contents = JSON.stringify(config, null, 2) + "\n";
    if (await exists(file) && await readFile(file, "utf8") === contents) return;
    const temporary = `${file}.${randomUUID()}.tmp`;
    try
    {
        await writeFile(temporary, contents,
        {
            encoding: "utf8",
            flag: "wx"
        });
        await rename(temporary, file);
    }
    finally
    {
        await rm(temporary,
        {
            force: true
        });
    }
}

async function isNextProject(folder)
{
    const file = path.join(folder, "package.json");
    if (!await exists(file)) return false;
    if ((await lstat(file)).isSymbolicLink()) throw Error(`Project manifest cannot be a symbolic link: ${file}`);
    const pkg = JSON.parse(await readFile(file, "utf8"));
    return Boolean(pkg.dependencies?.next || pkg.devDependencies?.next);
}

async function synchronize(workspace)
{
    const file = path.join(workspace, "deploy", "config.json");
    const config = await readConfig(file);
    const inputs = await inputPrompts(workspace);
    const known = new Set(pageOptions(config).map((page) => `${page.prompt}/${page.model}`.toLowerCase()));
    const output = path.join(workspace, "out");
    if (await exists(output)) await directory(output);
    for (const prompt of await directories(path.join(output, "pages")))
    {
        checkName(prompt, "output prompt");
        if (!inputs.has(prompt.toLowerCase())) throw Error(`No original prompt found for output: ${prompt}`);
        for (const model of await directories(path.join(output, "pages", prompt)))
        {
            checkName(model, "output model");
            const key = `${prompt}/${model}`.toLowerCase();
            if (known.has(key)) continue;
            const source = path.join(output, "pages", prompt, model);
            const next = await isNextProject(source);
            if (!next && !await exists(path.join(source, "index.html"))) continue;
            const slug = prompt.replace(/^\d+-/, "");
            const promptKey = Object.keys(config.pages).find((key) => key.toLowerCase() === prompt.toLowerCase()) ?? prompt;
            if (!Object.hasOwn(config.pages, promptKey))
            {
                Object.defineProperty(config.pages, promptKey,
                {
                    value:
                    {
                        weight: 1,
                        pages: []
                    },
                    enumerable: true,
                    writable: true,
                    configurable: true
                });
            }
            config.pages[promptKey].pages.push(
            {
                model,
                enabled: false,
                deployed: false,
                slug,
                title: slug.replaceAll("-", " "),
                tags: [],
                staticDir: next ? "out" : ".",
            });
            known.add(key);
        }
    }
    validateConfig(config);
    await writeConfig(workspace, config);
    return {
        config,
        inputs
    };
}

async function withLock(workspace, action)
{
    const deploy = path.join(workspace, "deploy");
    if (await exists(deploy)) await directory(deploy);
    else await mkdir(deploy,
    {
        recursive: true
    });
    const lock = path.join(deploy, ".publish.lock");
    let handle;
    const deadline = Date.now() + 5000;
    while (!handle)
    {
        try
        {
            handle = await open(lock, "wx");
        }
        catch (error)
        {
            if (error.code !== "EEXIST") throw error;
            if (Date.now() >= deadline) throw Error(`Deployment is locked: ${lock}. Check for an active process before removing a stale lock.`);
            await delay(50);
        }
    }
    try
    {
        await handle.writeFile(`${process.pid}\n`);
        return await action();
    }
    finally
    {
        await handle.close();
        await unlink(lock);
    }
}

export async function syncDeployConfig(workspace = root)
{
    return withLock(workspace, async () => (await synchronize(workspace)).config);
}

export async function registerGeneratedPage(workspace, page)
{
    return withLock(workspace, async () =>
    {
        const file = path.join(workspace, "deploy", "config.json");
        if (await exists(file) && (await lstat(file)).isSymbolicLink())
        {
            throw Error("Deployment config cannot be a symbolic link");
        }
        const config = await readConfig(file);
        const
        {
            prompt,
            ...option
        } = {
            ...page,
            enabled: false,
            deployed: false
        };
        validateConfig(
        {
            version: 2,
            pages:
            {
                [prompt]:
                {
                    pages: [option]
                }
            }
        });
        const options = pageOptions(config);
        if (options.some((entry) => entry.prompt.toLowerCase() !== page.prompt.toLowerCase() &&
                entry.slug.toLowerCase() === page.slug.toLowerCase()))
        {
            throw Error(`Conflicting public slug: ${page.slug}`);
        }
        if (options.some((entry) => entry.prompt.toLowerCase() === page.prompt.toLowerCase() && entry.slug !== page.slug))
        {
            throw Error(`Prompt has a different public slug: ${page.prompt}`);
        }
        const existing = options.find((entry) =>
            entry.prompt.toLowerCase() === page.prompt.toLowerCase() && entry.model.toLowerCase() === page.model.toLowerCase());
        if (existing)
        {
            if (existing.prompt !== page.prompt || existing.model !== page.model ||
                existing.slug !== page.slug || existing.staticDir !== page.staticDir)
            {
                throw Error(`Deployment mapping conflicts with metadata: ${page.prompt}/${page.model}`);
            }
            await writeConfig(workspace, config);
            return false;
        }
        const promptKey = Object.keys(config.pages).find((key) => key.toLowerCase() === prompt.toLowerCase());
        if (promptKey && promptKey !== prompt) throw Error(`Deployment prompt casing conflicts with metadata: ${prompt}`);
        if (!Object.hasOwn(config.pages, prompt))
        {
            Object.defineProperty(config.pages, prompt,
            {
                value:
                {
                    weight: 1,
                    pages: []
                },
                enumerable: true,
                writable: true,
                configurable: true
            });
        }
        config.pages[prompt].pages.push(option);
        validateConfig(config);
        await writeConfig(workspace, config);
        const saved = JSON.parse(await readFile(file, "utf8"));
        validateConfig(saved);
        if (!pageOptions(saved).some((entry) => entry.prompt === page.prompt && entry.model === page.model))
        {
            throw Error("Deployment registration was not saved");
        }
        return true;
    });
}

async function staticDirectory(source, relative)
{
    await directory(source);
    let current = source;
    for (const part of relative.split(/[\\/]/))
    {
        if (part === ".") continue;
        checkName(part, "staticDir component");
        current = path.join(current, part);
        await directory(current);
    }
    if (current === source && await isNextProject(source))
    {
        throw Error(`Next.js source cannot be deployed directly; set staticDir to its static export: ${source}`);
    }
    return current;
}

async function copyStatic(source, destination)
{
    await mkdir(destination,
    {
        recursive: true
    });
    for (const entry of await readdir(source,
        {
            withFileTypes: true
        }))
    {
        const input = path.join(source, entry.name);
        if (entry.isSymbolicLink()) throw Error(`Static assets cannot be symbolic links: ${input}`);
        const name = entry.name.toLowerCase();
        if (entry.isDirectory())
        {
            if (name.startsWith(".") || excludedDirectories.has(name)) continue;
            await copyStatic(input, path.join(destination, entry.name));
        }
        else if (entry.isFile() && !name.startsWith(".") && name !== "package.json" &&
            name !== "package-lock.json" && name !== "result.json" && name !== "metadata.json" &&
            !/^(?:next|postcss|tailwind|playwright)\.config\./.test(name) &&
            (staticExtensions.has(path.extname(name)) || /^(?:licen[cs]e|notice)(?:\.md)?$/.test(name)))
        {
            await copyFile(input, path.join(destination, entry.name));
        }
    }
}

export function renderGallery(template, pages,
{
    flat = false
} = {})
{
    const categories = [
        ["portfolio", /portfolio|photograph|designer|architect|artist/i],
        ["saas", /saas|software|dashboard|platform|subscription|cloud/i],
        ["editorial", /editorial|blog|magazine|journal|newsletter|publication|author|writer/i],
        ["developer", /developer|development|\bapi\b|documentation|programming|code|engineering|devops/i],
    ];
    const arrow = '<svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>';
    const prompts = new Map();
    for (const page of pages)
    {
        const key = flat ? `${page.prompt}/${page.model}` : page.prompt;
        if (!prompts.has(key)) prompts.set(key, []);
        prompts.get(key).push(page);
    }
    const cards = [...prompts.values()].map((models) =>
    {
        const slides = models.map((page, index) =>
        {
            const href = `${flat ? "../" : ""}pages/${encodeURIComponent(page.slug)}/${encodeURIComponent(page.model)}`;
            const title = PromptPageRenderer.escapeHtml(page.title);
            const preview = page.preview ?
                `<img src="${href}/preview.png" alt="Preview of ${title}" width="1200" height="900" loading="lazy">` :
                '<span class="preview-label">No preview provided</span>';
            const topics = `${page.title} ${page.tags.join(" ")}`;
            const groups = categories.filter(([, pattern]) => pattern.test(topics)).map(([name]) => name).join(" ");
            const slideAttributes = flat ? "" : ` role="group" aria-roledescription="slide" aria-label="${index + 1} of ${models.length}: ${PromptPageRenderer.escapeHtml(page.model)}"`;
            return `<div class="slide"${slideAttributes} data-model="${PromptPageRenderer.escapeHtml(page.model)}" data-tags="${PromptPageRenderer.escapeHtml(JSON.stringify(page.tags))}" data-categories="${groups}"${index ? " hidden inert" : ""}>
      <a class="preview" href="${href}/index.html" aria-label="Open ${title}" draggable="false">${preview}<span class="preview-arrow">${arrow}</span></a>
      <div class="details"><h3><a href="${href}/index.html" title="${title}">${title}</a></h3>
        <div class="tags">${page.tags.slice(0, 2).map((tag) => `<button class="tag" type="button" data-tag="${PromptPageRenderer.escapeHtml(tag)}">${PromptPageRenderer.escapeHtml(tag)}</button>`).join("")}</div>
        <div class="card-footer"><span class="model" aria-label="Model: ${PromptPageRenderer.escapeHtml(page.model)}" title="${PromptPageRenderer.escapeHtml(page.model)}">${PromptPageRenderer.escapeHtml(page.model)}</span><a class="prompt" href="${href}/prompt.html">View prompt ${arrow}</a></div>
      </div>
    </div>`;
        }).join("\n");
        const dots = models.map((page, index) =>
            `<button class="dot" type="button" data-index="${index}" aria-label="Show model ${PromptPageRenderer.escapeHtml(page.model)}" title="${PromptPageRenderer.escapeHtml(page.model)}" aria-current="${index === 0}"><span></span></button>`).join("");
        const sizing = models.length > 1 ?
            ` style="--carousel-width:${Math.min(models.length, 3) * 24}px;--carousel-height:${Math.ceil(models.length / 3) * 24}px"` :
            "";
        const attributes = flat ?
            `data-gallery-card aria-label="${PromptPageRenderer.escapeHtml(models[0].title)} - ${PromptPageRenderer.escapeHtml(models[0].model)}"` :
            `data-carousel role="region" aria-roledescription="carousel" aria-label="${PromptPageRenderer.escapeHtml(models[0].title)} model previews"`;
        return `<article class="card" ${attributes}${sizing}>
      <div class="slides">${slides}</div>
${models.length > 1 ? `      <div class="carousel-controls">
        <div class="dots" role="group" aria-label="Choose model">${dots}</div>
      </div>` : ""}
${flat ? "" : `      <p class="carousel-status sr-only" role="status" aria-atomic="true">${PromptPageRenderer.escapeHtml(models[0].model)}</p>`}
    </article>`;
    }).join("\n");
    const marker = "<!-- RESULT_CARDS -->";
    if (template.split(marker).length !== 2) throw Error(`Gallery template must contain exactly one ${marker}`);
    if (flat)
    {
        template = template
            .replace(/href="(index\.html(?:#collection)?|collections\/index\.html)"/g, 'href="../$1"')
            .replace(/<title>[^<]*<\/title>/, "<title>Collections - MusePages</title>")
            .replace(/(<h1 id="gallery-title">)[\s\S]*?(<\/h1>)/, "$1All Website Front Pages$2")
            .replace(/(<p class="intro">)[\s\S]*?(<\/p>)/,
                "$1Review every enabled model result side by side, with one card per page.$2");
    }
    const modelFilters = flat ?
        `<nav class="filters model-filters" aria-label="Filter by model">
        <button type="button" data-model="" aria-pressed="true">All models</button>
${[...new Set(pages.map((page) => page.model))].map((model) =>
    `        <button type="button" data-model="${PromptPageRenderer.escapeHtml(model)}" aria-pressed="false">${PromptPageRenderer.escapeHtml(model)}</button>`).join("\n")}
      </nav>` :
        "";
    return template.replace("<!-- MODEL_FILTERS -->", () => modelFilters)
        .replace(marker, () => cards || '<p class="sample-note">No published pages yet.</p>');
}

async function validateLinks(staging, folder = staging)
{
    for (const entry of await readdir(folder,
        {
            withFileTypes: true
        }))
    {
        const file = path.join(folder, entry.name);
        if (entry.isDirectory())
        {
            await validateLinks(staging, file);
        }
        else if (entry.name.endsWith(".html"))
        {
            const html = await readFile(file, "utf8");
            if (!html.trim()) throw Error(`Static page is empty: ${file}`);
            const base = new URL(path.relative(staging, file).split(path.sep).map(encodeURIComponent).join("/"), "https://musepages.invalid/");
            // Raw-text bodies can contain assignments and HTML templates, not document links.
            const markup = html.replace(/<!--[\s\S]*?-->|(<(script|style|textarea|title)\b(?:[^"'<>]|"[^"]*"|'[^']*')*>)[\s\S]*?(?:<\/\2\s*>|$)/gi,
                (_match, opening) => opening ?? "");
            const tags = markup.matchAll(/<[a-z][a-z0-9:-]*\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi);
            for (const tag of tags)
            {
                for (const match of tag[0].matchAll(/\s([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g))
                {
                    if (!/^(src|href)$/i.test(match[1])) continue;
                    const reference = (match[2] ?? match[3] ?? match[4] ?? "").replaceAll("&amp;", "&");
                    if (!reference || reference.startsWith("#")) continue;
                    const url = new URL(reference, base);
                    if (url.origin !== base.origin) continue;
                    const target = path.resolve(staging, decodeURIComponent(url.pathname).replace(/^\/+/, ""));
                    const relative = path.relative(staging, target);
                    if (relative.startsWith("..") || path.isAbsolute(relative)) throw Error(`Static link escapes the website: ${reference}`);
                    const candidates = [target, `${target}.html`, path.join(target, "index.html")];
                    let found = false;
                    for (const candidate of candidates)
                    {
                        if (await exists(candidate) && (await lstat(candidate)).isFile())
                        {
                            found = true;
                            break;
                        }
                    }
                    if (!found) throw Error(`Missing static link in ${path.relative(staging, file)}: ${reference}. Check export base paths and copied assets.`);
                }
            }
        }
    }
}

async function sameWebsite(staging, target, topLevel = true)
{
    if (!await exists(target)) return false;
    await directory(target);
    const expected = (await readdir(staging)).sort();
    const actual = (await readdir(target)).filter((name) => !topLevel || !gitFiles.has(name)).sort();
    if (expected.length !== actual.length || expected.some((name, index) => name !== actual[index])) return false;
    for (const name of expected)
    {
        const source = path.join(staging, name);
        const destination = path.join(target, name);
        const sourceInfo = await lstat(source);
        const targetInfo = await lstat(destination);
        if (targetInfo.isSymbolicLink()) return false;
        if (sourceInfo.isDirectory())
        {
            if (!targetInfo.isDirectory() || !await sameWebsite(source, destination, false)) return false;
        }
        else if (!targetInfo.isFile() || !(await readFile(source)).equals(await readFile(destination)))
        {
            return false;
        }
    }
    return true;
}

async function publishedPages(site)
{
    const pages = new Map();
    const folder = path.join(site, "pages");
    if (!await exists(folder)) return pages;
    const info = await lstat(folder);
    if (info.isSymbolicLink() || !info.isDirectory()) return pages;
    for (const slug of await readdir(folder,
        {
            withFileTypes: true
        }))
    {
        if (!slug.isDirectory() || slug.isSymbolicLink()) continue;
        const variants = path.join(folder, slug.name);
        for (const model of await readdir(variants,
            {
                withFileTypes: true
            }))
        {
            if (model.isDirectory() && !model.isSymbolicLink())
            {
                pages.set(`${slug.name}/${model.name}`, path.join(variants, model.name));
            }
        }
    }
    return pages;
}

async function publicationChanges(staging, target)
{
    const before = await publishedPages(target);
    const after = await publishedPages(staging);
    const changes = {
        added: 0,
        updated: 0,
        removed: 0,
        unchanged: 0
    };
    for (const [key, folder] of after)
    {
        if (!before.has(key)) changes.added++;
        else if (await sameWebsite(folder, before.get(key), false)) changes.unchanged++;
        else changes.updated++;
    }
    for (const key of before.keys())
    {
        if (!after.has(key)) changes.removed++;
    }
    return changes;
}

async function replaceWebsite(target, staging, commit)
{
    if (await exists(target)) await directory(target);
    else await mkdir(target);
    const backup = await mkdtemp(path.join(path.dirname(target), ".site-backup-"));
    const old = [];
    const installed = [];
    let cleanBackup = false;
    try
    {
        for (const name of await readdir(target))
        {
            if (gitFiles.has(name)) continue;
            await rename(path.join(target, name), path.join(backup, name));
            old.push(name);
        }
        for (const name of await readdir(staging))
        {
            await rename(path.join(staging, name), path.join(target, name));
            installed.push(name);
        }
        await commit();
        cleanBackup = true;
    }
    catch (error)
    {
        try
        {
            for (const name of installed) await rename(path.join(target, name), path.join(staging, name));
            for (const name of old) await rename(path.join(backup, name), path.join(target, name));
            cleanBackup = true;
        }
        catch (restoreError)
        {
            throw new AggregateError([error, restoreError], `Publish and rollback failed. Recovery files remain in ${backup} and ${staging}`);
        }
        throw error;
    }
    finally
    {
        if (cleanBackup) await rm(backup,
        {
            recursive: true
        });
    }
}

export async function publishSite(workspace = root)
{
    return withLock(workspace, async () =>
    {
        const
        {
            config,
            inputs
        } = await synchronize(workspace);
        const selected = pageOptions(config).filter((page) => page.enabled)
            .sort((a, b) => config.pages[b.prompt].weight - config.pages[a.prompt].weight);
        const destinations = new Set();
        const slugOwners = new Map();
        const promptSlugs = new Map();
        const staging = await mkdtemp(path.join(workspace, "deploy", ".site-build-"));
        let keepRecovery = false;
        try
        {
            await mkdir(path.join(staging, "pages"));
            for (const page of selected)
            {
                const promptKey = page.prompt.toLowerCase();
                const slugKey = page.slug.toLowerCase();
                if ((slugOwners.has(slugKey) && slugOwners.get(slugKey) !== promptKey) ||
                    (promptSlugs.has(promptKey) && promptSlugs.get(promptKey) !== slugKey))
                {
                    throw Error(`Conflicting public path: prompt/slug mapping for ${page.prompt}`);
                }
                slugOwners.set(slugKey, promptKey);
                promptSlugs.set(promptKey, slugKey);
                const key = `${page.slug}/${page.model}`.toLowerCase();
                if (destinations.has(key)) throw Error(`Conflicting public path: ${key}`);
                destinations.add(key);
                const promptFile = inputs.get(page.prompt.toLowerCase());
                if (!promptFile) throw Error(`Original prompt is missing: ${page.prompt}`);
                const source = path.join(workspace, "out", "pages", page.prompt, page.model);
                await directory(path.dirname(source));
                const exported = await staticDirectory(source, page.staticDir);
                const destination = path.join(staging, "pages", page.slug, page.model);
                await copyStatic(exported, destination);
                const index = path.join(destination, "index.html");
                if (!await exists(index) || !(await lstat(index)).isFile())
                {
                    throw Error(`Static index.html is missing for ${page.prompt}/${page.model}; export it before publishing`);
                }
                await writeFile(path.join(destination, "prompt.html"),
                    PromptPageRenderer.renderPromptPage(await readFile(promptFile, "utf8"), page.title, "../../../index.html"), "utf8");
                page.preview = await exists(path.join(destination, "preview.png"));
            }
            const template = await readFile(path.join(workspace, "src", "gallery", "index.html"), "utf8");
            await writeFile(path.join(staging, "index.html"), renderGallery(template, selected), "utf8");
            await mkdir(path.join(staging, "collections"));
            await writeFile(path.join(staging, "collections", "index.html"),
                renderGallery(template, selected,
                {
                    flat: true
                }), "utf8");
            if (config.siteUrl)
            {
                const base = siteBaseUrl(config.siteUrl);
                const urls = [base.href, ...selected.map((page) =>
                    new URL(`pages/${encodeURIComponent(page.slug)}/${encodeURIComponent(page.model)}/index.html`, base).href)];
                await writeFile(path.join(staging, "sitemap.xml"),
                    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
                    urls.map((url) => `  <url><loc>${PromptPageRenderer.escapeHtml(url)}</loc></url>`).join("\n") + "\n</urlset>\n", "utf8");
                await writeFile(path.join(staging, "robots.txt"),
                    `User-agent: *\nAllow: /\n\nSitemap: ${new URL("sitemap.xml", base).href}\n`, "utf8");
            }
            await validateLinks(staging);
            for (const group of Object.values(config.pages))
            {
                for (const page of group.pages) page.deployed = page.enabled;
            }
            const output = path.join(workspace, "deploy", "dist");
            if (!await exists(output)) await mkdir(output);
            await directory(output);
            const target = path.join(output, "MusePages");
            const changed = !await sameWebsite(staging, target);
            const changes = await publicationChanges(staging, target);
            try
            {
                if (changed) await replaceWebsite(target, staging, () => writeConfig(workspace, config));
                else await writeConfig(workspace, config);
            }
            catch (error)
            {
                if (error instanceof AggregateError) keepRecovery = true;
                throw error;
            }
            return {
                pages: selected.length,
                prompts: new Set(selected.map((page) => page.prompt)).size,
                changed,
                changes
            };
        }
        finally
        {
            if (!keepRecovery) await rm(staging,
            {
                recursive: true
            });
        }
    });
}

export async function watchDeployConfig(workspace = root)
{
    const output = path.join(workspace, "out", "pages");
    await mkdir(output,
    {
        recursive: true
    });
    await directory(path.join(workspace, "out"));
    await directory(output);
    let timer;
    let pending = Promise.resolve();
    const watcher = watch(output,
    {
        recursive: true
    }, () =>
    {
        clearTimeout(timer);
        timer = setTimeout(() =>
        {
            pending = pending.then(() => syncDeployConfig(workspace))
                .then((config) => console.log(`Deployment options synchronized: ${pageOptions(config).length}`))
                .catch((error) => console.error("Deployment option sync failed:", error));
        }, 150);
    });
    watcher.on("error", (error) => console.error("Output watcher failed:", error));
    try
    {
        await syncDeployConfig(workspace);
    }
    catch (error)
    {
        watcher.close();
        throw error;
    }
    return {
        async close()
        {
            clearTimeout(timer);
            watcher.close();
            await pending;
        },
    };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
{
    try
    {
        const command = process.argv[2] ?? "dist";
        if (command === "sync")
        {
            const config = await syncDeployConfig();
            console.log(`Deployment options synchronized: ${pageOptions(config).length}`);
        }
        else if (command === "watch")
        {
            const watcher = await watchDeployConfig();
            console.log("Watching out\\pages for new deployment options. Press Ctrl+C to stop.");
            for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, () =>
            {
                void watcher.close();
            });
        }
        else if (command === "dist")
        {
            const result = await publishSite();
            console.log(result.changed ?
                `Updated local static site: ${result.changes.added} added, ${result.changes.updated} updated, ${result.changes.removed} removed, ${result.changes.unchanged} unchanged.` :
                `No changes: local static site is up to date (${result.pages} pages from ${result.prompts} prompts).`);
            if (result.changed) console.log(`Total: ${result.pages} pages from ${result.prompts} prompts in deploy\\dist\\MusePages.`);
            console.log("No remote deployment was performed.");
        }
        else
        {
            throw Error(`Unknown command: ${command}. Use dist, sync, or watch.`);
        }
    }
    catch (error)
    {
        console.error("Deployment failed:", error);
        process.exitCode = 1;
    }
}
