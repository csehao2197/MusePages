import
{
    readFile,
    writeFile,
    mkdir,
    readdir,
    open,
    rename,
    unlink,
    copyFile
}
from 'node:fs/promises';
import path from 'node:path';
import
{
    pathToFileURL
}
from 'node:url';
import
{
    createHash
}
from 'node:crypto';
import
{
    createRequire
}
from 'node:module';
import assert from 'node:assert/strict';
const root = process.cwd(),
    run = 'ai-gpt6-f8e64dbe-eba7-4f2b-9541-dce137c3c8b8';
const report = 'C:\\Users\\wanha\\.copilot\\session-state\\15e609c2-d77b-41ed-9f30-414d8198825b\\files\\ai-gpt6-batch-196-215.json';
const [action, prompt, ...args] = process.argv.slice(2), folder = path.join(root, 'out', 'pages', prompt, 'GPT-6'), exported = path.join(folder, 'out'), lock = path.join(root, 'out', '.generation-locks', prompt + '.lock');
const json = async f => JSON.parse(await readFile(f, 'utf8')), sha = x => createHash('sha256').update(x).digest('hex');
const atomic = async (f, v) =>
{
    await writeFile(f + '.' + process.pid + '.tmp', JSON.stringify(v, null, 2) + '\n');
    await rename(f + '.' + process.pid + '.tmp', f);
};
const meta = path.join(folder, 'metadata.json');
const
{
    StaticHomepage
} = await import('../workflows/render-prompt-page.mjs');
const
{
    generatePreview,
    startPreviewServer
} = await import('../workflows/generate-preview.mjs');
const
{
    registerGeneratedPage
} = await import('../workflows/deploy-site.mjs');
if (action === 'begin')
{
    await mkdir(path.dirname(lock),
    {
        recursive: true
    });
    const h = await open(lock, 'wx');
    await h.writeFile(JSON.stringify(
    {
        run,
        pid: process.pid,
        prompt,
        started: new Date().toISOString()
    }));
    await h.close();
    try
    {
        assert.equal((await readdir(folder).catch(e =>
        {
            if (e.code === 'ENOENT') return [];
            throw e;
        })).length, 0, 'Protected nonempty output');
        await mkdir(exported,
        {
            recursive: true
        });
        await mkdir(path.join(folder, '.checks'),
        {
            recursive: true
        });
        await atomic(meta,
        {
            modelId: 'gpt-6.1-sol',
            tags: args[1].split('|'),
            staticDir: 'out',
            generated: false,
            preview: false,
            validated: false,
            config_added: false
        });
        await atomic(path.join(folder, '.checks', 'intent.json'),
        {
            run,
            prompt,
            title: args[0],
            features: args[2],
            limits: args[3]
        });
    }
    catch (e)
    {
        if ((await json(lock)).run === run) await unlink(lock);
        throw e;
    }
}
else
{
    assert.equal((await json(lock)).run, run);
    const m = await json(meta),
        intent = await json(path.join(folder, '.checks', 'intent.json'));
    assert.equal(m.modelId, 'gpt-6.1-sol');
    assert.equal(intent.run, run);
    assert(m.tags.length && m.tags.every(t => t && t.trim() === t) && new Set(m.tags).size === m.tags.length);
    const config = await json(path.join(root, 'deploy', 'config.json')),
        slug = config.pages[prompt]?.pages?.[0]?.slug || prompt.replace(/^\d+-/, '');
    if (action === 'check')
    {
        try
        {
            for (const name of (await readdir(folder)).filter(n => /\.(html|css|js|svg|webp|jpg|txt)$/.test(n))) await copyFile(path.join(folder, name), path.join(exported, name));
            const digest = await StaticHomepage.validateStaticOutput(exported, slug, 'GPT-6');
            m.generated = true;
            await atomic(meta, m);
            const input = await readFile(path.join(root, 'data', 'prompts', prompt, prompt + '.md'), 'utf8'),
                design = await readFile(path.join(root, 'src', 'workflows', 'AI Agent', 'DESIGN.md'), 'utf8');
            await writeFile(path.join(folder, '.generation-input.sha256'), sha(JSON.stringify([input, design])) + '\n');
            await generatePreview(exported,
            {
                workspace: root
            });
            const server = await startPreviewServer(exported,
            {
                workspace: root
            });
            const require = createRequire(path.join(root, 'package.json'));
            const
            {
                chromium
            } = require('@playwright/test');
            let browser;
            const errors = [];
            let checks = 0;
            try
            {
                browser = await chromium.launch(
                {
                    headless: true
                });
                const page = await browser.newPage();
                page.on('pageerror', e => errors.push(e.message));
                page.on('response', r =>
                {
                    if (r.status() >= 400) errors.push(r.status() + ' ' + r.url());
                });
                page.on('requestfailed', r => errors.push(r.failure().errorText));
                for (const width of [1440, 1024, 768, 390, 320])
                {
                    await page.setViewportSize(
                    {
                        width,
                        height: 900
                    });
                    await page.goto(server.url);
                    await page.evaluate(() => document.fonts.ready);
                    await page.waitForTimeout(100);
                    assert.equal(await page.locator('h1:visible').count(), 1);
                    checks++;
                    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Overflow ' + width);
                    checks++;
                    assert.equal(await page.locator('a[href="#"]').count(), 0);
                    checks++;
                    assert(!/[一-鿿]/.test(await page.locator('body').innerText()));
                    checks++;
                    if ([1440, 390].includes(width)) await page.screenshot(
                    {
                        path: path.join(folder, '.checks', width === 1440 ? 'desktop.png' : 'mobile.png'),
                        fullPage: true
                    });
                }
                await page.setViewportSize(
                {
                    width: 1440,
                    height: 900
                });
                await page.goto(server.url);
                const
                {
                    verify
                } = await import(pathToFileURL(path.join(folder, 'verify.mjs')) + '?t=' + Date.now());
                const n = await verify(page, assert);
                assert(Number.isInteger(n) && n > 0);
                checks += n;
                assert.deepEqual(errors, []);
                checks++;
                await atomic(path.join(folder, '.checks', 'validation.json'),
                {
                    run,
                    checks,
                    interactionAssertions: n,
                    widths: [1440, 1024, 768, 390, 320],
                    browserErrors: errors,
                    staticDigest: digest,
                    visualReview: 'pending'
                });
                console.log(JSON.stringify(
                {
                    prompt,
                    checks,
                    visualReview: 'pending'
                }));
            }
            finally
            {
                if (browser) await browser.close();
                await server.close();
            }
        }
        catch (e)
        {
            m.preview = false;
            m.validated = false;
            await atomic(meta, m);
            throw e;
        }
    }
    else if (action === 'finish')
    {
        assert(args[0]?.length > 30, 'Actual image inspection required');
        const v = await json(path.join(folder, '.checks', 'validation.json'));
        const digest = await StaticHomepage.validateStaticOutput(exported, slug, 'GPT-6');
        assert.equal(digest, v.staticDigest);
        const png = await readFile(path.join(exported, 'preview.png'));
        assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
        assert.equal(png.readUInt32BE(16), 1200);
        assert.equal(png.readUInt32BE(20), 900);
        await writeFile(path.join(folder, '.generation-preview.sha256'), digest + ' ' + sha(png) + '\n');
        v.visualReview = {
            review: args[0],
            evidence: ['.checks\\desktop.png', '.checks\\mobile.png', 'out\\preview.png'],
            timestamp: new Date().toISOString()
        };
        await atomic(path.join(folder, '.checks', 'validation.json'), v);
        m.preview = true;
        m.validated = true;
        await atomic(meta, m);
        await registerGeneratedPage(root,
        {
            prompt,
            model: 'GPT-6',
            slug,
            title: intent.title,
            tags: m.tags,
            staticDir: 'out'
        });
        const saved = await json(path.join(root, 'deploy', 'config.json')),
            option = saved.pages[prompt].pages.find(p => p.model === 'GPT-6');
        assert(option && option.staticDir === 'out');
        assert.equal(option.enabled, false);
        assert.equal(option.deployed, false);
        m.config_added = true;
        await atomic(meta, m);
        await writeFile(path.join(folder, 'README.md'), `# ${intent.title}\n\n- Original: \`data\\prompts\\${prompt}\\${prompt}.md\`; design: \`src\\workflows\\AI Agent\\DESIGN.md\`.\n- Actual model: \`gpt-6.1-sol\`; stable alias: \`GPT-6\`. Standalone HTML/CSS/JavaScript.\n- Functions: ${intent.features}\n- Source: \`out\\pages\\${prompt}\\GPT-6\\index.html\` and adjacent browser assets; static export: its \`out\\\` directory. Serve that directory with any static HTTP server. No build or environment variables required.\n- Mocks and limits: ${intent.limits}\n- Checks: ${v.checks} actual assertions, including ${v.interactionAssertions} focused interaction assertions; responsive widths ${v.widths.join(', ')}px; zero browser/resource errors. \`verify.mjs\` exports assertions exercised by this run's temporary Playwright harness, rather than a standalone CLI.\n- Screenshot command from repository root: \`node src\\workflows\\generate-preview.mjs out\\pages\\${prompt}\\GPT-6\\out\`. This renders/resource-checks the screenshot, without updating metadata or replaying interaction assertions.\n- Actual evidence: \`.checks\\desktop.png\`, \`.checks\\mobile.png\`, \`out\\preview.png\`. Visual review: ${args[0]}\n- Assets: original CSS/inline SVG artwork and system fonts; any Lucide icon paths retain their ISC license. Original requirement authors retain their rights; no additional rights granted.\n- Registered disabled and undeployed; expected publication: \`pages\\${slug}\\GPT-6\\index.html\`.\n- Unperformed: builds, installs, dist, publication, uploads and production backend tests.\n`);
        const summary = {
            timestamp: new Date().toISOString(),
            run,
            prompt,
            modelId: m.modelId,
            output: folder,
            action: 'generated-and-verified',
            result: 'complete',
            tags: m.tags,
            tagsNonempty: true,
            state: m,
            registration: option,
            validation: v,
            paths:
            {
                source: path.join(folder, 'index.html'),
                export: exported,
                metadata: meta,
                desktop: path.join(folder, '.checks', 'desktop.png'),
                mobile: path.join(folder, '.checks', 'mobile.png'),
                preview: path.join(exported, 'preview.png')
            },
            performed: ['static-resource-validation', 'real-browser-preview', 'responsive-overflow', 'focused-interactions', 'desktop-mobile-preview-visual-review', 'registration-readback'],
            unperformed: ['build', 'install', 'dist', 'publish', 'upload', 'production-backend'],
            errors: [],
            retainedArtifacts: ['source', 'static export', 'preview', 'browser screenshots', 'verification'],
            nextStep: 'None; registered disabled'
        };
        const log = await open(path.join(root, 'logs', 'render-prompt-pages-ai.log'), 'a');
        await log.writeFile(JSON.stringify(summary) + '\n', 'utf8');
        await log.close();
        const r = await json(report).catch(e =>
        {
            if (e.code === 'ENOENT') return {
                run,
                scope: '196-215',
                results: [],
                counts:
                {
                    complete: 0
                },
                blockers: [],
                inFlight: [],
                nextNotProcessed: null,
                cleanup:
                {}
            };
            throw e;
        });
        r.results.push(summary);
        r.counts = {
            complete: r.results.length,
            validated: r.results.length,
            preview: r.results.length,
            registeredDisabled: r.results.length,
            assertions: r.results.reduce((n, x) => n + x.validation.checks, 0),
            visualReviews: r.results.length * 3
        };
        r.nextNotProcessed = args[1] || null;
        r.cleanup = {
            ownedPromptLocksReleased: true,
            browsersClosed: true,
            loopbackServersClosed: true,
            noBuildOrPublish: true
        };
        await atomic(report, r);
        await unlink(lock);
        console.log(JSON.stringify(
        {
            prompt,
            result: 'complete',
            checks: v.checks
        }));
    }
    else throw Error('Unknown action');
}
