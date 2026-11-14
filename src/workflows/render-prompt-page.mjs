import
{
    spawn
}
from "node:child_process";
import
{
    createHash,
    randomUUID
}
from "node:crypto";
import
{
    constants
}
from "node:fs";
import
{
    access,
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
import os from "node:os";
import path from "node:path";
import
{
    fileURLToPath
}
from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const states = ["generated", "preview", "config_added", "validated"];
const assets = new Set([
    ".html", ".css", ".js", ".mjs", ".json", ".png", ".jpg", ".jpeg", ".gif",
    ".svg", ".webp", ".avif", ".ico", ".woff", ".woff2", ".ttf", ".otf",
    ".eot", ".txt", ".xml", ".webmanifest", ".mp4", ".webm", ".mp3", ".wav", ".pdf",
]);
const excluded = /^(?:node_modules|out|app|src|pages|components|task|metadata\.json|package(?:-lock)?\.json|result\.json|.*\.config\..*)$/i;

/**
 * Renders original prompts as escaped plain text with navigation back to the gallery.
 */
export class PromptPageRenderer
{
    static escapeHtml(text)
    {
        return text.replace(/[&<>"']/g, (character) => (
        {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        })[character]);
    }

    static renderPromptPage(prompt, title, backHref = "../../index.html")
    {
        return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${PromptPageRenderer.escapeHtml(title)} | Prompt | MusePages</title>
  <style>
    :root{color-scheme:light;--paper:#f7f6f2;--ink:#203d37;--muted:#69756f;--line:#dce1d8}
    *{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.6 system-ui,sans-serif}
    main{max-width:1000px;margin:auto;padding:32px 24px}a{color:inherit;text-underline-offset:4px}a:focus-visible,pre:focus-visible{outline:3px solid #ae592d;outline-offset:4px}
    h1{font:normal clamp(28px,5vw,44px)/1.2 Georgia,serif;overflow-wrap:anywhere;margin:32px 0 16px}.intro{color:var(--muted)}
    .codebox{min-width:0;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#fff;margin-top:24px}
    .codebox h2{margin:0;padding:12px 20px;background:#edf2eb;font:600 13px/1.5 system-ui,sans-serif;border-bottom:1px solid var(--line)}
    pre{margin:0;padding:20px;max-height:70vh;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;tab-size:2}
    code{font:14px/1.7 ui-monospace,SFMono-Regular,Consolas,monospace}
    @media(max-width:650px){main{padding:24px 16px}pre{padding:16px}code{font-size:13px}}
  </style>
</head>
<body>
  <main>
    <a href="${PromptPageRenderer.escapeHtml(backHref)}">Back to MusePages</a>
    <h1>${PromptPageRenderer.escapeHtml(title)}</h1>
    <p class="intro">The original prompt, shown as plain text. Select the text to copy it.</p>
    <section class="codebox" aria-labelledby="prompt-heading">
      <h2 id="prompt-heading">Prompt</h2>
      <pre tabindex="0" role="region" aria-label="Prompt text"><code>${PromptPageRenderer.escapeHtml(prompt)}</code></pre>
    </section>
  </main>
</body>
</html>
`;
    }
}

/**
 * Enforces workspace path boundaries and provides atomic UTF-8 metadata writes.
 */
export class WorkspaceFiles
{
    static async info(file)
    {
        try
        {
            const result = await lstat(file);
            if (result.isSymbolicLink()) throw Error(`Symbolic links are not allowed: ${file}`);
            return result;
        }
        catch (error)
        {
            if (error.code === "ENOENT") return null;
            throw error;
        }
    }

    static async inside(workspace, ...parts)
    {
        const file = path.resolve(workspace, ...parts);
        const relative = path.relative(workspace, file);
        if (relative.startsWith("..") || path.isAbsolute(relative)) throw Error("Path escapes workspace");
        let current = workspace;
        await WorkspaceFiles.info(current);
        for (const part of relative.split(path.sep).filter(Boolean))
        {
            if (!await WorkspaceFiles.info(current)) break;
            const siblings = await readdir(current);
            if (siblings.some((entry) => entry !== part && entry.toLowerCase() === part.toLowerCase()))
            {
                throw Error(`Case-insensitive path collision: ${file}`);
            }
            current = path.join(current, part);
            await WorkspaceFiles.info(current);
        }
        return file;
    }

    static async ensureDirectory(workspace, ...parts)
    {
        const file = await WorkspaceFiles.inside(workspace, ...parts);
        await mkdir(file,
        {
            recursive: true
        });
        if (!(await WorkspaceFiles.info(file)).isDirectory()) throw Error(`Expected a directory: ${file}`);
        return file;
    }

    static async text(file)
    {
        if (!(await WorkspaceFiles.info(file))?.isFile()) throw Error(`Required file is missing: ${file}`);
        return readFile(file, "utf8");
    }

    static async json(file)
    {
        return JSON.parse(await WorkspaceFiles.text(file));
    }

    static async saveJson(file, value)
    {
        await WorkspaceFiles.saveText(file, JSON.stringify(value, null, 2) + "\n");
    }

    static async saveText(file, value)
    {
        await WorkspaceFiles.info(file);
        const temporary = `${file}.${randomUUID()}.tmp`;
        try
        {
            await writeFile(temporary, value,
            {
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
}

/**
 * Prepares static assets and validates model-scoped resources, digests and preview reuse.
 */
export class StaticHomepage
{
    static publicAsset(filename)
    {
        return !filename.startsWith(".") && !excluded.test(filename) &&
            (assets.has(path.extname(filename).toLowerCase()) || /^(?:licen[cs]e|notice)(?:\.md)?$/i.test(filename));
    }

    static async checkSource(folder)
    {
        if (!(await WorkspaceFiles.text(path.join(folder, "README.md"))).trim()) throw Error("Generated README.md is empty");
        if (await WorkspaceFiles.info(path.join(folder, "index.html")))
        {
            if (!/<(?:html|body|main)\b/i.test(await WorkspaceFiles.text(path.join(folder, "index.html")))) throw Error("Source index.html is not a website");
            return "html";
        }
        const pkg = await WorkspaceFiles.json(path.join(folder, "package.json"));
        if (!pkg.dependencies?.next && !pkg.devDependencies?.next) throw Error("No HTML homepage or Next.js source found");
        for (const base of ["app", "src/app", "pages", "src/pages"])
        {
            const parts = base.split("/");
            await WorkspaceFiles.inside(folder, ...parts);
            for (const extension of ["tsx", "jsx", "js", "ts"])
            {
                const file = await WorkspaceFiles.inside(folder, ...parts, `${base.endsWith("app") ? "page" : "index"}.${extension}`);
                if (await WorkspaceFiles.info(file) && (await WorkspaceFiles.text(file)).trim()) return "next";
            }
        }
        throw Error("Next.js homepage source is missing");
    }

    static async copyHtml(source, destination)
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
            const file = path.join(source, entry.name);
            await WorkspaceFiles.info(file);
            if (entry.name.startsWith(".") || excluded.test(entry.name)) continue;
            if (entry.isDirectory()) await StaticHomepage.copyHtml(file, path.join(destination, entry.name));
            else if (entry.isFile() && StaticHomepage.publicAsset(entry.name)) await copyFile(file, path.join(destination, entry.name));
        }
    }

    static async ensurePreview(workspace, current, exported, digest, signal, ready)
    {
        const file = await WorkspaceFiles.inside(exported, "preview.png");
        const fingerprint = await WorkspaceFiles.inside(current.folder, ".generation-preview.sha256");
        const image = (await WorkspaceFiles.info(file))?.isFile() ? await readFile(file) : null;
        const imageDigest = image && createHash("sha256").update(image).digest("hex");
        if (ready && image && image.length > 24 && image.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" &&
            image.readUInt32BE(16) === 1200 && image.readUInt32BE(20) === 900 &&
            await WorkspaceFiles.info(fingerprint) && (await WorkspaceFiles.text(fingerprint)).trim() === `${digest} ${imageDigest}`)
        {
            return "preserved";
        }
        const
        {
            generatePreview
        } = await import("./generate-preview.mjs");
        await generatePreview(exported,
        {
            workspace,
            signal
        });
        const captured = createHash("sha256").update(await readFile(file)).digest("hex");
        await WorkspaceFiles.saveText(fingerprint, `${digest} ${captured}\n`);
        return "generated";
    }

    constructor(folder, slug, model)
    {
        this.folder = folder;
        this.slug = slug;
        this.model = model;
    }

    static async validateStaticOutput(folder, slug, model)
    {
        return new StaticHomepage(folder, slug, model).validate();
    }

    async validate()
    {
        const
        {
            folder,
            slug,
            model
        } = this;
        if (!/<(?:html|body|main)\b/i.test(await WorkspaceFiles.text(path.join(folder, "index.html")))) throw Error("Static homepage is missing or invalid");
        this.digest = createHash("sha256").update(JSON.stringify([slug, model]));
        this.prefix = `/pages/${encodeURIComponent(slug)}/${encodeURIComponent(model)}/`;
        this.base = new URL(this.prefix, "https://musepages.invalid");
        await this.walk(folder);
        return this.digest.digest("hex");
    }

    async reference(file, value)
    {
        const
        {
            folder,
            prefix,
            base
        } = this;
        if (!value || value.startsWith("#")) return;
        const relative = path.relative(folder, file).split(path.sep).map(encodeURIComponent).join("/");
        const url = new URL(value.replaceAll("&amp;", "&"), new URL(relative, base));
        if (url.origin !== base.origin)
        {
            if (["file:", "http:", "https:"].includes(url.protocol) &&
                (url.protocol === "file:" || ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)))
            {
                throw Error("Static output references a local development service");
            }
            return;
        }
        if (!url.pathname.startsWith(prefix)) throw Error(`Static reference escapes its public model path: ${value}`);
        const decoded = decodeURIComponent(url.pathname.slice(prefix.length));
        const target = await WorkspaceFiles.inside(folder, ...decoded.split("/"));
        for (const candidate of [target, `${target}.html`, path.join(target, "index.html")])
        {
            await WorkspaceFiles.inside(folder, path.relative(folder, candidate));
            if ((await WorkspaceFiles.info(candidate))?.isFile()) return;
        }
        throw Error(`Missing static resource: ${value}`);
    }

    async walk(directory)
    {
        const
        {
            folder,
            digest
        } = this;
        for (const entry of (await readdir(directory,
            {
                withFileTypes: true
            })).sort((a, b) => a.name.localeCompare(b.name)))
        {
            const file = path.join(directory, entry.name);
            await WorkspaceFiles.info(file);
            if (entry.name.startsWith(".") || excluded.test(entry.name)) throw Error(`Non-public file in static output: ${entry.name}`);
            if (entry.isDirectory())
            {
                await this.walk(file);
            }
            else
            {
                if (!entry.isFile() || !StaticHomepage.publicAsset(entry.name)) throw Error(`Unsupported static file: ${entry.name}`);
                const content = await readFile(file);
                if (file !== path.join(folder, "preview.png"))
                {
                    digest.update(JSON.stringify([path.relative(folder, file), createHash("sha256").update(content).digest("hex")]));
                }
                if (/\.(html|css)$/i.test(entry.name))
                {
                    const contents = content.toString("utf8");
                    if (!contents.trim()) throw Error(`Empty static file: ${entry.name}`);
                    const links = [...contents.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)|@import\s+(['"])(.*?)\3/gi)]
                        .map((match) => match[2] ?? match[4]);
                    if (/\.html$/i.test(entry.name))
                    {
                        for (const match of contents.matchAll(/(?:^|[\s<])(?:src|href|poster|srcset)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi))
                        {
                            const value = match[1] ?? match[2] ?? match[3];
                            if (/srcset\s*=/i.test(match[0]))
                            {
                                if (!value.startsWith("data:")) links.push(...value.split(",").map((part) => part.trim().split(/\s+/)[0]));
                            }
                            else links.push(value);
                        }
                    }
                    for (const link of links) await this.reference(file, link);
                }
            }
        }
    }
}

/**
 * Validates CLI inputs and manages cancellation, diagnostics and process exit status.
 */
export class GenerationCli
{
    static name(value, label)
    {
        if (typeof value !== "string" || !/^[a-z0-9][a-z0-9._-]*$/i.test(value) ||
            value.endsWith(".") || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(value))
        {
            throw Error(`Invalid ${label}`);
        }
        return value;
    }

    static promptNumber(value)
    {
        const number = Number(value);
        if (!Number.isSafeInteger(number) || number < 1) throw Error("Prompt number must be a positive safe integer");
        return number;
    }

    static promptRange(value)
    {
        const match = /^(\d+)-(\d+)$/.exec(value);
        if (!match) return null;
        const start = GenerationCli.promptNumber(match[1]);
        const end = GenerationCli.promptNumber(match[2]);
        if (start > end) throw Error("Prompt range start must not exceed its end");
        return [start, end];
    }

    static errorDetails(error, seen = new Set())
    {
        if (!error || seen.has(error) || seen.size >= 10) return "";
        seen.add(error);
        const details = [error.message || error.name || String(error)];
        for (const key of ["code", "syscall", "address", "port"])
        {
            if (error[key] !== undefined) details.push(`${key}=${error[key]}`);
        }
        for (const cause of [error.cause, ...(Array.isArray(error.errors) ? error.errors : [])])
        {
            const detail = GenerationCli.errorDetails(cause, seen);
            if (detail) details.push(`cause: ${detail}`);
        }
        return details.join("; ");
    }

    static parseArguments(args)
    {
        const positional = [];
        const options = {};
        for (const arg of args)
        {
            if (arg === "--check") options.check = true;
            else if (arg === "--retry") options.retry = true;
            else if (/^--(?:timeout-ms|retries)=/.test(arg))
            {
                const [key, value] = arg.slice(2).split("=");
                if (!/^\d+$/.test(value)) throw Error(`Invalid ${key}`);
                options[key === "timeout-ms" ? "timeoutMs" : key] = Number(value);
            }
            else if (arg.startsWith("-")) throw Error(`Unknown option: ${arg}`);
            else positional.push(arg);
        }
        if (positional.length !== 2)
        {
            throw Error("Expected two arguments: <prompt_scope> <display_model_name>");
        }
        const [scope, displayModelName] = positional;
        if (scope.toLowerCase() !== "all")
        {
            if (!/^\d+(?:-\d+)?$/.test(scope)) throw Error("Invalid prompt_scope; expected a number, range or All");
            if (!GenerationCli.promptRange(scope)) GenerationCli.promptNumber(scope);
            options.prompts = [scope];
        }
        options.displayModelName = GenerationCli.name(displayModelName, "display model name");
        return {
            selections: [],
            options
        };
    }

    static async run()
    {
        const controller = new AbortController();
        const cancel = () => controller.abort();
        process.once("SIGINT", cancel);
        process.once("SIGTERM", cancel);
        try
        {
            const
            {
                selections,
                options
            } = GenerationCli.parseArguments(process.argv.slice(2));
            const report = await PromptPageWorkflow.renderPromptPages(root, selections,
            {
                ...options,
                signal: controller.signal,
                onLog: (message) => console.error(`[${new Date().toISOString()}] ${message}`),
            });
            console.log(JSON.stringify(report, null, 2));
            if (report.summary.failed || report.summary.pending || report.summary.missing) process.exitCode = 1;
            if (controller.signal.aborted) process.exitCode = 130;
        }
        catch (error)
        {
            console.error(GenerationCli.errorDetails(error));
            process.exitCode = 1;
        }
        finally
        {
            process.removeListener("SIGINT", cancel);
            process.removeListener("SIGTERM", cancel);
        }
    }
}

/**
 * Discovers the local model and verifies service identity.
 */
export class ModelService
{
    constructor(workspace = root,
    {
        env = process.env,
        timeoutMs = 10000,
        signal
    } = {})
    {
        this.workspace = workspace;
        this.env = env;
        this.timeoutMs = timeoutMs;
        this.signal = signal;
    }

    async load(selections = [], displayModelName)
    {
        if (displayModelName !== undefined) GenerationCli.name(displayModelName, "display model name");
        const baseUrl = "http://localhost:8000/v1";
        const body = await this.requestModels({ baseUrl });
        if (!Array.isArray(body?.data) || body.data.length !== 1)
        {
            throw Error(`GET ${baseUrl}/models must return exactly one model`);
        }
        const modelId = body.data[0]?.id;
        if (typeof modelId !== "string" || !/^[^\s\x00-\x1f]+$/.test(modelId))
        {
            throw Error(`GET ${baseUrl}/models returned an invalid model ID`);
        }
        if (selections.length && (selections.length !== 1 || selections[0] !== modelId))
        {
            throw Error(`Requested model does not match the discovered model "${modelId}"`);
        }
        this.discovered = { baseUrl, body };
        return [
        {
            apiType: "openai-responses",
            baseUrl,
            modelId,
            directory: GenerationCli.name(displayModelName ?? modelId, "model directory"),
            selection: modelId
        }];
    }

    async requestModels(model)
    {
        const
        {
            env,
            timeoutMs,
            signal
        } = this;
        const key = model.apiKeyEnv ? env[model.apiKeyEnv] : undefined;
        if (model.apiKeyEnv && !key) throw Error(`Missing authentication environment variable: ${model.apiKeyEnv}`);
        const endpoint = `${model.baseUrl.replace(/\/+$/, "")}/models`;
        const timeout = AbortSignal.timeout(timeoutMs);
        let response;
        try
        {
            response = await fetch(endpoint,
            {
                headers: key ?
                {
                    Authorization: `Bearer ${key}`
                } :
                {},
                redirect: "error",
                signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
            });
        }
        catch (error)
        {
            throw new Error(`Model service identity check failed: GET ${endpoint} (timeout ${timeoutMs} ms)`,
            {
                cause: error
            });
        }
        if (!response.ok) throw Error(`Model service identity check failed: GET ${endpoint} (HTTP ${response.status})`);
        let body;
        try
        {
            body = await response.json();
        }
        catch (error)
        {
            throw new Error(`Model service identity check failed: GET ${endpoint} returned invalid JSON`,
            {
                cause: error
            });
        }
        return body;
    }

    async verify(model)
    {
        const body = this.discovered?.baseUrl === model.baseUrl ?
            this.discovered.body : await this.requestModels(model);
        const endpoint = `${model.baseUrl.replace(/\/+$/, "")}/models`;
        if (!Array.isArray(body?.data) || !body.data.some((entry) => entry?.id === model.modelId))
        {
            throw Error(`Model ID "${model.modelId}" is not advertised by GET ${endpoint}; refusing to substitute another model`);
        }
    }

    static async loadModels(workspace, selections, displayModelName)
    {
        return new ModelService(workspace).load(selections, displayModelName);
    }

    static async verifyModelService(model, options = {})
    {
        return new ModelService(root, options).verify(model);
    }
}

/**
 * Resolves Codex lazily and owns isolated subprocess execution, cancellation and attempt logs.
 */
export class CodexRunner
{
    constructor(
    {
        env = process.env,
        platform = process.platform,
        command
    } = {})
    {
        this.env = env;
        this.platform = platform;
        this.command = command;
    }

    async resolve()
    {
        const
        {
            env,
            platform
        } = this;
        if (this.command !== undefined && this.command !== null) return this.command;
        for (const folder of (env.PATH || env.Path || "").split(path.delimiter).filter(Boolean))
        {
            const directory = folder.replace(/^"|"$/g, "");
            for (const executable of platform === "win32" ? ["codex.exe", "codex.cmd"] : ["codex"])
            {
                const file = path.join(directory, executable);
                try
                {
                    await access(file, constants.X_OK);
                }
                catch
                {
                    continue;
                }
                if (executable.endsWith(".cmd"))
                {
                    const entry = path.join(directory, "node_modules", "@openai", "codex", "bin", "codex.js");
                    try
                    {
                        await access(entry);
                        return this.command = {
                            executable: process.execPath,
                            args: [entry]
                        };
                    }
                    catch
                    {
                        continue;
                    }
                }
                return this.command = {
                    executable: file,
                    args: []
                };
            }
        }
        throw Error("Codex CLI not found; install the official @openai/codex CLI (Windows: npm wrapper or codex.exe)");
    }

    async terminate(child)
    {
        if (!child.pid) return;
        if (process.platform === "win32")
        {
            // Descendants can keep inherited pipes open after the direct child has exited.
            const script = `$ErrorActionPreference='SilentlyContinue'; function Stop-Tree([int]$processId, [bool]$includeSelf=$true) { Get-CimInstance Win32_Process -Filter "ParentProcessId=$processId" | ForEach-Object { Stop-Tree $_.ProcessId }; if ($includeSelf) { Stop-Process -Id $processId -Force } }; Stop-Tree ${child.pid} $${child.exitCode === null}`;
            await new Promise((resolve) =>
            {
                const killer = spawn("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script],
                {
                    windowsHide: true
                });
                killer.once("error", () =>
                {
                    child.kill();
                    resolve();
                });
                killer.once("close", resolve);
            });
        }
        else
        {
            try
            {
                process.kill(-child.pid, "SIGKILL");
            }
            catch
            {
                child.kill("SIGKILL");
            }
        }
    }

    async run(
    {
        folder,
        prompt,
        model,
        command = this.command,
        timeoutMs,
        attempt,
        env = this.env,
        signal,
        onLog
    })
    {
        const home = await mkdtemp(path.join(os.tmpdir(), "musepages-codex-"));
        const overrides = {
            model_provider: "musepages",
            "model_providers.musepages.name": "MusePages",
            "model_providers.musepages.base_url": model.baseUrl.replace(/\/+$/, ""),
            "model_providers.musepages.wire_api": "responses",
            "model_providers.musepages.requires_openai_auth": false,
            "model_providers.musepages.request_max_retries": 0,
            "model_providers.musepages.stream_max_retries": 0,
        };
        if (model.apiKeyEnv) overrides["model_providers.musepages.env_key"] = model.apiKeyEnv;
        const args = [...(command.args || []), "--ask-for-approval", "never", "exec",
            "--sandbox", "workspace-write", "--skip-git-repo-check", "--ephemeral", "--json", "--model", model.modelId
        ];
        for (const [key, value] of Object.entries(overrides)) args.push("-c", `${key}=${JSON.stringify(value)}`);
        args.push("-");
        let output = "";
        let failure;
        const checkEvent = (line) =>
        {
            let event;
            try
            {
                event = JSON.parse(line);
            }
            catch
            {
                return;
            }
            const identity = event.model ?? event.response?.model;
            if (identity && identity !== model.modelId) throw Error("Codex reported a different model identity");
            if (event.type === "turn.failed" || event.type === "error") throw Error("Codex reported an unsuccessful turn; see attempt log");
        };
        try
        {
            const key = model.apiKeyEnv && env[model.apiKeyEnv];
            const quote = (arg) => /^[a-z0-9_./:=@,+-]+$/i.test(arg) ? arg :
                process.platform === "win32" ? `'${arg.replaceAll("'", "''")}'` : `'${arg.replaceAll("'", "'\\''")}'`;
            const displayed = [command.executable, ...args].map((arg) => quote(key ? arg.replaceAll(key, "[REDACTED]") : arg)).join(" ");
            onLog?.(`Codex command: ${process.platform === "win32" ? "& " : ""}${displayed}`);
            await new Promise((resolve, reject) =>
            {
                const child = spawn(command.executable, args,
                {
                    cwd: folder,
                    env:
                    {
                        ...env,
                        CODEX_HOME: home
                    },
                    shell: false,
                    windowsHide: true,
                    detached: process.platform !== "win32",
                    stdio: ["pipe", "pipe", "pipe"],
                });
                let interrupted = false;
                let stopping;
                const stop = (reason) =>
                {
                    if (interrupted) return;
                    interrupted = true;
                    failure = reason;
                    stopping = this.terminate(child).catch(() => child.kill());
                };
                const timer = setTimeout(() => stop(Error("Codex execution timed out; partial artifacts retained")), timeoutMs);
                const abort = () => stop(Error("Codex execution cancelled; partial artifacts retained"));
                signal?.addEventListener("abort", abort,
                {
                    once: true
                });
                if (signal?.aborted) abort();
                const append = (data) =>
                {
                    output = (output + data.toString()).slice(-1024 * 1024);
                };
                let line = "";
                child.stdout.setEncoding("utf8");
                child.stderr.setEncoding("utf8");
                child.stdout.on("data", (data) =>
                {
                    append(data);
                    line += data;
                    const lines = line.split(/\r?\n/);
                    line = lines.pop();
                    try
                    {
                        for (const complete of lines) checkEvent(complete);
                        if (line.length > 1024 * 1024) throw Error("Codex event exceeds the output limit");
                    }
                    catch (error)
                    {
                        stop(error);
                    }
                });
                child.stderr.on("data", append);
                child.stdin.on("error", (error) =>
                {
                    if (error.code !== "EPIPE") stop(error);
                });
                child.once("error", (error) =>
                {
                    failure = error;
                });
                child.once("close", async (code) =>
                {
                    clearTimeout(timer);
                    signal?.removeEventListener("abort", abort);
                    try
                    {
                        await (stopping ?? this.terminate(child));
                    }
                    catch (error)
                    {
                        failure ??= error;
                    }
                    try
                    {
                        checkEvent(line);
                    }
                    catch (error)
                    {
                        failure ??= error;
                    }
                    if (failure) reject(failure);
                    else if (code !== 0) reject(Error(`Codex exited with code ${code}; see attempt log`));
                    else resolve();
                });
                child.stdin.end(prompt);
            });
        }
        catch (error)
        {
            failure = error;
            throw error;
        }
        finally
        {
            output += `\n${JSON.stringify({ result: failure ? "failed" : "completed", error: failure?.message })}\n`;
            const key = model.apiKeyEnv && env[model.apiKeyEnv];
            if (key) output = output.replaceAll(key, "[REDACTED]");
            try
            {
                const logFile = path.join(folder, `.generation-attempt-${attempt}-${randomUUID()}.log`);
                await writeFile(logFile, output,
                {
                    flag: "wx"
                });
                onLog?.(`Attempt log: ${logFile}`);
            }
            finally
            {
                await rm(home,
                {
                    recursive: true,
                    force: true
                });
            }
        }
    }

    static async resolveCodex(options = {})
    {
        return new CodexRunner(options).resolve();
    }

    static async runCodex(options)
    {
        return new CodexRunner(
        {
            env: options.env
        }).run(options);
    }
}

/**
 * Processes prompt/model results sequentially while preserving locks, resumable state and validation.
 */
export class PromptPageWorkflow
{
    constructor(workspace = root, selections = [], options = {})
    {
        this.workspace = path.resolve(workspace);
        const settings = {
            timeoutMs: 1800000,
            retries: 0,
            env: process.env,
            ...options
        };
        if (!Number.isSafeInteger(settings.timeoutMs) || settings.timeoutMs < 1 || settings.timeoutMs > 2147483647 ||
            !Number.isInteger(settings.retries) || settings.retries < 0 || settings.retries > 2)
        {
            throw Error("timeoutMs must be between 1 and 2147483647; retries must be between 0 and 2");
        }
        this.selections = [...selections];
        this.settings = settings;
        this.modelService = new ModelService(this.workspace,
        {
            env: settings.env,
            signal: settings.signal
        });
        this.codex = new CodexRunner(settings);
    }

    async processItem(prompt, model, shared, options, verifyService)
    {
        const workspace = this.workspace;
        options.progress("lock", "Acquiring prompt generation lock");
        return PromptPageWorkflow.withPromptLock(workspace, prompt.id, async () =>
        {
            const current = await PromptPageWorkflow.inspect(workspace, prompt, model);
            const sharedFile = await WorkspaceFiles.inside(workspace, "out", "pages", prompt.id, "metadata.json");
            if (await WorkspaceFiles.info(sharedFile))
            {
                const latest = await WorkspaceFiles.json(sharedFile);
                if (latest.slug !== shared.slug || latest.title !== shared.title) throw Error("Shared metadata changed; retry after checking its mapping");
            }
            const digest = createHash("sha256").update(JSON.stringify([prompt.content, options.design])).digest("hex");
            const fingerprint = path.join(current.folder, ".generation-input.sha256");
            if (current.metadata?.generated && await WorkspaceFiles.info(fingerprint) && (await WorkspaceFiles.text(fingerprint)).trim() !== digest)
            {
                return {
                    status: "pending",
                    generated: true,
                    reason: "Requirements or DESIGN changed; existing source retained"
                };
            }
            if (current.metadata && !current.metadata.generated && !options.retry)
            {
                return {
                    status: "pending",
                    generated: false,
                    reason: "Incomplete generation requires explicit --retry"
                };
            }
            let metadata = current.metadata;
            let generated = false;
            if (!metadata?.generated)
            {
                options.progress("verify-model-service", `GET ${model.baseUrl.replace(/\/+$/, "")}/models; expected modelId=${model.modelId}; timeout=10000 ms`);
                await verifyService(model);
                options.progress("resolve-codex", "Locating Codex CLI");
                const command = await this.codex.resolve();
                await WorkspaceFiles.ensureDirectory(workspace, "out", "pages", prompt.id, model.directory);
                metadata = {
                    modelId: model.modelId,
                    tags: [],
                    staticDir: "out",
                    generated: false,
                    preview: false,
                    config_added: metadata?.config_added ?? false,
                    validated: false,
                };
                await WorkspaceFiles.saveJson(current.file, metadata);
                for (let attempt = 1; attempt <= options.retries + 1; attempt++)
                {
                    let instruction = PromptPageWorkflow.instructions(prompt, model);
                    console.log(`Attempt ${attempt} instruction:`, instruction);
                    options.progress("generate", `Attempt ${attempt}/${options.retries + 1}; executable=${command.executable}; cwd=${current.folder}; timeout=${options.timeoutMs} ms`);
                    try
                    {
                        await this.codex.run(
                        {
                            folder: current.folder,
                            prompt: instruction,
                            model,
                            command,
                            timeoutMs: options.timeoutMs,
                            attempt,
                            env: options.env,
                            signal: options.signal,
                            onLog: (message) => options.progress("generate", message),
                        });
                        break;
                    }
                    catch (error)
                    {
                        options.progress("generate", `Attempt ${attempt} failed: ${GenerationCli.errorDetails(error)}`);
                        if (options.signal?.aborted || attempt > options.retries) throw error;
                    }
                }
                // The workflow, not an agent's exit status or self-written state, owns metadata.
                options.progress("validate-source", "Checking generated source and model identity");
                PromptPageWorkflow.validateMetadata(await WorkspaceFiles.json(current.file), model);
                await StaticHomepage.checkSource(current.folder);
                metadata.generated = true;
                await WorkspaceFiles.saveJson(current.file, metadata);
                await WorkspaceFiles.saveText(fingerprint, digest);
                generated = true;
            }
            options.progress("prepare-static", "Checking source and preparing static homepage");
            const type = await StaticHomepage.checkSource(current.folder);
            const exported = await WorkspaceFiles.inside(current.folder, ...metadata.staticDir.split("/"));
            if (exported === current.folder && type === "next") throw Error("Next.js source is not a static export");
            if (!await WorkspaceFiles.info(exported) && type === "html" && metadata.staticDir === "out")
            {
                await StaticHomepage.copyHtml(current.folder, exported);
            }
            let staticDigest;
            try
            {
                options.progress("validate-static", exported);
                staticDigest = await StaticHomepage.validateStaticOutput(exported, shared.slug, model.directory);
            }
            catch (error)
            {
                metadata.preview = false;
                metadata.validated = false;
                await WorkspaceFiles.saveJson(current.file, metadata);
                return {
                    status: "pending",
                    generated: true,
                    reason: `Source retained; static output needs preparation: ${error.message}`
                };
            }
            let preview;
            try
            {
                options.progress("preview", "Preparing homepage screenshot");
                preview = await StaticHomepage.ensurePreview(workspace, current, exported, staticDigest, options.signal, metadata.preview);
            }
            catch (error)
            {
                metadata.preview = false;
                metadata.validated = false;
                await WorkspaceFiles.saveJson(current.file, metadata);
                return {
                    status: "pending",
                    generated: true,
                    reason: `Source retained; preview needs preparation: ${error.message}`
                };
            }
            metadata.preview = true;
            metadata.validated = true;
            await WorkspaceFiles.saveJson(current.file, metadata);
            try
            {
                options.progress("register", "Updating deployment options");
                await WorkspaceFiles.inside(workspace, "deploy", "config.json");
                const
                {
                    registerGeneratedPage
                } = await import("./deploy-site.mjs");
                const added = await registerGeneratedPage(workspace,
                {
                    prompt: prompt.id,
                    model: model.directory,
                    slug: shared.slug,
                    title: shared.title,
                    tags: metadata.tags,
                    staticDir: metadata.staticDir,
                });
                metadata.config_added = true;
                await WorkspaceFiles.saveJson(current.file, metadata);
                return {
                    status: generated ? "generated" : added ? "registered" : "skipped",
                    generated: true,
                    preview
                };
            }
            catch (error)
            {
                metadata.config_added = false;
                await WorkspaceFiles.saveJson(current.file, metadata);
                return {
                    status: "failed",
                    generated: true,
                    reason: `Generation retained; deployment registration failed: ${error.message}`
                };
            }
        });
    }

    async run()
    {
        const workspace = this.workspace;
        const settings = this.settings;
        let models = [];
        const redact = (message) => models.reduce((value, model) =>
        {
            const key = model.apiKeyEnv && settings.env[model.apiKeyEnv];
            return key ? value.replaceAll(key, "[REDACTED]") : value;
        }, String(message));
        const log = (message) => settings.onLog?.(redact(message));
        log("Discovering local model: GET http://localhost:8000/v1/models");
        models = await this.modelService.load(this.selections, settings.displayModelName);
        log(`Discovered model: ${models[0].modelId}; output directory: ${models[0].directory}`);
        log("Reading original prompts");
        const inputs = await PromptPageWorkflow.prompts(workspace, settings.prompts);
        log(`Selected ${inputs.length} prompt(s), ${models.length} model(s); mode=${settings.check ? "check" : "generate"}`);
        if (!settings.check) log("Checking shared output metadata and reading DESIGN.md");
        const shared = settings.check ? null : await PromptPageWorkflow.sharedMetadata(workspace, inputs);
        if (!settings.check) settings.design = await WorkspaceFiles.text(await WorkspaceFiles.inside(workspace, "src", "workflows", "AI Agent", "DESIGN.md"));
        if (!settings.check && !settings.design.trim()) throw Error("DESIGN.md is empty");
        const services = new Set();
        const verifyService = async (model) =>
        {
            if (services.has(model.selection)) return;
            await this.modelService.verify(model);
            services.add(model.selection);
        };
        const items = [];
        for (const prompt of inputs)
        {
            for (const model of models)
            {
                const item = {
                    prompt: prompt.id,
                    model: model.selection,
                    directory: model.directory
                };
                let inspected = false;
                let stage = "inspect";
                const progress = (next, message) =>
                {
                    stage = next;
                    log(`[${prompt.id}/${model.selection}] ${stage}: ${message}`);
                };
                try
                {
                    progress("inspect", `Output directory: ${path.join(workspace, "out", "pages", prompt.id, model.directory)}`);
                    if (settings.signal?.aborted) throw Error("Generation cancelled");
                    const current = await PromptPageWorkflow.inspect(workspace, prompt, model);
                    inspected = true;
                    item.generated = current.metadata?.generated ?? false;
                    if (settings.check)
                    {
                        Object.assign(item,
                        {
                            status: current.metadata?.generated ? "skipped" : "missing",
                            generated: current.metadata?.generated ?? false
                        });
                    }
                    else
                    {
                        Object.assign(item, await this.processItem(prompt, model, shared.get(prompt.id),
                        {
                            ...settings,
                            progress
                        }, verifyService));
                    }
                }
                catch (error)
                {
                    item.status = !inspected || /locked|collision|Symbolic|Shared metadata/.test(error.message) ? "pending" : "failed";
                    try
                    {
                        item.generated = (await PromptPageWorkflow.inspect(workspace, prompt, model)).metadata?.generated ?? false;
                    }
                    catch
                    {
                        /* Keep unknown state unclaimed. */
                    }
                    item.reason = `[${stage}] ${GenerationCli.errorDetails(error)}`;
                }
                if (item.reason) item.reason = redact(item.reason);
                log(`[${prompt.id}/${model.selection}] ${item.status}${item.reason ? `: ${item.reason}` : ""}`);
                items.push(item);
            }
        }
        const summary = Object.fromEntries(["generated", "registered", "skipped", "missing", "pending", "failed"]
            .map((status) => [status, items.filter((item) => item.status === status).length]));
        return {
            summary,
            items,
            remainingMissing: items.filter((item) => !item.generated).map((
            {
                prompt,
                model
            }) => (
            {
                prompt,
                model
            }))
        };
    }

    static async prompts(workspace, selected)
    {
        const base = await WorkspaceFiles.inside(workspace, "data", "prompts");
        const found = [];
        const keys = new Set();
        for (const folder of (await readdir(base)).sort())
        {
            if (!(await WorkspaceFiles.info(path.join(base, folder)))?.isDirectory()) continue;
            for (const entry of (await readdir(path.join(base, folder))).sort())
            {
                if (!entry.endsWith(".md") || /^(README|AGENTS|DESIGN)\.md$/i.test(entry)) continue;
                const id = GenerationCli.name(entry.slice(0, -3), "prompt filename");
                if (keys.has(id.toLowerCase())) throw Error(`Duplicate prompt filename: ${id}`);
                keys.add(id.toLowerCase());
                const content = await WorkspaceFiles.text(path.join(base, folder, entry));
                found.push(
                {
                    id,
                    content
                });
            }
        }
        if (!found.length) throw Error("No original Markdown prompts found");
        const numberOf = (prompt) => Number(prompt.id.match(/^(\d+)-/)?.[1]);
        if (selected)
        {
            const ids = new Set();
            let hasRange = false;
            for (const selection of selected)
            {
                const range = GenerationCli.promptRange(selection);
                if (range)
                {
                    hasRange = true;
                    const [start, end] = range;
                    const matches = found.filter((prompt) => numberOf(prompt) >= start && numberOf(prompt) <= end)
                        .sort((a, b) => numberOf(a) - numberOf(b));
                    let next = start;
                    for (const prompt of matches)
                    {
                        const number = numberOf(prompt);
                        if (number < next) throw Error(`Ambiguous prompt number: ${number}`);
                        if (number !== next) throw Error(`Unknown prompt number: ${next}`);
                        ids.add(prompt.id);
                        next++;
                    }
                    if (next <= end) throw Error(`Unknown prompt number: ${next}`);
                }
                else if (/^\d+$/.test(selection))
                {
                    const number = GenerationCli.promptNumber(selection);
                    const matches = found.filter((prompt) => numberOf(prompt) === number);
                    if (!matches.length) throw Error(`Unknown prompt number: ${selection}`);
                    if (matches.length > 1) throw Error(`Ambiguous prompt number: ${selection}`);
                    ids.add(matches[0].id);
                }
                else
                {
                    if (!found.some((prompt) => prompt.id === selection)) throw Error("Unknown prompt selection");
                    ids.add(selection);
                }
            }
            const result = found.filter((prompt) => ids.has(prompt.id));
            return hasRange ? result.sort((a, b) => numberOf(a) - numberOf(b) || a.id.localeCompare(b.id)) : result;
        }
        return found.sort((a, b) => numberOf(a) - numberOf(b) || a.id.localeCompare(b.id));
    }

    static validateMetadata(metadata, model)
    {
        if (!metadata || metadata.modelId !== model.modelId) throw Error("Model metadata identity does not match modelId");
        if (metadata.preview === undefined) metadata.preview = false;
        if (states.some((key) => typeof metadata[key] !== "boolean") ||
            !Array.isArray(metadata.tags) || metadata.tags.some((tag) => typeof tag !== "string") ||
            typeof metadata.staticDir !== "string" || !metadata.staticDir ||
            path.isAbsolute(metadata.staticDir) || /[:\\]/.test(metadata.staticDir) ||
            metadata.staticDir.split("/").some((part) => !part || part === ".."))
        {
            throw Error("Incomplete or unsafe model metadata");
        }
        delete metadata.deployed;
    }

    static async inspect(workspace, prompt, model)
    {
        const folder = await WorkspaceFiles.inside(workspace, "out", "pages", prompt.id, model.directory);
        const file = await WorkspaceFiles.inside(workspace, "out", "pages", prompt.id, model.directory, "metadata.json");
        const directory = await WorkspaceFiles.info(folder);
        if (!await WorkspaceFiles.info(file))
        {
            if (directory && (await readdir(folder)).length) throw Error("Existing files have no model metadata; manual confirmation is required");
            return {
                folder,
                file,
                metadata: null
            };
        }
        const metadata = await WorkspaceFiles.json(file);
        PromptPageWorkflow.validateMetadata(metadata, model);
        return {
            folder,
            file,
            metadata
        };
    }

    static async sharedMetadata(workspace, inputs)
    {
        const shared = new Map();
        const slugs = new Set();
        // Include unselected existing prompts so a partial run cannot claim their public paths.
        const pages = await WorkspaceFiles.inside(workspace, "out", "pages");
        const owners = new Map();
        if (await WorkspaceFiles.info(pages))
        {
            for (const entry of await readdir(pages))
            {
                if (!(await WorkspaceFiles.info(path.join(pages, entry)))?.isDirectory()) continue;
                const file = await WorkspaceFiles.inside(workspace, "out", "pages", entry, "metadata.json");
                if (await WorkspaceFiles.info(file))
                {
                    const value = await WorkspaceFiles.json(file);
                    GenerationCli.name(value.slug, "public slug");
                    const key = value.slug.toLowerCase();
                    if (owners.has(key)) throw Error(`Conflicting public slug: ${value.slug}`);
                    owners.set(key, entry);
                }
            }
        }
        for (const prompt of inputs)
        {
            const file = await WorkspaceFiles.inside(workspace, "out", "pages", prompt.id, "metadata.json");
            const slug = prompt.id.replace(/^\d+-/, "").toLowerCase();
            const value = await WorkspaceFiles.info(file) ? await WorkspaceFiles.json(file) :
            {
                slug,
                title: slug.replaceAll("-", " ")
            };
            GenerationCli.name(value.slug, "public slug");
            if (/^\d+-/.test(value.slug) || typeof value.title !== "string" || !value.title.trim())
            {
                throw Error(`Invalid shared metadata: ${prompt.id}`);
            }
            const key = value.slug.toLowerCase();
            if (slugs.has(key) || (owners.has(key) && owners.get(key) !== prompt.id))
            {
                throw Error(`Conflicting public slug: ${value.slug}`);
            }
            slugs.add(key);
            shared.set(prompt.id, value);
        }
        return shared;
    }

    static instructions(prompt, model)
    {
        const number = prompt.id.match(/^(\d+)-/)?.[1];
        if (!number) throw Error(`Prompt filename must have a numeric prefix: ${prompt.id}`);
        return [
            "Implement the specification in render-prompt-pages.md.",
            "",
            "Arguments:",
            `- prompt_scope: ${number.padStart(3, "0")}`,
            `- display_model_name: ${model.directory}`,
            "",
            "Read the specification completely before making changes.",
            "Apply all required code modifications and keep the implementation consistent with existing project conventions."
        ].join("\n");
    }

    static async withPromptLock(workspace, id, action)
    {
        const directory = await WorkspaceFiles.ensureDirectory(workspace, "out", ".generation-locks");
        const file = await WorkspaceFiles.inside(workspace, "out", ".generation-locks", `${id}.lock`);
        let handle;
        try
        {
            handle = await open(file, "wx");
        }
        catch (error)
        {
            if (error.code === "EEXIST") throw Error(`Generation is locked for ${id}; check the active process before removing a stale lock`);
            throw error;
        }
        try
        {
            await handle.writeFile(`${process.pid}\n`);
            return await action();
        }
        finally
        {
            await handle.close();
            await unlink(path.join(directory, `${id}.lock`));
        }
    }

    static async renderPromptPages(workspace = root, selections = [], options = {})
    {
        return new PromptPageWorkflow(workspace, selections, options).run();
    }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
{
    await GenerationCli.run();
}
