import
{
    watch
}
from "node:fs";
import
{
    createHash,
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
    rmdir,
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

const root = fileURLToPath(new URL("../../../", import.meta.url));
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

async function validatePageState(source, page)
{
    const file = path.join(source, "metadata.json");
    let metadata;
    try
    {
        const info = await lstat(file);
        if (info.isSymbolicLink() || !info.isFile()) throw Error("Expected a regular metadata file");
        metadata = JSON.parse(await readFile(file, "utf8"));
    }
    catch (error)
    {
        throw Error(`Cannot distribute ${page.prompt}/${page.model}: missing or invalid metadata at ${file}`,
        {
            cause: error
        });
    }
    const incomplete = ["generated", "preview", "validated", "config_added"].filter((key) => metadata?.[key] !== true);
    if (incomplete.length)
    {
        throw Error(`Cannot distribute ${page.prompt}/${page.model}: metadata fields must be true: ${incomplete.join(", ")}`);
    }
}

async function collectStatic(source, destination, website)
{
    website.directories.add(destination);
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
            await collectStatic(input, path.join(destination, entry.name), website);
        }
        else if (entry.isFile() && !name.startsWith(".") && name !== "package.json" &&
            name !== "package-lock.json" && name !== "result.json" && name !== "metadata.json" &&
            !/^(?:next|postcss|tailwind|playwright)\.config\./.test(name) &&
            (staticExtensions.has(path.extname(name)) || /^(?:licen[cs]e|notice)(?:\.md)?$/.test(name)))
        {
            website.files.set(path.join(destination, entry.name),
            {
                source: input,
                hash: createHash("sha256").update(await readFile(input)).digest("hex")
            });
        }
    }
}

export function renderGallery(template, pages,
{
    flat = false,
    categories = []
} = {})
{
    if (!Array.isArray(categories) || categories.some((name) => typeof name !== "string" || !name.trim() || name !== name.trim() ||
        name.toLowerCase() === "all") || new Set(categories.map((name) => name.toLowerCase())).size !== categories.length)
    {
        throw Error("config.json categories must be an array of unique, nonempty category names");
    }
    const categoryGroups = categories.map((name) => (
    {
        name,
        id: encodeURIComponent(name.toLowerCase())
    }));
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
            const category = categoryGroups.find(({ name }) =>
                typeof page.category === "string" && name.toLowerCase() === page.category.toLowerCase());
            const groups = category?.id ?? "";
            const slideAttributes = flat ? "" : ` role="group" aria-roledescription="slide" aria-label="${index + 1} of ${models.length}: ${PromptPageRenderer.escapeHtml(page.model)}"`;
            return `<div class="slide"${slideAttributes} data-model="${PromptPageRenderer.escapeHtml(page.model)}" data-tags="${PromptPageRenderer.escapeHtml(JSON.stringify(page.tags))}" data-categories="${groups}"${index ? " hidden inert" : ""}>
      <a class="preview" href="${href}/index.html" aria-label="Open ${title}" draggable="false">${preview}<span class="preview-arrow">${arrow}</span></a>
      <div class="details"><h3><a href="${href}/index.html" title="${title}">${title}</a></h3>
        <div class="tags">${category ? `<button class="tag" type="button" data-category="${PromptPageRenderer.escapeHtml(category.id)}" aria-label="Filter category ${PromptPageRenderer.escapeHtml(category.name)}">${PromptPageRenderer.escapeHtml(category.name)}</button>` : ""}${page.tags.slice(0, 2).map((tag) => `<button class="tag" type="button" data-tag="${PromptPageRenderer.escapeHtml(tag)}">${PromptPageRenderer.escapeHtml(tag)}</button>`).join("")}</div>
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
    const categoryFilters = categoryGroups.map(({ name, id }) =>
        `                <button type="button" data-filter="${PromptPageRenderer.escapeHtml(id)}" aria-pressed="false">${PromptPageRenderer.escapeHtml(name)}</button>`).join("\n");
    return template.replace("<!-- MODEL_FILTERS -->", () => modelFilters)
        .replace("<!-- CATEGORY_FILTERS -->", () => categoryFilters)
        .replace(marker, () => cards || '<p class="sample-note">No published pages yet.</p>');
}

async function fileContents(file)
{
    if (!file.source) return file.content;
    const content = await readFile(file.source);
    if (file.hash && createHash("sha256").update(content).digest("hex") !== file.hash)
    {
        throw Error(`Static source changed during synchronization: ${file.source}`);
    }
    return content;
}

async function validateLinks(website)
{
    const baseDirectory = path.resolve("website");
    for (const [name, entry] of website.files)
    {
        if (name.endsWith(".html"))
        {
            const html = (await fileContents(entry)).toString("utf8");
            if (!html.trim()) throw Error(`Static page is empty: ${entry.source ?? name}`);
            const base = new URL(name.split(path.sep).map(encodeURIComponent).join("/"), "https://musepages.invalid/");
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
                    const target = path.resolve(baseDirectory, decodeURIComponent(url.pathname).replace(/^\/+/, ""));
                    const relative = path.relative(baseDirectory, target);
                    if (relative.startsWith("..") || path.isAbsolute(relative)) throw Error(`Static link escapes the website: ${reference}`);
                    const candidates = [relative, `${relative}.html`, path.join(relative, "index.html")];
                    if (!candidates.some((candidate) => website.files.has(candidate)))
                    {
                        throw Error(`Missing static link in ${name}: ${reference}. Check export base paths and copied assets.`);
                    }
                }
            }
        }
    }
}

async function readWebsite(target)
{
    const website =
    {
        files: new Map(),
        directories: new Set()
    };
    async function visit(folder, relative = "")
    {
        await directory(folder);
        for (const entry of await readdir(folder,
        {
            withFileTypes: true
        }))
        {
            if (!relative && gitFiles.has(entry.name)) continue;
            const name = path.join(relative, entry.name);
            const source = path.join(folder, entry.name);
            if (entry.isSymbolicLink()) throw Error(`Website entries cannot be symbolic links: ${source}`);
            if (entry.isDirectory())
            {
                website.directories.add(name);
                await visit(source, name);
            }
            else if (entry.isFile()) website.files.set(name,
            {
                source
            });
            else throw Error(`Unsupported website entry: ${source}`);
        }
    }
    if (await exists(target)) await visit(target);
    return website;
}

async function sameWebsite(expected, actual, prefix = "")
{
    const inside = (name) => !prefix || name.startsWith(prefix + path.sep);
    for (const kind of ["files", "directories"])
    {
        const names = [...expected[kind].keys()].filter(inside);
        if (names.length !== [...actual[kind].keys()].filter(inside).length) return false;
        for (const name of names)
        {
            if (!actual[kind].has(name)) return false;
            if (kind === "files" && !(await fileContents(expected.files.get(name))).equals(await fileContents(actual.files.get(name))))
            {
                return false;
            }
        }
    }
    return true;
}

function publishedPages(site)
{
    return new Map([...site.directories].filter((name) =>
    {
        const parts = name.split(path.sep);
        return parts.length === 3 && parts[0] === "pages";
    }).map((name) => [name.split(path.sep).slice(1).join("/"), name]));
}

async function publicationChanges(expected, actual)
{
    const before = publishedPages(actual);
    const after = publishedPages(expected);
    const changes = {
        added: 0,
        updated: 0,
        removed: 0,
        unchanged: 0
    };
    for (const [key, folder] of after)
    {
        if (!before.has(key)) changes.added++;
        else if (await sameWebsite(expected, actual, folder)) changes.unchanged++;
        else changes.updated++;
    }
    for (const key of before.keys())
    {
        if (!after.has(key)) changes.removed++;
    }
    return changes;
}

async function syncWebsite(target, expected, actual, commit)
{
    if (await exists(target)) await directory(target);
    else await mkdir(target);
    const backup = await mkdtemp(path.join(path.dirname(target), ".site-backup-"));
    const saved = new Set();
    const touched = new Set();
    const removedDirectories = [];
    const createdDirectories = [];
    let cleanBackup = false;
    try
    {
        const changed = [];
        for (const [name, file] of expected.files)
        {
            if (!actual.files.has(name) ||
                !(await fileContents(file)).equals(await fileContents(actual.files.get(name))))
            {
                changed.push(name);
            }
        }
        const removed = [...actual.files.keys()].filter((name) => !expected.files.has(name));
        for (const name of new Set([...removed, ...changed.filter((name) => actual.files.has(name))]))
        {
            const destination = path.join(backup, name);
            await mkdir(path.dirname(destination),
            {
                recursive: true
            });
            await copyFile(path.join(target, name), destination);
            saved.add(name);
        }
        for (const name of removed)
        {
            await unlink(path.join(target, name));
            touched.add(name);
        }
        for (const name of [...actual.directories].sort((a, b) => b.length - a.length))
        {
            if (expected.directories.has(name)) continue;
            await rmdir(path.join(target, name));
            removedDirectories.push(name);
        }
        for (const name of [...expected.directories].sort((a, b) => a.length - b.length))
        {
            if (actual.directories.has(name)) continue;
            await mkdir(path.join(target, name));
            createdDirectories.push(name);
        }
        for (const name of changed)
        {
            const file = expected.files.get(name);
            const destination = path.join(target, name);
            touched.add(name);
            if (file.source) await copyFile(file.source, destination);
            else await writeFile(destination, file.content);
        }
        if (!await sameWebsite(expected, await readWebsite(target))) throw Error("Website verification failed after synchronization");
        await commit();
        cleanBackup = true;
    }
    catch (error)
    {
        try
        {
            for (const name of touched)
            {
                if (expected.files.has(name)) await rm(path.join(target, name),
                {
                    force: true
                });
            }
            for (const name of createdDirectories.reverse()) await rmdir(path.join(target, name));
            for (const name of removedDirectories.reverse()) await mkdir(path.join(target, name));
            for (const name of touched)
            {
                if (saved.has(name)) await copyFile(path.join(backup, name), path.join(target, name));
            }
            cleanBackup = true;
        }
        catch (restoreError)
        {
            throw new AggregateError([error, restoreError], `Synchronization and rollback failed. Recovery files remain in ${backup}`);
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
        const { categories = [] } = config;
        if (!Array.isArray(categories)) throw Error("config.json categories must be an array");
        const selected = pageOptions(config).filter((page) => page.enabled)
            .map((page) => (
            {
                ...page,
                category: config.pages[page.prompt].category
            }))
            .sort((a, b) => config.pages[b.prompt].weight - config.pages[a.prompt].weight);
        const destinations = new Set();
        const slugOwners = new Map();
        const promptSlugs = new Map();
        const website =
        {
            files: new Map(),
            directories: new Set(["pages", "collections"])
        };
        const generatedFile = (name, content) => website.files.set(name,
        {
            content: Buffer.from(content)
        });
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
            await validatePageState(source, page);
            const destination = path.join("pages", page.slug, page.model);
            website.directories.add(path.dirname(destination));
            await collectStatic(exported, destination, website);
            if (!website.files.has(path.join(destination, "index.html")))
            {
                throw Error(`Static index.html is missing for ${page.prompt}/${page.model}; export it before publishing`);
            }
            generatedFile(path.join(destination, "prompt.html"),
                PromptPageRenderer.renderPromptPage(await readFile(promptFile, "utf8"), page.title, "../../../index.html"));
            page.preview = website.files.has(path.join(destination, "preview.png"));
        }
        const template = await readFile(path.join(workspace, "src", "gallery", "index.html"), "utf8");
        generatedFile("index.html", renderGallery(template, selected,
        {
            categories
        }));
        generatedFile(path.join("collections", "index.html"), renderGallery(template, selected,
        {
            flat: true,
            categories
        }));
        if (config.siteUrl)
        {
            const base = siteBaseUrl(config.siteUrl);
            const urls = [base.href, ...selected.map((page) =>
                new URL(`pages/${encodeURIComponent(page.slug)}/${encodeURIComponent(page.model)}/index.html`, base).href)];
            generatedFile("sitemap.xml",
                '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
                urls.map((url) => `  <url><loc>${PromptPageRenderer.escapeHtml(url)}</loc></url>`).join("\n") + "\n</urlset>\n");
            generatedFile("robots.txt",
                `User-agent: *\nAllow: /\n\nSitemap: ${new URL("sitemap.xml", base).href}\n`);
        }
        await validateLinks(website);
        for (const group of Object.values(config.pages))
        {
            for (const page of group.pages) page.deployed = page.enabled;
        }
        const output = path.join(workspace, "deploy", "dist");
        if (!await exists(output)) await mkdir(output);
        await directory(output);
        const target = path.join(output, "MusePages");
        const actual = await readWebsite(target);
        const changed = !await sameWebsite(website, actual);
        const changes = await publicationChanges(website, actual);
        const commit = async () =>
        {
            for (const page of selected)
            {
                await validatePageState(path.join(workspace, "out", "pages", page.prompt, page.model), page);
            }
            await writeConfig(workspace, config);
        };
        if (changed) await syncWebsite(target, website, actual, commit);
        else await commit();
        return {
            pages: selected.length,
            prompts: new Set(selected.map((page) => page.prompt)).size,
            changed,
            changes
        };
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
