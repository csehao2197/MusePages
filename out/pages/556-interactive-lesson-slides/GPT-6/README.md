# How Sorting Works

以真实模型 `gpt-6.1-sol` 生成，公开标签为 `GPT-6`。

- 输入：`data\prompts\556-interactive-lesson-slides\556-interactive-lesson-slides.md`；设计指引：`src\workflows\AI Agent\DESIGN.md`。
- 原始来源：VibeFather，https://vibefather.ai/t/interactive-lesson-slides 。GitHub 快照：https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/interactive-lesson-slides/prompt.md 。
- 授权：CC BY-NC 4.0，仅非商业用途；商业许可由原作者另行提供。照片由 VibeFather 使用 qwen-image-3.0-pro 生成，原文明确允许随模板分发。资源明细见 `ASSETS.md` 与 `LICENSE`。
- 源码位于本目录；独立静态版本为 `out\`，真实 QA、截图位于 `.checks\`，无后端、外部 API、环境变量或运行时网络依赖。
- 十二页课程、五项即时判分、可操作排序步骤、可执行 JavaScript、持久化进度、逐页批注、哈希路由与移动目录抽屉。
- 根据本轮禁止构建的约束采用原生 HTML/CSS/JavaScript 静态适配，而非原文 Vite/React/TypeScript/Tailwind 编译项目。内容集中于带判别联合 JSDoc 类型的 `lesson.js`。CodeMirror 6 及依赖为本地浏览器模块，使用 JavaScript 高亮、原创建色与 Mod-Enter。这不是框架实现符合性声明。
- 使用仓库 `startPreviewServer` 仅托管 `out\`，最终子路径为 `/pages/interactive-lesson-slides/GPT-6/index.html`。不运行构建或发布命令。执行 `node out\pages\556-interactive-lesson-slides\GPT-6\.checks\verify.mjs` 进行真实浏览器检查。
- JavaScript 在不含 `allow-same-origin` 的独立脚本 iframe 中运行，禁用网络。同步死循环会阻塞同进程浏览器事件循环，3 秒移除机制无法保证抢占 JavaScript 执行；不应运行不可信代码。没有生产级隔离承诺。
- 2026-11-16 实测 16 组 Chromium 检查通过：1200×900、1440×900 与 390×844；全十二页无横向溢出，桌面内容无裁切，HTTP、资源、页面及控制台错误均为零。涵盖五项判分、错误反馈与重试、持久化、键盘与手机触控、拖拽排序、实际升降序代码执行及错误行号、批注/擦除/撤销、目录、链接复制、演示、确认重置和存储不可用。
- 已打开 `.checks\desktop.png`、`.checks\mobile.png` 和 `out\preview.png` 逐张复核：桌面纸色外壳与绿板主次清晰，照片、衬线标题和黄色标记平衡；手机为可滚动单列，照片不变形、字号及固定控制栏清晰。长内容在绿板内滚动，不强行缩成桌面截图。
- `.checks\qa.json` 保存真实断言及视觉评价；`.generation-input.sha256` 核对完整原文与设计输入，`.generation-preview.sha256` 核对静态内容与预览。登记为默认关闭，不表示发布；没有构建或部署。
- 无虚构后端或假代码执行；计分及批注真实保存在本机浏览器，不能跨设备同步。学校、教师和照片角色为原始模板虚构设定。
